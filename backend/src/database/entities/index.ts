/**
 * 数据库实体统一导出
 * 按业务域组织，为未来多数据库架构预留扩展空间
 */

// 按域导入实体
import {
  User,
  UserProfile,
  UserSession,
  UserLoginLog,
  CaptchaSession,
  userEntities,
} from './user';

import { Permission, RolePermission, authEntities } from './auth';

import {
  IPBlacklist,
  IPWhitelist,
  IPRateLimit,
  IPAccessLog,
  securityEntities,
} from './security';

import {
  Team,
  TeamMember,
  TeamInvitation,
  TeamRole,
  teamEntities,
} from './team';

// 导出所有实体（保持向后兼容）
export {
  User,
  UserProfile,
  Permission,
  RolePermission,
  UserSession,
  UserLoginLog,
  CaptchaSession,
  IPBlacklist,
  IPWhitelist,
  IPRateLimit,
  IPAccessLog,
  Team,
  TeamMember,
  TeamInvitation,
  TeamRole,
};

// 按域导出实体（为未来多数据库预留）
export const UserDomainEntities = {
  entities: [User, UserProfile, UserSession, UserLoginLog, CaptchaSession],
  entityClasses: userEntities,
};

export const AuthDomainEntities = {
  entities: [Permission, RolePermission],
  entityClasses: authEntities,
};

export const SecurityDomainEntities = {
  entities: [IPBlacklist, IPWhitelist, IPRateLimit, IPAccessLog],
  entityClasses: securityEntities,
};

export const TeamDomainEntities = {
  entities: [Team, TeamMember, TeamInvitation, TeamRole],
  entityClasses: teamEntities,
};

// 实体数组，用于TypeORM配置（当前单数据库使用）
export const entities = [
  User,
  UserProfile,
  Permission,
  RolePermission,
  UserSession,
  UserLoginLog,
  CaptchaSession,
  IPBlacklist,
  IPWhitelist,
  IPRateLimit,
  IPAccessLog,
  Team,
  TeamMember,
  TeamInvitation,
  TeamRole,
];

// 未来多数据库时可以使用的分域配置（预留）
export const domainEntities = {
  user: UserDomainEntities.entities,
  auth: AuthDomainEntities.entities,
  security: SecurityDomainEntities.entities,
  team: TeamDomainEntities.entities,
};
