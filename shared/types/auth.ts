/**
 * 认证系统相关类型定义
 * 包含JWT令牌、登录注册、权限控制等类型
 */

import { User, UserRole } from './user';

// JWT令牌信息
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;       // 过期时间（秒）
  tokenType: string;       // 通常为 'Bearer'
  issuedAt: number;        // 签发时间戳
}

// JWT载荷信息（解码后的内容）
export interface JWTPayload {
  sub: string;             // 用户ID
  email: string;
  name: string;
  role: UserRole;
  iat: number;             // 签发时间
  exp: number;             // 过期时间
  jti?: string;            // JWT ID，用于撤销令牌
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;    // 是否记住登录状态
  captcha?: string;        // 验证码（如需要）
}

// 登录响应
export interface LoginResponse {
  user: User;
  tokens: AuthToken;
  firstLogin: boolean;     // 是否首次登录
}

// 注册请求
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;   // 是否同意服务条款
  inviteCode?: string;     // 邀请码（如有）
  captcha?: string;        // 验证码
}

// 注册响应
export interface RegisterResponse {
  user: User;
  tokens: AuthToken;
  needEmailVerification: boolean; // 是否需要邮箱验证
}

// 刷新令牌请求
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 刷新令牌响应
export interface RefreshTokenResponse {
  tokens: AuthToken;
}

// 忘记密码请求
export interface ForgotPasswordRequest {
  email: string;
  captcha?: string;
}

// 忘记密码响应
export interface ForgotPasswordResponse {
  message: string;
  resetTokenSent: boolean;
}

// 重置密码请求
export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

// 重置密码响应
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

// 修改密码请求
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 修改密码响应
export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

// 邮箱验证请求
export interface VerifyEmailRequest {
  verificationToken: string;
}

// 邮箱验证响应
export interface VerifyEmailResponse {
  message: string;
  success: boolean;
  user: User;
}

// 权限定义
export interface Permission {
  id: string;
  name: string;            // 权限名称，如 'user:read', 'user:write'
  resource: string;        // 资源类型，如 'user', 'order', 'product'
  action: PermissionAction; // 操作类型
  description: string;     // 权限描述
}

// 权限操作枚举
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'        // 完全管理权限
}

// 角色权限配置
export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// 权限检查请求
export interface CheckPermissionRequest {
  userId: string;
  resource: string;
  action: PermissionAction;
}

// 权限检查响应
export interface CheckPermissionResponse {
  hasPermission: boolean;
  reason?: string;         // 如果无权限，说明原因
}

// 登出请求
export interface LogoutRequest {
  refreshToken?: string;   // 可选，用于撤销刷新令牌
  allDevices?: boolean;    // 是否登出所有设备
}

// 登出响应
export interface LogoutResponse {
  message: string;
  success: boolean;
}

// 会话信息
export interface SessionInfo {
  sessionId: string;
  userId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  isActive: boolean;
}

// 设备信息
export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  os: string;
  browser: string;
  location?: string;       // 大概的地理位置
}

// 获取会话列表响应
export interface SessionListResponse {
  sessions: SessionInfo[];
  currentSessionId: string;
}

// 撤销会话请求
export interface RevokeSessionRequest {
  sessionId: string;
}

// 撤销会话响应
export interface RevokeSessionResponse {
  message: string;
  success: boolean;
}

// 认证上下文（前端使用）
export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
  hasPermission: (resource: string, action: PermissionAction) => boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: (allDevices?: boolean) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User>;
}