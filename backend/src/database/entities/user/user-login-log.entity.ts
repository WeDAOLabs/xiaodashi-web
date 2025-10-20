import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_login_logs', { comment: '用户登录日志表' })
@Index(['createdAt'])
@Index(['userId', 'success', 'createdAt'])
export class UserLoginLog {
  @PrimaryGeneratedColumn('uuid', { comment: '登录日志唯一标识符' })
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '用户ID，关联到用户表，可为空（登录失败时）',
  })
  @Index()
  userId?: string;

  @Column({ type: 'varchar', length: 320, comment: '尝试登录的邮箱地址' })
  @Index()
  email: string;

  @Column({ type: 'inet', nullable: true, comment: '登录IP地址' })
  @Index()
  ipAddress?: string;

  @Column({ type: 'text', nullable: true, comment: '用户浏览器代理字符串' })
  userAgent?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '登录地理位置',
  })
  location?: string;

  @Column({ type: 'boolean', comment: '登录是否成功' })
  @Index()
  success: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '登录失败原因',
  })
  failureReason?: string;

  @CreateDateColumn({ type: 'timestamptz', comment: '登录尝试时间' })
  createdAt: Date;

  // 关联关系
  @ManyToOne(() => User, (user) => user.loginLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
