# 智商180的AI全域营销大师 Web 项目架构设计

## 项目概述

智赢 Web 是一个基于 Next.js 的前后端分离项目，采用现代化的技术栈和架构模式，遵循 KISS 原则（Keep It Simple, Stupid）。前端部分为智赢官网，提供产品展示、用户注册、定价方案等官方网站功能。

## 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - React 18      │    │ - NestJS        │    │ - 主数据库      │
│ - TypeScript    │    │ - TypeScript    │    │ - Redis 缓存    │
│ - Tailwind CSS  │    │ - JWT 认证      │    │                 │
│ - Zustand       │    │ - Prisma ORM    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 技术栈选择

### 前端技术栈（官网）
- **Next.js 14**: React 全栈框架，支持 SSR/SSG，用于构建智赢官方网站
- **React 18**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Zustand**: 轻量级状态管理
- **React Query**: 服务端状态管理
- **Axios**: HTTP 客户端

### 后端技术栈
- **Node.js**: JavaScript 运行时
- **NestJS**: 渐进式 Node.js 框架
- **TypeScript**: 类型安全
- **Prisma**: 现代化 ORM
- **JWT**: 身份认证
- **bcrypt**: 密码加密
- **class-validator**: 数据验证

### 数据库
- **PostgreSQL**: 主数据库
- **Redis**: 缓存和会话存储

## 项目结构

### 前端结构 (Next.js 官网)
```
frontend/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── /                   # 首页
│   │   ├── pricing/           # 定价页面
│   │   ├── products/          # 产品介绍页面
│   │   ├── solutions/         # 解决方案页面
│   │   ├── community/         # 社区页面
│   │   ├── customer-stories/  # 客户案例页面
│   │   ├── globals.css        # 全局样式
│   │   └── layout.tsx         # 根布局
│   ├── components/         # 可复用组件
│   │   ├── ui/                # 基础 UI 组件
│   │   ├── pricing/           # 定价相关组件
│   │   ├── community/         # 社区相关组件
│   │   └── Header.tsx         # 头部组件
│   ├── lib/               # 工具函数
│   │   └── utils.ts           # 通用工具
│   └── types/             # TypeScript 类型定义
├── public/                # 静态资源
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

### 后端结构 (NestJS)
```
backend/
├── src/
│   ├── app.controller.ts    # 根控制器
│   ├── app.module.ts        # 根模块
│   ├── app.service.ts       # 根服务
│   ├── main.ts              # 应用入口文件
│   ├── users/               # 示例：用户模块
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   └── auth/                # 示例：认证模块
│       ├── auth.module.ts
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       └── guards/
│           └── jwt-auth.guard.ts
├── test/                    # 测试文件
├── package.json
├── tsconfig.json
└── .env.example
```

## 核心功能模块

### 1. 官网展示模块
- 产品介绍和特性展示
- 解决方案介绍
- 定价方案展示

### 2. 用户交互模块
- 联系销售表单
- 产品试用申请
- 用户反馈收集
- 邮件订阅

### 3. 内容管理模块
- 博客文章展示
- 社区动态
- 工具推荐
- 教程和文档

### 4. SEO 优化模块
- 页面元数据管理
- 结构化数据
- 站点地图生成
- 性能优化

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
- 前端: `npm run dev` (localhost:3000)
- 后端: `npm run dev` (localhost:8000)
- 数据库: Docker PostgreSQL + Redis

### 生产环境
- 前端: Vercel 或自建服务器
- 后端: Docker 容器化部署
- 数据库: 云数据库服务
- 反向代理: Nginx

## 开发流程

### 1. 环境搭建
1. 安装 Node.js 18+
2. 安装 PostgreSQL 和 Redis
3. 克隆项目并安装依赖
4. 配置环境变量
5. 运行数据库迁移

### 2. 开发规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 编写单元测试
- 使用 Git Flow 工作流
- 代码审查机制

### 3. 测试策略
- 单元测试 (Jest)
- 集成测试
- E2E 测试 (Playwright)
- API 测试

## 性能优化

### 前端优化
- 代码分割和懒加载
- 图片优化
- 缓存策略
- CDN 使用

### 后端优化
- 数据库查询优化
- Redis 缓存
- API 响应压缩
- 连接池管理

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
- 无状态服务设计
- 负载均衡
- 数据库读写分离
- 缓存集群

### 微服务化
- 服务拆分原则
- API 网关
- 服务发现
- 分布式事务

## 总结

本架构设计遵循 KISS 原则，采用现代化的技术栈，具有良好的可维护性、可扩展性和性能表现。通过前后端分离的设计，可以支持团队并行开发，提高开发效率。

架构设计考虑了安全性、性能、可扩展性等多个方面，为项目的长期发展奠定了坚实的基础。
