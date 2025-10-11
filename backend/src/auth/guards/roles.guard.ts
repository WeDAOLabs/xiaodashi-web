import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@xiaodashi/shared';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../types';

/**
 * 角色守卫
 *
 * 基于角色的访问控制守卫，用于：
 * - 检查用户是否具有访问特定路由所需的角色
 * - 支持多角色验证（用户拥有其中任一角色即可）
 * - 提供详细的权限不足错误信息
 * - 记录权限检查失败的审计日志
 *
 * 使用方式：
 * - 与 @Roles() 装饰器配合使用
 * - 支持角色继承（ADMIN > PREMIUM > USER）
 * - 可与 JwtAuthGuard 链式使用
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN)
 * @Get('admin/users')
 * getUsers() {}
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  /**
   * 判断用户是否可以激活路由
   *
   * @param context - 执行上下文，包含请求信息
   * @returns boolean - 是否允许访问
   * @throws ForbiddenException - 当用户角色不足时抛出
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需的角色列表
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 从请求中获取认证用户信息
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // 如果用户不存在，则拒绝访问（理论上 JwtAuthGuard 应该已经处理了）
    if (!user) {
      this.logger.error('权限检查失败：用户不存在');
      throw new ForbiddenException('用户认证信息无效');
    }

    // 检查用户角色是否满足要求
    const hasRequiredRole = this.checkUserRole(user.role, requiredRoles);

    if (!hasRequiredRole) {
      // 记录权限检查失败的详细信息
      const { method, url } = request;
      this.logger.warn(`权限不足 - ${method} ${url}`, {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        requiredRoles,
        userAgent: request.get('user-agent'),
        ip: request.ip,
      });

      // 提供用户友好的错误信息
      throw new ForbiddenException(
        `权限不足，需要 ${requiredRoles.join(' 或 ')} 角色才能访问`,
      );
    }

    // 记录权限检查成功（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`权限检查通过 - ${request.method} ${request.url}`, {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        requiredRoles,
      });
    }

    return true;
  }

  /**
   * 检查用户角色是否满足要求
   *
   * 支持角色继承机制：
   * - ADMIN 可以访问所有级别的资源
   * - PREMIUM 可以访问 USER 和 PREMIUM 级别的资源
   * - USER 只能访问 USER 级别的资源
   *
   * @param userRole - 用户角色
   * @param requiredRoles - 所需角色列表
   * @returns boolean - 是否满足角色要求
   */
  private checkUserRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    // 如果用户角色在所需角色列表中，直接返回 true
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // 检查角色继承关系
    for (const requiredRole of requiredRoles) {
      if (this.isRoleSufficient(userRole, requiredRole)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查用户角色是否足够访问所需角色级别的资源
   *
   * 角色继承规则：
   * - ADMIN > PREMIUM > USER
   *
   * @param userRole - 用户角色
   * @param requiredRole - 所需角色
   * @returns boolean - 是否足够
   */
  private isRoleSufficient(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.PREMIUM]: 2,
      [UserRole.ADMIN]: 3,
    };

    const userLevel = roleHierarchy[userRole];
    const requiredLevel = roleHierarchy[requiredRole];

    return userLevel >= requiredLevel;
  }
}