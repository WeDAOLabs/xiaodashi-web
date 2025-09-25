# 技术栈选择说明

## 项目概述

**肖大师营销大师 Web (xiaodashi-web)** - 使用 Monorepo 架构的现代化全栈 Web 应用，采用前后端分离设计。

### 项目架构
- **Monorepo 结构**: 使用 pnpm workspaces 管理 5 个主要包：
  - `frontend/`: 主网站 (Next.js) - 运行在端口 3000
  - `frontend-app/`: 管理后台应用 (Next.js) - 运行在端口 3001
  - `frontend-app-demo/`: 演示应用 (Next.js)
  - `backend/`: NestJS API 服务器 - 运行在端口 2999
  - `shared/`: 共享 TypeScript 类型和工具库

## 前端技术栈

### 核心框架

#### Next.js 15.5.2
- React 全栈框架，支持 SSR/SSG
- App Router + Turbopack 集成
- 内置性能优化和 SEO 支持
**配置特点:**
- 所有前端项目均使用 Turbopack (`--turbopack`)
- frontend-app 配置自定义端口 3001

#### React 19.1.0
- 最新版本，包含新特性和性能优化
- 组件化开发，生态系统强大

### 开发语言

#### TypeScript 5.x
- 静态类型检查，减少运行时错误
- 与 React/Next.js 完美集成
- 所有包统一使用 5.x 版本

### 样式方案

#### Tailwind CSS 4.1.13 (v4 Beta)
- 最新 v4 架构，更小运行时开销，更好性能
- CSS-in-JS 体验，与 shadcn/ui 完美集成
- 使用 `@tailwindcss/postcss` 插件
- 支持 CSS variables 和主题定制

### UI 组件库

#### shadcn/ui + Radix UI
- 无头组件库，完全样式控制，优秀可访问性
- 与 Tailwind CSS 完美集成

**实际配置:**
- frontend-app 使用 shadcn/ui (New York 风格)
- 集成多个 Radix UI 组件：Accordion、Avatar、Dialog、Dropdown Menu 等
- 使用 Lucide React 作为图标库
- 支持 CSS Variables 主题系统

#### 辅助组件
- **date-fns**: 日期处理库 (4.1.0)
- **react-day-picker**: 日期选择器 (9.10.0)
- **recharts**: 图表组件 (2.15.4)
- **react-resizable-panels**: 可调整大小的面板 (3.0.5)
- **tw-animate-css**: Tailwind 动画扩展 (1.3.8)

### 状态管理

#### 客户端状态管理 (待实现)
**Zustand**: 轻量级，API 简洁，无需 Provider，TypeScript 支持良好

#### 服务端状态管理 (待实现)
**TanStack Query**: 服务端状态管理，内置缓存同步，与 REST API 集成良好

### HTTP 客户端 (待实现)
**Axios**: 功能丰富，支持请求/响应拦截器，自动 JSON 转换，错误处理完善

### 表单处理 (待实现)
**React Hook Form**: 性能优秀减少重渲染，与 shadcn/ui 集成良好，TypeScript 支持优秀

### 测试框架 (前端 - 待配置)
**Jest + React Testing Library**: React 官方推荐，专注用户行为测试，与 Next.js 集成良好

### 代码质量

#### ESLint 9.x
- 现代化代码质量检查工具，新扁平配置格式
- 与 TypeScript 和 Next.js 深度集成，支持自动修复
- 集成 `eslint-config-next`，统一 lint 脚本

#### 代码格式化 (后端使用 Prettier)
- 后端项目配置了 Prettier 3.4.2
- 前端项目依赖 Next.js 内置的格式化

## 后端技术栈

### 运行时环境

#### Node.js
- JavaScript 运行时，与前端技术栈统一
- 高性能异步 I/O，丰富 NPM 生态
- **推荐版本**: 20.x LTS

### Web 框架

#### NestJS 11.0.1
- 基于 TypeScript，现代化开发体验
- 完整应用架构（模块/控制器/服务），代码组织性强
- 内置依赖注入容器，强大 CLI 工具
- 底层 Express，兼具灵活性和高性能

**实际版本:** 11.0.1 (最新稳定版)
**核心依赖:**
- `@nestjs/common`: 11.0.1
- `@nestjs/core`: 11.0.1
- `@nestjs/platform-express`: 11.0.1
- `@nestjs/config`: 4.0.2 (配置管理)
- `@nestjs/swagger`: 11.0.1 (API 文档)

