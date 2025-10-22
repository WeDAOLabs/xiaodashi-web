/**
 * Shared Types 统一导出
 * 整合所有类型定义，支持按域命名空间导出（为未来多数据库架构预留）
 */

// === 直接导出（保持向后兼容） ===
// 导出API相关类型
export * from './api.types';

// 导出用户相关类型
export * from './user';

// 导出认证相关类型
export * from './auth';

// 导出会话相关类型
export * from './session';

// 导出安全域相关类型
export * from './security';

// 导出团队域相关类型
export * from './team';

// 重新导出一些常用类型的别名，提供更简洁的导入方式
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserProfile,
  UpdateUserProfileRequest
} from './user';

export type {
  AuthToken,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  Permission,
  AuthContext
} from './auth';

export type {
  ApiResponse,
  ApiErrorResponse
} from './api.types';

// 导出枚举（作为值，不是类型）
export { IPType, ThreatSeverity, IPRiskLevel } from './security';

// 导出类型
export type {
  IPBlacklistEntry,
  AddIPBlacklistRequest,
  UpdateIPBlacklistRequest,
  IPWhitelistEntry,
  AddIPWhitelistRequest,
  UpdateIPWhitelistRequest,
  IPRiskReport,
  IPCheckResponse,
  IPRateLimitStatus,
  IPAccessLogEntry
} from './security';

// 导出团队相关类型
export type {
  Team,
  TeamMember,
  TeamInvitation,
  TeamRole,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest,
  CreateTeamInvitationRequest,
  TeamMemberDetail,
  TeamDetail,
  TeamListItem,
  UserTeamInfo,
  GetTeamsResponse,
  GetTeamResponse,
  GetTeamMembersResponse,
  CreateTeamResponse,
  UpdateTeamResponse,
  AddTeamMemberResponse,
  UpdateTeamMemberResponse,
  CreateTeamInvitationResponse,
  GetTeamInvitationsResponse,
  RemoveTeamMemberResponse,
  CancelTeamInvitationResponse,
  TeamQueryParams,
  TeamMemberQueryParams,
  TeamInvitationQueryParams
} from './team';

// 导出团队相关枚举（作为值，不是类型）
export { TeamTier, TeamRoleType, InvitationStatus } from './team';

// === 按域命名空间导出（为未来多数据库扩展预留） ===
// 用户域类型命名空间
export * as UserDomain from './user';

// 认证域类型命名空间
export * as AuthDomain from './auth';

// 会话域类型命名空间
export * as SessionDomain from './session';

// 安全域类型命名空间
export * as SecurityDomain from './security';

// 团队域类型命名空间
export * as TeamDomain from './team';

// 通用API类型命名空间
export * as ApiTypes from './api.types';

// 预留其他业务域命名空间
// export * as BusinessDomain from './business';
// export * as AnalyticsDomain from './analytics';

// 域类型集合（为未来按域使用提供便利）
import * as UserTypes from './user';
import * as AuthTypes from './auth';
import * as SessionTypes from './session';
import * as SecurityTypes from './security';
import * as TeamTypes from './team';

export const DomainTypes = {
  User: UserTypes,
  Auth: AuthTypes,
  Session: SessionTypes,
  Security: SecurityTypes,
  Team: TeamTypes,
  // Business: BusinessTypes,
  // Analytics: AnalyticsTypes,
} as const;