#!/bin/sh
# =============================================================================
# 数据库等待脚本 - xiaodashi-web Backend
# =============================================================================
# 功能：等待PostgreSQL数据库可用
# 支持：阿里云RDS PostgreSQL连接检查
# =============================================================================

set -e

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

# 默认配置
DEFAULT_HOST="${DB_HOST:-localhost}"
DEFAULT_PORT="${DB_PORT:-5432}"
DEFAULT_USER="${DB_USER:-postgres}"
DEFAULT_DB="${DB_NAME:-postgres}"
DEFAULT_TIMEOUT="${DB_CONNECTION_TIMEOUT:-60}"
DEFAULT_SSL="${DB_SSL:-false}"

# 显示配置信息
show_config() {
    log_info "数据库连接配置:"
    log_info "  主机: $DEFAULT_HOST"
    log_info "  端口: $DEFAULT_PORT"
    log_info "  用户: $DEFAULT_USER"
    log_info "  数据库: $DEFAULT_DB"
    log_info "  SSL: $DEFAULT_SSL"
    log_info "  超时: ${DEFAULT_TIMEOUT}秒"
}

# 检查PostgreSQL客户端工具
check_postgres_client() {
    if command -v psql >/dev/null 2>&1; then
        return 0
    elif command -v pg_isready >/dev/null 2>&1; then
        return 0
    else
        log_warning "未找到PostgreSQL客户端工具，尝试使用nc连接检测"
        return 1
    fi
}

# 使用pg_isready检查数据库连接
check_with_pg_isready() {
    local ssl_option=""
    if [ "$DEFAULT_SSL" = "true" ]; then
        ssl_option="--sslmode=require"
    fi

    pg_isready -h "$DEFAULT_HOST" -p "$DEFAULT_PORT" -U "$DEFAULT_USER" -d "$DEFAULT_DB" $ssl_option -t 5 -q
}

# 使用psql检查数据库连接
check_with_psql() {
    local ssl_option=""
    if [ "$DEFAULT_SSL" = "true" ]; then
        ssl_option="sslmode=require"
    fi

    PGPASSWORD="$DB_PASSWORD" psql -h "$DEFAULT_HOST" -p "$DEFAULT_PORT" -U "$DEFAULT_USER" -d "$DEFAULT_DB" -c "SELECT 1;" -q $ssl_option >/dev/null 2>&1
}

# 使用nc(netcat)检查端口连通性
check_with_nc() {
    nc -z -w3 "$DEFAULT_HOST" "$DEFAULT_PORT" >/dev/null 2>&1
}

# 等待数据库可用
wait_for_database() {
    local wait_time=0
    local max_attempts="$DEFAULT_TIMEOUT"

    log_info "开始等待数据库连接可用..."

    while [ $wait_time -lt $max_attempts ]; do
        if check_postgres_client; then
            # 优先使用pg_isready
            if check_with_pg_isready; then
                log_success "数据库连接检查通过(pg_isready)"
                return 0
            fi

            # 使用psql进行完整连接测试
            if check_with_psql; then
                log_success "数据库连接测试通过(psql)"
                return 0
            fi

            log_warning "数据库响应异常，继续等待..."
        else
            # 使用nc进行端口检测
            if check_with_nc; then
                log_success "数据库端口连通性检查通过(nc)"
                return 0
            fi

            log_warning "数据库端口不可达，继续等待..."
        fi

        wait_time=$((wait_time + 1))
        if [ $wait_time -lt $max_attempts ]; then
            log_info "等待中... ($wait_time/$max_attempts)"
            sleep 1
        fi
    done

    log_error "数据库连接超时，已等待 ${max_attempts} 秒"
    log_error "请检查以下配置:"
    log_error "  数据库地址: $DEFAULT_HOST:$DEFAULT_PORT"
    log_error "  用户名: $DEFAULT_USER"
    log_error "  数据库名: $DEFAULT_DB"
    log_error "  SSL配置: $DEFAULT_SSL"
    log_error "  网络连通性: 请确认防火墙和安全组配置"

    return 1
}

# 主函数
main() {
    log_info "=== 数据库连接等待脚本 ==="
    show_config

    # 检查必要的环境变量
    if [ -z "$DB_PASSWORD" ]; then
        log_warning "未设置DB_PASSWORD环境变量，某些连接检查可能失败"
    fi

    # 等待数据库可用
    if wait_for_database; then
        log_success "数据库连接已就绪，可以启动应用"
        exit 0
    else
        log_error "数据库连接失败，应用启动中止"
        exit 1
    fi
}

# 执行主函数
main "$@"