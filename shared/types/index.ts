/**
 * Shared Types 统一导出
 * 整合所有类型定义，方便外部包引用
 */

// 导出API相关类型
export * from './api.types';

// 导出用户相关类型
export * from './user';

// 导出认证相关类型
export * from './auth';

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