import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import {
  LoginLogEntry,
  LoginLogQueryParams,
  LoginLogQueryResponse,
  LoginAnomaly,
  LoginAnomalyType,
  LoginAnomalyReport,
  LoginStatistics,
  LoginSecurityReport,
  UserLoginPattern,
  LoginPatternAnalysisResponse,
} from '@xiaodashi/shared';
import { UserLoginLog } from '../../database/entities/user/user-login-log.entity';
import { User } from '../../database/entities/user/user.entity';

/**
 * 登录审计服务
 *
 * 负责处理登录日志的查询、分析和异常检测功能，包括：
 * - 登录日志查询和筛选
 * - 用户登录模式分析
 * - 异常登录行为检测
 * - 安全审计报告生成
 */
@Injectable()
export class LoginAuditService {
  private readonly logger = new Logger(LoginAuditService.name);

  // 异常检测配置
  private readonly ANOMALY_DETECTION_CONFIG = {
    // IP变更检测：24小时内IP变化超过3次视为异常
    IP_CHANGE_THRESHOLD: 3,
    IP_CHANGE_WINDOW_HOURS: 24,

    // 高频登录检测：5分钟内登录尝试超过10次
    HIGH_FREQUENCY_THRESHOLD: 10,
    HIGH_FREQUENCY_WINDOW_MINUTES: 5,

    // 暴力破解检测：10分钟内失败次数超过5次后成功
    BRUTE_FORCE_FAILED_THRESHOLD: 5,
    BRUTE_FORCE_WINDOW_MINUTES: 10,

    // 时间异常检测：非常用登录时间段（凌晨2-6点）
    UNUSUAL_TIME_HOURS: [2, 3, 4, 5, 6],

    // 风险评分权重
    RISK_WEIGHTS: {
      IP_CHANGE: 20,
      LOCATION_JUMP: 30,
      TIME_ANOMALY: 15,
      HIGH_FREQUENCY: 25,
      BRUTE_FORCE: 40,
      DEVICE_CHANGE: 20,
    },
  };

  constructor(
    @InjectRepository(UserLoginLog)
    private readonly userLoginLogRepository: Repository<UserLoginLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 查询登录日志
   *
   * @param params - 查询参数
   * @returns Promise<LoginLogQueryResponse> - 分页的登录日志列表
   */
  async queryLoginLogs(
    params: LoginLogQueryParams,
  ): Promise<LoginLogQueryResponse> {
    const {
      userId,
      email,
      success,
      ipAddress,
      startDate,
      endDate,
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = params;

    // 限制每页最大数量
    const limitedPageSize = Math.min(pageSize, 100);
    const skip = (page - 1) * limitedPageSize;

    // 构建查询条件
    const where: FindOptionsWhere<UserLoginLog> = {};

    if (userId) {
      where.userId = userId;
    }

    if (email) {
      where.email = email;
    }

    if (success !== undefined) {
      where.success = success;
    }

    if (ipAddress) {
      where.ipAddress = ipAddress;
    }

    // 日期范围筛选
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      where.createdAt = Between(start, end);
    }

    // 执行查询
    const [logs, total] = await this.userLoginLogRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      take: limitedPageSize,
      skip,
    });

