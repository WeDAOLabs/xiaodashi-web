import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { UserRole } from '@xiaodashi/shared';
import { Permission } from './permission.entity';

@Entity('role_permissions', { comment: '角色权限关联表' })
@Unique(['role', 'permissionId'])
export class RolePermission {
  @PrimaryGeneratedColumn('uuid', { comment: '角色权限关联唯一标识符' })
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    comment: '用户角色：USER-普通用户，ADMIN-管理员',
  })
  @Index()
  role: UserRole;

  @Column({ type: 'uuid', comment: '权限ID，关联到权限表' })
  @Index()
  permissionId: string;

  @CreateDateColumn({ type: 'timestamptz', comment: '关联创建时间' })
  createdAt: Date;

  // 关联关系
  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
