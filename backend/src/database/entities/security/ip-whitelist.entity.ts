import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * IP白名单实体
 *
 * 用于管理可信任的IP地址，白名单IP将跳过频率限制等安全检查
 * 使用PostgreSQL的INET类型实现高效的IP段匹配
 */
@Entity('ip_whitelists', {
  comment: 'IP白名单表，记录可信任的IP地址，白名单IP将跳过频率限制',
})
export class IPWhitelist {
  /**
   * IP白名单记录唯一标识符
   */
  @PrimaryGeneratedColumn('uuid', {
    comment: 'IP白名单记录唯一标识符',
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
    comment: 'IP地址或CIDR格式的IP段',
  })
  @Index()
  ipAddress: string;

  /**
   * IP类型：单个IP或IP段
   */
  @Column({
    type: 'enum',
    enum: ['single', 'range'],
    comment: 'IP类型：single-单个IP地址，range-IP地址段',
  })
  type: 'single' | 'range';

  /**
   * 白名单说明
   */
  @Column({
    type: 'text',
    comment: '白名单说明，如"公司办公网络"、"CDN节点"等',
  })
  description: string;

  /**
   * 白名单规则是否生效
   */
  @Column({
    type: 'boolean',
    default: true,
    comment: '白名单规则是否生效',
  })
  @Index()
  isActive: boolean;

  /**
   * 创建该白名单记录的管理员用户ID
   */
  @Column({
    type: 'uuid',
    nullable: true,
    comment: '创建该白名单记录的管理员用户ID',
  })
  createdBy?: string;

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
