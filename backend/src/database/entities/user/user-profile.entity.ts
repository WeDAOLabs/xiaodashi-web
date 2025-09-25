import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { UserPreferences } from '@xiaodashi/shared';
import { User } from './user.entity';

@Entity('user_profiles', { comment: '用户详细资料表' })
export class UserProfile {
  @PrimaryGeneratedColumn('uuid', { comment: '用户资料唯一标识符' })
  id: string;

  @Column({ type: 'uuid', comment: '用户ID，关联到用户表' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '用户手机号码' })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '用户所在公司' })
  @Index()
  company?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '用户职位' })
  position?: string;

  @Column({ type: 'text', nullable: true, comment: '用户个人简介' })
  bio?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '用户所在地区' })
  location?: string;

  @Column({ type: 'text', nullable: true, comment: '用户个人网站或博客地址' })
  website?: string;

  @Column({ type: 'jsonb', default: {}, comment: '用户个性化设置和偏好' })
  preferences: UserPreferences;

  @CreateDateColumn({ type: 'timestamptz', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', comment: '更新时间' })
  updatedAt: Date;

  // 关联关系
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
