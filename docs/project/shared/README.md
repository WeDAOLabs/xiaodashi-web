# @xiaodashi/shared

肖大师项目的共享类型定义包，为前端和后端提供统一的TypeScript类型定义。

## 📦 包含内容

### 🔐 认证相关类型 (`auth.ts`)
- `AuthToken` - JWT令牌信息
- `LoginRequest/LoginResponse` - 登录接口类型
- `RegisterRequest/RegisterResponse` - 注册接口类型
- `Permission/PermissionAction` - 权限系统类型
- `AuthContext` - 前端认证上下文类型

### 👤 用户相关类型 (`user.ts`)
- `User` - 用户基础信息
- `UserRole` - 用户角色枚举 (`user | premium | admin`)
- `UserStatus` - 用户状态枚举 (`active | inactive | suspended`)
- `UserProfile` - 用户档案信息
- `UserPreferences` - 用户偏好设置

### 🌐 API相关类型 (`api.types.ts`)
- `ApiResponse<T>` - 统一API响应格式
- `ApiErrorResponse` - 错误响应格式

## 🚀 使用方法

### 安装依赖

在项目的 `package.json` 中添加：

```json
{
  "dependencies": {
    "@xiaodashi/shared": "workspace:*"
  }
}
```

### 导入类型

#### 单个类型导入
```typescript
import { User, UserRole, LoginRequest } from '@xiaodashi/shared';
```

#### 批量导入
```typescript
import * as SharedTypes from '@xiaodashi/shared';
```

#### 按模块导入
```typescript
import type {
  // 用户相关
  User,
  UserProfile,
  UserRole,
  UserStatus,

  // 认证相关
  AuthToken,
  LoginRequest,
  LoginResponse,

  // API相关
  ApiResponse
} from '@xiaodashi/shared';
```

## 💡 使用示例

### 前端使用示例 (React/Next.js)

```typescript
import { User, LoginRequest, ApiResponse } from '@xiaodashi/shared';

// API调用
async function loginUser(credentials: LoginRequest): Promise<ApiResponse<User>> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

// 组件中使用
interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span>角色: {user.role}</span>
    </div>
  );
}
```

### 后端使用示例 (NestJS)

```typescript
import { User, CreateUserRequest, ApiResponse } from '@xiaodashi/shared';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  async createUser(@Body() userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const user = await this.usersService.create(userData);

    return {
      success: true,
      data: user,
      message: '用户创建成功',
      code: 201,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### TypeORM实体映射示例

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole, UserStatus } from '@xiaodashi/shared';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;
}
```

## 🔧 开发指南

### 添加新类型
1. 在相应的 `.ts` 文件中定义类型
2. 在 `types/index.ts` 中导出类型
3. 运行 `pnpm run build:shared` 构建包
4. 更新此文档的使用示例

### 修改现有类型
1. 修改类型定义
2. 检查所有使用该类型的地方
3. 更新相关的实体和接口
4. 重新构建和测试

### 构建命令
```bash
# 构建shared包
pnpm run build:shared

# 验证类型导出
pnpm --filter frontend-app build
pnpm --filter backend build
```

## 📁 项目结构

```
shared/
├── types/
│   ├── auth.ts          # 认证相关类型
│   ├── user.ts          # 用户相关类型
│   ├── api.types.ts     # API相关类型
│   └── index.ts         # 统一导出
├── dist/                # 构建产物
├── index.ts             # 包主入口
├── package.json
├── tsconfig.json
└── README.md           # 本文档
```

## 🏗️ 架构原则

### 类型优先设计
- shared包只包含类型定义，不包含实现逻辑
- 类型定义决定API接口契约
- 实体映射基于shared类型创建

### 单一数据源
- 所有项目使用相同的类型定义
- 避免类型定义重复和不一致
- 类型变更自动同步到所有使用方

### 版本化管理
- 使用workspace协议 (`workspace:*`)
- 类型变更需要考虑向后兼容性
- 重大变更需要版本升级

## 🚨 注意事项

1. **不要在shared包中包含实现逻辑**
2. **类型变更需要同步更新所有使用方**
3. **枚举值变更需要考虑数据库迁移**
4. **添加新字段时考虑可选性和默认值**
5. **定期清理不再使用的类型定义**

## 📝 更新日志

### v1.0.0
- ✅ 初始版本
- ✅ 用户认证系统类型定义
- ✅ API响应类型统一
- ✅ 权限控制类型支持