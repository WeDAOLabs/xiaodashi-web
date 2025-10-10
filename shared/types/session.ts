/**
 * 会话管理相关类型定义
 * 包含用户会话、设备信息、会话管理等核心类型
 */

// 设备类型枚举
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

// 设备信息接口（扩展auth.ts中的DeviceInfo）
export interface DeviceInfo {
  deviceId?: string;           // 设备唯一标识（前端生成并持久化）
  deviceName?: string;         // 设备名称（如"iPhone 15 Pro"）
  deviceType: DeviceType;      // 设备类型
  os?: string;                 // 操作系统（如"iOS 17.1"）
  browser?: string;            // 浏览器（如"Safari 17.0"）
  location?: string;           // 地理位置（如"北京市 朝阳区"）
}

// 用户会话信息（对应UserSession实体）
export interface UserSession {
  id: string;                  // 会话唯一标识符
  userId: string;              // 用户ID
  deviceId?: string;           // 设备ID
  deviceName?: string;         // 设备名称
  deviceType?: DeviceType;     // 设备类型
  ipAddress?: string;          // IP地址
  userAgent?: string;          // User-Agent字符串
  location?: string;           // 地理位置
  isActive: boolean;           // 是否处于活跃状态
  expiresAt: string;           // 过期时间（ISO 8601格式）
  createdAt: string;           // 创建时间
  lastActiveAt: string;        // 最后活跃时间
}

// SessionInfo 别名（为了向后兼容auth.ts中的引用）
export type SessionInfo = UserSession;

// 创建会话请求
export interface CreateSessionRequest {
  userId: string;
  deviceInfo: DeviceInfo;
  refreshToken: string;        // Refresh token用于哈希存储
  ipAddress?: string;
  userAgent?: string;
  expiresIn?: number;          // 过期时间（秒），默认7天
}

// 创建会话响应
export interface CreateSessionResponse {
  session: UserSession;
  message: string;
}

// 会话列表响应
export interface SessionListResponse {
  sessions: UserSession[];
  currentSessionId?: string;   // 当前会话ID
  total: number;
  activeCount: number;         // 活跃会话数量
}

// 撤销会话请求
export interface RevokeSessionRequest {
  sessionId: string;
}

// 撤销会话响应
export interface RevokeSessionResponse {
  message: string;
  success: boolean;
  revokedSessionId: string;
}

// 撤销所有会话请求
export interface RevokeAllSessionsRequest {
  exceptCurrentSession?: boolean; // 是否保留当前会话
}

// 撤销所有会话响应
export interface RevokeAllSessionsResponse {
  message: string;
  success: boolean;
  revokedCount: number;        // 撤销的会话数量
}

// 更新会话活跃度请求
export interface UpdateSessionActivityRequest {
  sessionId: string;
}

// 更新会话活跃度响应
export interface UpdateSessionActivityResponse {
  message: string;
  success: boolean;
  lastActiveAt: string;
}

// 可疑登录警告
export interface SuspiciousLoginWarning {
  type: 'new_device' | 'new_location' | 'unusual_time';
  message: string;
  deviceInfo: DeviceInfo;
  previousLocation?: string;
  currentLocation?: string;
  timestamp: string;
}

// 设备限制信息
export interface DeviceLimitInfo {
  currentDeviceCount: number;
  maxDeviceCount: number;
  isLimitReached: boolean;
  oldestSession?: UserSession; // 如果达到限制，返回将被移除的最旧会话
}
