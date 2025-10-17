#!/bin/sh
# =============================================================================
# 容器启动脚本 - xiaodashi-web Backend
# =============================================================================
# 功能：数据库等待、Migration执行、应用启动
# 支持：优雅关闭、错误处理、日志记录
# =============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 信号处理函数
cleanup() {
    log_info "收到关闭信号，正在优雅关闭应用..."
    if [ -n "$APP_PID" ]; then
        kill -TERM "$APP_PID" 2>/dev/null || true
        wait "$APP_PID" 2>/dev/null || true
    fi
    log_success "应用已优雅关闭"
    exit 0
}

# 注册信号处理
trap cleanup SIGTERM SIGINT

# 检查必要的环境变量
check_environment() {
    log_info "检查环境变量配置..."

    local required_vars="DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME"
    local missing_vars=""

    for var in $required_vars; do
        eval "var_value=\$$var"
        if [ -z "$var_value" ]; then
            if [ -z "$missing_vars" ]; then
                missing_vars="$var"
            else
                missing_vars="$missing_vars $var"
            fi
        fi
    done

    if [ -n "$missing_vars" ]; then
        log_error "缺少必要的环境变量: $missing_vars"
        exit 1
    fi

    log_success "环境变量检查通过"
}

# 等待数据库连接
wait_for_database() {
    log_info "等待数据库连接..."

    # 如果是开发环境且有特定运行命令，跳过数据库等待
    if [ "$NODE_ENV" = "development" ] && [ "$1" = "pnpm" ]; then
        log_info "开发环境启动模式，跳过数据库等待"
        return 0
    fi

    # 使用wait-for-db.sh脚本等待数据库
    if [ -f "./wait-for-db.sh" ]; then
        ./wait-for-db.sh
    else
        log_warning "wait-for-db.sh脚本不存在，跳过数据库等待"
    fi
}

# 检查数据库Migration状态（只检查，不执行）
run_migrations() {
    if [ "$NODE_ENV" = "production" ]; then
        log_info "检查数据库Migration状态..."

        # 检查 typeorm.config.js 是否存在
        if [ ! -f "./backend/dist/typeorm.config.js" ]; then
            log_warning "typeorm.config.js 不存在，跳过 Migration 检查"
            return 0
        fi

        # 只检查状态，不自动执行
        if sh ./backend/node_modules/.bin/typeorm migration:show -d ./backend/dist/typeorm.config.js 2>/dev/null; then
            log_info "Migration 状态检查完成"
            log_warning "⚠️  如有待执行的 Migration，请手动运行:"
            log_warning "   docker compose -f docker-compose.prod.yml run --rm migration"
        else
            log_warning "无法检查 Migration 状态"
        fi
    else
        log_info "开发环境，跳过 Migration 检查"
    fi
}

# 启动应用
start_application() {
    log_info "启动xiaodashi-web后端应用..."
    log_info "运行环境: ${NODE_ENV:-development}"
    log_info "服务端口: ${PORT:-2999}"

    # 如果是生产环境且没有指定命令，直接运行编译后的应用
    if [ "$NODE_ENV" = "production" ] && [ $# -eq 0 ]; then
        log_info "使用生产环境默认启动命令"
        log_info "直接运行编译产物: node ./backend/dist/src/main"
        exec node ./backend/dist/src/main &
    else
        log_info "启动命令: $*"
        exec "$@" &
    fi

    APP_PID=$!
    log_success "应用已启动，PID: $APP_PID"

    # 等待应用进程
    wait "$APP_PID"
}

# 主函数
main() {
    log_info "=== xiaodashi-web Backend 启动脚本 ==="
    log_info "启动时间: $(date '+%Y-%m-%d %H:%M:%S')"
    log_info "当前工作目录: $(pwd)"

    # 检查环境变量
    check_environment

    # 等待数据库
    wait_for_database "$@"

    # 执行Migration
    run_migrations "$@"

    # 启动应用
    start_application "$@"
}

# 执行主函数
main "$@"