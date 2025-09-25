# 肖大师营销大师 Web 开发指南

## 环境搭建

### 系统要求

- **Node.js**: 20.x LTS 或更高版本
- **包管理器**: pnpm 8.x (推荐)
- **数据库**: PostgreSQL 16.x 或 17.x
- **缓存**: Redis 7.x（可选，当前使用 PostgreSQL 作为缓存）
- **Git**: 2.x 或更高版本

### 项目架构 (Monorepo)

```
xiaodashi-web/
├── frontend/           # 主网站 (Next.js) - :3000
├── frontend-app/       # 管理后台 (Next.js) - :3001
├── frontend-app-demo/  # 演示应用 (Next.js)
├── backend/           # API 服务 (NestJS) - :2999
└── shared/            # 共享类型库 (TypeScript)
```

### 开发环境安装

#### 1. 克隆项目
```bash
git clone <repository-url>
cd xiaodashi-web
```

#### 2. 安装依赖
```bash
# 使用 pnpm
pnpm install
```

#### 3. 环境配置
```bash
# 复制环境变量文件
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

#### 4. 数据库设置
```bash
# 启动 PostgreSQL (使用 Docker 或本地安装)
docker-compose up -d postgres

# 运行数据库迁移
cd backend
# 使用 TypeORM 迁移
pnpm run migration:run
```

#### 5. 启动开发服务器

使用 Monorepo 统一命令（从项目根目录执行）：

```bash
# 启动后端 API 服务 (http://localhost:2999)
pnpm run dev:backend

# 启动主网站 (http://localhost:3000)
pnpm run dev:frontend

# 启动管理后台 (http://localhost:3001)
pnpm run dev:frontend-app

# 启动演示应用
pnpm run dev:frontend-app-demo

# 构建共享类型库 (当 shared 类型变更时优先执行)
pnpm run build:shared
```

#### 6. 代码质量检查
```bash
# 前端代码检查
pnpm run lint                    # 所有前端项目
pnpm run lint:frontend           # 主网站
pnpm run lint:frontend-app       # 管理后台

# 后端代码检查和格式化
pnpm --filter backend lint       # 包含自动修复
pnpm --filter backend format     # Prettier 格式化
```

## 开发规范

### 代码风格

#### TypeScript 配置
项目使用严格的 TypeScript 配置，确保类型安全：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### ESLint 规则
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error"
  }
}
```

### 文件命名规范

#### 组件文件
- 使用 PascalCase: `UserProfile.tsx`
- 页面文件使用小写: `page.tsx`
- 布局文件使用小写: `layout.tsx`

#### 工具文件
- 使用 camelCase: `authUtils.ts`
- 常量文件使用 UPPER_CASE: `API_CONSTANTS.ts`

#### 类型文件
- 使用 camelCase: `userTypes.ts`
- 接口使用 PascalCase: `IUser`, `UserResponse`

### Git 工作流

#### 分支策略
```
main (生产环境)
├── develop (开发环境)
├── feature/功能名称 (功能开发)
├── hotfix/修复名称 (紧急修复)
└── release/版本号 (发布准备)
```

#### 提交信息规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type):**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例:**
```
feat(auth): add JWT token validation

- Implement token expiration check
- Add refresh token mechanism
- Update authentication middleware

Closes #123
```

## 后端开发指南

### NestJS 11.0.1 应用结构

项目使用 NestJS 11.0.1 + TypeScript 5.7.3，采用模块化架构：

- **模块 (`@Module`)**: 组织应用结构，根模块 `AppModule`
- **控制器 (`@Controller`)**: 处理 HTTP 请求，路由绑定
- **服务 (`@Injectable`)**: 业务逻辑处理，依赖注入

### 当前项目结构

```
backend/
├── src/
│   ├── app.module.ts           # 根模块
│   ├── main.ts                 # 应用入口，端口 2999
│   ├── config/                 # 配置文件
│   │   ├── app.config.ts
│   │   ├── auth.config.ts
│   │   └── security.config.ts
│   ├── database/               # 数据库配置
│   │   ├── database.config.ts
│   │   └── entities/           # TypeORM 实体
│   │       ├── user/           # 用户模块实体
│   │       └── auth/           # 认证模块实体
│   ├── health/                 # 健康检查
│   └── common/                 # 共享组件
└── test/                       # 测试文件
```

