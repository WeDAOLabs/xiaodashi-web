/**
 * Token 管理器
 *
 * 负责 JWT Token 的存储、读取、过期检测和自动刷新
 * ⚠️ 仅在客户端使用
 */

'use client';

import { publicConfig } from '@/lib/config';
import type { AuthToken } from '@xiaodashi/shared';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
  REMEMBER_ME: 'rememberMe',
} as const;

// Token 刷新状态
let refreshPromise: Promise<void> | null = null;
let refreshTimer: NodeJS.Timeout | null = null;

/**
 * Token 管理器类
 */
export class TokenManager {
  /**
   * 存储 Token
   * @param tokens - AuthToken 对象
   * @param rememberMe - 是否记住登录状态
   */
  static storeTokens(tokens: AuthToken, rememberMe: boolean = false): void {
    if (typeof window === 'undefined') {
      return;
    }

    // 计算 Token 过期时间戳（毫秒）
    const expiresAt = Date.now() + tokens.expiresIn * 1000;

    // 选择存储方式
    const storage = rememberMe ? localStorage : sessionStorage;

    // 存储 tokens 到 localStorage/sessionStorage
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    storage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt.toString());

    // 存储 rememberMe 标记
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }

    // 同时设置 HTTP Cookie，供 Next.js Middleware 使用
    this.setTokenCookies(tokens, rememberMe);
  }

  /**
   * 设置 Token 到 HTTP Cookie
   * 供 Next.js Middleware 在服务端验证使用
   *
   * @param tokens - AuthToken 对象
   * @param rememberMe - 是否记住登录状态
   */
  private static setTokenCookies(tokens: AuthToken, rememberMe: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Access Token Cookie 配置
    const accessTokenMaxAge = tokens.expiresIn; // 秒
    const accessTokenCookie = [
      `accessToken=${tokens.accessToken}`,
      'path=/',
      `max-age=${accessTokenMaxAge}`,
      'SameSite=Strict',
      // 生产环境启用 Secure (仅 HTTPS)
      ...(window.location.protocol === 'https:' ? ['Secure'] : []),
    ].join('; ');

    // Refresh Token Cookie 配置
    // 如果 rememberMe，使用 7 天；否则使用 Session Cookie
    const refreshTokenMaxAge = rememberMe ? 7 * 24 * 60 * 60 : undefined; // 7天 或 session
    const refreshTokenCookie = [
      `refreshToken=${tokens.refreshToken}`,
      'path=/',
      ...(refreshTokenMaxAge ? [`max-age=${refreshTokenMaxAge}`] : []),
      'SameSite=Strict',
      ...(window.location.protocol === 'https:' ? ['Secure'] : []),
    ].join('; ');

    // 设置 Cookies
    document.cookie = accessTokenCookie;
    document.cookie = refreshTokenCookie;

    console.log('🍪 Token Cookies 已设置');
  }

  /**
   * 获取 Access Token
   * @returns Access Token 或 null
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // 优先从 localStorage 获取（rememberMe 用户）
    let token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      return token;
    }

    // 其次从 sessionStorage 获取
    token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token;
  }

  /**
   * 获取 Refresh Token
   * @returns Refresh Token 或 null
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // 优先从 localStorage 获取
    let token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (token) {
      return token;
    }

    // 其次从 sessionStorage 获取
    token = sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return token;
  }

  /**
   * 清除所有 Token
   */
  static clearTokens(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // 取消自动刷新定时器
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    // 清除 Promise
    refreshPromise = null;

    // 清除 localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

    // 清除 sessionStorage
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);

    // 清除 HTTP Cookies
    this.clearTokenCookies();
  }

  /**
   * 清除 Token Cookies
   */
  private static clearTokenCookies(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // 设置过期的 Cookie 来删除它们
    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';

    console.log('🍪 Token Cookies 已清除');
  }

  /**
   * 检查 Token 是否过期
   * @returns 是否过期
   */
  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') {
      return true;
    }

    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return true;
    }

    // 从存储中读取过期时间
    const expiresAtStr =
      localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT) ||
      sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);

    if (!expiresAtStr) {
      return true;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const now = Date.now();

    return now >= expiresAt;
  }

  /**
   * 获取 Token 剩余有效时间（秒）
   * @returns 剩余秒数，如果已过期或不存在则返回 0
   */
  static getTokenRemainingTime(): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    const expiresAtStr =
      localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT) ||
      sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);

    if (!expiresAtStr) {
      return 0;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const now = Date.now();
    const remainingMs = expiresAt - now;

    return remainingMs > 0 ? Math.floor(remainingMs / 1000) : 0;
  }

  /**
   * 调度 Token 自动刷新
   * @param expiresIn - Token 有效期（秒）
   */
  static scheduleTokenRefresh(expiresIn: number): void {
    if (typeof window === 'undefined') {
      return;
    }

    // 取消之前的定时器
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    // 计算刷新时间
    // 在 Token 过期前 N 秒开始刷新（默认 5 分钟）
    const refreshBeforeExpiry = publicConfig.tokenRefreshBeforeExpiry;
    const refreshInSeconds = Math.max(expiresIn - refreshBeforeExpiry, 10); // 最少 10 秒后刷新

    console.log(
      `🔄 Token 将在 ${refreshInSeconds} 秒后自动刷新（过期前 ${refreshBeforeExpiry} 秒）`
    );

    // 设置定时器
    refreshTimer = setTimeout(() => {
      this.refreshTokenIfNeeded();
    }, refreshInSeconds * 1000);
  }

  /**
   * 如果需要，刷新 Token（内部方法）
   * 使用 Promise 去重，确保同一时间只有一个刷新请求
   */
  private static async refreshTokenIfNeeded(): Promise<void> {
    // 如果已经有刷新请求在进行中，直接返回该 Promise
    if (refreshPromise) {
      return refreshPromise;
    }

    // 创建新的刷新 Promise
    refreshPromise = (async () => {
      try {
        // 动态导入 AuthService 避免循环依赖
        const { AuthService } = await import('./authService');

        console.log('🔄 开始刷新 Token...');
        await AuthService.refreshToken();
        console.log('✅ Token 刷新成功');
      } catch (error) {
        console.error('❌ Token 刷新失败:', error);
        // Token 刷新失败，清除 tokens 并重定向到登录页
        this.clearTokens();

        // 触发全局事件，通知应用 Token 失效
        window.dispatchEvent(new Event('token-expired'));

        // 重定向到登录页（保存当前路径）
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      } finally {
        // 清除 Promise 引用
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  /**
   * 手动触发 Token 刷新
   * @returns Promise<void>
   */
  static async manualRefresh(): Promise<void> {
    return this.refreshTokenIfNeeded();
  }

  /**
   * 解码 JWT Token（客户端，不验证签名）
   * ⚠️ 注意：仅用于读取 payload，不验证 Token 有效性
   * @param token - JWT Token 字符串
   * @returns Payload 对象或 null
   */
  static decodeToken<T = Record<string, unknown>>(token: string): T | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // 解码 payload（Base64URL）
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded as T;
    } catch (error) {
      console.error('Token 解码失败:', error);
      return null;
    }
  }
}
