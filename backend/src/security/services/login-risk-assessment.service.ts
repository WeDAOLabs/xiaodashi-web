import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { UserLoginLog } from '../../database/entities/user/user-login-log.entity';
import { CaptchaSession } from '../../database/entities/user/captcha-session.entity';

/**
 * 登录风险评估服务
 *
 * 基于多种因素评估登录风险，智能判断是否需要验证码
 */
@Injectable()
export class LoginRiskAssessmentService {
  private readonly logger = new Logger(LoginRiskAssessmentService.name);

  constructor(
    @InjectRepository(UserLoginLog)
    private readonly userLoginLogRepository: Repository<UserLoginLog>,
    @InjectRepository(CaptchaSession)
    private readonly captchaSessionRepository: Repository<CaptchaSession>,
  ) {}

  /**
   * 评估登录风险，判断是否需要验证码
   *
   * @param userId 用户ID（可选，登录失败时可能为空）
   * @param email 登录邮箱
   * @param ipAddress IP地址
   * @param userAgent 用户代理
   * @returns Promise<{ required: boolean; reason: string; riskScore: number }>
   */
  async assessLoginRisk(
    userId?: string,
    email?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    required: boolean;
    reason: string;
    riskScore: number;
  }> {
    let totalRiskScore = 0;
    const reasons: string[] = [];

    // 1. 检查IP地址的失败登录次数
    const ipRisk = await this.calculateIPRisk(ipAddress);
    totalRiskScore += ipRisk.score;
    if (ipRisk.reason) {
      reasons.push(ipRisk.reason);
    }

    // 2. 检查邮箱的失败登录次数
    const emailRisk = await this.calculateEmailRisk(email);
    totalRiskScore += emailRisk.score;
    if (emailRisk.reason) {
      reasons.push(emailRisk.reason);
    }

    // 3. 检查用户的失败登录次数
    if (userId) {
      const userRisk = await this.calculateUserRisk(userId);
      totalRiskScore += userRisk.score;
      if (userRisk.reason) {
        reasons.push(userRisk.reason);
      }
    }

    // 4. 检查IP地址的验证码失败次数
    const captchaRisk = await this.calculateCaptchaRisk(ipAddress);
    totalRiskScore += captchaRisk.score;
    if (captchaRisk.reason) {
      reasons.push(captchaRisk.reason);
    }

    // 5. 检查异常登录模式
    const patternRisk = await this.analyzeLoginPatterns(
      userId,
      email,
      ipAddress,
      userAgent,
    );
    totalRiskScore += patternRisk.score;
    if (patternRisk.reason) {
      reasons.push(patternRisk.reason);
    }

    // 6. 检查地理位置异常（如果有位置信息）
    const geoRisk = await this.analyzeGeographicalAnomalies(userId, ipAddress);
    totalRiskScore += geoRisk.score;
    if (geoRisk.reason) {
      reasons.push(geoRisk.reason);
    }

    // 7. 检查设备指纹异常
    const deviceRisk = await this.analyzeDeviceAnomalies(userId, userAgent);
    totalRiskScore += deviceRisk.score;
    if (deviceRisk.reason) {
      reasons.push(deviceRisk.reason);
    }

    // 8. 检查时间模式异常
    const timeRisk = await this.analyzeTimePatterns(userId);
    totalRiskScore += timeRisk.score;
    if (timeRisk.reason) {
      reasons.push(timeRisk.reason);
    }

    // 决策逻辑：风险分数 >= 30 或满足特定条件则需要验证码
    const required =
      totalRiskScore >= 30 ||
      ipRisk.score >= 20 ||
      emailRisk.score >= 20 ||
      captchaRisk.score >= 15;

    this.logger.debug(
      `登录风险评估 - 用户ID: ${userId || 'unknown'}, 邮箱: ${email}, IP: ${ipAddress}, 风险分数: ${totalRiskScore}, 需要验证码: ${required}`,
    );

    return {
      required,
      reason: reasons.length > 0 ? reasons.join('; ') : '低风险登录',
      riskScore: totalRiskScore,
    };
  }

