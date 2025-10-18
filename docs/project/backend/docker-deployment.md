# Docker 部署指南

## 快速开始

### 完整部署流程

```bash
# 1. 构建镜像（生成 latest 和 v1.0.0 两个标签）
./backend/scripts/build-docker.sh prod

# 2. 推送到阿里云（需先配置凭证）
./backend/scripts/push-docker.sh \
  registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest
./backend/scripts/push-docker.sh \
  registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:v1.0.0

# 3. 服务器部署
# 3.1 准备配置文件
cp .env.example .env
cp .env.docker.example .env.docker
# 编辑配置文件...

# 3.2 拉取镜像
docker compose --env-file .env.docker -f docker-compose.prod.yml pull

# 3.3 执行 migration
docker compose --env-file .env.docker -f docker-compose.prod.yml run --rm migration

# 3.4 启动应用
docker compose --env-file .env.docker -f docker-compose.prod.yml up -d backend
```

## 目录结构

```
backend/
├── Dockerfile                 # 镜像构建文件
├── .dockerignore              # 构建忽略文件
├── entrypoint.sh              # 应用启动脚本
├── run-migration.sh           # Migration 执行脚本
├── wait-for-db.sh             # 数据库等待脚本
├── .env.example               # 本地开发环境变量模板
├── scripts/                   # 构建脚本
│   ├── build-docker.sh        # 构建脚本
│   ├── push-docker.sh         # 推送脚本
│   └── deploy-docker.sh       # 部署脚本
└── docker/                    # Docker 部署文件（上传到服务器）
    ├── docker-compose.yml     # 开发环境编排
    ├── docker-compose.prod.yml # 生产环境编排
    ├── .env.example           # 应用配置模板（330行）
    └── .env.docker.example    # Docker 配置模板（80行）
```

## 1. 构建镜像

```bash
# 进入项目根目录
cd xiaodashi-web

# 构建生产环境镜像
./backend/scripts/build-docker.sh prod -t v1.0.0

# 构建开发环境镜像
./backend/scripts/build-docker.sh dev
```

## 2. 配置说明

### 配置文件分离原则

Docker 部署采用配置分离设计，分为两个独立的配置文件：

**`.env` - 应用配置**（330行）
- 数据库连接（PostgreSQL、Redis）
- 认证配置（JWT、密码加密）
- 安全配置（CORS、限流）
- 业务配置（用户注册、邮箱验证等）
- 第三方服务（OSS、短信、邮件）

**`.env.docker` - Docker 配置**（80行）
- Docker Compose 项目名称
- 镜像名称和版本标签
- 容器资源限制
- Docker 日志配置
- 阿里云镜像仓库凭证

**优势：**
- 配置职责清晰，互不干扰
- 应用配置可复用于多种部署方式
- 避免重复维护相同配置

### 环境变量加载顺序

Docker Compose 读取配置的优先级（从低到高）：

```
1. .env (应用配置)
   ↓ 低优先级，提供基础配置
2. .env.docker (Docker 配置)
   ↓ 中优先级，可以覆盖 .env 中的值
3. docker-compose.yml 中的 environment (硬编码)
   ↓ 高优先级，强制覆盖
```

**示例：**
- `.env` 中设置 `NODE_ENV=development`
- `.env.docker` 中可以覆盖为 `NODE_ENV=production`
- `docker-compose.prod.yml` 的 `environment` 中强制设为 `NODE_ENV=production`

这样设计确保生产环境的关键配置（如 `SWAGGER_ENABLED=false`）不会被意外修改。

### ⚠️ 重要：--env-file 参数说明

**必须使用 `--env-file .env.docker` 参数：**

```bash
# ✅ 正确 - 会读取 .env.docker 中的 IMAGE_TAG 等变量
docker compose --env-file .env.docker -f docker-compose.prod.yml up -d

# ❌ 错误 - Docker Compose 无法读取 IMAGE_TAG，会使用默认值 latest
docker compose -f docker-compose.prod.yml up -d
```

**原因说明：**

`docker-compose.yml` 文件中的 `env_file` 配置项：
```yaml
env_file:
  - .env
  - .env.docker
```

**仅对容器内生效**，用于向运行中的容器注入环境变量。

但 `docker-compose.yml` 文件本身的变量替换（如 `${IMAGE_TAG}`）发生在 Docker Compose **解析 yml 文件时**，这时需要**宿主机的环境变量**。

