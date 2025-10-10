/**
 * 前端认证类型定义
 * 优先使用 @xiaodashi/shared 中的类型，只定义前端特有的扩展类型
 */

// 从 shared 包导入核心类型
export type {
  User,
  LoginRequest,
  LoginResponse,
  AuthToken,
  RefreshTokenRequest,
  RefreshTokenResponse,
  Permission,
  PermissionAction,
  UserSession,
  UserRole,
} from '@xiaodashi/shared';

// 前端认证上下文类型
export interface AuthContextType {
  /** 当前用户信息 */
  user: import('@xiaodashi/shared').User | null;

  /** 是否正在加载 */
  isLoading: boolean;

  /** 是否已认证 */
  isAuthenticated: boolean;

  /** 用户权限列表 */
  permissions: import('@xiaodashi/shared').Permission[];

  /** 用户会话信息 */
  sessionInfo: import('@xiaodashi/shared').UserSession | null;

  /**
   * 登录方法
   * @param credentials - 登录凭证
   * @returns Promise<boolean> - 登录是否成功
   */
  login: (credentials: import('@xiaodashi/shared').LoginRequest) => Promise<boolean>;

  /**
   * 登出方法
   * @param allDevices - 是否登出所有设备
   * @returns Promise<void>
   */
  logout: (allDevices?: boolean) => Promise<void>;

  /**
   * 手动刷新 Token
   * @returns Promise<void>
   */
  refreshSession: () => Promise<void>;

  /**
   * 检查用户是否拥有特定权限
   * @param resource - 资源名称
   * @param action - 操作类型
   * @returns boolean - 是否有权限
   */
  hasPermission: (
    resource: string,
    action: import('@xiaodashi/shared').PermissionAction
  ) => boolean;
}

/**
 * 认证错误类型
 */
export enum AuthErrorType {
  /** 登录失败 */
  LOGIN_FAILED = 'LOGIN_FAILED',
  /** Token 过期 */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  /** Token 刷新失败 */
  REFRESH_FAILED = 'REFRESH_FAILED',
  /** 未授权 */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** 权限不足 */
  FORBIDDEN = 'FORBIDDEN',
  /** 网络错误 */
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * 认证错误接口
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  code?: number;
}
