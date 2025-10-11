// 导出所有认证相关类型
export * from './auth.types';

// 重新导出 shared 包中的认证相关类型，方便统一导入
export type {
  AuthenticatedUser,
  JWTPayload,
  ValidatedJwtUser,
  AuthenticatedRequestBase,
} from '@xiaodashi/shared';