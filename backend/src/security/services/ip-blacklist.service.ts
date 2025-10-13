import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPBlacklist } from '../../database/entities/security/ip-blacklist.entity';
import {
  AddIPBlacklistRequest,
  UpdateIPBlacklistRequest,
  IPBlacklistEntry,
  IPBlacklistQueryParams,
  IPBlacklistQueryResponse,
  ThreatSeverity,
  IPType,
} from '@xiaodashi/shared';

/**
 * IP黑名单服务
 *
 * 负责管理IP黑名单，支持：
 * - 添加/移除IP黑名单（支持单IP和CIDR格式）
 * - 检查IP是否在黑名单中（使用PostgreSQL INET类型的高效匹配）
 * - 自动过期管理
 * - 黑名单查询和统计
 *
 * 技术要点：
 * - 使用PostgreSQL INET类型原生支持IP和CIDR格式
 * - 使用 <<= 操作符进行高效的IP范围匹配
 * - 支持临时封禁和永久封禁
 */
@Injectable()
export class IPBlacklistService {
  private readonly logger = new Logger(IPBlacklistService.name);

  constructor(
    @InjectRepository(IPBlacklist)
    private readonly blacklistRepository: Repository<IPBlacklist>,
  ) {}

  /**
   * 添加IP到黑名单
   *
   * @param request - 黑名单添加请求
   * @param createdBy - 创建者ID（可选）
   * @returns 创建的黑名单条目
   */
  async addToBlacklist(
    request: AddIPBlacklistRequest,
    createdBy?: string,
  ): Promise<IPBlacklistEntry> {
    const { ipAddress, type, reason, severity, duration, metadata } = request;

    // 计算过期时间
    let expiresAt: Date | undefined = undefined;
    if (duration && duration > 0) {
      expiresAt = new Date(Date.now() + duration * 60 * 1000);
    }

    // 检查IP是否已在黑名单中
    const existing = await this.blacklistRepository.findOne({
      where: { ipAddress },
    });

    if (existing) {
      this.logger.warn(
        `IP ${ipAddress} already in blacklist, updating instead`,
      );
      // 更新现有记录
      existing.reason = reason;
      existing.severity = severity;
      existing.expiresAt = expiresAt;
      existing.isActive = true;
      existing.metadata = metadata || existing.metadata;
      existing.createdBy = createdBy || existing.createdBy;

      const updated = await this.blacklistRepository.save(existing);
      return this.toEntry(updated);
    }

    // 创建新记录
    const entry = this.blacklistRepository.create({
      ipAddress,
      type,
      reason,
      severity,
      expiresAt,
      isActive: true,
      blockedAt: new Date(),
      createdBy,
      metadata,
    });

    const saved = await this.blacklistRepository.save(entry);
    this.logger.log(
      `Added IP ${ipAddress} to blacklist with severity ${severity}`,
    );

    return this.toEntry(saved);
  }

  /**
   * 从黑名单中移除IP
   *
   * @param ipAddress - IP地址或CIDR
   * @returns 是否成功移除
   */
  async removeFromBlacklist(ipAddress: string): Promise<boolean> {
    const result = await this.blacklistRepository.delete({ ipAddress });
    const removed = !!(result.affected && result.affected > 0);

    if (removed) {
      this.logger.log(`Removed IP ${ipAddress} from blacklist`);
    }

    return removed;
  }

  /**
   * 更新黑名单条目
   *
   * @param ipAddress - IP地址
   * @param request - 更新请求
   * @returns 更新后的条目，如果不存在则返回null
   */
  async updateBlacklist(
    ipAddress: string,
    request: UpdateIPBlacklistRequest,
  ): Promise<IPBlacklistEntry | null> {
    const entry = await this.blacklistRepository.findOne({
      where: { ipAddress },
    });

    if (!entry) {
      return null;
    }

    // 更新字段
    if (request.reason !== undefined) {
      entry.reason = request.reason;
    }
    if (request.severity !== undefined) {
      entry.severity = request.severity;
    }
    if (request.isActive !== undefined) {
      entry.isActive = request.isActive;
    }
    if (request.duration !== undefined) {
      if (request.duration > 0) {
        entry.expiresAt = new Date(Date.now() + request.duration * 60 * 1000);
      } else {
        entry.expiresAt = undefined;
      }
    }

    const updated = await this.blacklistRepository.save(entry);
    this.logger.log(`Updated blacklist entry for IP ${ipAddress}`);

    return this.toEntry(updated);
  }

