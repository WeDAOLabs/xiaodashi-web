import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PermissionAction } from '@xiaodashi/shared';
import { RolePermission } from './role-permission.entity';

@Entity('permissions', { comment: '权限定义表' })
export class Permission {
  @PrimaryGeneratedColumn('uuid', { comment: '权限唯一标识符' })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    comment: '权限名称，系统内唯一',
  })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 50, comment: '权限所属资源模块' })
  @Index()
  resource: string;

  @Column({
    type: 'enum',
    enum: PermissionAction,
    comment: '权限操作类型：CREATE-创建，READ-读取，UPDATE-更新，DELETE-删除',
  })
  @Index()
  action: PermissionAction;

  @Column({ type: 'text', nullable: true, comment: '权限详细描述' })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz', comment: '创建时间' })
  createdAt: Date;

  // 关联关系
  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