#### 实际应用入口文件 (`main.ts`)
```typescript
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const appConfig = configService.get('app');
  const securityConfig = configService.get('security');

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API 路径前缀
  if (appConfig?.apiPrefix) {
    app.setGlobalPrefix(appConfig.apiPrefix);
  }

  // CORS 配置
  app.enableCors({
    origin: securityConfig?.cors.origins || ['http://localhost:3000'],
    credentials: securityConfig?.cors.credentials || true,
  });

  // Swagger 文档配置
  if (appConfig?.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(`${appConfig.name} API`)
      .setDescription('肖大师营销大师 Web API 文档')
      .setVersion(appConfig.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appConfig.swagger.path, app, document);
  }

  // 启动应用 - 端口 2999
  await app.listen(appConfig?.port || 2999);

  logger.log(`🚀 应用启动成功！`);
  logger.log(`🌐 服务地址: http://localhost:${appConfig?.port || 2999}`);
}
bootstrap();
```

#### 控制器模式 (`*.controller.ts`)
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users') // 路由前缀为 /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
```

#### 服务层模式 (`*.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'name', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    // 遵循统一响应格式
    return {
      success: true,
      data: users,
      message: '获取用户列表成功',
      code: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### 数据库操作 (TypeORM 0.3.27)

项目使用 TypeORM 0.3.27 与 NestJS 11.0.1 深度集成，支持 PostgreSQL。

#### 实体定义示例
```typescript
// src/database/entities/user/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['USER', 'ADMIN', 'MODERATOR'], default: 'USER' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 数据库迁移 (TypeORM)
```bash
# 生成迁移
pnpm run migration:generate --name AddUserTable

# 运行迁移
pnpm run migration:run

# 回滚迁移
pnpm run migration:revert

# 查看迁移状态
pnpm run migration:show
```

#### 已配置的实体模块
- **用户模块**: User、UserProfile、UserSession、UserLoginLog
- **权限模块**: Permission、RolePermission

### 数据验证 (DTOs & Validation)

项目计划使用 `class-validator` 和 `class-transformer` 进行数据验证（待实现）。

#### 创建 DTO (`create-user.dto.ts`)
```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

#### 在控制器中使用 DTO
```typescript
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  // ...

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```
要全局启用验证，可以在 `main.ts` 中添加 `app.useGlobalPipes(new ValidationPipe());`。

## 测试指南

### 前端测试 (待配置)

**推荐技术栈**: Jest + React Testing Library
- Jest 是 React 官方推荐的测试框架
- React Testing Library 专注于用户行为测试
- 与 Next.js 集成良好

#### 组件测试
```typescript
// __tests__/components/UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '@/components/UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('编辑'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Hook 测试
```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('should initialize with null user and loading true', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
```

### 后端测试 (Jest 30.0.0 + Supertest 7.0.0)

**当前配置**: 已配置完整的测试环境
```bash
# 运行测试
pnpm --filter backend test

# 监视模式
pnpm --filter backend test:watch

# 测试覆盖率
pnpm --filter backend test:cov

# E2E 测试
pnpm --filter backend test:e2e
```

#### 单元测试
```typescript
// tests/services/user.service.test.ts
import { UserService } from '../../src/services/user.service';
import { PrismaClient } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
    } as any;
    
    userService = new UserService(mockPrisma);
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { id: '1', name: 'John', email: 'john@example.com' },
      ];
      
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(1);

      const result = await userService.getUsers({
        page: 1,
        limit: 10,
      });

      expect(result.items).toEqual(mockUsers);
      expect(result.pagination.total).toBe(1);
    });
  });
});
```

#### E2E 测试示例
```typescript
// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 部署指南 (待配置)

### 推荐部署方案

- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **进程管理**: PM2
- **错误监控**: Sentry

### 开发环境 Docker Compose 示例
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: xiaodashi_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis 可选，当前使用 PostgreSQL 作为缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "2999:2999"  # 更新端口
    environment:
      - NODE_ENV=development
      - PORT=2999
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/xiaodashi_dev
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:2999/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  frontend-app:
    build:
      context: ./frontend-app
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:2999/api
    volumes:
      - ./frontend-app:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 开发环境命令
