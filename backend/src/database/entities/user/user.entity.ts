import { UserRole, UserStatus } from '@xiaodashi/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLoginLog } from './user-login-log.entity';
import { UserProfile } from './user-profile.entity';
import { UserSession } from './user-session.entity';

@Entity('users', { comment: '用户基础信息表' })
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: '用户唯一标识符' })
  id: string;

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
    comment: '用户邮箱地址，作为登录用户名',
  })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 100, comment: '用户显示名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, comment: '密码哈希值' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    comment: '用户角色：USER-普通用户，ADMIN-管理员',
  })
  @Index()
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    comment: '用户状态：ACTIVE-活跃，INACTIVE-非活跃，SUSPENDED-已暂停',
  })
  @Index()
  status: UserStatus;

  @Column({ type: 'text', nullable: true, comment: '用户头像URL' })
  avatar?: string;

  @Column({ type: 'boolean', default: false, comment: '邮箱是否已验证' })
  emailVerified: boolean;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    comment: '邮箱验证令牌',
  })
  @Index()
  emailVerificationToken: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: '邮箱验证令牌过期时间',
  })
  emailVerificationExpiresAt: Date | null;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    comment: '密码重置令牌',
  })
  @Index()
  passwordResetToken: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: '密码重置令牌过期时间',
  })
  passwordResetExpiresAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true, comment: '最后登录时间' })
  @Index()
  lastLoginAt?: Date;

  @Column({ type: 'int', default: 0, comment: '登录失败尝试次数' })
  loginAttempts: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: '账户锁定至指定时间',
  })
  lockedUntil?: Date;

  @CreateDateColumn({ type: 'timestamptz', comment: '创建时间' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: '更新时间' })
  updatedAt: Date;

  // 关联关系
  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: ['insert', 'update'],
  })
  profile: UserProfile;

  @OneToMany(() => UserSession, (session) => session.user, { cascade: true })
  sessions: UserSession[];

  @OneToMany(() => UserLoginLog, (log) => log.user)
  loginLogs: UserLoginLog[];
}
