import { PointStatus } from '@xiaodashi/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';

@Entity('team_points', { comment: '团队积分表' })
export class TeamPoint {
  @PrimaryGeneratedColumn('uuid', { comment: '团队积分记录唯一标识符' })
  id: string;

  @Column({
    type: 'uuid',
    comment: '团队ID，关联到团队表',
  })
  @Index()
  teamId: string;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 4,
    default: 0,
    comment: '当前积分余额，支持4位小数精度，范围-999999999999.9999到999999999999.9999',
  })
  @Index()
  balance: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: PointStatus.ACTIVE,
    comment: '积分状态：active-激活状态，frozen-冻结状态，expired-过期状态，默认激活状态',
  })
  @Index()
  status: PointStatus;

  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: '积分过期时间，为空表示永不过期',
  })
  @Index()
  expiresAt: Date | null;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '积分记录创建时间',
  })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
    comment: '积分记录更新时间',
  })
  updatedAt: Date | null;

  // 关联关系
  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;
}