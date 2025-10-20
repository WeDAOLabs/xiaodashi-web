# =============================================================================
# NestJS 生产 Dockerfile - 优化版
# =============================================================================

# ---------------------
# Stage 1: Build
# ---------------------
FROM node:18-alpine AS build

WORKDIR /app

# 安装构建工具和 pnpm
RUN apk add --no-cache python3 make g++ && npm install -g pnpm@9

# 复制 monorepo 配置
COPY package*.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# 复制源代码
COPY shared ./shared
COPY backend ./backend

# 配置 pnpm 使用国内镜像源（加速下载）
RUN pnpm config set registry https://registry.npmmirror.com

# 安装所有依赖（包括 dev，用于构建）
RUN pnpm install --frozen-lockfile

# 构建
RUN pnpm build:shared
RUN cd backend && pnpm build

# 清理 devDependencies，只保留生产依赖
RUN pnpm install --prod --frozen-lockfile

# ---------------------
# Stage 2: Production（精简版）
# ---------------------
FROM node:18-alpine

WORKDIR /app

# 只安装运行时工具（移除构建工具）
RUN apk add --no-cache \
    dumb-init \
    curl \
    postgresql-client

# 创建用户
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nestjs

# 从 build 阶段复制完整的 node_modules（已编译好的原生模块）
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# 复制其他必要文件
COPY --from=build /app/backend/package.json ./backend/
COPY --from=build /app/shared/package.json ./shared/
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/backend/dist ./backend/dist

# 复制启动脚本和 Migration 脚本
COPY --chown=nestjs:nodejs backend/entrypoint.sh backend/wait-for-db.sh backend/run-migration.sh ./

RUN chmod +x entrypoint.sh wait-for-db.sh run-migration.sh

USER nestjs

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:2999/health || exit 1

# 暴露端口
EXPOSE 2999

# 设置环境变量
ENV NODE_ENV=production PORT=2999

# 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["./entrypoint.sh"]
