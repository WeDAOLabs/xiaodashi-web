/**
 * 安全域相关类型定义
 * 包含IP黑名单、白名单、频率限制、访问日志等
 */

// ==================== 枚举类型 ====================

/**
 * IP类型枚举
 */
export enum IPType {
  SINGLE = 'single', // 单个IP
  RANGE = 'range', // IP段（CIDR格式）
}

/**
 * 威胁严重程度枚举
 */
export enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * IP风险等级枚举
 */
export enum IPRiskLevel {
  SAFE = 'safe',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// ==================== IP黑名单相关 ====================

/**
 * IP黑名单条目
 */
export interface IPBlacklistEntry {
  id: string;
  ipAddress: string;
  type: IPType;
  reason: string;
  severity: ThreatSeverity;
  isActive: boolean;
  expiresAt?: string;
  blockedAt: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 添加IP黑名单请求
 */
export interface AddIPBlacklistRequest {
  ipAddress: string;
  type: IPType;
  reason: string;
  severity: ThreatSeverity;
  duration?: number; // 封禁时长（分钟），null表示永久
  metadata?: Record<string, unknown>;
}

/**
 * 更新IP黑名单请求
 */
export interface UpdateIPBlacklistRequest {
  reason?: string;
  severity?: ThreatSeverity;
  isActive?: boolean;
  duration?: number;
}

// ==================== IP白名单相关 ====================

/**
 * IP白名单条目
 */
export interface IPWhitelistEntry {
  id: string;
  ipAddress: string;
  type: IPType;
  description: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 添加IP白名单请求
 */
export interface AddIPWhitelistRequest {
  ipAddress: string;
  type: IPType;
  description: string;
}

/**
 * 更新IP白名单请求
 */
export interface UpdateIPWhitelistRequest {
  description?: string;
  isActive?: boolean;
}

// ==================== IP地理位置相关 ====================

/**
 * IP地理位置信息
 */
export interface IPGeolocation {
  country: string;
  city: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

// ==================== IP统计信息 ====================

/**
 * IP统计信息
 */
export interface IPStatistics {
  totalRequests: number;
  failedLogins: number;
  successfulLogins: number;
  blockedRequests: number;
  lastAccessAt: string;
  firstAccessAt: string;
}

// ==================== IP风险评估相关 ====================

/**
 * IP风险报告
 */
export interface IPRiskReport {
  ipAddress: string;
  riskScore: number; // 0-100
  riskLevel: IPRiskLevel;
  riskFactors: string[]; // 风险因素列表
  isBlacklisted: boolean;
  isWhitelisted: boolean;
  geolocation?: IPGeolocation;
  statistics: IPStatistics;
  recommendation: 'allow' | 'monitor' | 'captcha' | 'block';
  assessedAt: string;
}

// ==================== IP频率限制相关 ====================

/**
 * IP频率限制状态
 */
export interface IPRateLimitStatus {
  ipAddress: string;
  action: string; // 限流动作类型：login, register, api, captcha
  isLimited: boolean;
  requestsInWindow: number;
  maxRequests: number;
  windowStartAt: string;
  windowEndAt: string;
  blockedUntil?: string;
  resetAt: string;
}

// ==================== IP检查相关 ====================

/**
 * IP检查响应
 */
export interface IPCheckResponse {
  allowed: boolean;
  reason?: string;
  riskScore: number;
  isBlacklisted: boolean;
  isRateLimited: boolean;
  rateLimitStatus?: IPRateLimitStatus;
  requiresCaptcha: boolean;
}

// ==================== IP黑名单查询相关 ====================

/**
 * IP黑名单查询参数
 */
export interface IPBlacklistQueryParams {
  ipAddress?: string;
  severity?: ThreatSeverity;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'blockedAt' | 'severity' | 'expiresAt';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * IP黑名单查询响应
 */
export interface IPBlacklistQueryResponse {
  items: IPBlacklistEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * IP白名单查询参数
 */
export interface IPWhitelistQueryParams {
  ipAddress?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * IP白名单查询响应
 */
export interface IPWhitelistQueryResponse {
  items: IPWhitelistEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== IP访问日志相关 ====================

/**
 * IP访问日志条目
 */
export interface IPAccessLogEntry {
  id: string;
  ipAddress: string;
  endpoint: string;
  method: string;
  statusCode: number;
  userAgent?: string;
  userId?: string;
  riskScore: number;
  blocked: boolean;
  blockReason?: string;
  location?: string;
  createdAt: string;
}

/**
 * IP访问日志查询参数
 */
export interface IPAccessLogQueryParams {
  ipAddress?: string;
  userId?: string;
  endpoint?: string;
  blocked?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'riskScore';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * IP访问日志查询响应
 */
export interface IPAccessLogQueryResponse {
  logs: IPAccessLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== 管理员操作相关 ====================

/**
 * 删除IP黑名单响应
 */
export interface RemoveIPBlacklistResponse {
  success: boolean;
  message: string;
}

/**
 * 删除IP白名单响应
 */
export interface RemoveIPWhitelistResponse {
  success: boolean;
  message: string;
}

/**
 * 批量操作请求
 */
export interface BulkIPOperationRequest {
  ipAddresses: string[];
  action: 'block' | 'unblock' | 'whitelist' | 'remove_whitelist';
  reason?: string;
  severity?: ThreatSeverity;
}

/**
 * 批量操作响应
 */
export interface BulkIPOperationResponse {
  success: boolean;
  message: string;
  successCount: number;
  failedCount: number;
  errors?: Array<{
    ipAddress: string;
    error: string;
  }>;
}

// ==================== IP安全配置相关 ====================

/**
 * IP安全配置
 */
export interface IPSecurityConfig {
  blacklist: {
    enabled: boolean;
    autoBlock: boolean;
    autoBlockThreshold: number; // 风险分数阈值
    defaultBlockDuration: number; // 默认封禁时长（分钟）
  };
  rateLimit: {
    login: {
      windowMs: number;
      maxRequests: number;
    };
    register: {
      windowMs: number;
      maxRequests: number;
    };
    api: {
      windowMs: number;
      maxRequests: number;
    };
  };
  geolocation: {
    enabled: boolean;
    anomalyDetection: boolean;
  };
}
