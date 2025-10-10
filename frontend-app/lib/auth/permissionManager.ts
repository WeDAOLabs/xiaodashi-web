/**
 * 权限管理器
 *
 * 基于 @xiaodashi/shared Permission 类型的 RBAC 权限控制
 * 支持资源级别和操作级别的权限检查
 *
 * ⚠️ 可在客户端和服务端使用
 */

import type { Permission } from '@xiaodashi/shared';
import { PermissionAction, UserRole } from '@xiaodashi/shared';

/**
 * 权限管理器类
 */
export class PermissionManager {
  /**
   * 检查用户是否拥有特定权限
   * @param permissions - 用户的权限列表
   * @param resource - 资源名称（如 'user', 'order', 'product', 'ai'）
   * @param action - 操作类型（如 'create', 'read', 'update', 'delete', 'manage'）
   * @returns 是否有权限
   *
   * @example
   * ```ts
   * const canEdit = PermissionManager.hasPermission(
   *   user.permissions,
   *   'user',
   *   PermissionAction.UPDATE
   * );
   * ```
   */
  static hasPermission(
    permissions: Permission[],
    resource: string,
    action: PermissionAction
  ): boolean {
    // 如果没有权限列表，返回 false
    if (!permissions || permissions.length === 0) {
      return false;
    }

    // 查找匹配的权限
    return permissions.some((permission) => {
      // 资源匹配
      const resourceMatch = permission.resource === resource || permission.resource === '*';

      // 操作匹配
      const actionMatch =
        permission.action === action ||
        permission.action === PermissionAction.MANAGE; // MANAGE 拥有所有操作权限

      return resourceMatch && actionMatch;
    });
  }

  /**
   * 检查用户是否拥有任一权限
   * @param permissions - 用户的权限列表
   * @param checks - 权限检查列表
   * @returns 是否有任一权限
   *
   * @example
   * ```ts
   * const canEditOrView = PermissionManager.hasAnyPermission(
   *   user.permissions,
   *   [
   *     { resource: 'user', action: PermissionAction.UPDATE },
   *     { resource: 'user', action: PermissionAction.READ }
   *   ]
   * );
   * ```
   */
  static hasAnyPermission(
    permissions: Permission[],
    checks: Array<{ resource: string; action: PermissionAction }>
  ): boolean {
    return checks.some((check) =>
      this.hasPermission(permissions, check.resource, check.action)
    );
  }

  /**
   * 检查用户是否拥有所有权限
   * @param permissions - 用户的权限列表
   * @param checks - 权限检查列表
   * @returns 是否有所有权限
   *
   * @example
   * ```ts
   * const canFullManage = PermissionManager.hasAllPermissions(
   *   user.permissions,
   *   [
   *     { resource: 'user', action: PermissionAction.CREATE },
   *     { resource: 'user', action: PermissionAction.UPDATE },
   *     { resource: 'user', action: PermissionAction.DELETE }
   *   ]
   * );
   * ```
   */
  static hasAllPermissions(
    permissions: Permission[],
    checks: Array<{ resource: string; action: PermissionAction }>
  ): boolean {
    return checks.every((check) =>
      this.hasPermission(permissions, check.resource, check.action)
    );
  }

  /**
   * 根据用户角色获取默认权限列表
   * @param role - 用户角色
   * @returns 权限列表
   *
   * ⚠️ 这是一个示例实现，实际项目中应该从后端获取权限配置
   */
  static getPermissionsByRole(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        // 管理员拥有所有权限
        return [
          {
            id: 'admin-all',
            name: '全部权限',
            resource: '*',
            action: PermissionAction.MANAGE,
            description: '管理员拥有所有资源的完全管理权限',
          },
        ];

      case UserRole.PREMIUM:
        // Premium 用户权限
        return [
          {
            id: 'premium-ai-generate',
            name: 'AI 生成',
            resource: 'ai',
            action: PermissionAction.CREATE,
            description: '使用 AI 生成内容',
          },
          {
            id: 'premium-user-read',
            name: '用户查看',
            resource: 'user',
            action: PermissionAction.READ,
            description: '查看用户信息',
          },
          {
            id: 'premium-user-update',
            name: '用户编辑',
            resource: 'user',
            action: PermissionAction.UPDATE,
            description: '编辑用户信息',
          },
        ];

      case UserRole.USER:
        // 普通用户权限
        return [
          {
            id: 'user-read',
            name: '基础查看',
            resource: 'user',
            action: PermissionAction.READ,
            description: '查看基础信息',
          },
        ];

      default:
        return [];
    }
  }

  /**
   * 检查路由权限
   * @param path - 路由路径
   * @param userRole - 用户角色
   * @returns 是否有访问权限
   *
   * @example
   * ```ts
   * const canAccessAdmin = PermissionManager.checkRoutePermission(
   *   '/dashboard/admin',
   *   user.role
   * );
   * ```
   */
  static checkRoutePermission(path: string, userRole: UserRole): boolean {
    // 路由权限配置（示例）
    const routePermissions: Record<string, UserRole[]> = {
      '/dashboard': [UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN],
      '/dashboard/admin': [UserRole.ADMIN],
      '/dashboard/analytics': [UserRole.PREMIUM, UserRole.ADMIN],
      '/dashboard/settings': [UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN],
    };

    // 查找匹配的路由配置
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
      if (path.startsWith(route)) {
        return allowedRoles.includes(userRole);
      }
    }

    // 默认允许访问
    return true;
  }

  /**
   * 格式化权限为可读字符串
   * @param resource - 资源名称
   * @param action - 操作类型
   * @returns 权限字符串（如 "user:update"）
   */
  static formatPermission(resource: string, action: PermissionAction): string {
    return `${resource}:${action}`;
  }

  /**
   * 解析权限字符串
   * @param permissionString - 权限字符串（如 "user:update"）
   * @returns 资源和操作对象
   */
  static parsePermission(permissionString: string): {
    resource: string;
    action: PermissionAction;
  } | null {
    const parts = permissionString.split(':');
    if (parts.length !== 2) {
      return null;
    }

    return {
      resource: parts[0],
      action: parts[1] as PermissionAction,
    };
  }
}
