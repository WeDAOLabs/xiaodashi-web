# 智商180的AI全域营销大师 Web 项目 (xiaodashi-web) - iFlow 上下文

## 项目概述

这是一个现代化的全栈 Web 应用项目，采用前后端分离的 Monorepo 架构。项目名称为“智商180的AI全域营销大师”。

### 核心技术栈

*   **前端 (主站)**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 4
*   **前端 (应用)**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui (基于 Radix UI)
*   **后端**: NestJS 11, TypeScript 5, Prisma (ORM)
*   **共享**: TypeScript 类型与工具库
*   **数据库**: PostgreSQL 16, Redis 7
*   **包管理**: pnpm Workspaces

### 项目结构

项目使用 pnpm workspaces 管理 Monorepo，主要包含以下目录：

*   `frontend/`: 主站前端 Next.js 应用 (端口 3000)
*   `frontend-app/`: 应用前端 Next.js 应用 (端口 3001)
*   `backend/`: 后端 NestJS 应用 (端口 3001, API 前缀 /api/v1)
*   `shared/`: 前后端共享的代码 (类型定义等)
*   `docs/`: 项目文档

## 构建和运行

所有脚本都应在项目根目录运行。

### 环境要求

*   Node.js 20.x 或更高版本
*   pnpm 8.x 或更高版本 (推荐)

### 快速开始

1.  **安装依赖**
    ```bash
    pnpm install
    ```

2.  **启动主站前端开发服务器**
    ```bash
    pnpm run dev:frontend
    ```
    应用将在 `http://localhost:3000` 启动。

3.  **启动应用前端开发服务器**
    ```bash
    pnpm run dev:frontend-app
    ```
    应用将在 `http://localhost:3001` 启动。

4.  **启动后端开发服务器**
    ```bash
    pnpm run dev:backend
    ```
    后端服务将在 `http://localhost:3001` (默认) 启动。

### 可用脚本

*   `pnpm run dev:frontend`: 启动主站前端开发服务器。
*   `pnpm run dev:frontend-app`: 启动应用前端开发服务器。
*   `pnpm run dev:backend`: 启动后端开发服务器。
*   `pnpm run build:shared`: 构建共享模块。

## 开发约定

### 通用规范

*   遵循严格的 TypeScript 配置 (`strict: true`)。
*   使用 ESLint 和 Prettier 保证代码质量和风格。
*   Git 工作流采用 `main` (生产) -> `develop` (开发) -> `feature/*` (功能) 的分支策略。
*   提交信息遵循 Conventional Commits 规范 (e.g., `feat(auth): add JWT token validation`)。

### 前端开发规范 (主站 `frontend/`)

*   **样式**: 使用 Tailwind CSS v4，配置在 `globals.css` 中通过 `@theme` 指令完成。
*   **字体**: 使用 `next/font/local` 加载本地字体文件。
*   **图片**: 所有图片需本地化存储于 `frontend/public` 目录。
*   **组件**: 优先使用原生 HTML 和 Tailwind CSS 构建组件。
*   **依赖**: 所有前端依赖必须安装到 `frontend` 工作区 (`pnpm --filter frontend add <package>`)。

### 前端开发规范 (应用 `frontend-app/`)

*   **样式**: 使用 Tailwind CSS v4，配置在 `globals.css` 中通过 `@theme` 指令完成。
*   **字体**: 使用 `next/font/local` 加载本地字体文件。
*   **图片**: 所有图片需本地化存储于 `frontend-app/public` 目录。
*   **组件**: **必须优先使用 shadcn/ui 组件** 实现页面和功能。
*   **shadcn/ui**: 通过 CLI 添加组件 (`npx shadcn@latest add button`)，自定义样式优先使用 `variant` 扩展。
*   **依赖**: 所有前端依赖必须安装到 `frontend-app` 工作区 (`pnpm --filter frontend-app add <package>`)。

### 后端开发规范 (`backend/`)

*   **框架**: 使用 NestJS，遵循模块化架构 (`@Module`, `@Controller`, `@Injectable`)。
*   **入口**: `src/main.ts`，默认监听端口 3001，API 前缀为 `/api/v1`。
*   **数据库**: 使用 Prisma ORM 进行数据库操作。
*   **验证**: 使用 `class-validator` 和 `class-transformer` 进行 DTO 输入验证。

### 测试

*   **前端**: 使用 Jest + React Testing Library 进行组件和 Hook 测试。
*   **后端**: 使用 Jest 进行单元测试，Supertest 进行集成测试。