  /**
   * 检查IP是否在黑名单中
   *
   * 使用PostgreSQL INET类型的 <<= 操作符进行高效匹配：
   * - 单个IP：精确匹配
   * - CIDR范围：检查IP是否在范围内
   *
   * @param ipAddress - 要检查的IP地址
   * @returns 如果在黑名单中则返回黑名单条目，否则返回null
   */
  async isBlacklisted(ipAddress: string): Promise<IPBlacklistEntry | null> {
    // 使用PostgreSQL INET操作符进行匹配
    // <<= 表示"包含于或等于"，用于检查IP是否在CIDR范围内
    const entry = await this.blacklistRepository
      .createQueryBuilder('blacklist')
      .where('blacklist.isActive = :isActive', { isActive: true })
      .andWhere(
        `CAST(:ipAddress AS inet) <<= blacklist.ipAddress OR blacklist.ipAddress = CAST(:ipAddress AS inet)`,
        { ipAddress },
      )
      .andWhere('(blacklist.expiresAt IS NULL OR blacklist.expiresAt > :now)', {
        now: new Date(),
      })
      .orderBy('blacklist.severity', 'DESC')
      .getOne();

    return entry ? this.toEntry(entry) : null;
  }

  /**
   * 查询黑名单
   *
   * @param params - 查询参数
   * @returns 分页的黑名单条目列表
   */
  async queryBlacklist(
    params: IPBlacklistQueryParams,
  ): Promise<IPBlacklistQueryResponse> {
    const {
      ipAddress,
      severity,
      isActive,
      page = 1,
      pageSize = 20,
      sortBy = 'blockedAt',
      sortOrder = 'DESC',
    } = params;

    const query = this.blacklistRepository.createQueryBuilder('blacklist');

    // 应用过滤条件
    if (ipAddress) {
      query.andWhere('blacklist.ipAddress = :ipAddress', { ipAddress });
    }
    if (severity) {
      query.andWhere('blacklist.severity = :severity', { severity });
    }
    if (isActive !== undefined) {
      query.andWhere('blacklist.isActive = :isActive', { isActive });
    }

    // 应用排序
    const sortColumn = `blacklist.${sortBy}`;
    query.orderBy(sortColumn, sortOrder);

    // 应用分页
    const skip = (page - 1) * pageSize;
    query.skip(skip).take(pageSize);

    // 执行查询
    const [items, total] = await query.getManyAndCount();

    return {
      items: items.map((item) => this.toEntry(item)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取黑名单条目详情
   *
   * @param ipAddress - IP地址
   * @returns 黑名单条目，如果不存在则返回null
   */
  async getBlacklist(ipAddress: string): Promise<IPBlacklistEntry | null> {
    const entry = await this.blacklistRepository.findOne({
      where: { ipAddress },
    });

    return entry ? this.toEntry(entry) : null;
  }

  /**
   * 清理过期的黑名单条目
   *
   * 定时任务调用，将过期的条目标记为非活跃状态
   *
   * @returns 清理的条目数量
   */
  async cleanupExpired(): Promise<number> {
    const result = await this.blacklistRepository
      .createQueryBuilder()
      .update(IPBlacklist)
      .set({ isActive: false })
      .where('isActive = :isActive', { isActive: true })
      .andWhere('expiresAt IS NOT NULL')
      .andWhere('expiresAt <= :now', { now: new Date() })
      .execute();

    const count = result.affected || 0;
    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired blacklist entries`);
    }

    return count;
  }

  /**
   * 获取黑名单统计信息
   *
   * @returns 统计信息对象
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    bySeverity: Record<ThreatSeverity, number>;
    byType: Record<IPType, number>;
  }> {
    const [total, active] = await Promise.all([
      this.blacklistRepository.count(),
      this.blacklistRepository.count({ where: { isActive: true } }),
    ]);

    // 按严重程度统计
    const bySeverityRaw = await this.blacklistRepository
      .createQueryBuilder('blacklist')
      .select('blacklist.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where('blacklist.isActive = :isActive', { isActive: true })
      .groupBy('blacklist.severity')
      .getRawMany();

    const bySeverity: Record<ThreatSeverity, number> = {
      [ThreatSeverity.LOW]: 0,
      [ThreatSeverity.MEDIUM]: 0,
      [ThreatSeverity.HIGH]: 0,
      [ThreatSeverity.CRITICAL]: 0,
    };

    bySeverityRaw.forEach((item: { severity: string; count: string }) => {
      bySeverity[item.severity as ThreatSeverity] = parseInt(item.count, 10);
    });

    // 按类型统计
    const byTypeRaw = await this.blacklistRepository
      .createQueryBuilder('blacklist')
      .select('blacklist.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('blacklist.isActive = :isActive', { isActive: true })
      .groupBy('blacklist.type')
      .getRawMany();

    const byType: Record<IPType, number> = {
      [IPType.SINGLE]: 0,
      [IPType.RANGE]: 0,
    };

    byTypeRaw.forEach((item: { type: string; count: string }) => {
      byType[item.type as IPType] = parseInt(item.count, 10);
    });

    return {
      total,
      active,
      bySeverity,
      byType,
    };
  }

  /**
   * 将实体转换为DTO
   */
  private toEntry(entity: IPBlacklist): IPBlacklistEntry {
    return {
      id: entity.id,
      ipAddress: entity.ipAddress,
      type: entity.type as IPType,
      reason: entity.reason,
      severity: entity.severity as ThreatSeverity,
      isActive: entity.isActive,
      expiresAt: entity.expiresAt?.toISOString(),
      blockedAt: entity.blockedAt.toISOString(),
      createdBy: entity.createdBy,
      metadata: entity.metadata,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
