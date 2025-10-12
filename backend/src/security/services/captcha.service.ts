import {
  Injectable,
  Logger,
  BadRequestException,
  GoneException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as crypto from 'crypto';
import {
  CaptchaType,
  CaptchaGenerateRequest,
  CaptchaGenerateResponse,
  CaptchaVerifyResponse,
} from '@xiaodashi/shared';
import { CaptchaSession } from '../../database/entities/user/captcha-session.entity';
import { SecurityConfig } from '../../config/security.config';
import { SliderPuzzleGenerator } from '../utils/slider-puzzle.generator';
import { LoginRiskAssessmentService } from './login-risk-assessment.service';

/**
 * 验证码服务
 *
 * 负责管理登录验证码的生成、验证和会话管理，包括：
 * - 图形验证码和滑动验证码的生成
 * - 验证码验证逻辑
 * - 智能触发策略判断
 * - 过期验证码清理
 */
@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);
  private readonly securityConfig: SecurityConfig['security'];
  private readonly captchaConfig: SecurityConfig['security']['captcha'];
  private readonly sliderPuzzleGenerator: SliderPuzzleGenerator;
  private readonly sliderEncryptionKey: string;

  constructor(
    @InjectRepository(CaptchaSession)
    private readonly captchaSessionRepository: Repository<CaptchaSession>,
    private readonly configService: ConfigService,
    private readonly loginRiskAssessmentService: LoginRiskAssessmentService,
  ) {
    this.securityConfig =
      this.configService.get<SecurityConfig>('security')!.security;
    this.captchaConfig = this.securityConfig.captcha;
    this.sliderPuzzleGenerator = new SliderPuzzleGenerator();
    // 生成滑动验证码加密密钥（32字节）
    let encryptionKey = this.configService.get<string>('SLIDER_ENCRYPTION_KEY');
    if (!encryptionKey || typeof encryptionKey !== 'string' || encryptionKey.length < 32) {
      encryptionKey = 'default-32-char-encryption-key-for-slider!';
    }
    // 确保密钥长度为32字节
    this.sliderEncryptionKey = encryptionKey.padEnd(32, '0').substring(0, 32);
  }

  /**
   * 生成验证码
   *
   * @param params 生成参数
   * @param clientInfo 客户端信息
   * @returns Promise<CaptchaGenerateResponse> 验证码生成响应
   */
  async generateCaptcha(
    params: CaptchaGenerateRequest = {},
    clientInfo?: { ipAddress?: string; userAgent?: string },
  ): Promise<CaptchaGenerateResponse> {
    const { type = CaptchaType.IMAGE, complexity = 3 } = params;

    // 生成唯一会话ID
    const sessionId = this.generateSessionId();

    // 根据类型生成验证码
    let captchaData: string;
    let captchaImage: string | undefined;
    let sliderData:
      | {
          backgroundImage: string;
          puzzlePiece: string;
          tolerance: number;
        }
      | undefined;

    if (type === CaptchaType.IMAGE) {
      // 生成图形验证码
      const captcha = svgCaptcha.create({
        size: 4 + Math.floor(complexity / 2), // 4-6位
        ignoreChars: '0o1iIl',
        noise: Math.floor(complexity),
        color: true,
        background: '#f0f0f0',
        width: 120,
        height: 40,
      });

      captchaData = captcha.text;
      captchaImage = `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`;
    } else {
      // 生成滑动验证码（使用真实的拼图生成算法）
      try {
        const sliderPuzzle = this.sliderPuzzleGenerator.generateSliderPuzzle();

        // 存储拼图位置信息（格式：xPosition,yPosition）
        captchaData = `${sliderPuzzle.xPosition},${sliderPuzzle.yPosition}`;

        sliderData = {
          backgroundImage: sliderPuzzle.backgroundImage,
          puzzlePiece: sliderPuzzle.puzzlePiece,
          tolerance: 5, // 容差范围
          // 注意：绝不返回 xPosition，这是安全关键
          // 前端应该通过用户拖拽行为来获取位置，而不是直接知道答案
        };

        this.logger.debug(
          `生成滑动验证码: sessionId=${sessionId}, xPosition=${sliderPuzzle.xPosition}, yPosition=${sliderPuzzle.yPosition}`,
        );
      } catch (error) {
        this.logger.error(
          `生成滑动验证码失败: ${(error as Error).message}`,
          (error as Error).stack,
        );

        // 如果滑动验证码生成失败，降级到图形验证码
        const captcha = svgCaptcha.create({
          size: 4 + Math.floor(complexity / 2),
          ignoreChars: '0o1iIl',
          noise: Math.floor(complexity),
          color: true,
          background: '#f0f0f0',
          width: 120,
          height: 40,
        });

        captchaData = captcha.text;
        captchaImage = `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`;
      }
    }

    // 使用适当的加密方式存储验证码数据
    let encryptedData: string;
    if (type === CaptchaType.SLIDER) {
      // 滑动验证码使用对称加密（需要能够解密验证位置）
      encryptedData = this.encryptSliderData(captchaData);
    } else {
      // 图形验证码使用bcrypt单向加密
      const saltRounds = 12;
      encryptedData = await bcrypt.hash(captchaData, saltRounds);
    }

    // 计算过期时间
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + this.captchaConfig.expireTime,
    );

    // 创建验证码会话记录
    const captchaSession = this.captchaSessionRepository.create({
      sessionId,
      captchaData: encryptedData,
      captchaType: type,
      expiresAt,
      ipAddress: clientInfo?.ipAddress,
      userAgent: clientInfo?.userAgent,
      attempts: 0,
      isVerified: false,
      isUsed: false,
    });

    await this.captchaSessionRepository.save(captchaSession);

    this.logger.debug(
      `生成验证码: sessionId=${sessionId}, type=${type}, expiresAt=${expiresAt.toISOString()}`,
    );

    const response: CaptchaGenerateResponse = {
      sessionId,
      expiresAt: expiresAt.toISOString(),
    };

    if (captchaImage) {
      response.captchaImage = captchaImage;
    }

    if (sliderData) {
      response.sliderData = sliderData;
    }

    return response;
  }

  /**
   * 验证验证码
   *
   * @param sessionId 验证码会话ID
   * @param code 验证码内容
   * @param userId 用户ID（可选）
   * @param ipAddress IP地址（可选）
   * @param markAsUsed 是否标记为已使用（默认true，用于登录验证；false用于预验证）
   * @returns Promise<CaptchaVerifyResponse> 验证码验证响应
   */
  async verifyCaptcha(
    sessionId: string,
    code: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipAddress?: string,
    markAsUsed: boolean = true,
  ): Promise<CaptchaVerifyResponse> {
    // 查找验证码会话
    const captchaSession = await this.captchaSessionRepository.findOne({
      where: { sessionId },
    });

    if (!captchaSession) {
      this.logger.warn(`验证码会话不存在: sessionId=${sessionId}`);
      throw new BadRequestException('验证码会话不存在或已过期');
    }

    // 检查是否已过期
    if (captchaSession.expiresAt < new Date()) {
      this.logger.warn(
        `验证码已过期: sessionId=${sessionId}, expiresAt=${captchaSession.expiresAt.toISOString()}`,
      );
      throw new GoneException('验证码已过期');
    }

    // 检查是否已使用
    if (captchaSession.isUsed) {
      this.logger.warn(
        `验证码已使用: sessionId=${sessionId}, isUsed=${captchaSession.isUsed}`,
      );
      throw new BadRequestException('验证码已使用，请重新获取');
    }

    // 移除这个检查，允许已预验证的验证码在正式验证时使用

    // 检查尝试次数
    if (captchaSession.attempts >= this.captchaConfig.maxAttempts) {
      this.logger.warn(
        `验证码尝试次数过多: sessionId=${sessionId}, attempts=${captchaSession.attempts}`,
      );
      throw new BadRequestException('验证码尝试次数过多，请重新获取');
    }

    // 增加尝试次数
    await this.captchaSessionRepository.update(captchaSession.id, {
      attempts: captchaSession.attempts + 1,
    });

    // 如果验证码已经预验证过，直接使用预验证结果
    if (captchaSession.isVerified && !markAsUsed) {
      this.logger.warn(
        `预验证的验证码不应重复预验证: sessionId=${sessionId}`,
      );
      throw new BadRequestException('验证码已预验证，请直接用于登录');
    }

    // 如果验证码已经预验证过且现在是正式验证，直接标记为已使用
    if (captchaSession.isVerified && markAsUsed) {
      await this.captchaSessionRepository.update(captchaSession.id, {
        isUsed: true,
      });
      this.logger.debug(`预验证的验证码正式使用成功: sessionId=${sessionId}`);
      return {
        success: true,
        message: '验证码验证成功',
      };
    }

    // 验证验证码
    let isValid = false;

    if (captchaSession.captchaType === 'slider') {
      // 滑动验证码验证逻辑
      const userXPosition = parseInt(code, 10);
      if (!isNaN(userXPosition)) {
        // 解密滑动位置数据
        const correctData = this.decryptSliderData(captchaSession.captchaData);
        if (correctData) {
          const [correctX] = correctData.split(',').map(Number);
          isValid = this.sliderPuzzleGenerator.verifySliderPosition(
            correctX,
            userXPosition,
            5, // 容差范围
          );
        }
      }
    } else {
      // 图形验证码验证逻辑
      isValid = await bcrypt.compare(code, captchaSession.captchaData);
    }

    if (!isValid) {
      this.logger.warn(
        `验证码验证失败: sessionId=${sessionId}, attempt=${captchaSession.attempts + 1}`,
      );

      const remainingAttempts =
        this.captchaConfig.maxAttempts - (captchaSession.attempts + 1);

      return {
        success: false,
        message:
          remainingAttempts > 0
            ? '验证码错误，请重新输入'
            : '验证码尝试次数过多，请重新获取',
        attemptsRemaining: Math.max(0, remainingAttempts),
      };
    }

    // 验证成功，标记为已验证
    const updateData: any = {
      isVerified: true,
    };

    // 只有在正式验证时才标记为已使用
    if (markAsUsed) {
      updateData.isUsed = true;
      this.logger.debug(`验证码正式验证成功并标记为已使用: sessionId=${sessionId}`);
    } else {
      this.logger.debug(`验证码预验证成功（未标记为已使用）: sessionId=${sessionId}`);
    }

    await this.captchaSessionRepository.update(captchaSession.id, updateData);

    return {
      success: true,
      message: markAsUsed ? '验证码验证成功' : '验证码预验证成功',
    };
  }

  /**
   * 检查是否需要验证码（智能触发策略）
   *
   * @param userId 用户ID（可选）
   * @param email 登录邮箱（可选）
   * @param ipAddress IP地址
   * @param userAgent 用户代理（可选）
   * @returns Promise<{ required: boolean; reason?: string; riskScore?: number }> 是否需要验证码及原因
   */
  async shouldRequireCaptcha(
    userId?: string,
    email?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ required: boolean; reason?: string; riskScore?: number }> {
    if (!ipAddress) {
      return { required: false };
    }

    try {
      // 使用新的风险评估服务
      const riskAssessment =
        await this.loginRiskAssessmentService.assessLoginRisk(
          userId,
          email,
          ipAddress,
          userAgent,
        );

      this.logger.debug(
        `验证码触发评估 - 用户ID: ${userId || 'unknown'}, 邮箱: ${email}, IP: ${ipAddress}, 风险分数: ${riskAssessment.riskScore}, 需要验证码: ${riskAssessment.required}, 原因: ${riskAssessment.reason}`,
      );

      return {
        required: riskAssessment.required,
        reason: riskAssessment.reason,
        riskScore: riskAssessment.riskScore,
      };
    } catch (error) {
      this.logger.error('风险评估失败，使用降级方案', (error as Error).stack);

      // 降级方案：使用原有的简单检查逻辑
      const recentFailedAttempts = await this.captchaSessionRepository.count({
        where: {
          ipAddress,
          isVerified: false,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
          attempts: MoreThan(0),
        },
      });

      const required =
        recentFailedAttempts >= this.captchaConfig.triggerAttempts;
      const reason = required ? '检测到验证码验证失败记录' : undefined;

      return {
        required,
        reason,
      };
    }
  }

  /**
   * 清理过期的验证码会话（定时任务）
   *
   * 每小时执行一次清理过期验证码
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredCaptchas(): Promise<void> {
    const now = new Date();

    // 删除过期的验证码会话
    const result = await this.captchaSessionRepository.delete({
      expiresAt: LessThan(now),
    });

    const cleanedCount = result.affected || 0;

    if (cleanedCount > 0) {
      this.logger.log(`清理过期验证码会话: 清理了 ${cleanedCount} 个过期会话`);
    }
  }

  /**
   * 手动清理过期验证码
   *
   * @returns Promise<number> 清理的数量
   */
  async manualCleanupExpiredCaptchas(): Promise<number> {
    const now = new Date();

    const result = await this.captchaSessionRepository.delete({
      expiresAt: LessThan(now),
    });

    const cleanedCount = result.affected || 0;

    if (cleanedCount > 0) {
      this.logger.log(
        `手动清理过期验证码会话: 清理了 ${cleanedCount} 个过期会话`,
      );
    }

    return cleanedCount;
  }

  /**
   * 生成唯一的会话ID
   *
   * @returns string 会话ID
   * @private
   */
  private generateSessionId(): string {
    // 使用时间戳 + 随机数生成唯一ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `captcha_${timestamp}_${random}`;
  }

  /**
   * 加密滑动数据
   *
   * 使用AES-256-GCM对称加密算法加密滑动位置信息
   *
   * @param data 原始数据（格式：xPosition,yPosition）
   * @returns string 加密后的数据
   * @private
   */
  private encryptSliderData(data: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(this.sliderEncryptionKey),
        iv,
      );
      cipher.setAAD(Buffer.from('slider-captcha', 'utf8'));

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // 组合 IV + 加密数据 + 认证标签
      return (
        iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
      );
    } catch (error) {
      this.logger.error('加密滑动数据失败', (error as Error).stack);
      // 如果加密失败，返回原始数据的简单编码作为降级方案
      return Buffer.from(data, 'utf8').toString('base64');
    }
  }

  /**
   * 解密滑动数据
   *
   * 使用AES-256-GCM对称解密算法解密滑动位置信息
   *
   * @param encryptedData 加密的数据
   * @returns string | null 解密后的数据或null
   * @private
   */
  private decryptSliderData(encryptedData: string): string | null {
    try {
      // 尝试AES解密
      const parts = encryptedData.split(':');
      if (parts.length === 3) {
        const [ivHex, authTagHex, encrypted] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv(
          'aes-256-gcm',
          Buffer.from(this.sliderEncryptionKey),
          iv,
        );
        decipher.setAAD(Buffer.from('slider-captcha', 'utf8'));
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
      }
    } catch (error) {
      this.logger.debug('AES解密失败，尝试降级方案', (error as Error).message);
    }

    // 降级方案：尝试base64解码
    try {
      return Buffer.from(encryptedData, 'base64').toString('utf8');
    } catch (error) {
      this.logger.error('解密滑动数据完全失败', (error as Error).stack);
      return null;
    }
  }

  /**
   * 获取验证码统计信息
   *
   * @returns Promise<any> 统计信息
   */
  async getCaptchaStatistics(): Promise<{
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    usedSessions: number;
    verifiedSessions: number;
  }> {
    const now = new Date();

    const [
      totalSessions,
      activeSessions,
      expiredSessions,
      usedSessions,
      verifiedSessions,
    ] = await Promise.all([
      this.captchaSessionRepository.count(),
      this.captchaSessionRepository.count({
        where: { expiresAt: MoreThan(now), isUsed: false },
      }),
      this.captchaSessionRepository.count({
        where: { expiresAt: LessThan(now) },
      }),
      this.captchaSessionRepository.count({
        where: { isUsed: true },
      }),
      this.captchaSessionRepository.count({
        where: { isVerified: true },
      }),
    ]);

    return {
      totalSessions,
      activeSessions,
      expiredSessions,
      usedSessions,
      verifiedSessions,
    };
  }
}
