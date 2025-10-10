import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import type {
  DeviceInfo,
  SessionListResponse,
  RevokeSessionResponse,
  RevokeAllSessionsResponse,
  SuspiciousLoginWarning,
} from '@xiaodashi/shared';
import { UserSession } from '../database/entities/user/user-session.entity';

/**
 * 设备限制信息（backend内部使用，使用实体类型）
 */
interface DeviceLimitInfo {
  currentDeviceCount: number;
  maxDeviceCount: number;
  isLimitReached: boolean;
  oldestSession?: UserSession; // 使用实体类型而非shared的UserSession
}

/**
 * SessionService - 用户会话管理服务
 *
 * 提供完整的多设备会话管理功能：
 * - 创建和管理用户会话
 * - 多设备登录限制（最多5台）
 * - 会话撤销（单个/全部）
 * - 会话活跃度追踪
 * - 定时清理过期会话
 * - 可疑登录检测
 */
@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly MAX_DEVICES = 5; // 最大设备数量限制
  private readonly DEFAULT_SESSION_EXPIRES_IN = 7 * 24 * 60 * 60; // 7天（秒）

  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  /**
   * 创建新会话
   *
   * @param userId - 用户ID
   * @param deviceInfo - 设备信息
   * @param refreshToken - Refresh token（将被哈希存储）
   * @param ipAddress - IP地址
   * @param userAgent - User-Agent字符串
   * @returns Promise<UserSession> - 创建的会话对象
   */
  async createSession(
    userId: string,
    deviceInfo: DeviceInfo,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSession> {
    // 检查设备数量限制
    const deviceLimit = await this.checkDeviceLimit(userId);

    if (deviceLimit.isLimitReached && deviceLimit.oldestSession) {
      // 达到设备限制，移除最旧的会话
      this.logger.log(
        `用户 ${userId} 达到设备限制，移除最旧会话 ${deviceLimit.oldestSession.id}`,
      );
      await this.sessionRepository.remove(deviceLimit.oldestSession);
    }

    // 哈希 refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // 计算过期时间
    const expiresAt = new Date(
      Date.now() + this.DEFAULT_SESSION_EXPIRES_IN * 1000,
    );

    // 创建新会话
    const session = this.sessionRepository.create({
      userId,
      refreshTokenHash,
      deviceId: deviceInfo.deviceId,
      deviceName: deviceInfo.deviceName,
      deviceType: deviceInfo.deviceType,
      ipAddress,
      userAgent,
      location: deviceInfo.location,
      isActive: true,
      expiresAt,
    });

    const savedSession = await this.sessionRepository.save(session);
    this.logger.log(`用户 ${userId} 创建新会话 ${savedSession.id}`);

    return savedSession;
  }

  /**
   * 获取用户所有活跃会话
   *
   * @param userId - 用户ID
   * @returns Promise<SessionListResponse> - 会话列表响应
   */
  async getUserSessions(userId: string): Promise<SessionListResponse> {
    const allSessions = await this.sessionRepository.find({
      where: { userId },
      order: { lastActiveAt: 'DESC' },
    });

    const activeSessions = allSessions.filter((session) => session.isActive);

    return {
      sessions: activeSessions.map((session) => this.toSessionInfo(session)),
      total: allSessions.length,
      activeCount: activeSessions.length,
    };
  }

  /**
   * 撤销指定会话
   *
   * @param sessionId - 会话ID
   * @param userId - 用户ID（用于权限验证）
   * @returns Promise<RevokeSessionResponse> - 撤销响应
   * @throws NotFoundException - 会话不存在
   * @throws UnauthorizedException - 无权撤销该会话
   */
  async revokeSession(
    sessionId: string,
    userId: string,
  ): Promise<RevokeSessionResponse> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`会话 ${sessionId} 不存在`);
    }

    // 权限校验：只能撤销自己的会话
    if (session.userId !== userId) {
      throw new UnauthorizedException('无权撤销该会话');
    }

    // 设置为非活跃状态
    session.isActive = false;
    await this.sessionRepository.save(session);

    this.logger.log(`用户 ${userId} 撤销会话 ${sessionId}`);

    return {
      message: '会话已成功撤销',
      success: true,
      revokedSessionId: sessionId,
    };
  }

  /**
   * 撤销用户所有会话
   *
   * @param userId - 用户ID
   * @param exceptCurrentSession - 是否保留当前会话
   * @param currentSessionId - 当前会话ID（如果需要保留）
   * @returns Promise<RevokeAllSessionsResponse> - 撤销响应
   */
  async revokeAllSessions(
    userId: string,
    exceptCurrentSession = false,
    currentSessionId?: string,
  ): Promise<RevokeAllSessionsResponse> {
    const sessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
    });

    let sessionsToRevoke = sessions;

    // 如果需要保留当前会话
    if (exceptCurrentSession && currentSessionId) {
      sessionsToRevoke = sessions.filter(
        (session) => session.id !== currentSessionId,
      );
    }

    // 批量更新为非活跃状态
    for (const session of sessionsToRevoke) {
      session.isActive = false;
    }

    await this.sessionRepository.save(sessionsToRevoke);

    this.logger.log(
      `用户 ${userId} 撤销 ${sessionsToRevoke.length} 个会话${exceptCurrentSession ? '（保留当前会话）' : ''}`,
    );

    return {
      message: exceptCurrentSession
        ? '已撤销所有其他设备的会话'
        : '已撤销所有会话',
      success: true,
      revokedCount: sessionsToRevoke.length,
    };
  }

  /**
   * 更新会话活跃时间
   *
   * @param sessionId - 会话ID
   * @returns Promise<void>
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      lastActiveAt: new Date(),
    });
  }

  /**
   * 验证refresh token与会话的绑定
   *
   * @param sessionId - 会话ID
   * @param refreshToken - Refresh token
   * @returns Promise<boolean> - 是否验证通过
   */
  async validateRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, isActive: true },
    });

    if (!session) {
      return false;
    }

    // 验证refresh token哈希
    return bcrypt.compare(refreshToken, session.refreshTokenHash);
  }

  /**
   * 通过refresh token查找会话
   *
   * @param userId - 用户ID
   * @param refreshToken - Refresh token
   * @returns Promise<UserSession | null> - 会话对象或null
   */
  async findSessionByRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserSession | null> {
    const sessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
    });

    for (const session of sessions) {
      const isValid = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (isValid) {
        return session;
      }
    }

    return null;
  }

  /**
   * 检查设备数量限制
   *
   * @param userId - 用户ID
   * @returns Promise<DeviceLimitInfo> - 设备限制信息
   */
  async checkDeviceLimit(userId: string): Promise<DeviceLimitInfo> {
    const activeSessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'ASC' },
    });

    const currentDeviceCount = activeSessions.length;
    const isLimitReached = currentDeviceCount >= this.MAX_DEVICES;

    return {
      currentDeviceCount,
      maxDeviceCount: this.MAX_DEVICES,
      isLimitReached,
      oldestSession: isLimitReached ? activeSessions[0] : undefined,
    };
  }

  /**
   * 检测可疑登录
   *
   * @param userId - 用户ID
   * @param deviceInfo - 新设备信息
   * @param ipAddress - IP地址
   * @returns Promise<SuspiciousLoginWarning | null> - 可疑登录警告或null
   */
  async detectSuspiciousLogin(
    userId: string,
    deviceInfo: DeviceInfo,
    ipAddress?: string,
  ): Promise<SuspiciousLoginWarning | null> {
    const recentSessions = await this.sessionRepository.find({
      where: {
        userId,
        createdAt: MoreThan(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 最近30天
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    if (recentSessions.length === 0) {
      // 首次登录，不算可疑
      return null;
    }

    // 检查是否为新设备
    const isNewDevice = !recentSessions.some(
      (session) => session.deviceId === deviceInfo.deviceId,
    );

    if (isNewDevice) {
      return {
        type: 'new_device',
        message: '检测到新设备登录',
        deviceInfo,
        timestamp: new Date().toISOString(),
      };
    }

    // 检查是否为新地理位置（简单检查 - 生产环境应使用IP地理定位服务）
    if (ipAddress && deviceInfo.location) {
      const hasMatchingLocation = recentSessions.some(
        (session) => session.location === deviceInfo.location,
      );

      if (!hasMatchingLocation) {
        return {
          type: 'new_location',
          message: '检测到异地登录',
          deviceInfo,
          previousLocation: recentSessions[0]?.location,
          currentLocation: deviceInfo.location,
          timestamp: new Date().toISOString(),
        };
      }
    }

    return null;
  }

  /**
   * 定时清理过期会话
   * 每小时执行一次
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();

    const expiredSessions = await this.sessionRepository.find({
      where: {
        expiresAt: LessThan(now),
        isActive: true,
      },
    });

    if (expiredSessions.length > 0) {
      // 批量标记为非活跃
      for (const session of expiredSessions) {
        session.isActive = false;
      }

      await this.sessionRepository.save(expiredSessions);

      this.logger.log(`清理了 ${expiredSessions.length} 个过期会话`);
    }

    // 可选：删除已过期超过30天的会话记录（彻底清理）
    const oldExpiredSessions = await this.sessionRepository.find({
      where: {
        expiresAt: LessThan(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
        isActive: false,
      },
    });

    if (oldExpiredSessions.length > 0) {
      await this.sessionRepository.remove(oldExpiredSessions);
      this.logger.log(`永久删除了 ${oldExpiredSessions.length} 个旧会话记录`);
    }
  }

  /**
   * 将UserSession实体转换为前端会话信息
   *
   * @param session - UserSession实体
   * @returns SessionInfo - 会话信息对象
   * @private
   */
  private toSessionInfo(session: UserSession) {
    return {
      id: session.id,
      userId: session.userId,
      deviceId: session.deviceId,
      deviceName: session.deviceName,
      deviceType: session.deviceType,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      location: session.location,
      isActive: session.isActive,
      expiresAt: session.expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
      lastActiveAt: session.lastActiveAt.toISOString(),
    };
  }
}
