import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as geoip from 'geoip-lite';
import { IPAccessLog } from '../../database/entities/security/ip-access-log.entity';
import {
  IPRiskReport,
  IPRiskLevel,
  IPGeolocation,
  IPStatistics,
} from '@xiaodashi/shared';
import { IPBlacklistService } from './ip-blacklist.service';
import { IPWhitelistService } from './ip-whitelist.service';
import { IPRateLimiterService } from './ip-rate-limiter.service';

/**
 * IP风险评估服务
 *
 * 负责综合评估IP的风险等级：
 * - 集成geoip-lite进行地理位置分析
 * - 分析历史访问行为
 * - 计算风险评分（0-100）
 * - 提供安全建议（allow, monitor, captcha, block）
 *
 * 风险因素：
 * - 黑名单状态（+50分）
 * - 失败登录次数（每次+5分）
 * - 地理位置异常（+10分）
 * - 频率限制违规（+15分）
 * - 访问模式异常（+20分）
 */
@Injectable()
export class IPRiskAssessmentService {
  private readonly logger = new Logger(IPRiskAssessmentService.name);

  constructor(
    @InjectRepository(IPAccessLog)
    private readonly accessLogRepository: Repository<IPAccessLog>,
    private readonly blacklistService: IPBlacklistService,
    private readonly whitelistService: IPWhitelistService,
    private readonly rateLimiterService: IPRateLimiterService,
  ) {}

  /**
   * 评估IP风险
   *
   * @param ipAddress - IP地址
   * @returns IP风险报告
   */
  async assessIPRisk(ipAddress: string): Promise<IPRiskReport> {
    // 1. 检查白名单（白名单IP直接通过）
    const isWhitelisted = await this.whitelistService.isWhitelisted(ipAddress);
    if (isWhitelisted) {
      return this.createSafeReport(ipAddress);
    }

    // 2. 检查黑名单
    const blacklistEntry = await this.blacklistService.isBlacklisted(ipAddress);
    const isBlacklisted = blacklistEntry !== null;

    // 3. 获取地理位置信息
    const geolocation = this.getGeolocation(ipAddress);

    // 4. 获取统计信息
    const statistics = await this.getIPStatistics(ipAddress);

    // 5. 计算风险评分
    const { riskScore, riskFactors } = await this.calculateRiskScore(
      ipAddress,
      isBlacklisted,
      statistics,
    );

    // 6. 确定风险等级
    const riskLevel = this.determineRiskLevel(riskScore);

    // 7. 生成安全建议
    const recommendation = this.generateRecommendation(
      riskScore,
      isBlacklisted,
    );

    return {
      ipAddress,
      riskScore,
      riskLevel,
      riskFactors,
      isBlacklisted,
      isWhitelisted: false,
      geolocation,
      statistics,
      recommendation,
      assessedAt: new Date().toISOString(),
    };
  }

  /**
   * 记录IP访问日志
   *
   * @param data - 访问日志数据
   * @returns 创建的访问日志
   */
  async logIPAccess(data: {
    ipAddress: string;
    endpoint: string;
    method: string;
    statusCode: number;
    userAgent?: string;
    userId?: string;
    riskScore?: number;
    blocked?: boolean;
    blockReason?: string;
  }): Promise<IPAccessLog> {
    // 获取地理位置
    const geo = geoip.lookup(data.ipAddress);
    const location = geo ? `${geo.country},${geo.city}` : undefined;

    // 如果没有提供风险评分，则快速评估
    let riskScore = data.riskScore;
    if (riskScore === undefined) {
      const report = await this.assessIPRisk(data.ipAddress);
      riskScore = report.riskScore;
    }

    const log = this.accessLogRepository.create({
      ipAddress: data.ipAddress,
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      userAgent: data.userAgent,
      userId: data.userId,
      riskScore,
      blocked: data.blocked || false,
      blockReason: data.blockReason,
      location,
    });

    return await this.accessLogRepository.save(log);
  }

  /**
   * 获取IP统计信息
   *
   * @param ipAddress - IP地址
   * @returns IP统计信息
   */
  private async getIPStatistics(ipAddress: string): Promise<IPStatistics> {
    const logs = await this.accessLogRepository.find({
      where: { ipAddress },
      order: { createdAt: 'DESC' },
      take: 1000, // 最多查询最近1000条记录
    });

    if (logs.length === 0) {
      return {
        totalRequests: 0,
        failedLogins: 0,
        successfulLogins: 0,
        blockedRequests: 0,
        lastAccessAt: new Date().toISOString(),
        firstAccessAt: new Date().toISOString(),
      };
    }

    const totalRequests = logs.length;
    const blockedRequests = logs.filter((log) => log.blocked).length;

    // 统计登录相关请求
    const loginLogs = logs.filter((log) => log.endpoint.includes('/login'));
    const failedLogins = loginLogs.filter(
      (log) => log.statusCode === 401 || log.statusCode === 403,
    ).length;
    const successfulLogins = loginLogs.filter(
      (log) => log.statusCode === 200,
    ).length;

    const lastAccessAt = logs[0].createdAt.toISOString();
    const firstAccessAt = logs[logs.length - 1].createdAt.toISOString();

    return {
      totalRequests,
      failedLogins,
      successfulLogins,
      blockedRequests,
      lastAccessAt,
      firstAccessAt,
    };
  }

