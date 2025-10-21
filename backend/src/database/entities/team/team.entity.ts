import { TeamTier } from '@xiaodashi/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamMember } from './team-member.entity';
import { TeamInvitation } from './team-invitation.entity';

@Entity('teams', { comment: '团队基础信息表' })
export class Team {
  @PrimaryGeneratedColumn('uuid', { comment: '团队唯一标识符' })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '团队名称，最大100个字符',
  })
  name: string;

  @Column({
    type: 'uuid',
    comment: '团队所有者用户ID，关联到用户表',
  })
  @Index()
  ownerId: string;

  @Column({
    type: 'enum',
    enum: TeamTier,
    default: TeamTier.FREE,
    comment:
      '团队等级：free-免费版，pro-专业版，plus-增强版，ultra-旗舰版，默认免费版',
  })
  @Index()
  tier: TeamTier;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '团队创建时间',
  })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: '团队信息更新时间',
  })
  updatedAt: Date;

  // 关联关系
  @OneToMany(() => TeamMember, (member) => member.team, { cascade: true })
  members: TeamMember[];

  @OneToMany(() => TeamInvitation, (invitation) => invitation.team, {
    cascade: true,
  })
  invitations: TeamInvitation[];
}
