import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountLockoutStatus } from '@xiaodashi/shared';
import { User } from '../../database/entities/user/user.entity';
import { SecurityConfig } from '../../config/security.config';

/**
 * 账户锁定服务
 *
 * 负责处理用户登录失败的账户锁定机制，包括：
 * - 渐进式锁定策略（3次/5分钟，5次/15分钟，10次/1小时）
 * - 自动解锁机制
 * - 锁定状态查询和管理
 * - 管理员手动解锁功能
 */
@Injectable()
export class AccountLockoutService {
  private readonly logger = new Logger(AccountLockoutService.name);
  private readonly securityConfig: SecurityConfig['security'];

  // 定义最大尝试次数常量
  private readonly MAX_ATTEMPTS = 999; // 当达到最高锁定等级后，最大尝试次数

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.securityConfig =
      this.configService.get<SecurityConfig>('security')!.security;
  }

  /**
   * 记录登录失败尝试
   *
   * @param userId 用户ID
   * @param ipAddress 登录IP地址
   * @returns Promise<AccountLockoutStatus> 更新后的锁定状态
   */
  async recordFailedAttempt(
    userId: string,
    ipAddress: string,
  ): Promise<AccountLockoutStatus> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`用户不存在: ${userId}`);
    }

    // 增加失败次数
    const newAttempts = user.loginAttempts + 1;

    // 计算锁定状态
    const lockoutStatus = this.calculateLockoutStatus(newAttempts);

    // 更新用户记录
    const updateData: Partial<User> = {
      loginAttempts: newAttempts,
    };

    // 如果需要锁定，设置锁定时间
    if (lockoutStatus.isLocked && lockoutStatus.lockoutDuration) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(
        lockedUntil.getMinutes() + lockoutStatus.lockoutDuration,
      );
      updateData.lockedUntil = lockedUntil;

      this.logger.warn(
        `账户已锁定: 用户=${user.email}, 失败次数=${newAttempts}, ` +
          `锁定时长=${lockoutStatus.lockoutDuration}分钟, IP=${ipAddress}`,
      );
    }

    await this.userRepository.update(userId, updateData);

    // 返回最新的锁定状态
    return this.getLockoutStatus(userId);
  }

  /**
   * 检查账户是否被锁定
   *
   * @param userId 用户ID
   * @returns Promise<AccountLockoutStatus> 锁定状态信息
   */
  async checkAccountLocked(userId: string): Promise<AccountLockoutStatus> {
    return this.getLockoutStatus(userId);
  }

  /**
   * 重置用户登录失败次数（管理员手动解锁）
   *
   * @param userId 用户ID
   * @param reason 解锁原因
   * @param adminUserId 管理员用户ID（用于审计日志）
   * @returns Promise<{ success: boolean; message: string }> 解锁结果
   */
  async unlockAccount(
    userId: string,
    reason: string,
    adminUserId?: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return {
        success: false,
        message: '用户不存在',
      };
    }

    // 重置锁定状态
    await this.userRepository.update(userId, {
      loginAttempts: 0,
      lockedUntil: undefined,
    });

    this.logger.log(
      `账户已解锁: 用户=${user.email}, 操作者=${adminUserId || 'system'}, 原因=${reason}`,
    );

    return {
      success: true,
      message: `用户 ${user.email} 已成功解锁`,
    };
  }

  /**
   * 获取用户锁定状态
   *
   * @param userId 用户ID
   * @returns Promise<AccountLockoutStatus> 锁定状态详情
   */
  async getLockoutStatus(userId: string): Promise<AccountLockoutStatus> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`用户不存在: ${userId}`);
    }

    return this.calculateLockoutStatusFromUser(user);
  }

  /**
   * 获取用户信息（用于控制器获取邮箱等）
   *
   * @param userId 用户ID
   * @returns Promise<{ id: string; email: string } | null> 用户基本信息
   */
  async getUserInfo(
    userId: string,
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email'],
    });

    return user ? { id: user.id, email: user.email } : null;
  }

  /**
   * 清理过期的锁定状态（定时任务使用）
   *
   * 清理已过期的账户锁定，重置为正常状态
   * @returns Promise<number> 清理的用户数量
   */
  async cleanupExpiredLockouts(): Promise<number> {
    const now = new Date();

    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        loginAttempts: 0,
        lockedUntil: undefined,
      })
      .where('lockedUntil IS NOT NULL')
      .andWhere('lockedUntil <= :now', { now })
      .execute();

    const cleanedCount = result.affected || 0;

    if (cleanedCount > 0) {
      this.logger.log(`清理过期锁定状态: 清理了 ${cleanedCount} 个用户`);
    }

    return cleanedCount;
  }

  /**
   * 从用户实体计算锁定状态
   *
   * @param user 用户实体
   * @returns AccountLockoutStatus 锁定状态
   * @private
   */
  private calculateLockoutStatusFromUser(user: User): AccountLockoutStatus {
    const currentAttempts = user.loginAttempts;
    const now = new Date();
    const isLocked = user.lockedUntil ? user.lockedUntil > now : false;

    // 计算剩余时间和锁定时长
    let lockedUntil: string | undefined;
    let lockoutDuration: number | undefined;

    if (isLocked && user.lockedUntil) {
      lockedUntil = user.lockedUntil.toISOString();
      lockoutDuration = Math.ceil(
        (user.lockedUntil.getTime() - now.getTime()) / (1000 * 60),
      );
    }

    // 计算剩余尝试次数和下次锁定信息
    const nextThreshold = this.getNextLockThreshold(currentAttempts);
    const remainingAttempts =
      nextThreshold !== null ? nextThreshold - currentAttempts : 0; // 已达最高惩罚等级，剩余尝试次数为0
    // 获取下一个锁定阈值对应的锁定时长
    const nextLockDuration = this.getNextLockDuration(nextThreshold);

    return {
      isLocked,
      lockedUntil,
      remainingAttempts,
      currentAttempts,
      lockoutDuration,
      lockReason: isLocked ? '登录失败次数过多' : undefined,
      nextLockThreshold: nextThreshold,
      nextLockDuration: nextLockDuration,
    };
  }

  /**
   * 计算锁定状态
   *
   * @param attempts 失败尝试次数
   * @returns AccountLockoutStatus 锁定状态
   * @private
   */
  private calculateLockoutStatus(attempts: number): AccountLockoutStatus {
    const lockoutDuration = this.getLockoutDuration(attempts);
    const isLocked = lockoutDuration > 0;

    const nextThreshold = this.getNextLockThreshold(attempts);
    const remainingAttempts =
      nextThreshold !== null ? Math.max(0, nextThreshold - attempts) : 0; // 已达最高惩罚等级，剩余尝试次数为0

    return {
      isLocked,
      currentAttempts: attempts,
      remainingAttempts,
      lockoutDuration: isLocked ? lockoutDuration : undefined,
      nextLockThreshold: nextThreshold,
      nextLockDuration: this.getNextLockDuration(nextThreshold),
    };
  }

  /**
   * 根据失败次数获取锁定时长
   *
   * @param attempts 失败尝试次数
   * @returns number 锁定时长（分钟），0表示不锁定
   * @private
   */
  private getLockoutDuration(attempts: number): number {
    const levels = this.securityConfig.progressiveLockout.levels;

    // 找到匹配的锁定等级
    for (const level of levels) {
      if (attempts >= level.attempts) {
        return level.duration;
      }
    }

    return 0; // 不锁定
  }

  /**
   * 获取下一个锁定阈值
   *
   * @param currentAttempts 当前失败次数
   * @returns number | null 下次锁定阈值，null表示已达到最高惩罚等级
   * @private
   */
  private getNextLockThreshold(currentAttempts: number): number | null {
    const levels = this.securityConfig.progressiveLockout.levels;

    // 找到下一个更高的锁定等级
    for (const level of levels) {
      if (currentAttempts < level.attempts) {
        return level.attempts;
      }
    }

    // 已达最高锁定等级，返回 null 表示没有更高等级了
    return null;
  }

  /**
   * 获取下一个锁定等级的锁定时长
   *
   * @param nextThreshold 下一个锁定阈值
   * @returns number 下次锁定时长（分钟），0表示无更高等级
   * @private
   */
  private getNextLockDuration(nextThreshold: number | null): number {
    if (nextThreshold === null) {
      return 0; // 已达最高惩罚等级，无下一个锁定时长
    }

    const levels = this.securityConfig.progressiveLockout.levels;

    // 找到下一个锁定阈值对应的锁定时长
    for (const level of levels) {
      if (nextThreshold <= level.attempts) {
        return level.duration;
      }
    }

    // 已达最高等级，返回0表示无更高等级
    return 0;
  }

  /**
   * 检查是否需要重置失败次数（基于重置周期）
   *
   * TODO: 实现基于时间的失败次数重置逻辑
   * 可以基于最后登录时间或特定的重置周期
   *
   * @private
   */
  private shouldResetAttempts(): boolean {
    // 暂时返回false，未来可以实现基于时间的重置逻辑
    return false;
  }
}
