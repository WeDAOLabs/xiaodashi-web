# 智商180的AI全域营销大师 Web 项目架构设计

## 项目概述

智赢 Web 是一个采用 Monorepo 架构的现代化全栈项目，使用 pnpm workspaces 管理多个包，遵循 KISS 原则（Keep It Simple, Stupid）。项目包含官网、仪表板应用、演示应用以及后端 API 服务。

## 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │ Frontend-App    │    │   Backend API   │    │    Shared       │    │   Database      │
│   (主官网)      │    │   (仪表板)     │    │   (NestJS)      │    │   (Types)       │    │  (PostgreSQL)   │
│                 │    │                 │    │                 │    │                 │    │                 │
│ - Next.js 15.5  │    │ - Next.js 15.5  │    │ - NestJS 11     │    │ - TypeScript 5  │    │ - 主数据库      │
│ - React 19      │    │ - React 19      │    │ - TypeScript 5  │    │ - 共享类型      │    │ - TypeORM 0.3   │
│ - Tailwind v4   │    │ - Tailwind v4   │    │ - TypeORM       │    │ - 工具函数      │    │                 │
│ - Port: 3000    │    │ - Port: 3001    │    │ - Port: 2999    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                                  │                     ▲                      ▲
                                  │                     │                      │
                                  └─────────────────────┼──────────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │ Frontend-App    │
                                               │    Demo         │
                                               │ - Next.js 15.5  │
                                               │ - React 19      │
                                               │ - 演示应用      │
                                               └─────────────────┘
