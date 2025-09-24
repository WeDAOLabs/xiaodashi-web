/**
 * 认证域实体导出
 * 包含权限和角色相关的所有数据实体
 */

// 导入实体类
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';

// 权限相关实体
export { Permission } from './permission.entity';
export { RolePermission } from './role-permission.entity';

// 认证域实体数组，用于 TypeORM 配置
export const authEntities = [Permission, RolePermission];
