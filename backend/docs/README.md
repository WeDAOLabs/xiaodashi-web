# Backend 文档中心

欢迎来到 XiaoDashi Web Backend 文档中心。这里包含了后端开发的所有重要指南和最佳实践。

## 📚 文档目录

### 🗄️ 数据库开发

- **[数据库实体新增指南](./database-entity-guide.md)**
  - 按业务域组织的实体架构说明
  - 新增表的完整操作步骤
  - 创建新业务域的详细流程
  - 常见问题解答

- **[Migration 最佳实践](./migration-best-practices.md)**
  - TypeORM Migration 基础概念
  - 日常开发和生产部署流程
  - 常用命令速查表
  - 问题排查和安全检查

## 🏗️ 项目架构概述

### 数据库架构

当前项目采用按业务域组织的数据库实体架构：

```
backend/src/database/
├── entities/
│   ├── user/           # 用户域：用户信息、档案、会话等
│   ├── auth/           # 认证域：权限、角色等
│   └── index.ts        # 统一导出
├── migrations/         # 数据库迁移文件
└── typeorm.config.ts   # TypeORM 配置
```

### 核心特性

- ✅ **按域组织**: 清晰的业务边界
- ✅ **类型安全**: 完整的 TypeScript 支持
- ✅ **易于扩展**: 为多数据库架构预留空间
- ✅ **向后兼容**: 保持现有 API 不变

## 🚀 快速开始

### 新增数据表

```bash
# 1. 创建实体文件
# backend/src/database/entities/[domain]/[entity].entity.ts

# 2. 更新域导出
# backend/src/database/entities/[domain]/index.ts

# 3. 生成 migration
pnpm --filter backend run migration:generate -- src/database/migrations/AddNewTable

# 4. 执行 migration
pnpm --filter backend run migration:run
```

### 常用命令

```bash
# 构建检查
pnpm --filter backend build

# Migration 管理
pnpm --filter backend run migration:show
pnpm --filter backend run migration:run
pnpm --filter backend run migration:revert

# 代码质量
pnpm --filter backend run lint
```

## 📖 开发规范

### 实体命名规范

- **文件命名**: `kebab-case.entity.ts` (如 `user-profile.entity.ts`)
- **类命名**: `PascalCase` (如 `UserProfile`)
- **表命名**: `snake_case` (如 `user_profiles`)
- **字段命名**: `camelCase` (如 `firstName`)

### Migration 命名规范

- **格式**: `[动作][实体][具体描述]`
- **示例**:
  - `AddUserNotifications`
  - `UpdateOrderStatusEnum`
  - `CreateBusinessTables`
  - `AddIndexUserEmail`

### 代码组织规范

```typescript
// 实体文件标准结构
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 基础字段
  @Column({ type: 'varchar', length: 100 })
  name: string;

  // 时间戳字段
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => RelatedEntity)
  related: RelatedEntity;
}
```

## 🔧 开发工具

### 推荐的 VSCode 扩展

- **TypeORM Snippets**: TypeORM 代码片段
- **PostgreSQL**: 数据库管理
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

### 数据库管理工具

- **pgAdmin**: PostgreSQL 图形化管理
- **DBeaver**: 通用数据库管理工具
- **psql**: 命令行工具

## 🐛 故障排查

### 常见问题

1. **Migration 生成失败**
   - 检查实体导出是否正确
   - 验证 TypeORM 配置路径
   - 确认数据库连接

2. **类型错误**
   - 运行 `pnpm -w run build:shared`
   - 检查 shared 包类型定义
   - 验证实体和类型的一致性

3. **数据库连接问题**
   - 检查环境变量配置
   - 验证数据库服务状态
   - 确认网络连接

## 📞 获取帮助

- **团队沟通**: 项目开发群
- **技术文档**: 本文档目录
- **问题报告**: 项目 Issue 跟踪
- **代码审查**: 提交 Pull Request

## 🔄 文档更新

本文档会随着项目发展持续更新。如果您发现文档有误或需要补充，请：

1. 在项目中提交 Issue
2. 直接提交文档更新的 Pull Request
3. 联系文档维护者

---

**文档维护者**: Backend Team
**最后更新**: 2025-01-15
**版本**: v1.0.0

## 📋 TODO

- [ ] 添加 API 文档生成指南
- [ ] 完善错误处理最佳实践
- [ ] 添加性能监控指南
- [ ] 补充单元测试文档