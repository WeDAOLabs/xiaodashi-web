# 数据库实体新增指南

本文档详细说明在当前按业务域组织的架构下，如何新增数据库表和实体。

## 📋 目录

- [架构概述](#架构概述)
- [新增表的完整步骤](#新增表的完整步骤)
- [创建新业务域](#创建新业务域)
- [核心要点和最佳实践](#核心要点和最佳实践)
- [常见问题解答](#常见问题解答)

## 🏗️ 架构概述

当前项目采用按业务域组织的数据库实体架构：

```
backend/src/database/entities/
├── user/                   # 用户域
│   ├── user.entity.ts
│   ├── user-profile.entity.ts
│   ├── user-session.entity.ts
│   ├── user-login-log.entity.ts
│   └── index.ts            # 域导出文件
├── auth/                   # 认证域
│   ├── permission.entity.ts
│   ├── role-permission.entity.ts
│   └── index.ts            # 域导出文件
└── index.ts                # 主导出文件
```

### 业务域划分标准

- **user/**: 用户相关数据（基础信息、档案、会话、日志等）
- **auth/**: 认证授权相关（权限、角色等）
- **未来扩展**: business/, analytics/ 等

## 🚀 新增表的完整步骤

### 步骤1: 确定业务域

**判断标准**：
- 用户相关数据 → `user/`
- 权限相关数据 → `auth/`
- 全新业务逻辑 → 创建新域

### 步骤2: 创建实体文件

以创建**用户通知表**为例：

```typescript
// backend/src/database/entities/user/user-notification.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_notifications')
export class UserNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'unread'
  })
  status: 'unread' | 'read' | 'archived';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### 步骤3: 更新域导出文件

```typescript
// backend/src/database/entities/user/index.ts
// 添加导入
import { UserNotification } from './user-notification.entity';

// 添加导出
export { UserNotification } from './user-notification.entity';

// 更新实体数组
export const userEntities = [
  User,
  UserProfile,
  UserSession,
  UserLoginLog,
  UserNotification, // 新增
];
```

### 步骤4: 更新主导出文件

```typescript
// backend/src/database/entities/index.ts
// 更新导入
import {
  User,
  UserProfile,
  UserSession,
  UserLoginLog,
  UserNotification, // 新增
  userEntities
} from './user';

// 更新导出
export {
  User,
  UserProfile,
  UserSession,
  UserLoginLog,
  UserNotification, // 新增
  Permission,
  RolePermission
};

// 更新实体数组
export const entities = [
  User,
  UserProfile,
  Permission,
  RolePermission,
  UserSession,
  UserLoginLog,
  UserNotification, // 新增
];
```

### 步骤5: 添加共享类型

```typescript
// shared/types/user.ts
// 新增通知相关类型
export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  content: string;
}

export interface UpdateNotificationRequest {
  status?: 'unread' | 'read' | 'archived';
}
```

### 步骤6: 生成并运行 Migration

```bash
# 1. 生成 migration
pnpm --filter backend run migration:generate -- src/database/migrations/AddUserNotifications

# 2. 查看生成的 migration 文件
# backend/src/database/migrations/[timestamp]-AddUserNotifications.ts

# 3. 运行 migration
pnpm --filter backend run migration:run

# 4. 验证结果
pnpm --filter backend run migration:show
```

### 步骤7: 验证和测试

```bash
# 1. 后端构建检查
pnpm --filter backend build

# 2. 共享包构建
pnpm -w run build:shared

# 3. 前端类型检查
pnpm --filter frontend-app build

# 4. 代码质量检查
pnpm --filter backend run lint
```

## 🆕 创建新业务域

当需要创建全新业务域（如订单管理）时：

### 1. 创建新域目录

```bash
mkdir -p backend/src/database/entities/business
```

### 2. 创建实体文件

```typescript
// backend/src/database/entities/business/order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  orderNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

### 3. 创建域导出文件

```typescript
// backend/src/database/entities/business/index.ts
import { Order } from './order.entity';
// import { Product } from './product.entity'; // 其他实体

// 导出实体
export { Order } from './order.entity';
// export { Product } from './product.entity';

// 业务域实体数组
export const businessEntities = [
  Order,
  // Product,
];
```

### 4. 更新 TypeORM 配置

```typescript
// backend/typeorm.config.ts
entities: [
  'src/database/entities/user/*.entity{.ts,.js}',
  'src/database/entities/auth/*.entity{.ts,.js}',
  'src/database/entities/business/*.entity{.ts,.js}', // 新增
  // 未来可以继续添加其他域
],
```

### 5. 更新主导出文件

```typescript
// backend/src/database/entities/index.ts
// 导入新域
import { Order, businessEntities } from './business';

// 导出新实体
export { Order };

// 更新实体数组
export const entities = [
  User,
  UserProfile,
  Permission,
  RolePermission,
  UserSession,
  UserLoginLog,
  Order, // 新增
];

// 新增域实体配置
export const BusinessDomainEntities = {
  entities: [Order],
  entityClasses: businessEntities,
};

// 更新分域配置
export const domainEntities = {
  user: UserDomainEntities.entities,
  auth: AuthDomainEntities.entities,
  business: BusinessDomainEntities.entities, // 新增
};
```

### 6. 更新 Shared 包

```typescript
// shared/types/index.ts
// 新增业务域导出
export * as BusinessDomain from './business';

// 取消注释预留的业务域命名空间
// export * as BusinessDomain from './business'; → 取消注释
```

```typescript
// shared/types/business.ts (新建文件)
/**
 * 业务域相关类型定义
 */

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  orderNumber: string;
  totalAmount: number;
}

export interface UpdateOrderRequest {
  status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount?: number;
}
```

## 💡 核心要点和最佳实践

### ✅ DO - 应该遵循的

1. **先确定业务域**
   - 分析新表的业务属性
   - 优先使用现有域
   - 必要时才创建新域

2. **按层次更新**
   - 实体文件 → 域导出 → 主导出 → 共享类型
   - 每一层都要更新，确保完整性

3. **使用 Migration 管理数据库变更**
   - 总是使用 `migration:generate` 自动生成
   - 检查生成的 SQL 是否符合预期
   - 先在开发环境测试

4. **完整测试验证**
   - Backend 构建测试
   - Shared 包构建测试
   - Frontend 类型检查
   - Migration 功能测试

### ❌ DON'T - 应该避免的

1. **跳过域组织**
   - 不要直接在 `entities/` 根目录创建实体
   - 会破坏架构的一致性

2. **忘记更新导出文件**
   - TypeORM 无法找到实体
   - 导致运行时错误

3. **手写 Migration**
   - 容易出错且不一致
   - 使用 CLI 工具自动生成

4. **忘记同步共享类型**
   - 前后端类型不一致
   - 导致开发时类型错误

## 🕐 时间估算

| 复杂度 | 描述 | 预估时间 |
|--------|------|----------|
| 简单 | 5-8字段，无复杂关联 | 15-30分钟 |
| 中等 | 10-15字段，有关联关系 | 30-60分钟 |
| 复杂 | 多表关联，复杂业务逻辑 | 1-2小时 |
| 新域 | 创建全新业务域 | 1-2小时 |

## ❓ 常见问题解答

### Q1: 如何判断是否需要创建新域？

**A1**: 遵循以下判断标准：
- 如果新表与现有域有明确的业务关联 → 放入现有域
- 如果是全新的业务模块且预期会有多个相关表 → 创建新域
- 如果不确定 → 先放入最相关的现有域，未来可以重构

### Q2: Migration 生成失败怎么办？

**A2**: 常见原因和解决方案：
- **实体未正确导出**: 检查 `entities/index.ts` 导出
- **TypeORM 配置错误**: 验证 `typeorm.config.ts` 路径配置
- **数据库连接问题**: 检查环境变量和数据库状态

### Q3: 可以修改已有的 Migration 吗？

**A3**: **不建议修改已执行的 Migration**：
- 如果 Migration 还未执行 → 可以修改
- 如果已执行 → 创建新的 Migration 来修改
- 生产环境 → 绝对不要修改已执行的 Migration

### Q4: 如何处理实体之间的关联关系？

**A4**: 跨域关联的最佳实践：
```typescript
// 用户域实体关联认证域实体
@ManyToMany(() => Permission)
@JoinTable({
  name: 'user_permissions',
  joinColumn: { name: 'userId' },
  inverseJoinColumn: { name: 'permissionId' }
})
permissions: Permission[];
```

### Q5: 为什么要使用共享类型？

**A5**: 共享类型的重要性：
- 确保前后端类型一致性
- 减少类型定义重复
- 支持 TypeScript 类型检查
- 便于 API 接口文档生成

## 📚 相关文档

- [TypeORM Entity 文档](https://typeorm.io/entities)
- [TypeORM Migration 文档](https://typeorm.io/migrations)
- [项目 Migration 最佳实践](./migration-best-practices.md)

---

**最后更新**: 2025-01-15
**维护者**: Backend Team