**替代方案:**
- Express.js (不选择原因：过于轻量，需要自行构建架构)
- Koa (不选择原因：生态和社区相对较小)

### 开发语言

#### TypeScript 5.7.3
- 与前端技术栈统一，提供类型安全
- 更好 IDE 支持，便于重构和维护，减少运行时错误
**配置特点:**
- 使用 Node.js Next 模块解析
- 启用装饰器支持 (`experimentalDecorators`)
- 目标 ES2023，充分利用现代 JavaScript 特性

### 数据库 ORM

#### TypeORM 0.3.27
- 成熟 TypeScript ORM，与 NestJS 深度集成
- 装饰器风格实体定义，支持复杂关系和查询
- 完善迁移系统，活跃社区支持

**实际版本:** 0.3.27
**配置特点:**
- 使用 PostgreSQL 作为主数据库
- 已配置完整的实体系统 (用户、权限、认证相关)
- 支持多数据源配置 (预留)
- 集成 `@nestjs/typeorm` 11.0.0

**数据库实体结构:**
- **用户模块**: User、UserProfile、UserSession、UserLoginLog
- **权限模块**: Permission、RolePermission

### 身份认证 (待实现)
**JWT (jsonwebtoken)**: 无状态认证，适合分布式系统，跨域支持良好，轻量级高性能

### 密码加密 (待实现)
**bcrypt**: 专门用于密码哈希，内置盐值生成，安全性高，API 简单

### 数据验证 (待实现)
**class-validator & class-transformer**: NestJS 官方推荐，基于装饰器与 DTO 结合，功能强大

### 日志记录 (待实现)
**Winston**: 功能丰富日志库，支持多种传输方式，可配置日志级别

### 测试框架

#### Jest 30.0.0 + Supertest 7.0.0
- Jest 功能强大，支持完整测试生态
- Supertest 专门用于 HTTP API 测试
- 与 TypeScript 和 NestJS 集成良好，支持覆盖率报告

**实际配置:**
- Jest 30.0.0 (最新版)
- Supertest 7.0.0
- ts-jest 29.2.5 (TypeScript 支持)
- 配置了完整的测试环境和覆盖率收集

## 数据库技术

### 主数据库

#### PostgreSQL
- 功能强大关系型数据库，支持复杂查询和事务
- 数据类型丰富支持 JSON，性能优秀扩展性强
- 开源免费，社区活跃

**推荐版本:** 17.x
**实际配置:**
- 已配置完整的数据库连接和环境变量支持
- 支持 SSL 连接（生产环境）
- 连接池配置 (最大 10 连接)
- 开发环境启用查询日志

### 缓存数据库

#### Redis (可选)
- 高性能内存数据库，支持多种数据结构，持久化支持
- 与 Node.js 集成良好，**推荐版本**: 7.x
- **当前状态**: 暂未配置，使用 PostgreSQL 作为缓存

## 开发工具

### 包管理

#### pnpm (Monorepo 管理)
- 快速节省磁盘空间，严格依赖管理避免幽灵依赖
- 优秀 monorepo 支持，与 npm 生态完全兼容，性能表现最佳

**实际配置:**
- 使用 pnpm workspaces 管理 5 个子包
- 配置了统一的开发脚本
- 支持跨包依赖 (`workspace:*`)
- 配置了 `onlyBuiltDependencies` 优化构建性能

**主要脚本:**
```bash
pnpm run dev:frontend        # 启动主网站
pnpm run dev:frontend-app    # 启动管理后台
pnpm run dev:backend         # 启动后端服务
pnpm run build:shared        # 构建共享包
pnpm run lint               # 检查所有前端代码
```

### 代码质量工具

#### ESLint + Prettier (后端)
- 前端: ESLint 9.x (新配置格式)
- 后端: ESLint + Prettier 3.4.2
- 支持自动修复和格式化，与 TypeScript 深度集成

### 版本控制

#### Git
- 最流行版本控制系统，分布式架构功能强大
- 完善分支管理和合并策略，社区支持完善
- **当前状态**: 主分支 `dev`，用于版本控制和协作开发

## 部署和运维 (待配置)

### 容器化
**Docker + Docker Compose**: 标准化部署环境跨平台支持，简单多容器管理适合开发和小型部署

### 反向代理
**Nginx**: 高性能 Web 服务器，优秀负载均衡和静态文件服务，配置灵活广泛使用

