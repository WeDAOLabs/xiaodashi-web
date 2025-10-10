/**
 * 认证服务
 *
 * 提供用户认证相关的 API 调用功能
 * - 登录、登出
 * - Token 刷新
 * - 获取当前用户信息
 *
 * ⚠️ 仅在客户端使用
 */

'use client';

import { apiClient } from './apiClient';
import { TokenManager } from './tokenManager';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  User,
} from '@xiaodashi/shared';

/**
 * 认证服务类
 * 封装所有认证相关的 API 调用
 */
export class AuthService {
  /**
   * 用户登录
   * POST /auth/login
   *
   * @param credentials - 登录凭证（邮箱和密码）
   * @returns LoginResponse 包含用户信息和 tokens
   *
   * @throws {ApiError} 登录失败时抛出错误
   *
   * @example
   * ```ts
   * try {
   *   const response = await AuthService.login({
   *     email: 'user@example.com',
   *     password: 'password123',
   *     rememberMe: true
   *   });
   *   console.log('登录成功:', response.user);
   * } catch (error) {
   *   console.error('登录失败:', error.message);
   * }
   * ```
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // 调用后端登录接口
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

      // 存储 tokens 到本地存储
      TokenManager.storeTokens(response.tokens, credentials.rememberMe);

      // 调度 Token 自动刷新
      TokenManager.scheduleTokenRefresh(response.tokens.expiresIn);

      console.log('✅ 登录成功:', response.user.name);

      return response;
    } catch (error) {
      console.error('❌ 登录失败:', error);
      throw error;
    }
  }

  /**
   * 刷新 Access Token
   * POST /auth/refresh
   *
   * 使用 Refresh Token 获取新的 Access Token
   *
   * @returns RefreshTokenResponse 包含新的 tokens
   * @throws {ApiError} 刷新失败时抛出错误
   *
   * @example
   * ```ts
   * try {
   *   const response = await AuthService.refreshToken();
   *   console.log('Token 刷新成功');
   * } catch (error) {
   *   // Token 刷新失败，需要重新登录
   *   window.location.href = '/login';
   * }
   * ```
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      // 获取 Refresh Token
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error('没有可用的 Refresh Token');
      }

      // 构造请求
      const request: RefreshTokenRequest = {
        refreshToken,
      };

      // 调用后端刷新接口
      const response = await apiClient.post<RefreshTokenResponse>(
        '/auth/refresh',
        request
      );

      // 存储新的 tokens
      // 保持原有的 rememberMe 设置
      const rememberMe = !!localStorage.getItem('rememberMe');
      TokenManager.storeTokens(response.tokens, rememberMe);

      // 调度下一次自动刷新
      TokenManager.scheduleTokenRefresh(response.tokens.expiresIn);

      console.log('✅ Token 刷新成功');

      return response;
    } catch (error) {
      console.error('❌ Token 刷新失败:', error);
      // 清除无效的 tokens
      TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * 用户登出
   * POST /auth/logout
   *
   * @param allDevices - 是否登出所有设备（默认 false）
   * @returns Promise<void>
   *
   * @example
   * ```ts
   * // 登出当前设备
   * await AuthService.logout();
   *
   * // 登出所有设备
   * await AuthService.logout(true);
   * ```
   */
  static async logout(allDevices: boolean = false): Promise<void> {
    try {
      // 获取 Refresh Token
      const refreshToken = TokenManager.getRefreshToken();

      // 构造请求
      const request: LogoutRequest = {
        refreshToken: refreshToken || undefined,
        allDevices,
      };

      // 调用后端登出接口
      await apiClient.post<LogoutResponse>('/auth/logout', request);

      console.log('✅ 登出成功');
    } catch (error) {
      console.error('⚠️ 登出请求失败（将继续清除本地状态）:', error);
      // 即使后端请求失败，也要清除本地 tokens
    } finally {
      // 清除本地 tokens
      TokenManager.clearTokens();
    }
  }

  /**
   * 获取当前用户信息
   * GET /auth/me
   *
   * @returns 用户信息或 null（未登录）
   *
   * @example
   * ```ts
   * const user = await AuthService.getCurrentUser();
   * if (user) {
   *   console.log('当前用户:', user.name);
   * } else {
   *   console.log('用户未登录');
   * }
   * ```
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      // 检查是否有 Token
      const accessToken = TokenManager.getAccessToken();
      if (!accessToken) {
        return null;
      }

      // 检查 Token 是否过期
      if (TokenManager.isTokenExpired()) {
        // 尝试刷新 Token
        try {
          await this.refreshToken();
        } catch {
          console.error('Token 刷新失败，用户需要重新登录');
          return null;
        }
      }

      // 调用后端获取用户信息
      const user = await apiClient.get<User>('/auth/me');

      return user;
    } catch {
      return null;
    }
  }

  /**
   * 检查是否已认证
   * @returns 是否已认证
   *
   * @example
   * ```ts
   * if (AuthService.isAuthenticated()) {
   *   // 用户已登录
   * } else {
   *   // 用户未登录，重定向到登录页
   *   router.push('/login');
   * }
   * ```
   */
  static isAuthenticated(): boolean {
    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) {
      return false;
    }

    // 检查 Token 是否过期
    return !TokenManager.isTokenExpired();
  }

  /**
   * 获取 Token 剩余有效时间（秒）
   * @returns 剩余秒数
   *
   * @example
   * ```ts
   * const remainingTime = AuthService.getTokenRemainingTime();
   * console.log(`Token 还有 ${remainingTime} 秒过期`);
   * ```
   */
  static getTokenRemainingTime(): number {
    return TokenManager.getTokenRemainingTime();
  }

  /**
   * 监听 Token 过期事件
   * @param callback - Token 过期时的回调函数
   * @returns 取消监听的函数
   */
  static onTokenExpired(callback: () => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    window.addEventListener('token-expired', callback);
    return () => window.removeEventListener('token-expired', callback);
  }
}
