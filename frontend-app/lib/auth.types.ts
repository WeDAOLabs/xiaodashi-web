/**
 * @deprecated
 * 此文件已弃用，请使用 '@/lib/auth/types' 代替
 *
 * 为了保持向后兼容，此文件重新导出新位置的类型
 */

export type {
  User,
  LoginRequest,
  LoginResponse,
  AuthToken,
  RefreshTokenRequest,
  RefreshTokenResponse,
  Permission,
  PermissionAction,
  UserSession,
  UserRole,
  AuthContextType,
  AuthError,
} from './auth/types';

export { AuthErrorType } from './auth/types';