```

## 技术栈选择

### 前端技术栈
#### 主官网 (frontend/)
- **Next.js 15.5.2**: React 全栈框架，支持 SSR/SSG，使用 Turbopack 构建
- **React 19.1.0**: 用户界面库
- **TypeScript 5.x**: 类型安全的 JavaScript
- **Tailwind CSS 4.1.13**: 实用优先的 CSS 框架
- **端口**: 3000

#### 仪表板应用 (frontend-app/)
- **Next.js 15.5.2**: React 全栈框架，使用 App Router
- **React 19.1.0**: 用户界面库
- **Radix UI**: 无障碍的 UI 组件库
- **Tailwind CSS 4.1.13**: 实用优先的 CSS 框架
- **Lucide React**: 图标库
- **Recharts**: 数据可视化
- **端口**: 3001

#### 演示应用 (frontend-app-demo/)
- **Next.js 15.5.2**: 演示和测试环境
- **React 19.1.0**: 用户界面库

### 后端技术栈
- **Node.js**: JavaScript 运行时
- **NestJS 11.0.1**: 渐进式 Node.js 框架
- **TypeScript 5.7.3**: 类型安全
- **TypeORM 0.3.27**: 数据库 ORM
- **PostgreSQL**: 主数据库
- **@nestjs/swagger**: API 文档生成
- **端口**: 2999

### 共享包 (shared/)
- **@xiaodashi/shared**: 工作空间共享包
- **TypeScript 5.x**: 类型定义
- **构建输出**: dist/ 目录

### 数据库
- **PostgreSQL**: 主数据库，通过 TypeORM 管理
- **Migration 支持**: 完整的数据库迁移脚本
- **连接配置**: 支持开发和生产环境配置

## 项目结构

### Monorepo 项目结构
```
xiaodashi-web/
├── frontend/              # 主官网 (端口 3000)
│   ├── app/                  # App Router
│   │   ├── page.tsx            # 首页
│   │   ├── globals.css         # 全局样式
│   │   └── layout.tsx          # 根布局
│   ├── lib/                  # 工具函数
│   ├── fonts/                # 字体文件
│   ├── public/               # 静态资源
│   └── package.json
│
├── frontend-app/          # 仪表板应用 (端口 3001)
│   ├── app/                  # App Router
│   ├── components/           # React 组件
│   │   └── ui/                 # shadcn/ui 组件
│   ├── lib/                  # 工具函数
│   ├── styles/               # 样式文件
│   ├── types/                # 类型定义
│   └── package.json
│
├── frontend-app-demo/     # 演示应用
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── backend/               # NestJS API (端口 2999)
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── health/           # 健康检查模块
│   ├── test/                 # 测试文件
│   ├── scripts/              # 构建脚本
│   └── package.json
│
├── shared/                # 共享包
│   ├── types/                # TypeScript 类型
│   ├── examples/             # 示例代码
│   ├── dist/                 # 构建输出
│   └── package.json
│
├── docs/                  # 项目文档
├── pnpm-workspace.yaml    # pnpm 工作空间配置
└── package.json           # 根配置
```

### 后端结构 (NestJS)
```
backend/
├── src/
│   ├── app.module.ts        # 根模块
│   ├── main.ts              # 应用入口文件
│   ├── health/              # 健康检查模块
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   └── common/              # 共享后端工具
├── scripts/                 # 构建和工具脚本
│   └── generate-openapi.ts  # OpenAPI 文档生成
├── test/                    # 测试文件
│   └── jest-e2e.json       # E2E 测试配置
├── typeorm.config.ts        # TypeORM 配置
├── package.json
├── tsconfig.json
└── .env.example
```

## 核心功能模块

### 1. 主官网模块 (frontend/)
- 产品介绍和特性展示
- 解决方案介绍
- 定价方案展示
- SEO 优化和性能优化

### 2. 仪表板应用 (frontend-app/)
- 用户管理界面
- 数据可视化 (Recharts)
- 交互式组件 (Radix UI)
- 响应式设计 (Tailwind CSS v4)

### 3. 演示应用 (frontend-app-demo/)
- 功能演示
- 测试环境
- 原型验证

### 4. 后端 API 服务 (backend/)
- RESTful API 接口
- 数据库管理 (TypeORM)
- 健康检查端点
- OpenAPI 文档自动生成

### 5. 共享模块 (shared/)
- TypeScript 类型定义
- 工具函数库
- 跨项目复用组件

## API 设计原则

### RESTful API 规范
- 使用标准 HTTP 方法 (GET, POST, PUT, DELETE)
- 统一的响应格式
- 合理的状态码使用
- 版本控制 (v1, v2)

### 响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "code": 200,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 错误处理
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 安全考虑

### 前端安全
- XSS 防护
- CSRF 防护
- 敏感信息保护
- 输入验证

### 后端安全
- JWT Token 安全
- 密码加密存储
- API 限流
- 输入验证和清理
- SQL 注入防护

## 部署架构

### 开发环境
- 主官网: `pnpm run dev:frontend` (localhost:3000)
- 仪表板应用: `pnpm run dev:frontend-app` (localhost:3001)
- 演示应用: `pnpm run dev:frontend-app-demo`
- 后端 API: `pnpm run dev:backend` (localhost:2999)
- 共享包构建: `pnpm run build:shared`
- 数据库: PostgreSQL with TypeORM

### 生产环境
- 前端: Vercel 或自建服务器
- 后端: Docker 容器化部署
- 数据库: 云数据库服务
- 反向代理: Nginx

## 开发流程

### 1. 环境搭建
1. 安装 Node.js 18+
2. 安装 pnpm 包管理器
3. 安装 PostgreSQL 数据库
4. 克隆项目: `git clone <repository>`
5. 安装依赖: `pnpm install`
6. 配置环境变量 (.env 文件)
7. 构建共享包: `pnpm run build:shared`
8. 运行数据库迁移: `pnpm --filter backend migration:run`

### 2. 开发规范
- 使用 TypeScript 严格模式 (所有包)
- 遵循 ESLint 和 Prettier 配置
- Monorepo 工作流程:
  - 共享类型变更时先构建: `pnpm run build:shared`
  - 工作空间级别安装依赖
  - 使用 workspace 协议引用内部包
- 代码质量检查:
  - `pnpm run lint` (检查所有前端)
  - `pnpm --filter backend lint` (检查后端)
- 使用 Git Flow 工作流
- 代码审查机制

### 3. 测试策略
- 后端单元测试: `pnpm --filter backend test`
- 后端测试覆盖: `pnpm --filter backend test:cov`
- 后端 E2E 测试: `pnpm --filter backend test:e2e`
- 前端测试: 集成到各个前端工作空间
- API 测试: 通过 NestJS 测试框架

## 性能优化

### 前端优化
- **Turbopack**: Next.js 15 使用 Turbopack 构建器
- **代码分割**: Next.js App Router 自动代码分割
- **Tailwind CSS v4**: 现代化 CSS 框架
- **字体优化**: 使用 @fontsource 管理字体
- **缓存策略**: Next.js 内置缓存机制
- **Monorepo 优化**: 共享包减少重复依赖

### 后端优化
- **TypeORM 查询优化**: 数据库查询性能优化
- **健康检查**: 内置健康检查端点
- **API 文档**: 自动生成 OpenAPI 文档
- **NestJS 性能**: 利用 NestJS 内置优化
- **数据库连接**: TypeORM 连接池管理

## 监控和日志

### 监控指标
- API 响应时间
- 错误率
- 用户活跃度
- 系统资源使用

### 日志管理
- 结构化日志
- 日志级别管理
- 日志聚合和分析
- 错误追踪

## 扩展性考虑

### 水平扩展
- **Monorepo 扩展**: 可独立部署各个包
- **无状态服务**: NestJS 服务无状态设计
- **前端部署**: 多个 Next.js 应用可独立部署
- **数据库扩展**: TypeORM 支持读写分离
- **包级别缓存**: 共享包构建缓存

### 微服务化
- **包级别拆分**: 按功能域拆分 workspace
- **API 版本控制**: 通过 NestJS 路由版本管理
- **类型安全**: 通过共享包保证服务间类型一致性
- **独立部署**: 各 workspace 可独立构建部署

## 总结

本架构设计采用现代化的 Monorepo 架构，遵循 KISS 原则，具有良好的可维护性、可扩展性和性能表现。通过 pnpm workspaces 管理多个相关包，支持团队并行开发，提高开发效率。

主要优势：
- **统一技术栈**: 所有包使用一致的 TypeScript、Next.js 和工具链
- **类型安全**: 通过共享包确保前后端类型一致性
- **开发效率**: Turbopack 构建、热重载、工作空间级别的依赖管理
- **独立部署**: 各个应用可独立构建和部署
- **代码复用**: 共享组件和工具函数减少重复开发

架构设计考虑了现代 Web 开发的最佳实践，为项目的长期发展和团队协作奠定了坚实的基础。