  /**
   * 计算风险评分
   *
   * @param ipAddress - IP地址
   * @param isBlacklisted - 是否在黑名单中
   * @param statistics - IP统计信息
   * @returns 风险评分和风险因素列表
   */
  private async calculateRiskScore(
    ipAddress: string,
    isBlacklisted: boolean,
    statistics: IPStatistics,
  ): Promise<{ riskScore: number; riskFactors: string[] }> {
    let score = 0;
    const factors: string[] = [];

    // 1. 黑名单检查（+50分）
    if (isBlacklisted) {
      score += 50;
      factors.push('IP在黑名单中');
    }

    // 2. 失败登录次数（每次+5分，最多+30分）
    if (statistics.failedLogins > 0) {
      const failedScore = Math.min(statistics.failedLogins * 5, 30);
      score += failedScore;
      factors.push(`${statistics.failedLogins}次失败登录尝试`);
    }

    // 3. 频率限制检查（+15分）
    const loginRateLimit = await this.rateLimiterService.getRateLimitStatus(
      ipAddress,
      'login',
    );
    if (loginRateLimit?.isLimited) {
      score += 15;
      factors.push('触发频率限制');
    }

    // 4. 被拦截请求比例（>20%则+20分）
    if (
      statistics.totalRequests > 10 &&
      statistics.blockedRequests / statistics.totalRequests > 0.2
    ) {
      score += 20;
      factors.push('高拦截率（>20%）');
    }

    // 5. 地理位置异常检查（+10分）
    const geo = geoip.lookup(ipAddress);
    if (geo && this.isHighRiskCountry(geo.country)) {
      score += 10;
      factors.push(`来自高风险地区：${geo.country}`);
    }

    // 6. 无成功登录但有大量失败尝试（+15分）
    if (statistics.failedLogins > 5 && statistics.successfulLogins === 0) {
      score += 15;
      factors.push('只有失败登录，无成功登录');
    }

    // 确保评分在0-100之间
    score = Math.min(Math.max(score, 0), 100);

    return { riskScore: score, riskFactors: factors };
  }

  /**
   * 确定风险等级
   *
   * @param riskScore - 风险评分
   * @returns 风险等级
   */
  private determineRiskLevel(riskScore: number): IPRiskLevel {
    if (riskScore >= 80) return IPRiskLevel.CRITICAL;
    if (riskScore >= 60) return IPRiskLevel.HIGH;
    if (riskScore >= 40) return IPRiskLevel.MEDIUM;
    if (riskScore >= 20) return IPRiskLevel.LOW;
    return IPRiskLevel.SAFE;
  }

  /**
   * 生成安全建议
   *
   * @param riskScore - 风险评分
   * @param isBlacklisted - 是否在黑名单中
   * @returns 安全建议
   */
  private generateRecommendation(
    riskScore: number,
    isBlacklisted: boolean,
  ): 'allow' | 'monitor' | 'captcha' | 'block' {
    if (isBlacklisted || riskScore >= 80) return 'block';
    if (riskScore >= 60) return 'captcha';
    if (riskScore >= 40) return 'monitor';
    return 'allow';
  }

  /**
   * 获取IP地理位置信息
   *
   * @param ipAddress - IP地址
   * @returns 地理位置信息，如果无法查询则返回undefined
   */
  private getGeolocation(ipAddress: string): IPGeolocation | undefined {
    const geo = geoip.lookup(ipAddress);

    if (!geo) {
      return undefined;
    }

    return {
      country: geo.country,
      city: geo.city || 'Unknown',
      region: geo.region,
      latitude: geo.ll[0],
      longitude: geo.ll[1],
      timezone: geo.timezone,
    };
  }

  /**
   * 检查是否为高风险国家
   *
   * 这是一个示例实现，实际应根据业务需求配置
   *
   * @param countryCode - 国家代码
   * @returns 是否为高风险国家
   */
  private isHighRiskCountry(countryCode: string): boolean {
    // 示例：可以从配置文件读取高风险国家列表
    const highRiskCountries = ['XX', 'YY']; // 替换为实际的高风险国家代码
    return highRiskCountries.includes(countryCode);
  }

  /**
   * 创建安全的报告（用于白名单IP）
   *
   * @param ipAddress - IP地址
   * @returns 安全的风险报告
   */
  private createSafeReport(ipAddress: string): IPRiskReport {
    const geolocation = this.getGeolocation(ipAddress);

    return {
      ipAddress,
      riskScore: 0,
      riskLevel: IPRiskLevel.SAFE,
      riskFactors: [],
      isBlacklisted: false,
      isWhitelisted: true,
      geolocation,
      statistics: {
        totalRequests: 0,
        failedLogins: 0,
        successfulLogins: 0,
        blockedRequests: 0,
        lastAccessAt: new Date().toISOString(),
        firstAccessAt: new Date().toISOString(),
      },
      recommendation: 'allow',
      assessedAt: new Date().toISOString(),
    };
  }
}