因此必须使用 `--env-file` 参数告诉 Docker Compose 在解析 yml 文件时读取 `.env.docker` 文件。

## 3. 推送到阿里云

### 前置条件

1. 已通过 `build-docker.sh` 构建镜像
2. 有阿里云镜像仓库的访问权限
3. 已配置阿里云登录凭证

### 配置推送凭证

在 `backend/docker/.env.docker` 中配置：

```bash
# 阿里云镜像仓库凭证
ALIYUN_DOCKER_USERNAME=布鲁托2000
ALIYUN_DOCKER_PASSWORD=your_password
```

**注意**：请妥善保管凭证，不要提交到代码仓库。

### 推送镜像

#### 方式 1：使用配置文件（推荐）

```bash
# 构建镜像（自动生成 latest 和 v1.0.0 两个标签）
./backend/scripts/build-docker.sh prod

# 推送 latest 标签
./backend/scripts/push-docker.sh \
  registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest

# 推送版本标签
./backend/scripts/push-docker.sh \
  registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:v1.0.0
```

#### 方式 2：命令行参数

```bash
# 推送时直接指定用户名和密码
./backend/scripts/push-docker.sh \
  registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest \
  --username 布鲁托2000 \
  --password 'your_password'
```

#### 方式 3：测试模式（Dry Run）

```bash
# 不实际推送，仅测试流程
./backend/scripts/push-docker.sh \
  registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest \
  --dry-run
```

### 验证推送结果

```bash
# 查看阿里云镜像列表（需要阿里云 CLI）
# 或访问阿里云容器镜像服务控制台查看

# 本地测试拉取
docker pull registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest
docker pull registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:v1.0.0
```

### 推送常见问题

#### Q: 推送提示"镜像不存在"？

A: 请先使用 `build-docker.sh` 构建镜像：
```bash
./backend/scripts/build-docker.sh prod
```

#### Q: 推送提示"用户名或密码错误"？

A: 检查 `backend/docker/.env.docker` 中的凭证配置是否正确。

#### Q: 如何推送到不同的区域？

A: 修改镜像名称中的 registry 地址：
```bash
# 北京区域
registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest

# 杭州区域
registry.cn-hangzhou.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest
```

## 4. 服务器部署

### 准备服务器

1. 安装 Docker 和 Docker Compose
2. 创建部署目录：`mkdir -p /opt/xiaodashi/backend`
3. 上传 `backend/docker/` 目录下的所有文件到服务器

### 配置环境变量

需要配置 **两个** 环境文件：

#### 步骤 1：配置应用环境（.env）

```bash
# 复制应用配置模板
cp .env.example .env

# 编辑应用配置
vim .env
```

关键配置项：
```bash
# 运行环境
NODE_ENV=production
PORT=2999

# 前端应用 URL
FRONTEND_URL=https://your-domain.com
FRONTEND_APP_URL=https://app.your-domain.com

# 阿里云 PostgreSQL
DB_HOST=pg-xxxxx.pg.rds.aliyuncs.com
DB_PORT=5432
DB_USER=xiaodashi
DB_PASSWORD=your_secure_password
DB_NAME=xiaodashi_prod
DB_SSL=true

# 阿里云 Redis（可选）
REDIS_HOST=r-xxxxx.redis.rds.aliyuncs.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT 密钥（必须修改）
JWT_ACCESS_SECRET=生成的强密钥
JWT_REFRESH_SECRET=生成的强密钥

# CORS 配置
CORS_ORIGINS=https://your-domain.com,https://app.your-domain.com

# 安全配置
CAPTCHA_ENABLED=true
SWAGGER_ENABLED=false
DEBUG=false
SHOW_ERROR_DETAILS=false
```

#### 步骤 2：配置 Docker 环境（.env.docker）

```bash
# 复制 Docker 配置模板
cp .env.docker.example .env.docker

# 编辑 Docker 配置
vim .env.docker
```

关键配置项：
```bash
# Docker Compose 项目名称
COMPOSE_PROJECT_NAME=xiaodashi-app-backend

# 镜像配置
IMAGE_NAME=registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend
IMAGE_TAG=latest

# 资源限制
CPU_LIMIT=2.0
MEMORY_LIMIT=2G
CPU_RESERVATION=0.5
MEMORY_RESERVATION=512M

# Docker 日志配置
LOG_MAX_SIZE=10m
LOG_MAX_FILES=3
```

