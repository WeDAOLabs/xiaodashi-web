import { PointTransactionType } from '@xiaodashi/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from '../team/team.entity';

@Entity('point_transactions', { comment: '积分交易记录表' })
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid', { comment: '积分交易记录唯一标识符' })
  id: string;

  @Column({
    type: 'uuid',
    comment: '团队ID，关联到团队表',
  })
  @Index()
  teamId: string;

  @Column({
    type: 'uuid',
    comment: '操作用户ID，关联到用户表',
  })
  @Index()
  userId: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment:
      '交易类型：consumption-积分消耗，recharge-积分充值，initial_grant-初始积分发放，adjustment-积分调整',
  })
  @Index()
  type: PointTransactionType;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 4,
    comment: '交易积分数量，正数为充值，负数为消耗，支持4位小数精度',
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 4,
    comment: '交易后积分余额，支持4位小数精度',
  })
  balanceAfter: number;

  @Column({
    type: 'text',
    comment: '交易描述和备注信息，详细说明交易原因和背景',
  })
  description: string;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '关联业务ID，如订单ID、任务ID等外部系统标识符',
  })
  @Index()
  businessId: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '业务类型，如payment、recharge、task_completion等',
  })
  @Index()
  businessType: string | null;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '交易发生时间，自动记录交易的时间戳',
  })
  @Index()
  createdAt: Date;

  // 关联关系
  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;
}
