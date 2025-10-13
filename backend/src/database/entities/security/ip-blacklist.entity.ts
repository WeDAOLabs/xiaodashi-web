import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * IP黑名单实体
 *
 * 用于管理被封禁的IP地址和IP段，支持CIDR格式
 * 使用PostgreSQL的INET类型实现高效的IP段匹配
 */
@Entity('ip_blacklists', {
  comment: 'IP黑名单表，记录被封禁的IP地址和IP段，支持CIDR格式',
})
export class IPBlacklist {
  /**
   * IP黑名单记录唯一标识符
   */
  @PrimaryGeneratedColumn('uuid', {
    comment: 'IP黑名单记录唯一标识符',
  })
  id: string;

  /**
   * IP地址或CIDR格式的IP段
   * 使用PostgreSQL INET类型，支持高效的IP段匹配
   * 示例：192.168.1.100 (单IP) 或 192.168.1.0/24 (IP段)
   */
  @Column({
    type: 'inet',
    unique: true,
    comment:
      'IP地址或CIDR格式的IP段（如192.168.1.0/24），使用PostgreSQL INET类型',
  })
  @Index()
  ipAddress: string;

  /**
   * IP类型：单个IP或IP段
   */
  @Column({
    type: 'enum',
    enum: ['single', 'range'],
    comment: 'IP类型：single-单个IP地址，range-IP地址段（CIDR格式）',
  })
  type: 'single' | 'range';

  /**
   * 封禁原因说明
   */
  @Column({
    type: 'text',
    comment: '封禁原因说明，如"暴力破解攻击"、"恶意扫描"等',
  })
  reason: string;

  /**
   * 威胁严重程度
   */
  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    comment: '威胁严重程度：low-低危，medium-中危，high-高危，critical-严重',
  })
  severity: 'low' | 'medium' | 'high' | 'critical';

  /**
   * 黑名单规则是否生效
   */
  @Column({
    type: 'boolean',
    default: true,
    comment: '黑名单规则是否生效，false表示暂时禁用',
  })
  @Index()
  isActive: boolean;

  /**
   * 黑名单过期时间
   * null表示永久封禁
   */
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: '黑名单过期时间，null表示永久封禁',
  })
  @Index()
  expiresAt?: Date;

  /**
   * IP被加入黑名单的时间
   */
  @Column({
    type: 'timestamptz',
    comment: 'IP被加入黑名单的时间',
  })
  blockedAt: Date;

  /**
   * 创建该黑名单记录的管理员用户ID
   */
  @Column({
    type: 'uuid',
    nullable: true,
    comment: '创建该黑名单记录的管理员用户ID',
  })
  createdBy?: string;

  /**
   * 额外元数据
   * 可存储触发次数、相关事件ID等信息
   */
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: '额外元数据，如触发次数、相关事件ID等',
  })
  metadata?: Record<string, unknown>;

  /**
   * 记录创建时间
   */
  @CreateDateColumn({
    type: 'timestamptz',
    comment: '记录创建时间',
  })
  createdAt: Date;

  /**
   * 记录更新时间
   */
  @UpdateDateColumn({
    type: 'timestamptz',
    comment: '记录更新时间',
  })
  updatedAt: Date;
}
