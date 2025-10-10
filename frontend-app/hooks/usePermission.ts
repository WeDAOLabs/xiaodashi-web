/**
 * 权限检查 Hook
 *
 * 提供便捷的权限检查方法
 */

'use client';

import { useAuth } from '@/components/layout/AuthContext';
import type { PermissionAction } from '@xiaodashi/shared';

/**
 * 权限检查 Hook
 * @param resource - 资源名称
 * @param action - 操作类型
 * @returns 是否有权限
 *
 * @example
 * ```tsx
 * function UserEditButton() {
 *   const canEdit = usePermission('user', PermissionAction.UPDATE);
 *
 *   if (!canEdit) {
 *     return null;
 *   }
 *
 *   return <button>Edit User</button>;
 * }
 * ```
 */
export function usePermission(resource: string, action: PermissionAction): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(resource, action);
}

/**
 * 批量权限检查 Hook - 任一权限
 * @param checks - 权限检查列表
 * @returns 是否有任一权限
 *
 * @example
 * ```tsx
 * function AdminOrModeratorButton() {
 *   const hasAccess = useHasAnyPermission([
 *     { resource: 'user', action: PermissionAction.DELETE },
 *     { resource: 'user', action: PermissionAction.MANAGE },
 *   ]);
 *
 *   if (!hasAccess) {
 *     return null;
 *   }
 *
 *   return <button>Manage Users</button>;
 * }
 * ```
 */
export function useHasAnyPermission(
  checks: Array<{ resource: string; action: PermissionAction }>
): boolean {
  const { hasPermission } = useAuth();

  return checks.some((check) => hasPermission(check.resource, check.action));
}

/**
 * 批量权限检查 Hook - 所有权限
 * @param checks - 权限检查列表
 * @returns 是否有所有权限
 *
 * @example
 * ```tsx
 * function FullAccessButton() {
 *   const hasFullAccess = useHasAllPermissions([
 *     { resource: 'user', action: PermissionAction.CREATE },
 *     { resource: 'user', action: PermissionAction.UPDATE },
 *     { resource: 'user', action: PermissionAction.DELETE },
 *   ]);
 *
 *   if (!hasFullAccess) {
 *     return null;
 *   }
 *
 *   return <button>Full User Management</button>;
 * }
 * ```
 */
export function useHasAllPermissions(
  checks: Array<{ resource: string; action: PermissionAction }>
): boolean {
  const { hasPermission } = useAuth();

  return checks.every((check) => hasPermission(check.resource, check.action));
}
