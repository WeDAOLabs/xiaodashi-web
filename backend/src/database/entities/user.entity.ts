import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole, UserStatus } from '@xiaodashi/shared';
import { UserProfile } from './user-profile.entity';
import { UserSession } from './user-session.entity';
import { UserLoginLog } from './user-login-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Index()
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @Index()
  status: UserStatus;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  emailVerificationToken?: string;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerificationExpiresAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  passwordResetToken?: string;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpiresAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @Index()
  lastLoginAt?: Date;

  @Column({ type: 'int', default: 0 })
  loginAttempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  lockedUntil?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // 关联关系
  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => UserSession, (session) => session.user, { cascade: true })
  sessions: UserSession[];

  @OneToMany(() => UserLoginLog, (log) => log.user)
  loginLogs: UserLoginLog[];
}