# 智赢 AI 营销平台 - 应用产品平台

这是智赢 AI 营销平台的应用产品平台前端项目，基于 Next.js 15 构建。

## 技术栈

与主项目 `frontend` 保持完全一致：

- **框架**: Next.js 15.5.2 + React 19.1.0
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS v4.1.13
- **字体**: Noto Sans SC + Spline Sans
- **工具**: ESLint + Prettier

## 项目结构

```
frontend-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式 (Tailwind v4)
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── lib/                   # 工具函数
│   └── utils.ts           # 通用工具
├── fonts/                 # 字体文件
├── public/                # 静态资源
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── next.config.ts         # Next.js 配置
├── postcss.config.js      # PostCSS 配置
└── eslint.config.mjs      # ESLint 配置
```

## 开发命令

### 启动开发服务器

```bash
# 在项目根目录运行
pnpm run dev:frontend-app

# 或直接在 frontend-app 目录运行
cd frontend-app
pnpm run dev
```

项目将在 `http://localhost:3001` 启动。

### 构建项目

```bash
# 在项目根目录运行
pnpm --filter frontend-app build

# 或直接在 frontend-app 目录运行
cd frontend-app
pnpm run build
```

### 启动生产服务器

```bash
cd frontend-app
pnpm run start
```

## 特性

- ✅ Next.js 15 最新特性
- ✅ React 19 并发特性
- ✅ Tailwind CSS v4 配置
- ✅ TypeScript 严格模式
- ✅ 中文字体优化
- ✅ 响应式设计
- ✅ 端口 3001 配置

## 开发规范

遵循项目统一的开发规范：

1. **组件 Props 类型**: 所有 React 组件 props 必须显式类型化
2. **样式规范**: 使用 CSS 变量，禁止硬编码颜色值
3. **路径别名**: 使用 `@/` 作为 `frontend-app/` 的别名
4. **依赖管理**: 使用 pnpm workspaces 管理依赖

## 与主项目的关系

- 与 `frontend` 项目共享相同的技术栈和配置
- 独立的端口 (3001) 避免冲突
- 共享字体和样式规范
- 遵循相同的开发约定

## 部署

项目支持多种部署方式：

- **Vercel**: 推荐，零配置部署
- **Docker**: 使用项目根目录的 Docker 配置
- **静态导出**: `pnpm run build` 后部署 `out` 目录

## 开发注意事项

1. 确保 Node.js 版本 >= 18.14.0
2. 使用 `pnpm --filter frontend-app add <package>` 安装依赖
3. 遵循 KISS 原则，保持代码简洁
4. 所有图片资源需要本地化存储
