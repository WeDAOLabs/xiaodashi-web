# 项目结构详细说明

## 整体项目结构

```
xiaodashi-web/
├── docs/                          # 项目文档
│   ├── architecture.md            # 架构设计文档
│   ├── project-structure.md       # 项目结构说明
│   ├── tech-stack.md              # 技术栈选择说明
│   ├── api-design.md              # API 设计规范
│   └── development-guide.md       # 开发指南
├── frontend/                      # 智赢官网 (Next.js)
├── backend/                       # 后端 API 服务 (NestJS)
├── shared/                        # 共享代码和类型定义
├── docker/                        # Docker 配置文件
├── scripts/                       # 部署和构建脚本
├── .github/                       # GitHub Actions 配置
├── .gitignore                     # Git 忽略文件
├── docker-compose.yml             # Docker Compose 配置
├── package.json                   # 根项目配置
└── README.md                      # 项目说明
```

## 智赢官网结构 (frontend/)

```
frontend/
├── app/                       # Next.js App Router
│   ├── /                      # 首页 (智赢主页)
│   │   └── page.tsx           # 主页组件
│   ├── pricing/               # 定价页面
│   │   └── page.tsx           # 定价方案展示
│   ├── products/              # 产品介绍页面
│   │   └── page.tsx           # 产品特性介绍
│   ├── solutions/             # 解决方案页面
│   │   └── page.tsx           # 解决方案介绍
│   ├── community/             # 社区页面
│   │   └── page.tsx           # 社区互动和内容
│   ├── customer-stories/      # 客户案例页面
│   │   └── page.tsx           # 成功案例展示
│   ├── components/            # 可复用组件
│   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── Button.tsx         # 按钮组件
│   │   │   ├── Card.tsx           # 卡片组件
│   │   │   ├── Modal.tsx          # 模态框组件
│   │   │   └── Input.tsx          # 输入框组件
│   │   ├── pricing/           # 定价相关组件
│   │   │   ├── PricingCard.tsx    # 定价卡片
│   │   │   └── PlanComparison.tsx # 方案对比
│   │   ├── community/         # 社区相关组件
│   │   │   └── CommunityHub.tsx   # 社区中心
│   │   ├── customer-stories/  # 客户案例组件
│   │   │   └── StoryCard.tsx      # 案例卡片
│   │   ├── Header.tsx         # 头部组件
│   │   ├── Footer.tsx         # 底部组件
│   │   ├── Hero.tsx           # 主要展示区域
│   │   ├── Features.tsx       # 功能特性展示
│   │   ├── Pricing.tsx        # 定价展示
│   │   ├── Testimonials.tsx   # 客户评价
│   │   └── ContactSalesModal.tsx # 联系销售模态框
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 首页
├── lib/                       # 工具函数和配置
│   └── utils.ts               # 通用工具函数
├── public/                    # 静态资源
│   ├── images/                # 图片资源
│   ├── icons/                 # 图标资源
│   ├── favicon.ico            # 网站图标
│   └── icon.svg               # SVG 图标
├── .env.local                 # 本地环境变量
├── .env.example               # 环境变量示例
├── .eslintrc.json             # ESLint 配置
├── next.config.ts             # Next.js 配置
├── package.json               # 项目依赖
├── postcss.config.js          # PostCSS 配置
├── tsconfig.json              # TypeScript 配置
└── README.md                  # 官网项目说明
```

## 后端API服务结构 (backend/)

```
backend/
├── src/
│   ├── app.controller.ts          # 应用根控制器
│   ├── app.module.ts              # 应用根模块
│   ├── app.service.ts             # 应用根服务
│   ├── main.ts                    # 应用入口文件
│   ├── health/                    # 健康检查模块
│   │   ├── health.module.ts
│   │   ├── health.controller.ts
│   │   ├── health.service.ts
│   │   ├── health.controller.spec.ts
│   │   └── health.service.spec.ts
│   └── common/                    # 通用模块/工具
│       └── interceptors/
│           └── transform.interceptor.ts
├── scripts/                       # 脚本目录
│   └── generate-openapi.ts        # OpenAPI 文档生成脚本
├── test/                          # 测试文件
│   ├── app.e2e-spec.ts            # e2e 测试
│   └── jest-e2e.json              # e2e 测试配置
├── .eslintrc.js                   # ESLint 配置
├── nest-cli.json                  # NestJS CLI 配置文件
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── README.md
```

