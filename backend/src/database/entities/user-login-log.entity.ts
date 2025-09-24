import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_login_logs')
export class UserLoginLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId?: string;

  @Column({ type: 'varchar', length: 320 })
  @Index()
  email: string;

  @Column({ type: 'inet', nullable: true })
  @Index()
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string;

  @Column({ type: 'boolean' })
  @Index()
  success: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  failureReason?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  createdAt: Date;

  // 关联关系
  @ManyToOne(() => User, (user) => user.loginLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;
}