```bash
# 启动所有服务
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f backend

# 重建并启动
docker-compose -f docker-compose.dev.yml up --build

# 停止服务
docker-compose -f docker-compose.dev.yml down

# 清理数据卷
docker-compose -f docker-compose.dev.yml down -v
```

### 生产环境部署

#### 生产 Dockerfile 示例
```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@8

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner

RUN npm install -g pnpm@8

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 2999
CMD ["pnpm", "run", "start:prod"]
```

```dockerfile
# frontend/Dockerfile (主网站)
FROM node:20-alpine AS builder

RUN npm install -g pnpm@8

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```dockerfile
# frontend-app/Dockerfile (管理后台)
FROM node:20-alpine AS builder

RUN npm install -g pnpm@8

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3001
CMD ["node", "server.js"]
```

## 性能优化

### 前端优化 (Next.js 15 + Turbopack)

**当前优化**:
- 使用 Turbopack 加速开发构建
- Next.js 15 内置性能优化
- Tailwind CSS v4 更小运行时开销

#### 代码分割
```typescript
// 动态导入组件
const UserProfile = dynamic(() => import('@/components/UserProfile'), {
  loading: () => <div>Loading...</div>,
});

// 路由级别的代码分割
const Dashboard = dynamic(() => import('@/pages/dashboard'), {
  ssr: false,
});
```

#### 图片优化
```typescript
import Image from 'next/image';

const OptimizedImage = () => {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
};
```

### 后端优化 (NestJS + TypeORM)

#### 数据库查询优化
```typescript
// 使用 TypeORM 的 select 和 relations
const users = await this.userRepository.find({
  select: ['id', 'name', 'email', 'createdAt'],
  relations: ['profile'],
  where: {
    active: true,
  },
  order: {
    createdAt: 'DESC',
  },
  take: 20,
  skip: (page - 1) * 20,
});

// 使用 QueryBuilder 复杂查询
const users = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .where('user.active = :active', { active: true })
  .orderBy('user.createdAt', 'DESC')
  .limit(20)
  .getMany();
```

#### 连接池优化
```typescript
// database.config.ts 中已配置
extra: {
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
},
```

#### 缓存策略 (待实现)
```typescript
// 当前使用 PostgreSQL 作为缓存
// 后续可集成 Redis

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedUsers = async () => {
  const cacheKey = 'users:list';
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const users = await userService.getUsers();
  await redis.setex(cacheKey, 300, JSON.stringify(users)); // 5 分钟缓存

  return users;
};
```

## 监控和日志

### 错误监控
```typescript
// 前端错误边界
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>出现了一些问题:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>重试</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // 发送错误到监控服务
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      <MyApp />
    </ErrorBoundary>
  );
}
```

### 日志记录 (待实现)

**推荐方案**: Winston
```typescript
// 后端日志配置示例
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    }),
  ],
});

// NestJS 中间件
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });
  });

  next();
};
```

## 总结

本开发指南涵盖了肖大师营销大师 Web 项目的完整开发流程：

### 已完成配置
1. **Monorepo 架构**: pnpm workspaces 管理 5 个子包
2. **后端框架**: NestJS 11.0.1 + TypeScript 5.7.3 + TypeORM 0.3.27
3. **前端框架**: Next.js 15.5.2 + React 19.1.0 + Tailwind CSS 4.1.13
4. **数据库**: PostgreSQL 连接配置和实体定义
5. **测试环境**: Jest 30.0.0 + Supertest 7.0.0 (后端)
6. **开发工具**: ESLint 9.x + Prettier (后端)

### 待实现功能
1. **认证系统**: JWT + bcrypt
2. **数据验证**: class-validator + class-transformer
3. **前端状态**: Zustand + TanStack Query
4. **HTTP 客户端**: Axios
5. **日志系统**: Winston
6. **部署配置**: Docker + CI/CD

### 开发优先级
1. 先完成认证系统和核心业务功能
2. 关键业务逻辑优先编写测试
3. 及时更新 API 文档和组件文档
4. 充分利用 TypeScript 和 ESLint 保证代码质量

遵循这些指南可以确保项目的代码质量、可维护性和性能表现。