## 共享代码结构 (shared/)

```
shared/
├── types/                        # 共享类型定义
│   ├── auth.types.ts             # 认证相关类型
│   ├── user.types.ts             # 用户相关类型
│   ├── api.types.ts              # API 相关类型
│   └── common.types.ts           # 通用类型
├── constants/                    # 共享常量
│   ├── api.constants.ts          # API 常量
│   ├── auth.constants.ts         # 认证常量
│   └── common.constants.ts       # 通用常量
├── utils/                        # 共享工具函数
│   ├── validation.utils.ts       # 验证工具
│   ├── date.utils.ts             # 日期工具
│   └── string.utils.ts           # 字符串工具
├── schemas/                      # 数据模式定义
│   ├── auth.schemas.ts           # 认证模式
│   ├── user.schemas.ts           # 用户模式
│   └── common.schemas.ts         # 通用模式
├── package.json                  # 共享包配置
└── tsconfig.json                 # TypeScript 配置
```

## Docker 配置结构 (docker/)

```
docker/
├── frontend/                     # 前端 Docker 配置
│   ├── Dockerfile                # 前端 Dockerfile
│   └── nginx.conf                # Nginx 配置
├── backend/                      # 后端 Docker 配置
│   ├── Dockerfile                # 后端 Dockerfile
│   └── docker-entrypoint.sh      # 启动脚本
├── database/                     # 数据库 Docker 配置
│   ├── init.sql                  # 数据库初始化脚本
│   └── postgresql.conf           # PostgreSQL 配置
└── docker-compose.yml            # Docker Compose 配置
```

## 脚本结构 (scripts/)

```
scripts/
├── setup.sh                      # 项目初始化脚本
├── build.sh                      # 构建脚本
├── deploy.sh                     # 部署脚本
├── test.sh                       # 测试脚本
├── migrate.sh                    # 数据库迁移脚本
└── seed.sh                       # 数据库种子数据脚本
```

## 文件命名规范

### 组件文件
- 使用 PascalCase: `UserProfile.tsx`, `Header.tsx`, `Hero.tsx`
- 页面文件使用小写: `page.tsx`
- 布局文件使用小写: `layout.tsx`

### 工具文件
- 使用 camelCase: `authUtils.ts`
- 常量文件使用 UPPER_CASE: `API_CONSTANTS.ts`

### 类型文件
- 使用 camelCase: `userTypes.ts`
- 接口使用 PascalCase: `IUser`, `UserResponse`

### 样式文件
- 使用 kebab-case: `user-profile.css`
- 全局样式: `globals.css`

## 目录组织原则

### 1. 按功能分组
- 相关功能放在同一目录下
- 避免深层嵌套 (最多 3-4 层)

### 2. 按类型分组
- 组件、工具、类型分别存放
- 便于查找和维护

### 3. 按层级分组
- 官网: 页面 → 组件 → 工具
- 后端: 控制器 → 服务 → 模型

### 4. 共享代码
- 前后端共用的类型和工具放在 shared 目录
- 避免代码重复

## 导入路径规范

### 绝对路径导入
```typescript
// 推荐
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/types/user'

// 避免
import { Button } from '../../../components/ui/button'
```

### 相对路径导入
```typescript
// 同级或子级文件
import { UserCard } from './user-card'
import { UserForm } from '../forms/user-form'
```

## 总结

本项目结构设计遵循以下原则：

1. **清晰分层**: 官网、后端、共享代码分离
2. **模块化**: 按功能模块组织代码
3. **可维护性**: 合理的目录结构和命名规范
4. **可扩展性**: 预留扩展空间，便于后续功能添加
5. **团队协作**: 统一的代码组织方式，便于团队开发

通过这样的项目结构，可以确保代码的可读性、可维护性和可扩展性，为项目的长期发展奠定良好的基础。
