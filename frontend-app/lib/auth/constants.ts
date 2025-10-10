/**
 * 认证系统常量配置
 */

/**
 * Storage Keys
 * 本地存储使用的键名
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
  REMEMBER_ME: 'rememberMe',
  USER: 'user',
} as const;

/**
 * API Endpoints
 * 认证相关的 API 端点路径
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

/**
 * Routes
 * 路由路径常量
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

/**
 * Token 配置
 */
export const TOKEN_CONFIG = {
  /** Token 刷新提前时间（秒） - 过期前多久开始刷新 */
  REFRESH_BEFORE_EXPIRY: 300, // 5 分钟

  /** Token 刷新重试次数 */
  REFRESH_RETRY_COUNT: 3,

  /** Token 刷新重试延迟（毫秒） - 指数退避 */
  REFRESH_RETRY_DELAYS: [1000, 2000, 4000], // 1s, 2s, 4s
} as const;

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  LOGIN_FAILED: '登录失败，请检查用户名和密码',
  LOGOUT_FAILED: '登出失败，请稍后重试',
  TOKEN_EXPIRED: '登录已过期，请重新登录',
  TOKEN_REFRESH_FAILED: 'Token 刷新失败，请重新登录',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '权限不足，无法访问',
  NETWORK_ERROR: '网络错误，请检查网络连接',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
} as const;
