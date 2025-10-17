#!/bin/sh
# =============================================================================
# 数据库 Migration 执行脚本
# =============================================================================
# 用途：手动执行数据库 Migration
# 使用：docker compose -f docker-compose.prod.yml run --rm migration
# =============================================================================

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_info "=== 数据库 Migration 执行脚本 ==="
log_info "执行时间: $(date '+%Y-%m-%d %H:%M:%S')"
log_info "当前目录: $(pwd)"

# 检查配置文件
if [ ! -f "./backend/dist/typeorm.config.js" ]; then
    log_error "typeorm.config.js 不存在"
    log_error "路径: ./backend/dist/typeorm.config.js"
    exit 1
fi

log_success "找到 typeorm.config.js"

# 显示当前 Migration 状态
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "当前 Migration 状态:"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if ! sh ./backend/node_modules/.bin/typeorm migration:show -d ./backend/dist/typeorm.config.js; then
    log_warning "无法显示 Migration 状态"
fi

# 询问确认（在非交互环境中跳过）
if [ -t 0 ]; then
    echo ""
    log_warning "⚠️  即将执行数据库 Migration，此操作将修改数据库结构"
    echo -n "是否继续？[y/N] "
    read -r confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        log_info "用户取消操作"
        exit 0
    fi
fi

# 执行 Migration
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "开始执行 Migration..."
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if sh ./backend/node_modules/.bin/typeorm migration:run -d ./backend/dist/typeorm.config.js; then
    log_success "✅ Migration 执行成功"
    
    # 显示执行后的状态
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "执行后的 Migration 状态:"
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    sh ./backend/node_modules/.bin/typeorm migration:show -d ./backend/dist/typeorm.config.js || true
    
    log_success "所有 Migration 已执行完成"
    exit 0
else
    log_error "❌ Migration 执行失败"
    log_error "请检查数据库连接和 Migration 文件"
    exit 1
fi

