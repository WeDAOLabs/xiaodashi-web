import { TeamRoleType } from '@xiaodashi/shared';
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

@Entity('team_members', {
  comment:
    '团队成员关系表，作为用户表和团队表的多对多关系链接表，支持一个用户属于多个团队',
})
@Unique(['teamId', 'userId']) // 确保同一用户在同一团队中只有一条记录
export class TeamMember {
  @PrimaryGeneratedColumn('uuid', { comment: '团队成员关系唯一标识符' })
  id: string;

  @Column({
    type: 'uuid',
    comment: '团队ID，关联到团队表',
  })
  @Index()
  teamId: string;

  @Column({
    type: 'uuid',
    comment: '用户ID，关联到用户表',
  })
  @Index()
  userId: string;

  @Column({
    type: 'enum',
    enum: TeamRoleType,
    default: TeamRoleType.MEMBER,
    comment:
      '成员角色：owner-团队所有者，admin-管理员，member-普通成员，默认普通成员',
  })
  @Index()
  role: TeamRoleType;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '成员在团队中的显示名称，最大100个字符',
  })
  displayName: string;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '成员加入团队的时间',
  })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: '成员信息更新时间',
  })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
