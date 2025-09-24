/**
 * 类型使用示例
 * 演示如何在不同场景中使用shared类型
 */

import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
  UserStatus
} from '../types';

// ===== 前端使用示例 =====

// 1. API调用类型定义
async function login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  // 模拟API调用
  const response: ApiResponse<LoginResponse> = {
    success: true,
    data: {
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: credentials.email,
        name: 'Test User',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        createdAt: '2025-09-24T00:00:00Z',
        updatedAt: '2025-09-24T00:00:00Z',
      },
      tokens: {
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
        issuedAt: Date.now(),
      },
      firstLogin: false,
    },
    message: '登录成功',
    code: 200,
    timestamp: '2025-09-24T00:00:00Z',
  };

  return response;
}

// 2. 组件Props类型定义
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

function UserCard({ user, onEdit }: UserCardProps) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    canEdit: user.role !== UserRole.ADMIN,
  };
}

// ===== 后端使用示例 =====

// 1. API响应构造
function createSuccessResponse<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    code: 200,
    timestamp: new Date().toISOString(),
  };
}

// 2. 用户数据处理
function sanitizeUser(user: User & { passwordHash?: string }): User {
  // 移除敏感信息，返回安全的用户对象
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// 3. 权限检查
function hasPermission(user: User, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 1,
    [UserRole.PREMIUM]: 2,
    [UserRole.ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// ===== TypeORM实体映射示例 =====

// 实体到类型的转换
function entityToUser(userEntity: any): User {
  return {
    id: userEntity.id,
    email: userEntity.email,
    name: userEntity.name,
    role: userEntity.role,
    status: userEntity.status,
    avatar: userEntity.avatar,
    lastLoginAt: userEntity.lastLoginAt?.toISOString(),
    createdAt: userEntity.createdAt.toISOString(),
    updatedAt: userEntity.updatedAt.toISOString(),
  };
}

// ===== 验证函数 =====

// 类型守卫
function isValidUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    Object.values(UserRole).includes(obj.role) &&
    Object.values(UserStatus).includes(obj.status)
  );
}

// 导出示例
export {
  createSuccessResponse, entityToUser, hasPermission, isValidUser, login, sanitizeUser, UserCard
};

// 类型导出（用于其他模块）
export type { UserCardProps };

console.log('✅ 所有类型使用示例编译成功！');
console.log('📦 shared类型可以在前端、后端和TypeORM中正常使用');