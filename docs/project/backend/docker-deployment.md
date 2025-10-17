# Docker 部署指南

## 目录结构

```
backend/
├── Dockerfile                 # 镜像构建文件
├── .dockerignore              # 构建忽略文件
├── entrypoint.sh              # 应用启动脚本
├── run-migration.sh           # Migration 执行脚本
├── wait-for-db.sh             # 数据库等待脚本
├── scripts/                   # 构建脚本
│   ├── build-docker.sh        # 构建脚本
│   ├── push-docker.sh         # 推送脚本
│   └── deploy-docker.sh       # 部署脚本
└── docker/                    # 服务器运行文件
    ├── docker-compose.yml     # 开发环境
    ├── docker-compose.prod.yml # 生产环境
    └── .env.docker.example    # 环境变量模板
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

## 2. 推送到阿里云

### 配置镜像仓库信息

在 `backend/docker/.env.docker` 中配置：

```bash
DOCKER_REGISTRY=registry.cn-hangzhou.aliyuncs.com
DOCKER_NAMESPACE=your-namespace
DOCKER_IMAGE_NAME=xiaodashi-backend
ALIYUN_ACCESS_KEY_ID=your_access_key
ALIYUN_ACCESS_KEY_SECRET=your_secret_key
```

### 推送镜像

```bash
# 推送指定版本
./backend/scripts/push-docker.sh xiaodashi/backend:v1.0.0

# 推送到多个区域
./backend/scripts/push-docker.sh xiaodashi/backend:v1.0.0 --multi-region
```

## 3. 服务器部署

### 准备服务器

1. 安装 Docker 和 Docker Compose
2. 创建部署目录：`mkdir -p /opt/xiaodashi/backend`
3. 上传 `backend/docker/` 目录下的所有文件到服务器

### 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker.example .env

# 编辑配置（主要是阿里云数据库连接）
vim .env
```

关键配置项：
```bash
# 阿里云 PostgreSQL
DB_HOST=pg-xxxxx.pg.rds.aliyuncs.com
DB_PORT=5432
DB_USER=xiaodashi
DB_PASSWORD=your_password
DB_NAME=xiaodashi_prod
DB_SSL=true

# 阿里云 Redis（可选）
REDIS_HOST=r-xxxxx.redis.rds.aliyuncs.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# 应用配置
NODE_ENV=production
PORT=2999
```

## 使用方法

### 方式 1：使用 Docker Compose（推荐）

```bash
# 1. 启动应用（不会自动执行 migration）
docker compose -f docker-compose.prod.yml up -d

# 2. 查看应用日志（会提示是否有待执行的 migration）
docker compose -f docker-compose.prod.yml logs backend

# 3. 手动执行 migration
docker compose -f docker-compose.prod.yml run --rm migration

# 4. 查看 migration 执行日志
docker compose -f docker-compose.prod.yml logs migration
```

## 完整部署流程

### 初次部署

```bash
# 1. 准备环境文件
cp .env.example .env.docker
# 编辑 .env.docker 配置数据库连接

# 2. 拉取镜像
docker compose -f docker-compose.prod.yml pull

# 3. 执行 migration
docker compose -f docker-compose.prod.yml run --rm migration

# 4. 启动应用
docker compose -f docker-compose.prod.yml up -d backend

# 5. 健康检查
curl http://localhost:2999/health
```

### 更新部署

```bash
# 1. 拉取新镜像
docker compose -f docker-compose.prod.yml pull

# 2. 备份数据库（推荐）
# pg_dump -h <host> -U <user> -d <database> > backup.sql

# 3. 执行新的 migration
docker compose -f docker-compose.prod.yml run --rm migration

# 4. 重启应用
docker compose -f docker-compose.prod.yml up -d backend

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
docker compose -f docker-compose.prod.yml run --rm migration
```

### Q: Migration 执行失败怎么办？

A: 
1. 查看详细日志：`docker compose -f docker-compose.prod.yml logs migration`
2. 检查数据库连接配置
3. 检查数据库用户权限
4. 如果需要，恢复数据库备份

### Q: 如何在 CI/CD 中集成？

A: 
```yaml
# GitHub Actions 示例
- name: Run Database Migration
  run: |
    docker compose -f docker-compose.prod.yml run --rm migration
    
- name: Deploy Application
  run: |
    docker compose -f docker-compose.prod.yml up -d backend
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