### 应用监控
**PM2 + Sentry**: PM2 提供 Node.js 进程管理自动重启负载均衡，Sentry 实时错误监控性能追踪

## 技术栈总结

### 前端技术栈 (实际配置)
- **核心框架**: Next.js 15.5.2 + React 19.1.0
- **开发语言**: TypeScript 5.x
- **样式方案**: Tailwind CSS 4.1.13 (v4 Beta)
- **UI 组件库**: shadcn/ui + Radix UI (frontend-app)
- **图标库**: Lucide React 0.543.0
- **构建工具**: Turbopack (Next.js 内置)
- **代码检查**: ESLint 9.x

**待实现功能:**
- 状态管理 (推荐: Zustand + TanStack Query)
- HTTP 客户端 (推荐: Axios)
- 表单处理 (推荐: React Hook Form)
- 测试框架 (推荐: Jest + React Testing Library)

### 后端技术栈 (实际配置)
- **运行时**: Node.js (推荐 20.x LTS)
- **Web 框架**: NestJS 11.0.1
- **开发语言**: TypeScript 5.7.3
- **数据库 ORM**: TypeORM 0.3.27
- **数据库连接**: @nestjs/typeorm 11.0.0
- **配置管理**: @nestjs/config 4.0.2
- **API 文档**: @nestjs/swagger 11.0.1
- **测试框架**: Jest 30.0.0 + Supertest 7.0.0
- **代码质量**: ESLint 9.x + Prettier 3.4.2

**已配置实体:**
- 用户模块: User、UserProfile、UserSession、UserLoginLog
- 权限模块: Permission、RolePermission

**待实现功能:**
- 身份认证 (推荐: JWT + bcrypt)
- 数据验证 (推荐: class-validator)
- 日志记录 (推荐: Winston)

### 数据库技术 (实际配置)
- **主数据库**: PostgreSQL (已配置连接和实体)
- **缓存方案**: 暂未配置 Redis，使用 PostgreSQL

### 开发工具 (实际配置)
- **包管理**: pnpm (Monorepo 架构)
- **代码质量**: ESLint 9.x + Prettier (后端)
- **版本控制**: Git 
- **共享类型**: @xiaodashi/shared workspace

### 项目架构特点
- **Monorepo 结构**: 5 个包的工作空间
- **端口配置**: frontend:3000, frontend-app:3001, backend:2999
- **构建优化**: Turbopack、pnpm workspaces
- **类型安全**: 全栈 TypeScript，共享类型库

## 技术选型优势

1. **技术栈统一**: 前后端全栈 TypeScript，降低学习维护成本
2. **现代化架构**: 最新版本核心技术 (Next.js 15, React 19, NestJS 11)
3. **开发体验优秀**: Turbopack + pnpm workspaces + shadcn/ui 高效开发
4. **类型安全**: 端到端类型安全，共享类型库减少重复
5. **生态成熟**: 所有技术都有活跃社区和丰富资源
6. **Monorepo 优势**: 统一管理代码共享原子化部署

## 项目当前状态

### ✅ 已完成配置
- **项目结构**: 完整的 Monorepo 工作空间
- **前端基础**: Next.js + React + TypeScript + Tailwind CSS v4
- **UI 组件**: shadcn/ui 组件系统 (frontend-app)
- **后端基础**: NestJS + TypeScript + TypeORM
- **数据库**: PostgreSQL 连接和实体定义
- **开发工具**: pnpm、ESLint、测试框架配置

### 🚧 待开发功能
- **认证系统**: JWT + bcrypt 实现
- **数据验证**: class-validator 集成
- **状态管理**: 前端状态管理方案
- **API 客户端**: HTTP 客户端和状态管理
- **日志系统**: Winston 日志记录
- **部署配置**: Docker + CI/CD

## 未来扩展考虑

1. **微服务化**: 当前 NestJS 架构支持模块化拆分
2. **实时通信**: WebSocket 或 Server-Sent Events 支持
3. **移动端**: React Native 或 Expo 开发
4. **国际化**: i18n 多语言支持
5. **性能优化**: Redis 缓存、CDN、图片优化

## 开发建议

1. **优先级**: 先完成认证系统和核心业务功能
2. **测试覆盖**: 关键业务逻辑优先编写测试
3. **文档维护**: 及时更新 API 文档和组件文档
4. **代码质量**: 充分利用 TypeScript 和 ESLint 保证代码质量

