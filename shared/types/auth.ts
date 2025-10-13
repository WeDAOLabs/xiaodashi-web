/**
 * 认证系统相关类型定义
 * 包含JWT令牌、登录注册、权限控制等类型
 */

import { User, UserRole } from './user';
import type { DeviceInfo, SessionInfo } from './session';

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

// 认证用户信息（用于前后端共享）
export interface AuthenticatedUser {
  id: string;             // 用户ID（对应 JWT sub）
  email: string;
  name: string;
  role: UserRole;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;    // 是否记住登录状态
  captcha?: {             // 验证码信息（如需要）
    sessionId: string;
    code: string;
  };
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
  captcha?: {              // 验证码信息
    sessionId: string;
    code: string;
  };
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
  captcha?: {              // 验证码信息
    sessionId: string;
    code: string;
  };
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

// 重新导出会话相关类型（从session.ts导入，避免重复定义）
export type {
  DeviceInfo,
  SessionInfo,
  SessionListResponse,
  RevokeSessionRequest,
  RevokeSessionResponse
} from './session';

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

// === 账户锁定相关类型 ===

// 账户锁定状态
export interface AccountLockoutStatus {
  isLocked: boolean;              // 账户是否被锁定
  lockedUntil?: string;           // 锁定截止时间（ISO字符串）
  remainingAttempts: number;      // 剩余尝试次数（0表示已达到最高惩罚等级）
  currentAttempts: number;        // 当前失败次数
  lockoutDuration?: number;       // 锁定时长（分钟）
  lockReason?: string;            // 锁定原因
  nextLockThreshold?: number | null;  // 下次锁定阈值，null表示已达到最高惩罚等级
  nextLockDuration?: number;      // 下次锁定时长（分钟），0表示无更高等级
}

// 管理员解锁账户请求
export interface UnlockAccountRequest {
  userId: string;                 // 要解锁的用户ID
  reason: string;                 // 解锁原因
}

// 管理员解锁账户响应
export interface UnlockAccountResponse {
  success: boolean;               // 解锁是否成功
  message: string;                // 操作结果消息
  unlockedAt: string;             // 解锁时间（ISO字符串）
}

// 用户锁定状态查询响应
export interface LockStatusResponse {
  userId: string;                 // 用户ID
  email: string;                  // 用户邮箱
  status: AccountLockoutStatus;   // 锁定状态详情
}

// 登录失败锁定信息（用于错误响应）
export interface LoginLockoutError {
  code: 'ACCOUNT_LOCKED';         // 错误代码
  message: string;                // 错误消息
  lockoutStatus: AccountLockoutStatus; // 锁定状态详情
}

// 渐进式锁定策略配置
export interface ProgressiveLockoutConfig {
  levels: Array<{
    attempts: number;             // 失败尝试次数阈值
    duration: number;             // 锁定时长（分钟）
  }>;
  resetPeriod: number;            // 重置周期（小时）
}

// 管理员安全操作日志
export interface SecurityAuditLog {
  id: string;                     // 日志ID
  adminUserId: string;            // 管理员用户ID
  targetUserId: string;           // 目标用户ID
  action: 'UNLOCK_ACCOUNT' | 'VIEW_LOCK_STATUS'; // 操作类型
  reason?: string;                // 操作原因
  ipAddress: string;              // 操作IP地址
  userAgent: string;              // 用户代理
  timestamp: string;              // 操作时间（ISO字符串）
}

// === 后端适配类型 ===

// 后端认证请求基础接口（无框架依赖）
export interface AuthenticatedRequestBase {
  user: AuthenticatedUser;
}

// JWT 验证后的用户信息（用于 JWT Strategy）
export interface ValidatedJwtUser extends AuthenticatedUser {
  iat: number;
  exp: number;
  jti?: string;
}

// === 验证码相关类型 ===

// 验证码类型枚举
export enum CaptchaType {
  IMAGE = 'image',         // 图形验证码
  SLIDER = 'slider'       // 滑动验证码
}

// 验证码生成请求
export interface CaptchaGenerateRequest {
  type?: CaptchaType;      // 验证码类型，默认图形验证码
  complexity?: number;     // 复杂度 1-5，默认3
}

// 验证码生成响应
export interface CaptchaGenerateResponse {
  sessionId: string;       // 会话ID，用于验证时提交
  captchaImage?: string;   // Base64编码的图片（图形验证码）
  sliderData?: {           // 滑动验证数据
    backgroundImage: string; // 背景图Base64
    puzzlePiece: string;    // 拼图块Base64
    // 注意：为了安全考虑，不返回 xPosition
    // 前端应该通过用户拖拽行为来收集位置数据
    tolerance: number;      // 容差范围
  };
  expiresAt: string;       // 过期时间（ISO 8601格式）
}

// 验证码验证请求
export interface CaptchaVerifyRequest {
  sessionId: string;
  code: string;            // 用户输入的验证码或滑动位置
}

// 验证码验证响应
export interface CaptchaVerifyResponse {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
}

// 验证码必需检查响应
export interface CaptchaRequiredResponse {
  required: boolean;
  reason?: string;          // 需要验证码的详细原因
  riskScore?: number;        // 风险评分（0-100）
  sessionId?: string;      // 如果需要验证码，预生成会话ID
  requiredType?: CaptchaType;
}

// === 登录审计日志相关类型 ===

// 登录日志条目
export interface LoginLogEntry {
  id: string;                     // 日志ID
  userId?: string;                // 用户ID（登录失败时可能为空）
  email: string;                  // 尝试登录的邮箱
  ipAddress?: string;             // 登录IP地址
  userAgent?: string;             // 用户代理字符串
  location?: string;              // 地理位置
  success: boolean;               // 登录是否成功
  failureReason?: string;         // 失败原因
  createdAt: string;              // 登录时间（ISO字符串）
}

// 登录日志查询参数
export interface LoginLogQueryParams {
  userId?: string;                // 按用户ID筛选
  email?: string;                 // 按邮箱筛选
  success?: boolean;              // 按成功状态筛选
  ipAddress?: string;             // 按IP地址筛选
  startDate?: string;             // 开始日期（ISO字符串）
  endDate?: string;               // 结束日期（ISO字符串）
  page?: number;                  // 页码（默认1）
  pageSize?: number;              // 每页数量（默认20，最大100）
  sortBy?: 'createdAt' | 'email'; // 排序字段
  sortOrder?: 'ASC' | 'DESC';     // 排序顺序（默认DESC）
}

// 登录日志查询响应
export interface LoginLogQueryResponse {
  logs: LoginLogEntry[];          // 日志列表
  total: number;                  // 总记录数
  page: number;                   // 当前页码
  pageSize: number;               // 每页数量
  totalPages: number;             // 总页数
}

// 登录异常类型枚举
export enum LoginAnomalyType {
  IP_CHANGE = 'ip_change',              // IP地址突变
  LOCATION_JUMP = 'location_jump',      // 地理位置跳变
  TIME_ANOMALY = 'time_anomaly',        // 异常时间登录
  HIGH_FREQUENCY = 'high_frequency',    // 高频登录尝试
  BRUTE_FORCE = 'brute_force',          // 疑似暴力破解
  DEVICE_CHANGE = 'device_change',      // 设备变更
}

// 登录异常详情
export interface LoginAnomaly {
  type: LoginAnomalyType;         // 异常类型
  severity: 'low' | 'medium' | 'high' | 'critical'; // 严重程度
  userId?: string;                // 相关用户ID
  email: string;                  // 相关邮箱
  description: string;            // 异常描述
  detectedAt: string;             // 检测时间（ISO字符串）
  relatedLogs: string[];          // 相关日志ID列表
  riskScore: number;              // 风险评分（0-100）
  metadata?: Record<string, unknown>; // 额外元数据
}

// 登录异常报告
export interface LoginAnomalyReport {
  anomalies: LoginAnomaly[];      // 异常列表
  total: number;                  // 异常总数
  criticalCount: number;          // 严重异常数量
  highCount: number;              // 高风险异常数量
  mediumCount: number;            // 中风险异常数量
  lowCount: number;               // 低风险异常数量
  generatedAt: string;            // 报告生成时间（ISO字符串）
  timeRange: {
    startDate: string;            // 分析开始时间
    endDate: string;              // 分析结束时间
  };
}

// 登录统计信息
export interface LoginStatistics {
  totalAttempts: number;          // 总登录尝试次数
  successfulLogins: number;       // 成功登录次数
  failedLogins: number;           // 失败登录次数
  successRate: number;            // 成功率（百分比）
  uniqueUsers: number;            // 唯一用户数
  uniqueIPs: number;              // 唯一IP数
  topFailureReasons: Array<{
    reason: string;
    count: number;
  }>;                             // 失败原因统计
  hourlyDistribution: Array<{
    hour: number;                 // 小时（0-23）
    count: number;                // 登录次数
  }>;                             // 按小时分布
  dailyDistribution: Array<{
    date: string;                 // 日期（ISO字符串）
    attempts: number;             // 尝试次数
    successes: number;            // 成功次数
  }>;                             // 按日分布
}

// 安全审计报告
export interface LoginSecurityReport {
  summary: {
    totalLogs: number;            // 总日志数
    dateRange: {
      startDate: string;
      endDate: string;
    };
    generatedAt: string;          // 报告生成时间
  };
  statistics: LoginStatistics;    // 登录统计
  anomalies: LoginAnomalyReport;  // 异常报告
  topRiskUsers: Array<{
    userId: string;
    email: string;
    riskScore: number;
    anomalyCount: number;
  }>;                             // 高风险用户列表
  topRiskIPs: Array<{
    ipAddress: string;
    attemptCount: number;
    failureCount: number;
    riskScore: number;
  }>;                             // 高风险IP列表
  recommendations: string[];      // 安全建议
}

// 用户登录模式分析
export interface UserLoginPattern {
  userId: string;
  email: string;
  analysisData: {
    commonLoginHours: number[];   // 常用登录时间（小时）
    commonIPs: string[];          // 常用IP地址
    commonLocations: string[];    // 常用登录地点
    averageLoginFrequency: number; // 平均登录频率（次/天）
    lastLoginAt?: string;         // 最后登录时间
    deviceTypes: string[];        // 使用的设备类型
  };
  anomalyIndicators: {
    hasUnusualIPActivity: boolean;    // 存在异常IP活动
    hasUnusualTimeActivity: boolean;  // 存在异常时间活动
    hasUnusualLocationActivity: boolean; // 存在异常地点活动
    recentFailureRate: number;    // 近期失败率
  };
  riskAssessment: {
    overallRiskScore: number;     // 总体风险评分（0-100）
    riskLevel: 'low' | 'medium' | 'high' | 'critical'; // 风险等级
    riskFactors: string[];        // 风险因素列表
  };
}

// 登录模式分析响应
export interface LoginPatternAnalysisResponse {
  pattern: UserLoginPattern;
  recommendations: string[];      // 针对该用户的安全建议
}