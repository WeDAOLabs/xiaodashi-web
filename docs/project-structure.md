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
├── frontend/                      # 前端项目 (Next.js)
├── backend/                       # 后端项目 (NestJS)
├── shared/                        # 共享代码和类型定义
├── docker/                        # Docker 配置文件
├── scripts/                       # 部署和构建脚本
├── .github/                       # GitHub Actions 配置
├── .gitignore                     # Git 忽略文件
├── docker-compose.yml             # Docker Compose 配置
├── package.json                   # 根项目配置
└── README.md                      # 项目说明
```

## 前端项目结构 (frontend/)

```
frontend/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # 认证相关页面组
│   │   │   ├── login/            # 登录页面
│   │   │   │   └── page.tsx
│   │   │   ├── register/         # 注册页面
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx        # 认证页面布局
│   │   ├── dashboard/            # 仪表板
│   │   │   ├── page.tsx          # 仪表板首页
│   │   │   ├── profile/          # 用户资料
│   │   │   └── settings/         # 设置页面
│   │   ├── api/                  # API 路由 (可选)
│   │   │   └── auth/             # 认证相关 API
│   │   ├── globals.css           # 全局样式
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # 首页
│   │   └── not-found.tsx         # 404 页面
│   ├── components/               # 可复用组件
│   │   ├── ui/                   # 基础 UI 组件
│   │   │   ├── button.tsx        # 按钮组件
│   │   │   ├── input.tsx         # 输入框组件
│   │   │   ├── modal.tsx         # 模态框组件
│   │   │   ├── table.tsx         # 表格组件
│   │   │   └── index.ts          # 导出文件
│   │   ├── forms/                # 表单组件
│   │   │   ├── login-form.tsx    # 登录表单
│   │   │   ├── register-form.tsx # 注册表单
│   │   │   └── profile-form.tsx  # 资料表单
│   │   ├── layout/               # 布局组件
│   │   │   ├── header.tsx        # 头部组件
│   │   │   ├── sidebar.tsx       # 侧边栏组件
│   │   │   ├── footer.tsx        # 底部组件
│   │   │   └── navigation.tsx    # 导航组件
│   │   ├── features/             # 功能组件
│   │   │   ├── auth/             # 认证相关组件
│   │   │   ├── dashboard/        # 仪表板组件
│   │   │   └── user/             # 用户相关组件
│   │   └── providers/            # 上下文提供者
│   │       ├── auth-provider.tsx # 认证上下文
│   │       └── theme-provider.tsx # 主题上下文
│   ├── lib/                      # 工具函数和配置
│   │   ├── api.ts                # API 客户端配置
│   │   ├── auth.ts               # 认证相关工具
│   │   ├── utils.ts              # 通用工具函数
│   │   ├── constants.ts          # 常量定义
│   │   ├── validations.ts        # 表单验证规则
│   │   └── config.ts             # 配置文件
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── use-auth.ts           # 认证 Hook
│   │   ├── use-api.ts            # API 调用 Hook
│   │   ├── use-local-storage.ts  # 本地存储 Hook
│   │   └── use-debounce.ts       # 防抖 Hook
│   ├── store/                    # 状态管理
│   │   ├── auth-store.ts         # 认证状态
│   │   ├── user-store.ts         # 用户状态
│   │   ├── ui-store.ts           # UI 状态
│   │   └── index.ts              # 状态导出
│   ├── types/                    # TypeScript 类型定义
│   │   ├── auth.ts               # 认证相关类型
│   │   ├── user.ts               # 用户相关类型
│   │   ├── api.ts                # API 相关类型
│   │   └── common.ts             # 通用类型
│   └── styles/                   # 样式文件
│       ├── globals.css           # 全局样式
│       ├── components.css        # 组件样式
│       └── utilities.css         # 工具类样式
├── public/                       # 静态资源
│   ├── images/                   # 图片资源
│   ├── icons/                    # 图标资源
│   ├── favicon.ico               # 网站图标
│   └── manifest.json             # PWA 配置
├── tests/                        # 测试文件
│   ├── __mocks__/                # Mock 文件
│   ├── components/               # 组件测试
│   ├── pages/                    # 页面测试
│   └── utils/                    # 工具函数测试
├── .env.local                    # 本地环境变量
├── .env.example                  # 环境变量示例
├── .eslintrc.json                # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── jest.config.js                # Jest 测试配置
├── next.config.js                # Next.js 配置
├── package.json                  # 项目依赖
├── tailwind.config.js            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 前端项目说明
```

## 后端项目结构 (backend/)

```
backend/
├── src/
│   ├── app.controller.ts    # 应用根控制器
│   ├── app.module.ts        # 应用根模块
│   ├── app.service.ts       # 应用根服务
│   ├── main.ts              # 应用入口文件
│   ├── users/               # 示例：用户模块
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/               # 数据传输对象
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/          # 数据实体
│   │       └── user.entity.ts
│   ├── auth/                # 示例：认证模块
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   └── common/                # 通用模块/工具
│       ├── decorators/
│       ├── guards/
│       └── pipes/
├── test/                    # 测试文件
│   ├── app.e2e-spec.ts      # e2e 测试
│   └── jest-e2e.json        # e2e 测试配置
├── .eslintrc.js             # ESLint 配置
├── nest-cli.json            # NestJS CLI 配置文件
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
- 使用 PascalCase: `UserProfile.tsx`
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
- 前端: 页面 → 组件 → 工具
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

1. **清晰分层**: 前端、后端、共享代码分离
2. **模块化**: 按功能模块组织代码
3. **可维护性**: 合理的目录结构和命名规范
4. **可扩展性**: 预留扩展空间，便于后续功能添加
5. **团队协作**: 统一的代码组织方式，便于团队开发

通过这样的项目结构，可以确保代码的可读性、可维护性和可扩展性，为项目的长期发展奠定良好的基础。
