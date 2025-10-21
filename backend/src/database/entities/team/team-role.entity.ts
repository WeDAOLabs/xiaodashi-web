import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('team_roles', {
  comment: '团队角色定义表，为未来复杂权限系统预留扩展',
})
export class TeamRole {
  @PrimaryGeneratedColumn('uuid', { comment: '角色唯一标识符' })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '角色名称，最大50个字符，唯一索引',
  })
  @Index()
  name: string;

  @Column({
    type: 'jsonb',
    comment:
      '权限配置，JSONB格式存储各种权限键值对，如 {"canInvite": true, "canManageMembers": false}',
  })
  permissions: Record<string, boolean>;

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '角色创建时间',
  })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: '角色权限更新时间',
  })
  updatedAt: Date;
}