  /**
   * 计算IP地址风险
   *
   * @param ipAddress IP地址
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async calculateIPRisk(
    ipAddress?: string,
  ): Promise<{ score: number; reason: string }> {
    if (!ipAddress) {
      return { score: 0, reason: '' };
    }

    try {
      // 查询最近1小时内该IP的失败登录次数
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentFailedLogins = await this.userLoginLogRepository.count({
        where: {
          ipAddress,
          success: false,
          createdAt: LessThan(oneHourAgo),
        },
      });

      // 查询最近15分钟内的失败登录次数
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const veryRecentFailedLogins = await this.userLoginLogRepository.count({
        where: {
          ipAddress,
          success: false,
          createdAt: LessThan(fifteenMinutesAgo),
        },
      });

      let score = 0;
      let reason = '';

      // 15分钟内失败3次以上：高风险
      if (veryRecentFailedLogins >= 3) {
        score += 25;
        reason = '该IP地址在15分钟内多次登录失败';
      }
      // 1小时内失败5次以上：中高风险
      else if (recentFailedLogins >= 5) {
        score += 20;
        reason = '该IP地址在1小时内多次登录失败';
      }
      // 1小时内失败2-4次：中等风险
      else if (recentFailedLogins >= 2) {
        score += 10;
        reason = '该IP地址有失败登录记录';
      }

      return { score, reason };
    } catch (error) {
      this.logger.error('计算IP风险失败', (error as Error).stack);
      return { score: 0, reason: '' };
    }
  }

  /**
   * 计算邮箱风险
   *
   * @param email 登录邮箱
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async calculateEmailRisk(
    email?: string,
  ): Promise<{ score: number; reason: string }> {
    if (!email) {
      return { score: 0, reason: '' };
    }

    try {
      // 查询最近30分钟内该邮箱的失败登录次数
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentFailedLogins = await this.userLoginLogRepository.count({
        where: {
          email,
          success: false,
          createdAt: LessThan(thirtyMinutesAgo),
        },
      });

      let score = 0;
      let reason = '';

      // 30分钟内失败3次以上：高风险
      if (recentFailedLogins >= 3) {
        score += 20;
        reason = '该邮箱在30分钟内多次登录失败';
      }
      // 30分钟内失败2次：中等风险
      else if (recentFailedLogins >= 2) {
        score += 10;
        reason = '该邮箱有失败登录记录';
      }

      return { score, reason };
    } catch (error) {
      this.logger.error('计算邮箱风险失败', (error as Error).stack);
      return { score: 0, reason: '' };
    }
  }

  /**
   * 计算用户风险
   *
   * @param userId 用户ID
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async calculateUserRisk(
    userId?: string,
  ): Promise<{ score: number; reason: string }> {
    if (!userId) {
      return { score: 0, reason: '' };
    }

    try {
      // 查询最近1小时内该用户的失败登录次数
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentFailedLogins = await this.userLoginLogRepository.count({
        where: {
          userId,
          success: false,
          createdAt: LessThan(oneHourAgo),
        },
      });

      let score = 0;
      let reason = '';

      // 1小时内失败5次以上：高风险
      if (recentFailedLogins >= 5) {
        score += 15;
        reason = '该用户在1小时内多次登录失败';
      }
      // 1小时内失败2-4次：中等风险
      else if (recentFailedLogins >= 2) {
        score += 8;
        reason = '该用户有失败登录记录';
      }

      return { score, reason };
    } catch (error) {
      this.logger.error('计算用户风险失败', (error as Error).stack);
      return { score: 0, reason: '' };
    }
  }

  /**
   * 计算验证码相关风险
   *
   * @param ipAddress IP地址
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async calculateCaptchaRisk(
    ipAddress?: string,
  ): Promise<{ score: number; reason: string }> {
    if (!ipAddress) {
      return { score: 0, reason: '' };
    }

    try {
      // 查询该IP地址的失败验证码会话数量
      const recentFailedCaptchas = await this.captchaSessionRepository.count({
        where: {
          ipAddress,
          isVerified: false,
          isUsed: false,
          expiresAt: LessThan(new Date()),
          attempts: 1, // 至少尝试过1次
        },
      });

      let score = 0;
      let reason = '';

      // 有失败验证码记录：中等风险
      if (recentFailedCaptchas >= 2) {
        score += 15;
        reason = '该IP地址有验证码验证失败记录';
      } else if (recentFailedCaptchas >= 1) {
        score += 8;
        reason = '该IP地址有验证码验证记录';
      }

      return { score, reason };
    } catch (error) {
      this.logger.error('计算验证码风险失败', (error as Error).stack);
      return { score: 0, reason: '' };
    }
  }

  /**
   * 分析登录模式异常
   *
   * @param userId 用户ID
   * @param email 登录邮箱
   * @param ipAddress IP地址
   * @param userAgent 用户代理
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async analyzeLoginPatterns(
    userId?: string,
    email?: string,
    ipAddress?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userAgent?: string,
  ): Promise<{ score: number; reason: string }> {
    let score = 0;
    let reason = '';

    try {
      // 检查是否存在相同IP的多个不同邮箱登录尝试（可能是批量攻击）
      if (ipAddress) {
        const uniqueEmailsFromSameIP = (await this.userLoginLogRepository
          .createQueryBuilder('log')
          .select('COUNT(DISTINCT log.email)')
          .where('log.ipAddress = :ipAddress', { ipAddress })
          .andWhere('log.createdAt >= :oneHourAgo', {
            oneHourAgo: new Date(Date.now() - 60 * 60 * 1000),
          })
          .getRawOne()) as Record<string, string>;

        const emailCount = parseInt(
          Object.values(uniqueEmailsFromSameIP)[0],
          10,
        );

        if (emailCount >= 5) {
          score += 20;
          reason = '检测到来自同一IP的多个邮箱登录尝试';
        } else if (emailCount >= 3) {
          score += 10;
          reason = '检测到来自同一IP的多个登录尝试';
        }
      }

      // 检查是否存在同一邮箱的多个不同IP登录尝试（可能是账户被盗）
      if (email) {
        const uniqueIPsForSameEmail = (await this.userLoginLogRepository
          .createQueryBuilder('log')
          .select('COUNT(DISTINCT log.ipAddress)')
          .where('log.email = :email', { email })
          .andWhere('log.createdAt >= :oneHourAgo', {
            oneHourAgo: new Date(Date.now() - 60 * 60 * 1000),
          })
          .getRawOne()) as Record<string, string>;

        const ipCount = parseInt(Object.values(uniqueIPsForSameEmail)[0], 10);

        if (ipCount >= 3) {
          score += 15;
          if (reason) reason += '; ';
          reason += '检测到来自多个IP的登录尝试';
        }
      }
    } catch (error) {
      this.logger.error('分析登录模式失败', (error as Error).stack);
    }

    return { score, reason };
  }

  /**
   * 分析地理位置异常
   *
   * @param userId 用户ID
   * @param ipAddress IP地址
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  private async analyzeGeographicalAnomalies(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ipAddress?: string,
  ): Promise<{ score: number; reason: string }> {
    // 这里是地理位置异常检测的占位符实现
    // 实际项目中可以集成IP地理位置服务（如MaxMind GeoIP2）

    // 目前返回零风险，因为我们还没有集成地理位置服务
    return { score: 0, reason: '' };
  }

  /**
   * 分析设备异常
   *
   * @param userId 用户ID
   * @param userAgent 用户代理
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async analyzeDeviceAnomalies(
    userId?: string,
    userAgent?: string,
  ): Promise<{ score: number; reason: string }> {
    if (!userId || !userAgent) {
      return { score: 0, reason: '' };
    }

    try {
      // 查询用户最近的登录设备
      const recentLogins = await this.userLoginLogRepository.find({
        where: { userId, success: true },
        order: { createdAt: 'DESC' },
        take: 5,
      });

      if (recentLogins.length > 0) {
        const lastUserAgent = recentLogins[0].userAgent;

        // 如果用户代理发生了显著变化
        if (lastUserAgent && lastUserAgent !== userAgent) {
          // 简单的设备类型检测
          const lastDeviceType = this.detectDeviceType(lastUserAgent);
          const currentDeviceType = this.detectDeviceType(userAgent);

          if (lastDeviceType !== currentDeviceType) {
            return {
              score: 10,
              reason: '检测到设备类型变化',
            };
          }
        }
      }
    } catch (error) {
      this.logger.error('分析设备异常失败', (error as Error).stack);
    }

    return { score: 0, reason: '' };
  }

  /**
   * 分析时间模式异常
   *
   * @param userId 用户ID
   * @returns Promise<{ score: number; reason: string }>
   * @private
   */
  private async analyzeTimePatterns(
    userId?: string,
  ): Promise<{ score: number; reason: string }> {
    if (!userId) {
      return { score: 0, reason: '' };
    }

    try {
      // 查询用户最近7天的登录时间
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentLogins = await this.userLoginLogRepository.find({
        where: {
          userId,
          success: true,
          createdAt: sevenDaysAgo,
        },
        order: { createdAt: 'DESC' },
        take: 20,
      });

      if (recentLogins.length >= 3) {
        // 分析登录时间是否异常（如在非正常时间登录）
        const currentHour = new Date().getHours();
        const userNormalHours = this.getUserNormalLoginHours(recentLogins);

        if (!userNormalHours.includes(currentHour)) {
          return {
            score: 8,
            reason: '检测到异常登录时间',
          };
        }
      }
    } catch (error) {
      this.logger.error('分析时间模式失败', (error as Error).stack);
    }

    return { score: 0, reason: '' };
  }

  /**
   * 简单的设备类型检测
   *
   * @param userAgent 用户代理字符串
   * @returns string 设备类型
   * @private
   */
  private detectDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone')
    ) {
      return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * 获取用户正常登录时间段
   *
   * @param logins 登录记录
   * @returns number[] 正常登录小时数组
   * @private
   */
  private getUserNormalLoginHours(logins: UserLoginLog[]): number[] {
    const hourCounts: { [key: number]: number } = {};

    // 统计每个小时的登录次数
    logins.forEach((login) => {
      const hour = new Date(login.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // 找出登录次数最多的时间段（占80%以上的登录）
    const totalLogins = logins.length;
    const sortedHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([hour]) => parseInt(hour, 10));

    let cumulativeCount = 0;
    const normalHours: number[] = [];

    for (const hour of sortedHours) {
      normalHours.push(hour);
      cumulativeCount += hourCounts[hour];

      if (cumulativeCount >= totalLogins * 0.8) {
        break;
      }
    }

    return normalHours;
  }
}
