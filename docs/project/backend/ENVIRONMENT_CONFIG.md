# 环境配置指南

## 概述

此文档详细说明小大师Web后端应用的环境变量配置。配置系统采用分层设计，支持开发、测试和生产环境。

## 快速开始

1. **复制配置模板**：
   ```bash
   cp .env.example .env
   ```

2. **修改必要配置**：
   ```bash
   # 数据库连接（必须）
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=xiaodashi

   # JWT密钥（必须）
   JWT_ACCESS_SECRET=your-jwt-access-secret
   JWT_REFRESH_SECRET=your-jwt-refresh-secret
   ```

3. **启动应用**：
   ```bash
   pnpm run dev:backend
   ```

## 配置分类

### 1. 应用基础配置 (app.config.ts)

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `NODE_ENV` | `development` | 运行环境 |
| `APP_NAME` | `xiaodashi-web` | 应用名称 |
| `PORT` | `3001` | 服务端口 |
| `API_PREFIX` | `api` | API路径前缀 |
| `FRONTEND_URL` | `http://localhost:3000` | 前端URL |
| `FRONTEND_APP_URL` | `http://localhost:3001` | 管理端URL |

**特性开关**：
- `ENABLE_USER_REGISTRATION` - 用户注册功能
- `ENABLE_EMAIL_VERIFICATION` - 邮箱验证功能
- `ENABLE_2FA` - 双因子认证
- `ENABLE_SOCIAL_LOGIN` - 社交登录

### 2. JWT认证配置 (auth.config.ts)

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `JWT_ACCESS_SECRET` | ⚠️ **必须设置** | 访问令牌密钥 |
| `JWT_REFRESH_SECRET` | ⚠️ **必须设置** | 刷新令牌密钥 |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | 访问令牌过期时间 |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | 刷新令牌过期时间 |
| `JWT_ISSUER` | `xiaodashi-web` | JWT签发者 |
| `JWT_AUDIENCE` | `xiaodashi-users` | JWT受众 |

**密码加密**：
- `BCRYPT_SALT_ROUNDS` - 加密轮数（推荐12）

### 3. 安全配置 (security.config.ts)

**CORS设置**：
- `CORS_ORIGINS` - 允许的源地址（逗号分隔）
- `CORS_CREDENTIALS` - 是否允许凭证

**限流配置**：
- `RATE_LIMIT_WINDOW_MS` - 限流时间窗口
- `RATE_LIMIT_MAX_REQUESTS` - 最大请求数
- `LOGIN_RATE_LIMIT_WINDOW_MS` - 登录限流窗口
- `LOGIN_RATE_LIMIT_MAX_ATTEMPTS` - 登录最大尝试次数

### 4. 数据库配置 (database.config.ts)

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `DB_HOST` | ⚠️ **必须设置** | 数据库主机 |
| `DB_PORT` | `5432` | 数据库端口 |
| `DB_USER` | ⚠️ **必须设置** | 数据库用户 |
| `DB_PASSWORD` | ⚠️ **必须设置** | 数据库密码 |
| `DB_NAME` | ⚠️ **必须设置** | 数据库名称 |

**高级选项**：
- `DB_SSL` - SSL连接
- `DB_SYNCHRONIZE` - 自动同步结构（仅开发环境）
- `DB_LOGGING` - 查询日志级别

## 环境特定配置

### 开发环境 (NODE_ENV=development)

```bash
# 基础配置
NODE_ENV=development
PORT=3001
SWAGGER_ENABLED=true
DEBUG=true

# 数据库配置
DB_SYNCHRONIZE=true
DB_LOGGING=all

# 安全配置（宽松）
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
SHOW_ERROR_DETAILS=true
```

### 生产环境 (NODE_ENV=production)

```bash
# 基础配置
NODE_ENV=production
SWAGGER_ENABLED=false
DEBUG=false

# 数据库配置
DB_SYNCHRONIZE=false
DB_LOGGING=error
DB_SSL=true

# 安全配置（严格）
CORS_ORIGINS=https://yourdomain.com
SHOW_ERROR_DETAILS=false
RATE_LIMIT_MAX_REQUESTS=50
```

## 配置验证

应用启动时会自动验证必要的环境变量：

```typescript
const requiredEnvVars = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];
```

如果缺少任何必要变量，应用将拒绝启动并显示错误信息。

## 密钥生成

### JWT密钥
```bash
# 生成安全的JWT密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Session密钥
```bash
# 生成Session密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## CORS 配置最佳实践

### 配置格式

支持三种配置格式：

1. **精确匹配**（推荐用于生产环境）
   ```bash
   CORS_ORIGINS=https://app.xds.sxx0.com,https://admin.xds.sxx0.com
   ```

2. **通配符匹配**（适合多子域名场景）
   ```bash
   CORS_ORIGINS=https://*.sxx0.com
   ```

3. **正则表达式**（高级场景）
   ```bash
   CORS_ORIGINS=/^https:\/\/(app|admin)\.sxx0\.com$/
   ```

### 环境配置示例

**开发环境：**
```bash
NODE_ENV=development
# 开发环境自动允许 localhost，无需配置
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**生产环境（精确匹配）：**
```bash
NODE_ENV=production
CORS_ORIGINS=https://app.xds.sxx0.com,https://admin.xds.sxx0.com
CORS_CREDENTIALS=true
```

**生产环境（通配符）：**
```bash
NODE_ENV=production
CORS_ORIGINS=https://*.sxx0.com
CORS_CREDENTIALS=true
```

### CORS 安全建议

1. ✅ 生产环境优先使用精确匹配
2. ✅ 通配符仅用于可信的子域名
3. ✅ 始终启用 `CORS_CREDENTIALS=true`
4. ❌ 永远不要使用 `*` 允许所有域名
5. ❌ 不要在生产环境使用正则表达式（除非必要）

## 配置最佳实践

### 1. 安全原则
- ✅ 生产环境使用强密钥（32字符以上）
- ✅ 不要将`.env`文件提交到版本控制
- ✅ 定期轮换敏感密钥
- ✅ 使用环境变量管理工具（如AWS Secrets Manager）

### 2. 性能优化
- ✅ 配置合适的数据库连接池大小
- ✅ 设置合理的限流参数
- ✅ 生产环境关闭详细日志

### 3. 监控和调试
- ✅ 开发环境启用详细日志
- ✅ 配置健康检查端点
- ✅ 设置应用监控

## 故障排除

### 常见错误

1. **缺少必要环境变量**
   ```
   Error: 缺少必要的环境变量: JWT_ACCESS_SECRET, DB_PASSWORD
   ```
   **解决**: 检查`.env`文件是否正确配置所有必要变量

2. **数据库连接失败**
   ```
   Error: password authentication failed
   ```
   **解决**: 验证数据库连接信息是否正确

3. **端口冲突**
   ```
   Error: listen EADDRINUSE: address already in use
   ```
   **解决**: 更改`PORT`环境变量或停止占用端口的进程

### 调试技巧

1. **查看配置值**
   ```bash
   # 在开发环境中查看实际配置
   curl http://localhost:3001/api/health
   ```

2. **数据库连接测试**
   ```bash
   # 使用psql测试连接
   psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
   ```

## 更新日志

- `v1.0.0` - 初始配置系统
- 支持分层配置管理
- 环境变量验证
- 类型安全的配置接口

## 相关文档

- [数据库迁移指南](./DATABASE_MIGRATION.md)
- [部署指南](./DEPLOYMENT.md)
- [安全最佳实践](./SECURITY.md)