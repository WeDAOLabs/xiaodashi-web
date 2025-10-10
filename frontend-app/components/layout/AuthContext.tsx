'use client';

import { AuthService } from '@/lib/auth/authService';
import { PermissionManager } from '@/lib/auth/permissionManager';
import { StorageManager } from '@/lib/auth/storageManager';
import { TokenManager } from '@/lib/auth/tokenManager';
import type { AuthContextType } from '@/lib/auth/types';
import type {
  LoginRequest,
  User,
  Permission,
  PermissionAction,
  UserSession,
} from '@xiaodashi/shared';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider 组件
 * 提供认证状态管理和相关方法
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [sessionInfo, setSessionInfo] = useState<UserSession | null>(null);

  // 初始化：检查用户认证状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // 检查是否有 Token
        if (!AuthService.isAuthenticated()) {
          setUser(null);
          setPermissions([]);
          setSessionInfo(null);
          return;
        }

        // 获取当前用户信息
        const currentUser = await AuthService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);

          // 根据用户角色获取权限
          const userPermissions = PermissionManager.getPermissionsByRole(currentUser.role);
          setPermissions(userPermissions);

          // TODO: 从后端获取会话信息
          // const session = await apiClient.get<UserSession>('/auth/session');
          // setSessionInfo(session);
        } else {
          setUser(null);
          setPermissions([]);
          setSessionInfo(null);
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
        // 认证失败，清除状态
        setUser(null);
        setPermissions([]);
        setSessionInfo(null);
        TokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 监听多标签页状态同步
  useEffect(() => {
    // 监听 Token 过期事件
    const handleTokenExpired = () => {
      console.warn('Token 已过期，清除认证状态');
      setUser(null);
      setPermissions([]);
      setSessionInfo(null);
    };

    window.addEventListener('token-expired', handleTokenExpired);

    // 监听 Storage 变化（多标签页同步）
    const unsubscribe = StorageManager.onStorageChange<string>('accessToken', (newToken) => {
      if (!newToken) {
        // Token 被清除，同步清除状态
        console.log('检测到其他标签页登出，同步清除状态');
        setUser(null);
        setPermissions([]);
        setSessionInfo(null);
      }
    });

    return () => {
      window.removeEventListener('token-expired', handleTokenExpired);
      unsubscribe();
    };
  }, []);

  /**
   * 登录方法
   */
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);

      // 调用 AuthService 登录
      const response = await AuthService.login(credentials);

      // 设置用户状态
      setUser(response.user);

      // 设置权限
      const userPermissions = PermissionManager.getPermissionsByRole(response.user.role);
      setPermissions(userPermissions);

      // TODO: 设置会话信息
      // setSessionInfo(response.sessionInfo);

      console.log('✅ 登录成功');
      return true;
    } catch (error) {
      console.error('❌ 登录失败:', error);
      setUser(null);
      setPermissions([]);
      setSessionInfo(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 登出方法
   */
  const logout = async (allDevices: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);

      // 调用 AuthService 登出
      await AuthService.logout(allDevices);

      // 清除状态
      setUser(null);
      setPermissions([]);
      setSessionInfo(null);

      console.log('✅ 登出成功');
    } catch (error) {
      console.error('❌ 登出失败:', error);
      // 即使失败也清除本地状态
      setUser(null);
      setPermissions([]);
      setSessionInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 手动刷新会话
   */
  const refreshSession = async (): Promise<void> => {
    try {
      // 刷新 Token
      await TokenManager.manualRefresh();

      // 重新获取用户信息
      const currentUser = await AuthService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        const userPermissions = PermissionManager.getPermissionsByRole(currentUser.role);
        setPermissions(userPermissions);
      }

      console.log('✅ 会话刷新成功');
    } catch (error) {
      console.error('❌ 会话刷新失败:', error);
      throw error;
    }
  };

  /**
   * 检查用户权限
   */
  const hasPermission = (resource: string, action: PermissionAction): boolean => {
    return PermissionManager.hasPermission(permissions, resource, action);
  };

  // 上下文值
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    permissions,
    sessionInfo,
    login,
    logout,
    refreshSession,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * 用于在组件中访问认证上下文
 *
 * @example
 * ```tsx
 * const { user, login, logout, hasPermission } = useAuth();
 *
 * if (!user) {
 *   return <LoginForm onSubmit={login} />;
 * }
 *
 * return (
 *   <div>
 *     <h1>Welcome, {user.name}</h1>
 *     {hasPermission('user', PermissionAction.UPDATE) && (
 *       <button>Edit Profile</button>
 *     )}
 *     <button onClick={() => logout()}>Logout</button>
 *   </div>
 * );
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }

  return context;
};

export default AuthContext;
