# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "xiaodashi-web" (智商180的AI全域营销大师 Web) - a modern full-stack web application using a monorepo architecture with frontend-backend separation.

## Architecture

- **Monorepo Structure**: Uses pnpm workspaces with 5 main packages:
  - `frontend/`: Main website (Next.js) - runs on port 3000
  - `frontend-app/`: Dashboard application (Next.js) - runs on port 3001
  - `frontend-app-demo/`: Demo application (Next.js)
  - `backend/`: NestJS API server - runs on port 2999
  - `shared/`: Shared TypeScript types and utilities

- **Tech Stack**:
  - Frontend: Next.js 15.5.2, React 19.1.0, TypeScript 5.x, Tailwind CSS 4.1.13
  - Backend: NestJS 11.0.1, TypeScript 5.7.3, TypeORM 0.3.27
  - Shared: TypeScript types and common utilities

## Development Commands

Run all commands from the project root directory:

### Frontend Development
- `pnpm run dev:frontend` - Start main website dev server (localhost:3000)
- `pnpm run dev:frontend-app` - Start dashboard app dev server (localhost:3001)

### Backend Development
- `pnpm run dev:backend` - Start backend dev server with watch mode
- `pnpm --filter backend start:dev` - Alternative backend dev command

### Building
- `pnpm run build:shared` - Build shared package (run this first when shared types change)
- Individual workspaces can be built with: `pnpm --filter <workspace-name> build`

### Linting & Quality Check
- Frontend: `pnpm run lint:frontend` (shorthand for `pnpm --filter frontend lint`)
- Frontend-app: `pnpm run lint:frontend-app` (shorthand for `pnpm --filter frontend-app lint`)
- Backend: `pnpm --filter backend lint` (includes auto-fix)
- All frontend: `pnpm run lint` (runs both frontend workspaces)

### Testing (Backend)
- `pnpm --filter backend test` - Run unit tests
- `pnpm --filter backend test:watch` - Run tests in watch mode
- `pnpm --filter backend test:cov` - Run tests with coverage
- `pnpm --filter backend test:e2e` - Run end-to-end tests

### Backend Specific Commands
- `pnpm --filter backend format` - Format code with Prettier
- `pnpm --filter backend openapi:gen` - Generate OpenAPI documentation

## Key Project Structure

```
xiaodashi-web/
├── frontend/          # Main website (Next.js)
│   ├── app/          # Next.js App Router pages
│   ├── lib/          # Utilities
│   └── fonts/        # Font files
├── frontend-app/     # Dashboard application (Next.js)
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── styles/       # Additional styles
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── common/   # Shared backend utilities
│   │   └── health/   # Health check endpoints
│   └── test/         # Test files
├── shared/           # Shared TypeScript code
└── docs/            # Project documentation
```

## Important Development Notes

1. **Workspace Dependencies**: Always install dependencies at the workspace level, not the root
2. **Shared Package**: When modifying shared types, run `pnpm run build:shared` first
3. **Port Configuration**:
   - Frontend (main): 3000
   - Frontend-app (dashboard): 3001
   - Backend API: 2999 (updated to avoid conflicts)
4. **Documentation**: Extensive docs available in `docs/` directory including architecture, tech stack, and development guides

## Code Quality Workflow (推荐执行顺序)

**开发期间质量检查**：
1. Lint 检查：`pnpm run lint:frontend-app` 或 `pnpm run lint:frontend`
2. 类型检查：`pnpm --filter frontend-app build` (确保无 TypeScript 错误)
3. 如有 shared 类型变更：先执行 `pnpm run build:shared`

**代码提交前检查**：
```bash
# 全面检查
pnpm run lint                         # 检查所有前端代码
pnpm run build:shared                 # 构建共享类型
pnpm --filter frontend-app build      # 验证构建无错误
```

## Build Order for Deployment

1. Build shared package first: `pnpm run build:shared`
2. Build backend: `pnpm --filter backend build`
3. Build frontend applications: `pnpm --filter frontend build` and `pnpm --filter frontend-app build`

## Common Issues

- If you get TypeScript errors about shared types, ensure the shared package is built first
- Backend now runs on port 2999 to avoid conflicts with frontend-app (port 3001)
- The project uses Turbopack for faster Next.js builds (--turbopack flag)
- frontend-app 测试用户名：zhangsan@example.com 密码:111111
- ui界面组件优先使用 shadcn/ui, 可以使用shadcn工具查询.每次查询一个组件.如果在查询组件时遇到网络错误,可以尝试重试一次.

## Tailwind CSS v4 开发规范 🚨

**⚠️ CRITICAL: frontend-app 项目必须使用 Tailwind CSS v4 语法！严禁使用 v3 语法！**

### 必须遵循的语法规则

1. **透明度语法 (最常见错误)**:
   - ✅ 正确: `bg-blue-500/50`, `text-white/80`

2. **表单验证优先使用 user-* 变体**:
   - ❌ 避免: `invalid:border-red-500`
   - ✅ 推荐: `user-invalid:border-red-500`

3. **利用 v4 新特性**:
   - 入场动画: `starting:open:opacity-0`
   - JS 禁用检测: `noscript:block`
   - 阴影透明度: `text-shadow-lg/50`

### 开发检查点

在编写或审查代码时必须检查：
- [ ] 所有透明度都使用了 `/` 转义语法
- [ ] 表单验证使用了 `user-*` 变体
- [ ] 充分利用了 v4 新功能

### 详细语法指南

参考文档: `docs/tailwind-v4-migration.md` - 包含完整的 v3 vs v4 语法对比和常见错误示例

## 通用配置

### 指令集 - 前缀 "/"
   - faq-save: 使用 faq-record-assistant 整理并记录当前问题到FAQ中，以方便后续查询
   - faq-query: 使用 faq-query-assistant 查询问题

### 工具集
   - 访问网站内容：不要使用内置工具 Fetch，要使用agent：website-visitor 访问网站内容