    // 转换为响应格式
    const logEntries: LoginLogEntry[] = logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      email: log.email,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      location: log.location,
      success: log.success,
      failureReason: log.failureReason,
      createdAt: log.createdAt.toISOString(),
    }));

    const totalPages = Math.ceil(total / limitedPageSize);

    return {
      logs: logEntries,
      total,
      page,
      pageSize: limitedPageSize,
      totalPages,
    };
  }

  /**
   * 分析用户登录模式
   *
   * @param userId - 用户ID
   * @returns Promise<LoginPatternAnalysisResponse> - 登录模式分析结果
   */
  async analyzeLoginPatterns(
    userId: string,
  ): Promise<LoginPatternAnalysisResponse> {
    // 获取用户信息
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error(`用户 ${userId} 不存在`);
    }

    // 获取最近90天的登录日志
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const logs = await this.userLoginLogRepository.find({
      where: {
        userId,
        success: true, // 只分析成功的登录
        createdAt: Between(ninetyDaysAgo, new Date()),
      },
      order: { createdAt: 'ASC' },
    });

    // 分析常用登录时间
    const loginHours = logs.map((log) => log.createdAt.getHours());
    const hourCounts = this.countOccurrences(loginHours);
    const commonLoginHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([hour]) => parseInt(hour));

    // 分析常用IP
    const ipAddresses = logs
      .map((log) => log.ipAddress)
      .filter((ip): ip is string => ip !== undefined && ip !== null);
    const ipCounts = this.countOccurrences(ipAddresses);
    const commonIPs = Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([ip]) => ip);

    // 分析常用地点
    const locations = logs
      .map((log) => log.location)
      .filter((loc): loc is string => loc !== undefined && loc !== null);
    const locationCounts = this.countOccurrences(locations);
    const commonLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([loc]) => loc);

    // 计算平均登录频率
    const averageLoginFrequency = logs.length > 0 ? logs.length / 90 : 0; // 次/天

    // 分析设备类型
    const deviceTypes = [
      ...new Set(logs.map((log) => this.detectDeviceType(log.userAgent || ''))),
    ];

    // 分析最近7天的失败率
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLogs = await this.userLoginLogRepository.find({
      where: {
        userId,
        createdAt: Between(sevenDaysAgo, new Date()),
      },
    });

    const recentFailureRate =
      recentLogs.length > 0
        ? (recentLogs.filter((log) => !log.success).length /
            recentLogs.length) *
          100
        : 0;

    // 异常指标检测
    const hasUnusualIPActivity = this.detectUnusualIPActivity(logs, commonIPs);
    const hasUnusualTimeActivity = this.detectUnusualTimeActivity(
      logs,
      commonLoginHours,
    );
    const hasUnusualLocationActivity = this.detectUnusualLocationActivity(
      logs,
      commonLocations,
    );

    // 风险评估
    let riskScore = 0;
    const riskFactors: string[] = [];

    if (hasUnusualIPActivity) {
      riskScore += 25;
      riskFactors.push('检测到异常IP活动');
    }

    if (hasUnusualTimeActivity) {
      riskScore += 20;
      riskFactors.push('检测到异常时间登录');
    }

    if (hasUnusualLocationActivity) {
      riskScore += 25;
      riskFactors.push('检测到异常地理位置活动');
    }

    if (recentFailureRate > 30) {
      riskScore += 30;
      riskFactors.push(`近期失败率过高: ${recentFailureRate.toFixed(1)}%`);
    }

    // 确定风险等级
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (riskScore >= 75) riskLevel = 'critical';
    else if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'medium';

    const pattern: UserLoginPattern = {
      userId: user.id,
      email: user.email,
      analysisData: {
        commonLoginHours,
        commonIPs,
        commonLocations,
        averageLoginFrequency,
        lastLoginAt: user.lastLoginAt?.toISOString(),
        deviceTypes,
      },
      anomalyIndicators: {
        hasUnusualIPActivity,
        hasUnusualTimeActivity,
        hasUnusualLocationActivity,
        recentFailureRate,
      },
      riskAssessment: {
        overallRiskScore: riskScore,
        riskLevel,
        riskFactors,
      },
    };

    // 生成建议
    const recommendations: string[] = [];

    if (riskScore > 0) {
      if (hasUnusualIPActivity) {
        recommendations.push('建议启用多因素认证以增强账户安全');
      }
      if (recentFailureRate > 20) {
        recommendations.push(
          '检测到多次登录失败，请检查账户是否被他人尝试访问',
        );
      }
      if (hasUnusualTimeActivity) {
        recommendations.push('检测到非常规时间登录，请确认是否为本人操作');
      }
    } else {
      recommendations.push('当前登录行为正常，无异常活动');
    }

    return {
      pattern,
      recommendations,
    };
  }

  /**
   * 检测登录异常行为
   *
   * @param userId - 可选，指定用户ID；不指定则检测所有用户
   * @returns Promise<LoginAnomalyReport> - 异常检测报告
   */
  async detectAnomalies(userId?: string): Promise<LoginAnomalyReport> {
    // 获取最近24小时的日志
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const where: FindOptionsWhere<UserLoginLog> = {
      createdAt: Between(oneDayAgo, new Date()),
    };

    if (userId) {
      where.userId = userId;
    }

    const logs = await this.userLoginLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    const anomalies: LoginAnomaly[] = [];

    // 按用户分组进行异常检测
    const logsByUser = this.groupBy(logs, 'userId');

    for (const [uid, userLogs] of Object.entries(logsByUser)) {
      if (!uid || uid === 'undefined') continue;

      // IP变更异常检测
      const ipChangeAnomalies = this.detectIPChangeAnomalies(uid, userLogs);
      anomalies.push(...ipChangeAnomalies);

      // 高频登录异常检测
      const highFrequencyAnomalies = this.detectHighFrequencyAnomalies(
        uid,
        userLogs,
      );
      anomalies.push(...highFrequencyAnomalies);

      // 暴力破解检测
      const bruteForceAnomalies = this.detectBruteForceAnomalies(uid, userLogs);
      anomalies.push(...bruteForceAnomalies);

      // 异常时间登录检测
      const timeAnomalies = this.detectTimeAnomalies(uid, userLogs);
      anomalies.push(...timeAnomalies);
    }

    // 统计异常数量
    const criticalCount = anomalies.filter(
      (a) => a.severity === 'critical',
    ).length;
    const highCount = anomalies.filter((a) => a.severity === 'high').length;
    const mediumCount = anomalies.filter((a) => a.severity === 'medium').length;
    const lowCount = anomalies.filter((a) => a.severity === 'low').length;

    return {
      anomalies,
      total: anomalies.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      generatedAt: new Date().toISOString(),
      timeRange: {
        startDate: oneDayAgo.toISOString(),
        endDate: new Date().toISOString(),
      },
    };
  }

  /**
   * 生成安全审计报告
   *
   * @param startDate - 开始日期
   * @param endDate - 结束日期
   * @returns Promise<LoginSecurityReport> - 完整的安全审计报告
   */
  async generateSecurityReport(
    startDate: string,
    endDate: string,
  ): Promise<LoginSecurityReport> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 获取指定时间范围的所有日志
    const logs = await this.userLoginLogRepository.find({
      where: {
        createdAt: Between(start, end),
      },
      order: { createdAt: 'ASC' },
    });

    // 生成统计信息
    const statistics = this.generateStatistics(logs);

    // 检测异常
    const anomalies = this.detectAnomaliesFromLogs(logs);

    // 识别高风险用户
    const topRiskUsers = this.identifyTopRiskUsers(logs, 10);

    // 识别高风险IP
    const topRiskIPs = this.identifyTopRiskIPs(logs, 10);

    // 生成安全建议
    const recommendations = this.generateRecommendations(statistics, anomalies);

    return {
      summary: {
        totalLogs: logs.length,
        dateRange: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        },
        generatedAt: new Date().toISOString(),
      },
      statistics,
      anomalies,
      topRiskUsers,
      topRiskIPs,
      recommendations,
    };
  }

  // ========== 私有辅助方法 ==========

  /**
   * 统计数组元素出现次数
   */
  private countOccurrences<T extends string | number>(
    arr: T[],
  ): Record<string, number> {
    return arr.reduce(
      (acc, item) => {
        const key = String(item);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * 按字段分组
   */
  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
          result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
      },
      {} as Record<string, T[]>,
    );
  }

  /**
   * 检测设备类型
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
    } else if (
      ua.includes('windows') ||
      ua.includes('mac') ||
      ua.includes('linux')
    ) {
      return 'desktop';
    }
    return 'unknown';
  }

  /**
   * 检测异常IP活动
   */
  private detectUnusualIPActivity(
    logs: UserLoginLog[],
    commonIPs: string[],
  ): boolean {
    const recentLogs = logs.slice(-20); // 最近20次登录
    const recentIPs = recentLogs
      .map((log) => log.ipAddress)
      .filter((ip): ip is string => ip !== undefined && ip !== null);

    const unusualIPs = recentIPs.filter((ip) => !commonIPs.includes(ip));
    return unusualIPs.length > 3; // 超过3次不寻常IP登录
  }

  /**
   * 检测异常时间活动
   */
  private detectUnusualTimeActivity(
    logs: UserLoginLog[],
    commonHours: number[],
  ): boolean {
    const recentLogs = logs.slice(-10); // 最近10次登录
    const recentHours = recentLogs.map((log) => log.createdAt.getHours());

    const unusualHours = recentHours.filter(
      (hour) => !commonHours.includes(hour),
    );
    return unusualHours.length > 5; // 超过一半是非常用时间
  }

  /**
   * 检测异常地理位置活动
   */
  private detectUnusualLocationActivity(
    logs: UserLoginLog[],
    commonLocations: string[],
  ): boolean {
    const recentLogs = logs.slice(-10);
    const recentLocations = recentLogs
      .map((log) => log.location)
      .filter((loc): loc is string => loc !== undefined && loc !== null);

    const unusualLocations = recentLocations.filter(
      (loc) => !commonLocations.includes(loc),
    );
    return unusualLocations.length > 3;
  }

  /**
   * 检测IP变更异常
   */
  private detectIPChangeAnomalies(
    userId: string,
    logs: UserLoginLog[],
  ): LoginAnomaly[] {
    const anomalies: LoginAnomaly[] = [];
    const uniqueIPs = new Set(
      logs
        .map((log) => log.ipAddress)
        .filter((ip): ip is string => ip !== null && ip !== undefined),
    );

    if (uniqueIPs.size > this.ANOMALY_DETECTION_CONFIG.IP_CHANGE_THRESHOLD) {
      const userEmail = logs[0]?.email || '';
      anomalies.push({
        type: LoginAnomalyType.IP_CHANGE,
        severity: 'high',
        userId,
        email: userEmail,
        description: `24小时内检测到${uniqueIPs.size}个不同IP地址登录`,
        detectedAt: new Date().toISOString(),
        relatedLogs: logs.map((log) => log.id),
        riskScore: this.ANOMALY_DETECTION_CONFIG.RISK_WEIGHTS.IP_CHANGE,
        metadata: {
          uniqueIPCount: uniqueIPs.size,
          ipAddresses: Array.from(uniqueIPs),
        },
      });
    }

    return anomalies;
  }

  /**
   * 检测高频登录异常
   */
  private detectHighFrequencyAnomalies(
    userId: string,
    logs: UserLoginLog[],
  ): LoginAnomaly[] {
    const anomalies: LoginAnomaly[] = [];
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(
      fiveMinutesAgo.getMinutes() -
        this.ANOMALY_DETECTION_CONFIG.HIGH_FREQUENCY_WINDOW_MINUTES,
    );

    const recentLogs = logs.filter((log) => log.createdAt >= fiveMinutesAgo);

    if (
      recentLogs.length > this.ANOMALY_DETECTION_CONFIG.HIGH_FREQUENCY_THRESHOLD
    ) {
      const userEmail = logs[0]?.email || '';
      anomalies.push({
        type: LoginAnomalyType.HIGH_FREQUENCY,
        severity: 'high',
        userId,
        email: userEmail,
        description: `5分钟内检测到${recentLogs.length}次登录尝试`,
        detectedAt: new Date().toISOString(),
        relatedLogs: recentLogs.map((log) => log.id),
        riskScore: this.ANOMALY_DETECTION_CONFIG.RISK_WEIGHTS.HIGH_FREQUENCY,
      });
    }

    return anomalies;
  }

  /**
   * 检测暴力破解异常
   */
  private detectBruteForceAnomalies(
    userId: string,
    logs: UserLoginLog[],
  ): LoginAnomaly[] {
    const anomalies: LoginAnomaly[] = [];
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(
      tenMinutesAgo.getMinutes() -
        this.ANOMALY_DETECTION_CONFIG.BRUTE_FORCE_WINDOW_MINUTES,
    );

    const recentLogs = logs.filter((log) => log.createdAt >= tenMinutesAgo);
    const failedLogs = recentLogs.filter((log) => !log.success);
    const successLogs = recentLogs.filter((log) => log.success);

    if (
      failedLogs.length >=
        this.ANOMALY_DETECTION_CONFIG.BRUTE_FORCE_FAILED_THRESHOLD &&
      successLogs.length > 0
    ) {
      const userEmail = logs[0]?.email || '';
      anomalies.push({
        type: LoginAnomalyType.BRUTE_FORCE,
        severity: 'critical',
        userId,
        email: userEmail,
        description: `10分钟内${failedLogs.length}次失败后登录成功，疑似暴力破解`,
        detectedAt: new Date().toISOString(),
        relatedLogs: recentLogs.map((log) => log.id),
        riskScore: this.ANOMALY_DETECTION_CONFIG.RISK_WEIGHTS.BRUTE_FORCE,
        metadata: {
          failedAttempts: failedLogs.length,
          successfulLogins: successLogs.length,
        },
      });
    }

    return anomalies;
  }

  /**
   * 检测异常时间登录
   */
  private detectTimeAnomalies(
    userId: string,
    logs: UserLoginLog[],
  ): LoginAnomaly[] {
    const anomalies: LoginAnomaly[] = [];
    const unusualTimeLogs = logs.filter((log) =>
      this.ANOMALY_DETECTION_CONFIG.UNUSUAL_TIME_HOURS.includes(
        log.createdAt.getHours(),
      ),
    );

    if (unusualTimeLogs.length > 3) {
      const userEmail = logs[0]?.email || '';
      anomalies.push({
        type: LoginAnomalyType.TIME_ANOMALY,
        severity: 'medium',
        userId,
        email: userEmail,
        description: `检测到${unusualTimeLogs.length}次异常时间登录（凌晨2-6点）`,
        detectedAt: new Date().toISOString(),
        relatedLogs: unusualTimeLogs.map((log) => log.id),
        riskScore: this.ANOMALY_DETECTION_CONFIG.RISK_WEIGHTS.TIME_ANOMALY,
      });
    }

    return anomalies;
  }

  /**
   * 从日志中检测异常
   */
  private detectAnomaliesFromLogs(logs: UserLoginLog[]): LoginAnomalyReport {
    const anomalies: LoginAnomaly[] = [];
    const logsByUser = this.groupBy(logs, 'userId');

    for (const [userId, userLogs] of Object.entries(logsByUser)) {
      if (!userId || userId === 'undefined') continue;

      anomalies.push(...this.detectIPChangeAnomalies(userId, userLogs));
      anomalies.push(...this.detectHighFrequencyAnomalies(userId, userLogs));
      anomalies.push(...this.detectBruteForceAnomalies(userId, userLogs));
      anomalies.push(...this.detectTimeAnomalies(userId, userLogs));
    }

    const criticalCount = anomalies.filter(
      (a) => a.severity === 'critical',
    ).length;
    const highCount = anomalies.filter((a) => a.severity === 'high').length;
    const mediumCount = anomalies.filter((a) => a.severity === 'medium').length;
    const lowCount = anomalies.filter((a) => a.severity === 'low').length;

    return {
      anomalies,
      total: anomalies.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      generatedAt: new Date().toISOString(),
      timeRange: {
        startDate: logs[0]?.createdAt.toISOString() || '',
        endDate: logs[logs.length - 1]?.createdAt.toISOString() || '',
      },
    };
  }

  /**
   * 生成统计信息
   */
  private generateStatistics(logs: UserLoginLog[]): LoginStatistics {
    const totalAttempts = logs.length;
    const successfulLogins = logs.filter((log) => log.success).length;
    const failedLogins = totalAttempts - successfulLogins;
    const successRate =
      totalAttempts > 0 ? (successfulLogins / totalAttempts) * 100 : 0;

    const uniqueUsers = new Set(
      logs
        .map((log) => log.userId)
        .filter((id): id is string => id !== null && id !== undefined),
    ).size;
    const uniqueIPs = new Set(
      logs
        .map((log) => log.ipAddress)
        .filter((ip): ip is string => ip !== null && ip !== undefined),
    ).size;

    // 失败原因统计
    const failureReasons = logs
      .filter((log) => !log.success && log.failureReason)
      .map((log) => log.failureReason as string);
    const reasonCounts = this.countOccurrences(failureReasons);
    const topFailureReasons = Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 按小时分布
    const hourCounts = this.countOccurrences(
      logs.map((log) => log.createdAt.getHours()),
    );
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourCounts[hour] || 0,
    }));

    // 按日分布
    const logsByDateMap = logs.reduce(
      (acc, log) => {
        const date = log.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(log);
        return acc;
      },
      {} as Record<string, UserLoginLog[]>,
    );
    const dailyDistribution = Object.entries(logsByDateMap).map(
      ([date, dayLogs]) => ({
        date,
        attempts: dayLogs.length,
        successes: dayLogs.filter((log) => log.success).length,
      }),
    );

    return {
      totalAttempts,
      successfulLogins,
      failedLogins,
      successRate,
      uniqueUsers,
      uniqueIPs,
      topFailureReasons,
      hourlyDistribution,
      dailyDistribution,
    };
  }

  /**
   * 识别高风险用户
   */
  private identifyTopRiskUsers(
    logs: UserLoginLog[],
    limit: number,
  ): LoginSecurityReport['topRiskUsers'] {
    const logsByUser = this.groupBy(logs, 'userId');
    const userRisks: Array<{
      userId: string;
      email: string;
      riskScore: number;
      anomalyCount: number;
    }> = [];

    for (const [userId, userLogs] of Object.entries(logsByUser)) {
      if (!userId || userId === 'undefined') continue;

      const anomalies = [
        ...this.detectIPChangeAnomalies(userId, userLogs),
        ...this.detectHighFrequencyAnomalies(userId, userLogs),
        ...this.detectBruteForceAnomalies(userId, userLogs),
        ...this.detectTimeAnomalies(userId, userLogs),
      ];

      const riskScore = anomalies.reduce((sum, a) => sum + a.riskScore, 0);

      if (anomalies.length > 0) {
        userRisks.push({
          userId,
          email: userLogs[0].email,
          riskScore,
          anomalyCount: anomalies.length,
        });
      }
    }

    return userRisks.sort((a, b) => b.riskScore - a.riskScore).slice(0, limit);
  }

  /**
   * 识别高风险IP
   */
  private identifyTopRiskIPs(
    logs: UserLoginLog[],
    limit: number,
  ): LoginSecurityReport['topRiskIPs'] {
    const logsByIP = this.groupBy(
      logs.filter((log) => log.ipAddress),
      'ipAddress',
    );

    const ipRisks: Array<{
      ipAddress: string;
      attemptCount: number;
      failureCount: number;
      riskScore: number;
    }> = [];

    for (const [ipAddress, ipLogs] of Object.entries(logsByIP)) {
      const attemptCount = ipLogs.length;
      const failureCount = ipLogs.filter((log) => !log.success).length;
      const failureRate =
        attemptCount > 0 ? (failureCount / attemptCount) * 100 : 0;

      // 风险评分：考虑失败率和尝试次数
      let riskScore = 0;
      if (failureRate > 50) riskScore += 40;
      else if (failureRate > 30) riskScore += 25;
      if (attemptCount > 50) riskScore += 30;
      else if (attemptCount > 20) riskScore += 15;

      if (riskScore > 0) {
        ipRisks.push({
          ipAddress,
          attemptCount,
          failureCount,
          riskScore,
        });
      }
    }

    return ipRisks.sort((a, b) => b.riskScore - a.riskScore).slice(0, limit);
  }

  /**
   * 生成安全建议
   */
  private generateRecommendations(
    statistics: LoginStatistics,
    anomalies: LoginAnomalyReport,
  ): string[] {
    const recommendations: string[] = [];

    if (statistics.successRate < 70) {
      recommendations.push(
        `登录成功率较低（${statistics.successRate.toFixed(1)}%），建议检查是否存在暴力破解攻击`,
      );
    }

    if (anomalies.criticalCount > 0) {
      recommendations.push(
        `检测到${anomalies.criticalCount}个严重异常，建议立即采取安全措施`,
      );
    }

    if (anomalies.highCount > 5) {
      recommendations.push(
        `检测到${anomalies.highCount}个高风险异常，建议加强账户安全策略`,
      );
    }

    if (statistics.topFailureReasons.length > 0) {
      const topReason = statistics.topFailureReasons[0];
      recommendations.push(
        `最常见的失败原因是"${topReason.reason}"（${topReason.count}次），建议针对性优化`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('当前登录安全状态良好，继续保持监控');
    }

    return recommendations;
  }
}
