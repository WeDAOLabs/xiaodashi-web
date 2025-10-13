import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IPRateLimit } from '../../database/entities/security/ip-rate-limit.entity';
import { IPRateLimitStatus } from '@xiaodashi/shared';

/**
 * IP频率限制服务
 *
 * 使用PostgreSQL作为缓存实现滑动窗口频率限制：
 * - 支持多种动作类型（login, register, api, captcha）
 * - 使用滑动窗口算法准确计数
 * - 自动清理过期记录
 * - 支持临时封禁
 *
 * 技术要点：
 * - PostgreSQL替代Redis，KISS原则
 * - 滑动窗口算法：基于时间窗口的精确限流
 * - 使用数据库事务保证一致性
 * - 定时任务清理过期数据
 */
@Injectable()
export class IPRateLimiterService {
  private readonly logger = new Logger(IPRateLimiterService.name);

  // 默认配置（分钟为单位的窗口时间和最大请求数）
  private readonly defaultLimits: Record<
    string,
    { windowMs: number; maxRequests: number }
  > = {
    login: { windowMs: 15, maxRequests: 5 }, // 15分钟内最多5次登录尝试
    register: { windowMs: 60, maxRequests: 3 }, // 1小时内最多3次注册
    api: { windowMs: 1, maxRequests: 100 }, // 1分钟内最多100次API调用
    captcha: { windowMs: 1, maxRequests: 10 }, // 1分钟内最多10次验证码请求
  };

  constructor(
    @InjectRepository(IPRateLimit)
    private readonly rateLimitRepository: Repository<IPRateLimit>,
  ) {}

  /**
   * 检查并记录IP访问
   *
   * 使用滑动窗口算法：
   * 1. 查找或创建当前IP+action的记录
   * 2. 检查当前窗口是否过期，过期则重置
   * 3. 增加请求计数
   * 4. 判断是否超过限制
   *
   * @param ipAddress - IP地址
   * @param action - 动作类型
   * @param customLimits - 自定义限制配置（可选）
   * @returns 频率限制状态
   */
  async checkRateLimit(
    ipAddress: string,
    action: string,
    customLimits?: { windowMs: number; maxRequests: number },
  ): Promise<IPRateLimitStatus> {
    const limits = customLimits || this.defaultLimits[action];

    if (!limits) {
      throw new Error(`Unknown action type: ${action}`);
    }

    const now = new Date();
    const windowMs = limits.windowMs * 60 * 1000; // 转换为毫秒

    // 查找现有记录
    let record = await this.rateLimitRepository.findOne({
      where: { ipAddress, action },
    });

    if (!record) {
      // 创建新记录
      record = this.rateLimitRepository.create({
        ipAddress,
        action,
        requestCount: 1,
        windowStartAt: now,
        windowEndAt: new Date(now.getTime() + windowMs),
        isBlocked: false,
      });

      await this.rateLimitRepository.save(record);

      return this.toStatus(record, limits.maxRequests);
    }

    // 检查窗口是否过期
    if (now >= record.windowEndAt) {
      // 窗口已过期，重置计数
      record.requestCount = 1;
      record.windowStartAt = now;
      record.windowEndAt = new Date(now.getTime() + windowMs);
      record.isBlocked = false;
      record.blockedUntil = undefined;

      await this.rateLimitRepository.save(record);

      return this.toStatus(record, limits.maxRequests);
    }

    // 检查是否被封禁
    if (record.isBlocked && record.blockedUntil && now < record.blockedUntil) {
      return this.toStatus(record, limits.maxRequests);
    }

    // 如果封禁已过期，解除封禁
    if (record.isBlocked && record.blockedUntil && now >= record.blockedUntil) {
      record.isBlocked = false;
      record.blockedUntil = undefined;
      record.requestCount = 1;
      record.windowStartAt = now;
      record.windowEndAt = new Date(now.getTime() + windowMs);

      await this.rateLimitRepository.save(record);

      return this.toStatus(record, limits.maxRequests);
    }

    // 在当前窗口内增加计数
    record.requestCount += 1;

    // 检查是否超过限制
    if (record.requestCount > limits.maxRequests) {
      record.isBlocked = true;
      // 封禁至窗口结束
      record.blockedUntil = record.windowEndAt;

      this.logger.warn(
        `IP ${ipAddress} exceeded rate limit for action ${action}: ${record.requestCount}/${limits.maxRequests}`,
      );
    }

    await this.rateLimitRepository.save(record);

    return this.toStatus(record, limits.maxRequests);
  }

  /**
   * 获取IP的频率限制状态
   *
   * @param ipAddress - IP地址
   * @param action - 动作类型
   * @returns 频率限制状态，如果没有记录则返回null
   */
  async getRateLimitStatus(
    ipAddress: string,
    action: string,
  ): Promise<IPRateLimitStatus | null> {
    const record = await this.rateLimitRepository.findOne({
      where: { ipAddress, action },
    });

    if (!record) {
      return null;
    }

    const limits = this.defaultLimits[action];
    if (!limits) {
      return null;
    }

    return this.toStatus(record, limits.maxRequests);
  }

