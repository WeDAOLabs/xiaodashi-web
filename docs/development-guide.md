# 开发指南

## 环境搭建

### 系统要求

- **Node.js**: 20.x LTS 或更高版本
- **包管理器**: pnpm 8.x (推荐) 或 npm 9.x
- **数据库**: PostgreSQL 16.x
- **缓存**: Redis 7.x
- **Git**: 2.x 或更高版本

### 开发环境安装

#### 1. 克隆项目
```bash
git clone <repository-url>
cd xiaodashi-web
```

#### 2. 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
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
# 启动 PostgreSQL 和 Redis (使用 Docker)
docker-compose up -d postgres redis

# 运行数据库迁移
cd backend
pnpm prisma migrate dev
pnpm prisma db seed
```

#### 5. 启动开发服务器
```bash
# 启动后端服务
cd backend
pnpm dev

# 启动前端服务 (新终端)
cd frontend
pnpm dev
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

## 前端开发指南

### React 组件开发

#### 函数组件最佳实践
```typescript
import React from 'react';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onEdit?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
      {onEdit && (
        <button 
          onClick={() => onEdit(user)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          编辑
        </button>
      )}
    </div>
  );
};
```

#### 自定义 Hooks
```typescript
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return { user, loading };
};
```

### 状态管理 (Zustand)

#### 基础 Store 创建
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        
        login: async (credentials) => {
          try {
            const response = await api.post('/auth/login', credentials);
            const { user, token } = response.data;
            
            localStorage.setItem('token', token);
            set({ user, isAuthenticated: true });
          } catch (error) {
            throw new Error('登录失败');
          }
        },
        
        logout: () => {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        },
        
        updateUser: (userData) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, ...userData } });
          }
        },
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
);
```

#### Store 切片模式
```typescript
import { create, StateCreator } from 'zustand';

interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface UISlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

const createAuthSlice: StateCreator<
  AuthSlice & UISlice,
  [],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // 登录逻辑
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
});

const createUISlice: StateCreator<
  AuthSlice & UISlice,
  [],
  [],
  UISlice
> = (set) => ({
  theme: 'light',
  sidebarOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
});

export const useAppStore = create<AuthSlice & UISlice>()((...args) => ({
  ...createAuthSlice(...args),
  ...createUISlice(...args),
}));
```

### 样式开发 (Tailwind CSS)

#### 组件样式规范
```typescript
// 使用 Tailwind 类名
const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### 响应式设计
```typescript
const ResponsiveGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 移动端 1 列，平板 2 列，桌面 3 列 */}
    </div>
  );
};
```

### API 集成

#### API 客户端配置
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### React Query 使用
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 查询数据
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
};

// 创建用户
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: CreateUserData) => 
      api.post('/users', userData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## 后端开发指南

### NestJS 应用结构

NestJS 强制使用一种有组织的、基于模块的架构。核心概念包括模块（Modules）、控制器（Controllers）和服务（Services）。

- **模块 (`@Module`)**: 用于组织应用结构。每个应用至少有一个根模块 (`AppModule`)。
- **控制器 (`@Controller`)**: 负责处理传入的请求和向客户端返回响应。通过装饰器（如 `@Get`, `@Post`）将路由绑定到处理方法。
- **服务 (`@Injectable`)**: 负责处理业务逻辑。服务是“可注入的”，意味着可以被控制器或其他服务依赖。

#### 应用入口文件 (`main.ts`)
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 设置全局 API 前缀, e.g., /api/v1
  app.setGlobalPrefix('api/v1');
  
  // 启用 CORS
  app.enableCors();
  
  await app.listen(process.env.PORT || 3001);
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
import { PrismaService } from '../prisma/prisma.service'; // 假设 Prisma 服务已创建

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
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

### 数据库操作 (Prisma)

NestJS 与 Prisma 的集成非常成熟。通常会创建一个 `PrismaModule` 和 `PrismaService` 来在整个应用中共享数据库连接。

#### Schema 定义
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

#### 数据库迁移
```bash
# 创建迁移
npx prisma migrate dev --name add_user_table

# 应用迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

### 数据验证 (Pipes & DTOs)

NestJS 使用管道（Pipes）和数据传输对象（DTOs）来处理输入验证，通常与 `class-validator` 和 `class-transformer` 库结合使用。

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

### 前端测试

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

### 后端测试

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

#### 集成测试
```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Auth API', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

## 部署指南

### 开发环境部署

#### Docker Compose 配置
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: xiaodashi_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/xiaodashi_dev
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 启动开发环境
```bash
# 启动所有服务
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

### 生产环境部署

#### 生产 Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 8000
CMD ["npm", "start"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

## 性能优化

### 前端优化

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

### 后端优化

#### 数据库查询优化
```typescript
// 使用 Prisma 的 select 和 include
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
  where: {
    active: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 20,
});
```

#### 缓存策略
```typescript
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

### 日志记录
```typescript
// 后端日志中间件
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
    });
  });
  
  next();
};
```

## 总结

本开发指南涵盖了智商180的AI全域营销大师 Web 项目的完整开发流程，包括：

1. **环境搭建**: 详细的开发环境配置步骤
2. **开发规范**: 代码风格、命名规范、Git 工作流
3. **前端开发**: React 组件、状态管理、样式开发、API 集成
4. **后端开发**: NestJS 应用结构、数据库操作、DTO 及验证管道
5. **测试指南**: 前端和后端的测试策略
6. **部署指南**: 开发和生产环境的部署方案
7. **性能优化**: 前后端性能优化技巧
8. **监控日志**: 错误监控和日志记录

遵循这些指南可以确保项目的代码质量、可维护性和性能表现。建议团队成员仔细阅读并严格执行这些规范。