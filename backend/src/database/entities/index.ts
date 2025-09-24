// 导入实体类
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { UserSession } from './user-session.entity';
import { UserLoginLog } from './user-login-log.entity';

// 导出所有实体
export { User, UserProfile, Permission, RolePermission, UserSession, UserLoginLog };

// 实体数组，用于TypeORM配置
export const entities = [
  User,
  UserProfile,
  Permission,
  RolePermission,
  UserSession,
  UserLoginLog,
];