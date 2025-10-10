'use client';

import { useAuth } from '@/components/layout/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import type { UserRole, PermissionAction } from '@xiaodashi/shared';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** 要求的用户角色（可选） */
  requiredRole?: UserRole;
  /** 要求的权限（可选） */
  requiredPermission?: {
    resource: string;
    action: PermissionAction;
  };
}

/**
 * ProtectedRoute 组件
 *
 * 客户端路由保护组件，用于包裹需要认证的页面
 * 配合 Next.js 中间件实现双重保护
 *
 * @example
 * ```tsx
 * // 基础保护：只要求登录
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * // 角色保护：要求特定角色
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPage />
 * </ProtectedRoute>
 *
 * // 权限保护：要求特定权限
 * <ProtectedRoute requiredPermission={{ resource: 'user', action: PermissionAction.UPDATE }}>
 *   <UserEditPage />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { user, isLoading, isAuthenticated, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 如果正在加载，不做任何操作
    if (isLoading) {
      return;
    }

    // 如果未认证，重定向到登录页（保存当前路径）
    if (!isAuthenticated) {
      console.log('🔒 未认证，重定向到登录页');
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    // 检查角色权限
    if (requiredRole && user?.role !== requiredRole) {
      console.warn(`⚠️ 权限不足：需要角色 ${requiredRole}，当前角色 ${user?.role}`);
      router.push('/dashboard'); // 重定向到首页或无权限页面
      return;
    }

    // 检查细粒度权限
    if (requiredPermission) {
      const hasPerm = hasPermission(
        requiredPermission.resource,
        requiredPermission.action
      );

      if (!hasPerm) {
        console.warn(
          `⚠️ 权限不足：需要权限 ${requiredPermission.resource}:${requiredPermission.action}`
        );
        router.push('/dashboard'); // 重定向到首页或无权限页面
        return;
      }
    }
  }, [
    user,
    isLoading,
    isAuthenticated,
    requiredRole,
    requiredPermission,
    router,
    pathname,
    hasPermission,
  ]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)] mb-4"></div>
          <p className="text-[var(--text-secondary)] text-sm">验证身份中...</p>
        </div>
      </div>
    );
  }

  // 未认证状态（等待重定向）
  if (!isAuthenticated) {
    return null;
  }

  // 角色或权限不足（等待重定向）
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <p className="text-[var(--text-primary)] text-lg font-semibold mb-2">
            权限不足
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            您没有访问此页面的权限
          </p>
        </div>
      </div>
    );
  }

  if (requiredPermission) {
    const hasPerm = hasPermission(
      requiredPermission.resource,
      requiredPermission.action
    );

    if (!hasPerm) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
          <div className="text-center">
            <p className="text-[var(--text-primary)] text-lg font-semibold mb-2">
              权限不足
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              您没有执行此操作的权限
            </p>
          </div>
        </div>
      );
    }
  }

  // 认证通过，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;