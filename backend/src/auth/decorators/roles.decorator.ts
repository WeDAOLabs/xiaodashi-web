import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@xiaodashi/shared';

/**
 * 角色装饰器
 *
 * 用于标记需要特定角色才能访问的路由或控制器
 * 支持多个角色，用户拥有其中任一角色即可访问
 *
 * @param roles - 允许访问的角色列表
 *
 * @example
 * ```typescript
 * @Roles(UserRole.ADMIN)
 * @Get('admin/users')
 * getUsers() {}
 *
 * @Roles(UserRole.ADMIN, UserRole.PREMIUM)
 * @Get('premium-content')
 * getPremiumContent() {}
 * ```
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 管理员角色装饰器
 *
 * 便捷装饰器，用于标记只有管理员才能访问的路由
 *
 * @example
 * ```typescript
 * @Admin()
 * @Post('unlock-account')
 * unlockAccount() {}
 * ```
 */
export const Admin = () => Roles(UserRole.ADMIN);

/**
 * 付费用户角色装饰器
 *
 * 便捷装饰器，用于标记付费用户及以上权限才能访问的路由
 *
 * @example
 * ```typescript
 * @Premium()
 * @Get('premium-content')
 * getPremiumContent() {}
 * ```
 */
export const Premium = () => Roles(UserRole.PREMIUM, UserRole.ADMIN);

/**
 * 公开访问装饰器
 *
 * 便捷装饰器，用于标记所有认证用户都能访问的路由
 *
 * @example
 * ```typescript
 * @Authenticated()
 * @Get('profile')
 * getProfile() {}
 * ```
 */
export const Authenticated = () =>
  Roles(UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN);
