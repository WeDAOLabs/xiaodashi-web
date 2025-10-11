import { Request } from 'express';
import { AuthenticatedUser } from '@xiaodashi/shared';

/**
 * 扩展 Express Request 类型以包含认证用户信息
 *
 * 这个接口提供 NestJS 控制器所需的认证用户信息类型支持，
 * 避免了类型冲突问题。
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

// 导出所有认证相关类型，便于其他模块使用
export type { AuthenticatedRequestBase } from '@xiaodashi/shared';
