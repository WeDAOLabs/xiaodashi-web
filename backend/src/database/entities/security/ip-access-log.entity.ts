import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * IP访问日志实体
 *
 * 记录所有IP的访问行为，用于安全分析和风险评估
 * 可分析IP的访问模式、频率、异常行为等
 */
@Entity('ip_access_logs', {
  comment: 'IP访问日志表，记录所有IP的访问行为用于安全分析',
})
@Index(['ipAddress', 'createdAt'])
@Index(['userId', 'createdAt'])
export class IPAccessLog {
  /**
   * IP访问日志唯一标识符
   */
  @PrimaryGeneratedColumn('uuid', {
    comment: 'IP访问日志唯一标识符',
  })
  id: string;

  /**
   * IP地址
   */
  @Column({
    type: 'inet',
    comment: 'IP地址',
  })
  @Index()
  ipAddress: string;

  /**
   * 访问的API端点路径
   */
  @Column({
    type: 'varchar',
    length: 200,
    comment: '访问的API端点路径',
  })
  endpoint: string;

  /**
   * HTTP请求方法
   */
  @Column({
    type: 'varchar',
    length: 10,
    comment: 'HTTP请求方法：GET、POST、PUT、DELETE等',
  })
  method: string;

  /**
   * HTTP响应状态码
   */
  @Column({
    type: 'int',
    comment: 'HTTP响应状态码',
  })
  @Index()
  statusCode: number;

  /**
   * 用户代理字符串
   */
  @Column({
    type: 'text',
    nullable: true,
    comment: '用户代理字符串',
  })
  userAgent?: string;

  /**
   * 关联的用户ID
   * 未登录时为空
   */
  @Column({
    type: 'uuid',
    nullable: true,
    comment: '关联的用户ID，未登录时为空',
  })
  @Index()
  userId?: string;

  /**
   * IP风险评分
   * 由风险评估服务计算，0-100
   */
  @Column({
    type: 'int',
    default: 0,
    comment: 'IP风险评分（0-100），由风险评估服务计算',
  })
  riskScore: number;

  /**
   * 该请求是否被安全策略拦截
   */
  @Column({
    type: 'boolean',
    default: false,
    comment: '该请求是否被安全策略拦截',
  })
  blocked: boolean;

  /**
   * 拦截原因说明
   */
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '拦截原因说明',
  })
  blockReason?: string;

  /**
   * 地理位置信息
   * 格式：国家,城市
   * 由geoip-lite库解析
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '地理位置信息，格式：国家,城市',
  })
  location?: string;

  /**
   * 访问时间
   */
  @CreateDateColumn({
    type: 'timestamptz',
    comment: '访问时间',
  })
  @Index()
  createdAt: Date;
}
