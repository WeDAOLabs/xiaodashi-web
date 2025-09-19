# 智商180的AI全域营销大师 Web (xiaodashi-web)
网站名称是：智商180的AI全域营销大师
这是一个现代化的全栈 Web 应用项目，采用前后端分离的 Monorepo 架构。

## 技术栈

- **前端 (Frontend)**: Next.js, React, TypeScript, Tailwind CSS
- **后端 (Backend)**: NestJS, TypeScript, Prisma
- **共享 (Shared)**: TypeScript 类型与工具库

详细技术栈请参考 [docs/tech-stack.md](./docs/tech-stack.md)。

## 项目结构

本项目使用 pnpm workspaces 管理 Monorepo。

- `frontend/`: 前端 Next.js 应用
- `backend/`: 后端 NestJS 应用
- `shared/`: 前后端共享的代码 (类型定义等)
- `docs/`: 项目文档

## 环境要求

- Node.js 20.x 或更高版本
- pnpm 8.x 或更高版本 (推荐)

## 快速开始

1. **安装依赖**
   在项目根目录运行：
   ```bash
   pnpm install
   ```

2. **启动前端开发服务器**
   ```bash
   pnpm run dev:frontend
   ```
   前端应用将在 `http://localhost:3000` 启动。

3. **启动后端开发服务器**
   ```bash
   pnpm run dev:backend
   ```
   后端服务将在 `http://localhost:3001` (默认) 启动。

## 可用脚本

所有脚本都应在项目根目录运行。

- `pnpm run dev:frontend`: 启动前端开发服务器。
- `pnpm run dev:frontend-app`: 启动前端管理后台。
- `pnpm run dev:backend`: 启动后端开发服务器。
- `pnpm run build:shared`: 构建共享模块。
- `pnpm run lint`: 检查前端代码质量。
- `pnpm run build:all`: 构建所有模块。