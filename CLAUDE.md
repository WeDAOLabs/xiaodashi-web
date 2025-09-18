# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "xiaodashi-web" (智商180的AI全域营销大师 Web) - a modern full-stack web application using a monorepo architecture with frontend-backend separation.

## Architecture

- **Monorepo Structure**: Uses npm workspaces with 4 main packages:
  - `frontend/`: Main website (Next.js) - runs on port 3000
  - `frontend-app/`: Dashboard application (Next.js) - runs on port 3001
  - `backend/`: NestJS API server - runs on port 3001 (default)
  - `shared/`: Shared TypeScript types and utilities

- **Tech Stack**:
  - Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4.x
  - Backend: NestJS 11, TypeScript, likely Prisma for ORM
  - Shared: TypeScript types and common utilities

## Development Commands

Run all commands from the project root directory:

### Frontend Development
- `npm run dev:frontend` - Start main website dev server (localhost:3000)
- `npm run dev:frontend-app` - Start dashboard app dev server (localhost:3001)

### Backend Development
- `npm run dev:backend` - Start backend dev server with watch mode
- `npm run start:dev --workspace=backend` - Alternative backend dev command

### Building
- `npm run build:shared` - Build shared package (run this first when shared types change)
- Individual workspaces can be built with: `npm run build --workspace=<workspace-name>`

### Linting & Quality Check
- Frontend: `npm run lint:frontend` (shorthand for `npm run lint --workspace=frontend`)
- Frontend-app: `npm run lint:frontend-app` (shorthand for `npm run lint --workspace=frontend-app`)
- Backend: `npm run lint --workspace=backend` (includes auto-fix)
- All frontend: `npm run lint` (runs both frontend workspaces)

### Testing (Backend)
- `npm run test --workspace=backend` - Run unit tests
- `npm run test:watch --workspace=backend` - Run tests in watch mode
- `npm run test:cov --workspace=backend` - Run tests with coverage
- `npm run test:e2e --workspace=backend` - Run end-to-end tests

### Backend Specific Commands
- `npm run format --workspace=backend` - Format code with Prettier
- `npm run openapi:gen --workspace=backend` - Generate OpenAPI documentation

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
2. **Shared Package**: When modifying shared types, run `npm run build:shared` first
3. **Port Configuration**:
   - Frontend (main): 3000
   - Frontend-app (dashboard): 3001
   - Backend API: 3001 (default, may conflict with frontend-app)
4. **Documentation**: Extensive docs available in `docs/` directory including architecture, tech stack, and development guides

## Code Quality Workflow (推荐执行顺序)

**开发期间质量检查**：
1. Lint 检查：`npm run lint:frontend-app` 或 `npm run lint:frontend`
2. 类型检查：`npm run build --workspace=frontend-app` (确保无 TypeScript 错误)
3. 如有 shared 类型变更：先执行 `npm run build:shared`

**代码提交前检查**：
```bash
# 全面检查
npm run lint                           # 检查所有前端代码
npm run build:shared                   # 构建共享类型
npm run build --workspace=frontend-app # 验证构建无错误
```

## Build Order for Deployment

1. Build shared package first: `npm run build:shared`
2. Build backend: `npm run build --workspace=backend`
3. Build frontend applications: `npm run build --workspace=frontend` and `npm run build --workspace=frontend-app`

## Common Issues

- If you get TypeScript errors about shared types, ensure the shared package is built first
- Both frontend-app and backend default to port 3001 - check actual backend port configuration
- The project uses Turbopack for faster Next.js builds (--turbopack flag)
- frontend-app 测试用户名：zhangsan@example.com 密码:111111
- ui界面组件优先使用 shadcn/ui, 可以使用shadcn工具查询.每次查询一个组件.如果在查询组件时遇到网络错误,可以尝试重试一次.