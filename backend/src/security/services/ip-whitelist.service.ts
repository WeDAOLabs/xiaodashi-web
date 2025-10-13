import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPWhitelist } from '../../database/entities/security/ip-whitelist.entity';
import {
  AddIPWhitelistRequest,
  UpdateIPWhitelistRequest,
  IPWhitelistEntry,
  IPWhitelistQueryParams,
  IPWhitelistQueryResponse,
  IPType,
} from '@xiaodashi/shared';

/**
 * IP白名单服务
 *
 * 负责管理IP白名单，支持：
 * - 添加/移除IP白名单（支持单IP和CIDR格式）
 * - 检查IP是否在白名单中（使用PostgreSQL INET类型的高效匹配）
 * - 白名单查询和统计
 *
 * 白名单IP将：
 * - 跳过频率限制检查
 * - 跳过风险评估
 * - 获得最高优先级访问权限
 *
 * 技术要点：
 * - 使用PostgreSQL INET类型原生支持IP和CIDR格式
 * - 使用 <<= 操作符进行高效的IP范围匹配
 */
@Injectable()
export class IPWhitelistService {
  private readonly logger = new Logger(IPWhitelistService.name);

  constructor(
    @InjectRepository(IPWhitelist)
    private readonly whitelistRepository: Repository<IPWhitelist>,
  ) {}

  /**
   * 添加IP到白名单
   *
   * @param request - 白名单添加请求
   * @param createdBy - 创建者ID（可选）
   * @returns 创建的白名单条目
   */
  async addToWhitelist(
    request: AddIPWhitelistRequest,
    createdBy?: string,
  ): Promise<IPWhitelistEntry> {
    const { ipAddress, type, description } = request;

    // 检查IP是否已在白名单中
    const existing = await this.whitelistRepository.findOne({
      where: { ipAddress },
    });

    if (existing) {
      this.logger.warn(
        `IP ${ipAddress} already in whitelist, updating instead`,
      );
      // 更新现有记录
      existing.description = description;
      existing.isActive = true;
      existing.createdBy = createdBy || existing.createdBy;

      const updated = await this.whitelistRepository.save(existing);
      return this.toEntry(updated);
    }

    // 创建新记录
    const entry = this.whitelistRepository.create({
      ipAddress,
      type,
      description,
      isActive: true,
      createdBy,
    });

    const saved = await this.whitelistRepository.save(entry);
    this.logger.log(`Added IP ${ipAddress} to whitelist`);

    return this.toEntry(saved);
  }

  /**
   * 从白名单中移除IP
   *
   * @param ipAddress - IP地址或CIDR
   * @returns 是否成功移除
   */
  async removeFromWhitelist(ipAddress: string): Promise<boolean> {
    const result = await this.whitelistRepository.delete({ ipAddress });
    const removed = !!(result.affected && result.affected > 0);

    if (removed) {
      this.logger.log(`Removed IP ${ipAddress} from whitelist`);
    }

    return removed;
  }

  /**
   * 更新白名单条目
   *
   * @param ipAddress - IP地址
   * @param request - 更新请求
   * @returns 更新后的条目，如果不存在则返回null
   */
  async updateWhitelist(
    ipAddress: string,
    request: UpdateIPWhitelistRequest,
  ): Promise<IPWhitelistEntry | null> {
    const entry = await this.whitelistRepository.findOne({
      where: { ipAddress },
    });

    if (!entry) {
      return null;
    }

    // 更新字段
    if (request.description !== undefined) {
      entry.description = request.description;
    }
    if (request.isActive !== undefined) {
      entry.isActive = request.isActive;
    }

    const updated = await this.whitelistRepository.save(entry);
    this.logger.log(`Updated whitelist entry for IP ${ipAddress}`);

    return this.toEntry(updated);
  }

  /**
   * 检查IP是否在白名单中
   *
   * 使用PostgreSQL INET类型的 <<= 操作符进行高效匹配：
   * - 单个IP：精确匹配
   * - CIDR范围：检查IP是否在范围内
   *
   * @param ipAddress - 要检查的IP地址
   * @returns 如果在白名单中则返回true，否则返回false
   */
  async isWhitelisted(ipAddress: string): Promise<boolean> {
    // 使用PostgreSQL INET操作符进行匹配
    const entry = await this.whitelistRepository
      .createQueryBuilder('whitelist')
      .where('whitelist.isActive = :isActive', { isActive: true })
      .andWhere(
        `CAST(:ipAddress AS inet) <<= whitelist.ipAddress OR whitelist.ipAddress = CAST(:ipAddress AS inet)`,
        { ipAddress },
      )
      .getOne();

    return entry !== null;
  }

  /**
   * 获取白名单条目详情
   *
   * @param ipAddress - IP地址
   * @returns 白名单条目，如果不存在则返回null
   */
  async getWhitelist(ipAddress: string): Promise<IPWhitelistEntry | null> {
    const entry = await this.whitelistRepository.findOne({
      where: { ipAddress },
    });

    return entry ? this.toEntry(entry) : null;
  }

  /**
   * 查询白名单
   *
   * @param params - 查询参数
   * @returns 分页的白名单条目列表
   */
  async queryWhitelist(
    params: IPWhitelistQueryParams,
  ): Promise<IPWhitelistQueryResponse> {
    const { ipAddress, isActive, page = 1, pageSize = 20 } = params;

    const query = this.whitelistRepository.createQueryBuilder('whitelist');

    // 应用过滤条件
    if (ipAddress) {
      query.andWhere('whitelist.ipAddress = :ipAddress', { ipAddress });
    }
    if (isActive !== undefined) {
      query.andWhere('whitelist.isActive = :isActive', { isActive });
    }

    // 按创建时间倒序排序
    query.orderBy('whitelist.createdAt', 'DESC');

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
   * 获取白名单统计信息
   *
   * @returns 统计信息对象
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    byType: Record<IPType, number>;
  }> {
    const [total, active] = await Promise.all([
      this.whitelistRepository.count(),
      this.whitelistRepository.count({ where: { isActive: true } }),
    ]);

    // 按类型统计
    const byTypeRaw = await this.whitelistRepository
      .createQueryBuilder('whitelist')
      .select('whitelist.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('whitelist.isActive = :isActive', { isActive: true })
      .groupBy('whitelist.type')
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
      byType,
    };
  }

  /**
   * 将实体转换为DTO
   */
  private toEntry(entity: IPWhitelist): IPWhitelistEntry {
    return {
      id: entity.id,
      ipAddress: entity.ipAddress,
      type: entity.type as IPType,
      description: entity.description,
      isActive: entity.isActive,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
