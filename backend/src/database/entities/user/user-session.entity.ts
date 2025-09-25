import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { User } from './user.entity';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

@Entity('user_sessions', { comment: '用户会话表' })
@Index(['userId', 'isActive'])
@Index(['userId', 'deviceId'])
@Index(['expiresAt', 'isActive'])
@Check(`"expiresAt" > "createdAt"`)
export class UserSession {
  @PrimaryGeneratedColumn('uuid', { comment: '会话唯一标识符' })
  id: string;

  @Column({ type: 'uuid', comment: '用户ID，关联到用户表' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 255, comment: '刷新令牌哈希值' })
  @Index()
  refreshTokenHash: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '设备ID，用于识别设备',
  })
  @Index()
  deviceId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '设备名称' })
  deviceName?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '设备类型：mobile-手机，tablet-平板，desktop-桌面，unknown-未知',
  })
  deviceType?: DeviceType;

  @Column({ type: 'inet', nullable: true, comment: '用户IP地址' })
  @Index()
  ipAddress?: string;

  @Column({ type: 'text', nullable: true, comment: '用户浏览器代理字符串' })
  userAgent?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '用户地理位置',
  })
  location?: string;

  @Column({ type: 'boolean', default: true, comment: '会话是否处于活跃状态' })
  @Index()
  isActive: boolean;

  @Column({ type: 'timestamptz', comment: '会话过期时间' })
  @Index()
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: '最后活跃时间' })
  lastActiveAt: Date;

  // 关联关系
  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
