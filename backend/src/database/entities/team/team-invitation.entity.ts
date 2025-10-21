import { InvitationStatus } from '@xiaodashi/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Team } from './team.entity';
import { User } from '../user/user.entity';

@Entity('team_invitations', {
  comment: '团队邀请记录表，管理团队成员邀请流程',
})
@Unique(['token']) // 确保邀请令牌唯一性
export class TeamInvitation {
  @PrimaryGeneratedColumn('uuid', { comment: '邀请记录唯一标识符' })
  id: string;

  @Column({
    type: 'uuid',
    comment: '团队ID，关联到团队表',
  })
  @Index()
  teamId: string;

  @Column({
    type: 'uuid',
    comment: '邀请者用户ID，关联到用户表',
  })
  @Index()
  inviterId: string;

  @Column({
    type: 'varchar',
    length: 320,
    comment: '被邀请者邮箱地址，作为登录用户名',
  })
  @Index()
  email: string;

  @Column({
    type: 'varchar',
    length: 1024,
    unique: true,
    comment: '邀请令牌，用于验证邀请链接的有效性，长度1024字符，唯一索引',
  })
  @Index()
  token: string;

  @Column({
    type: 'timestamptz',
    comment: '邀请过期时间，过期后邀请自动失效',
  })
  @Index()
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
    comment:
      '邀请状态：pending-待处理，accepted-已接受，expired-已过期，cancelled-已取消，默认待处理',
  })
  @Index()
  status: InvitationStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '邀请创建时间',
  })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: '邀请状态更新时间',
  })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => Team, (team) => team.invitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviterId' })
  inviter: User;
}
