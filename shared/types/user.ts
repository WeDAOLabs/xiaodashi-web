/**
 * 用户相关类型定义
 * 定义用户实体、状态和角色等核心类型
 */

// 用户角色枚举 - 三级权限体系
export enum UserRole {
  USER = 'user',           // 普通用户
  PREMIUM = 'premium',     // 付费用户
  ADMIN = 'admin'          // 管理员
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',       // 激活状态
  INACTIVE = 'inactive',   // 未激活
  SUSPENDED = 'suspended'  // 已暂停
}

// 用户基础信息接口（不含敏感信息）
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;       // ISO 8601 格式
  updatedAt: string;       // ISO 8601 格式
  lastLoginAt?: string;    // 最后登录时间
}

// 用户档案信息（包含额外的个人信息）
export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  company?: string;
  position?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// 用户偏好设置
export interface UserPreferences {
  language: string;        // 语言偏好 'zh-CN' | 'en-US'
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  timezone: string;        // 时区设置
}

// 创建用户请求（注册时使用）
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;        // 前端传递，后端需要哈希处理
  role?: UserRole;         // 可选，默认为 USER
  profile?: Partial<Pick<UserProfile, 'phone' | 'company' | 'position'>>;
}

// 更新用户信息请求
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  status?: UserStatus;     // 仅管理员可修改
  role?: UserRole;         // 仅管理员可修改
}

// 更新用户档案请求
export interface UpdateUserProfileRequest {
  phone?: string;
  company?: string;
  position?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences?: Partial<UserPreferences>;
}

// 用户查询过滤条件
export interface UserQueryFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;         // 搜索邮箱或姓名
  createdAfter?: string;   // 创建时间筛选
  createdBefore?: string;
  lastLoginAfter?: string; // 最后登录时间筛选
  lastLoginBefore?: string;
}

// 用户列表响应（用于管理后台）
export interface UserListItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// 分页查询用户响应
export interface UsersListResponse {
  users: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}