## 使用方法

### 方式 1：使用 Docker Compose（推荐）

```bash
# 1. 启动应用（不会自动执行 migration）
docker compose --env-file .env.docker -f docker-compose.prod.yml up -d

# 2. 查看应用日志（会提示是否有待执行的 migration）
docker compose --env-file .env.docker -f docker-compose.prod.yml logs backend

# 3. 手动执行 migration
docker compose --env-file .env.docker -f docker-compose.prod.yml run --rm migration

# 4. 查看 migration 执行日志
docker compose --env-file .env.docker -f docker-compose.prod.yml logs migration
```

## 完整部署流程

### 初次部署

```bash
# 1. 准备应用配置文件
cp .env.example .env
# 编辑 .env 配置数据库、JWT、CORS等应用配置

# 2. 准备 Docker 配置文件
cp .env.docker.example .env.docker
# 编辑 .env.docker 配置镜像、资源限制等

# 3. 拉取镜像
docker compose --env-file .env.docker -f docker-compose.prod.yml pull

# 4. 执行 migration
docker compose --env-file .env.docker -f docker-compose.prod.yml run --rm migration

# 5. 启动应用
docker compose --env-file .env.docker -f docker-compose.prod.yml up -d backend

# 6. 健康检查
curl http://localhost:2999/health
```

### 更新部署

```bash
# 1. 拉取新镜像
docker compose --env-file .env.docker -f docker-compose.prod.yml pull

# 2. 备份数据库（推荐）
# pg_dump -h <host> -U <user> -d <database> > backup.sql

# 3. 执行新的 migration
docker compose --env-file .env.docker -f docker-compose.prod.yml run --rm migration

# 4. 重启应用
docker compose --env-file .env.docker -f docker-compose.prod.yml up -d backend

# 5. 验证
curl http://localhost:2999/health
```

## Migration 管理命令

### 查看 Migration 状态

```bash
docker exec -it xiaodashi-backend-prod sh -c \
  "node ./node_modules/.bin/typeorm migration:show -d ./backend/dist/typeorm.config.js"
```

### 回滚 Migration

```bash
docker exec -it xiaodashi-backend-prod sh -c \
  "node ./node_modules/.bin/typeorm migration:revert -d ./backend/dist/typeorm.config.js"
```

## 常见问题

### Q: 应用启动时提示有待执行的 Migration 怎么办？

A: 这是正常的提示，按照提示执行即可：
```bash
docker compose --env-file .env.docker -f docker-compose.prod.yml run --rm migration
```

### Q: Migration 执行失败怎么办？

A: 
1. 查看详细日志：`docker compose --env-file .env.docker -f docker-compose.prod.yml logs migration`
2. 检查数据库连接配置
3. 检查数据库用户权限
4. 如果需要，恢复数据库备份

### Q: 如何在 CI/CD 中集成？

A: 
```yaml
# GitHub Actions 示例
- name: Run Database Migration
  run: |
    docker compose --env-file .env.docker -f docker-compose.prod.yml run --rm migration
    
- name: Deploy Application
  run: |
    docker compose --env-file .env.docker -f docker-compose.prod.yml up -d backend
```

### Q: 可以恢复自动执行 Migration 吗？

A: 不推荐。但如果确实需要，可以修改 `entrypoint.sh` 中的 `run_migrations()` 函数，改回自动执行模式。

## 技术细节

### Migration 脚本位置
- `/app/run-migration.sh` - Migration 执行脚本
- `/app/backend/dist/typeorm.config.js` - TypeORM 配置文件

### 环境变量
Migration 使用与应用相同的环境变量：
- `DB_HOST` - 数据库主机
- `DB_PORT` - 数据库端口
- `DB_USER` - 数据库用户
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称

### 网络
Migration 容器与应用容器在同一网络（`xiaodashi-prod-network`），确保可以访问相同的数据库。

## 安全建议

1. ✅ **总是在执行 Migration 前备份数据库**
2. ✅ **在测试环境先验证 Migration**
3. ✅ **检查 Migration 脚本内容**
4. ✅ **保留 Migration 执行日志**
5. ✅ **在维护窗口执行 Migration**

## 相关文档

- [TypeORM Migration 文档](https://typeorm.io/migrations)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PostgreSQL 备份恢复](https://www.postgresql.org/docs/current/backup.html)

