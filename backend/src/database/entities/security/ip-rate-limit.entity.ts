import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * IP频率限制记录实体
 *
 * 用于记录IP的访问频率，实现滑动窗口算法的频率限制
 * 使用PostgreSQL作为缓存存储，定期清理过期记录
 */
@Entity('ip_rate_limits', {
  comment: 'IP频率限制记录表，用于记录IP的访问频率，支持滑动窗口算法',
})
@Index(['ipAddress', 'action'])
export class IPRateLimit {
  /**
   * IP频率限制记录唯一标识符
   */
  @PrimaryGeneratedColumn('uuid', {
    comment: 'IP频率限制记录唯一标识符',
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
   * 限流动作类型
   * 不同的动作类型有不同的限流策略
   */
  @Column({
    type: 'varchar',
    length: 50,
    comment:
      '限流动作类型：login-登录，register-注册，api-API调用，captcha-验证码',
  })
  @Index()
  action: string;

  /**
   * 当前窗口内的请求次数
   */
  @Column({
    type: 'int',
    default: 1,
    comment: '当前窗口内的请求次数',
  })
  requestCount: number;

  /**
   * 窗口开始时间
   * 用于滑动窗口算法计算
   */
  @Column({
    type: 'timestamptz',
    comment: '窗口开始时间，用于滑动窗口算法计算',
  })
  @Index()
  windowStartAt: Date;

  /**
   * 窗口结束时间
   * = 窗口开始时间 + 窗口大小
   */
  @Column({
    type: 'timestamptz',
    comment: '窗口结束时间（=窗口开始时间+窗口大小）',
  })
  @Index()
  windowEndAt: Date;

  /**
   * 是否已被限流阻止
   */
  @Column({
    type: 'boolean',
    default: false,
    comment: '是否已被限流阻止',
  })
  isBlocked: boolean;

  /**
   * 限流解除时间
   * 超过此时间自动解除限流
   */
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: '限流解除时间，超过此时间自动解除限流',
  })
  @Index()
  blockedUntil?: Date;

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