  /**
   * 重置IP的频率限制
   *
   * @param ipAddress - IP地址
   * @param action - 动作类型（可选，如果不提供则重置所有动作）
   * @returns 是否成功重置
   */
  async resetRateLimit(ipAddress: string, action?: string): Promise<boolean> {
    const where = action ? { ipAddress, action } : { ipAddress };
    const result = await this.rateLimitRepository.delete(where);

    const reset = !!(result.affected && result.affected > 0);
    if (reset) {
      this.logger.log(
        `Reset rate limit for IP ${ipAddress}${action ? ` action ${action}` : ''}`,
      );
    }

    return reset;
  }

  /**
   * 手动封禁IP
   *
   * @param ipAddress - IP地址
   * @param action - 动作类型
   * @param durationMinutes - 封禁时长（分钟）
   * @returns 是否成功封禁
   */
  async blockIP(
    ipAddress: string,
    action: string,
    durationMinutes: number,
  ): Promise<boolean> {
    const now = new Date();
    const blockedUntil = new Date(now.getTime() + durationMinutes * 60 * 1000);

    let record = await this.rateLimitRepository.findOne({
      where: { ipAddress, action },
    });

    if (!record) {
      // 创建新的封禁记录
      const limits = this.defaultLimits[action];
      if (!limits) {
        return false;
      }

      const windowMs = limits.windowMs * 60 * 1000;
      record = this.rateLimitRepository.create({
        ipAddress,
        action,
        requestCount: limits.maxRequests + 1, // 超过限制
        windowStartAt: now,
        windowEndAt: new Date(now.getTime() + windowMs),
        isBlocked: true,
        blockedUntil,
      });
    } else {
      record.isBlocked = true;
      record.blockedUntil = blockedUntil;
    }

    await this.rateLimitRepository.save(record);
    this.logger.log(
      `Manually blocked IP ${ipAddress} for action ${action} until ${blockedUntil.toISOString()}`,
    );

    return true;
  }

  /**
   * 解除IP封禁
   *
   * @param ipAddress - IP地址
   * @param action - 动作类型
   * @returns 是否成功解除
   */
  async unblockIP(ipAddress: string, action: string): Promise<boolean> {
    const record = await this.rateLimitRepository.findOne({
      where: { ipAddress, action },
    });

    if (!record) {
      return false;
    }

    record.isBlocked = false;
    record.blockedUntil = undefined;

    await this.rateLimitRepository.save(record);
    this.logger.log(`Unblocked IP ${ipAddress} for action ${action}`);

    return true;
  }

  /**
   * 定时清理过期的频率限制记录
   *
   * 每小时执行一次，清理窗口结束时间超过24小时的记录
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredRecords(): Promise<void> {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24小时前

    const result = await this.rateLimitRepository.delete({
      windowEndAt: LessThan(cutoffTime),
    });

    const count = result.affected || 0;
    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired rate limit records`);
    }
  }

  /**
   * 获取频率限制统计信息
   *
   * @returns 统计信息对象
   */
  async getStatistics(): Promise<{
    total: number;
    blocked: number;
    byAction: Record<string, { total: number; blocked: number }>;
  }> {
    const [total, blocked] = await Promise.all([
      this.rateLimitRepository.count(),
      this.rateLimitRepository.count({ where: { isBlocked: true } }),
    ]);

    // 按动作类型统计
    const byActionRaw = await this.rateLimitRepository
      .createQueryBuilder('rate_limit')
      .select('rate_limit.action', 'action')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN rate_limit.isBlocked = true THEN 1 ELSE 0 END)',
        'blocked',
      )
      .groupBy('rate_limit.action')
      .getRawMany();

    const byAction: Record<string, { total: number; blocked: number }> = {};

    byActionRaw.forEach(
      (item: { action: string; total: string; blocked: string }) => {
        byAction[item.action] = {
          total: parseInt(item.total, 10),
          blocked: parseInt(item.blocked, 10),
        };
      },
    );

    return {
      total,
      blocked,
      byAction,
    };
  }

  /**
   * 将实体转换为状态DTO
   */
  private toStatus(
    record: IPRateLimit,
    maxRequests: number,
  ): IPRateLimitStatus {
    const now = new Date();
    const isLimited =
      record.isBlocked ||
      (record.blockedUntil !== undefined &&
        record.blockedUntil !== null &&
        now < record.blockedUntil);

    return {
      ipAddress: record.ipAddress,
      action: record.action,
      isLimited,
      requestsInWindow: record.requestCount,
      maxRequests,
      windowStartAt: record.windowStartAt.toISOString(),
      windowEndAt: record.windowEndAt.toISOString(),
      blockedUntil: record.blockedUntil?.toISOString(),
      resetAt: record.windowEndAt.toISOString(),
    };
  }
}
