#!/bin/bash
# =============================================================================
# Docker 服务器部署脚本 - xiaodashi-web Backend
# =============================================================================
# 功能：在生产服务器上部署Docker容器
# 支持：自动更新、健康检查、回滚机制
# =============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 脚本使用说明
show_usage() {
    cat << EOF
Docker 服务器部署脚本 - xiaodashi-web Backend

使用方法:
    $0 [选项] <镜像名称>

参数:
    镜像名称          要部署的镜像名称 (必需)

选项:
    -e, --env ENV           环境类型 (prod|dev, 默认: prod)
    -c, --config FILE       Docker Compose 配置文件路径
    --env-file FILE         环境变量文件路径
    --backup                部署前备份当前版本
    --rollback              回滚到上一个版本
    --force                 强制部署，忽略健康检查
    --dry-run               仅显示将要执行的命令，不实际执行
    --timeout SECONDS       部署超时时间 (默认: 300)
    --health-check URL      自定义健康检查URL
    -h, --help              显示帮助信息

示例:
    $0 xiaodashi/backend:v1.0.0
    $0 xiaodashi/backend:latest --env prod --backup
    $0 --rollback  # 回滚到上一个版本
    $0 xiaodashi/backend:v1.0.0 --dry-run

环境变量文件示例 (.env.docker):
    DOCKER_REGISTRY=registry.cn-hangzhou.aliyuncs.com
    DOCKER_NAMESPACE=xiaodashi
    DOCKER_IMAGE_NAME=xiaodashi-backend
    IMAGE_TAG=v1.0.0
    PORT=2999

EOF
}

# 解析命令行参数
parse_args() {
    # 默认值
    IMAGE_NAME=""
    ENVIRONMENT="prod"
    COMPOSE_FILE=""
    ENV_FILE=""
    BACKUP_BEFORE_DEPLOY=false
    ROLLBACK_MODE=false
    FORCE_DEPLOY=false
    DRY_RUN=false
    DEPLOY_TIMEOUT=300
    HEALTH_CHECK_URL=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -c|--config)
                COMPOSE_FILE="$2"
                shift 2
                ;;
            --env-file)
                ENV_FILE="$2"
                shift 2
                ;;
            --backup)
                BACKUP_BEFORE_DEPLOY=true
                shift
                ;;
            --rollback)
                ROLLBACK_MODE=true
                shift
                ;;
            --force)
                FORCE_DEPLOY=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --timeout)
                DEPLOY_TIMEOUT="$2"
                shift 2
                ;;
            --health-check)
                HEALTH_CHECK_URL="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            -*)
                log_error "未知选项: $1"
                show_usage
                exit 1
                ;;
            *)
                if [ -z "$IMAGE_NAME" ] && [ "$ROLLBACK_MODE" = false ]; then
                    IMAGE_NAME="$1"
                else
                    log_error "多余的参数: $1"
                    show_usage
                    exit 1
                fi
                shift
                ;;
        esac
    done

    # 设置默认配置文件
    if [ -z "$COMPOSE_FILE" ]; then
        COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"
    fi

    # 设置默认环境文件
    if [ -z "$ENV_FILE" ]; then
        ENV_FILE=".env.docker"
    fi
}

# 检查Docker环境
check_docker() {
    log_step "检查Docker环境..."

    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker 未安装或未在PATH中"
        exit 1
    fi

    if ! command -v docker-compose >/dev/null 2>&1; then
        log_error "Docker Compose 未安装或未在PATH中"
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        log_error "无法连接到Docker daemon"
        exit 1
    fi

    log_success "Docker环境检查通过"
}

# 加载配置文件
load_config() {
    log_step "加载配置文件..."

    if [ -n "$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
        log_info "加载环境文件: $ENV_FILE"
        set -a
        source "$ENV_FILE"
        set +a
    else
        log_warning "环境文件不存在: $ENV_FILE"
    fi

    # 设置默认值
    export DOCKER_REGISTRY="${DOCKER_REGISTRY:-registry.cn-hangzhou.aliyuncs.com}"
    export DOCKER_NAMESPACE="${DOCKER_NAMESPACE:-xiaodashi}"
    export DOCKER_IMAGE_NAME="${DOCKER_IMAGE_NAME:-xiaodashi-backend}"
    export IMAGE_TAG="${IMAGE_TAG:-latest}"
    export PORT="${PORT:-2999}"

    # 构建完整的镜像名称
    if [ -n "$IMAGE_NAME" ]; then
        export FULL_IMAGE_NAME="$IMAGE_NAME"
    else
        export FULL_IMAGE_NAME="${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${DOCKER_IMAGE_NAME}:${IMAGE_TAG}"
    fi

    log_success "配置加载完成"
}

# 检查配置文件
check_config_files() {
    log_step "检查配置文件..."

    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker Compose 配置文件不存在: $COMPOSE_FILE"
        exit 1
    fi

    log_success "配置文件检查通过"
}

# 备份当前版本
backup_current_version() {
    if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
        log_step "备份当前版本..."

        local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$backup_dir"

        # 备份配置文件
        cp "$COMPOSE_FILE" "$backup_dir/docker-compose.yml"
        [ -f "$ENV_FILE" ] && cp "$ENV_FILE" "$backup_dir/.env"

        # 备份当前运行的镜像信息
        if docker-compose -f "$COMPOSE_FILE" ps --format json 2>/dev/null | jq -r '.[0].Image' >/dev/null 2>&1; then
            docker-compose -f "$COMPOSE_FILE" ps --format json | jq -r '.[0].Image' > "$backup_dir/current_image.txt"
        fi

        log_success "备份完成: $backup_dir"
    fi
}

# 拉取新镜像
pull_image() {
    local image="$1"

    log_step "拉取新镜像: $image"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker pull $image"
        return 0
    fi

    if docker pull "$image"; then
        log_success "镜像拉取成功"
    else
        log_error "镜像拉取失败"
        exit 1
    fi
}

# 停止当前服务
stop_services() {
    log_step "停止当前服务..."

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker-compose -f $COMPOSE_FILE down"
        return 0
    fi

    if docker-compose -f "$COMPOSE_FILE" down; then
        log_success "服务停止成功"
    else
        log_warning "服务停止失败或没有运行的服务"
    fi
}

# 启动新服务
start_services() {
    log_step "启动新服务..."

    local compose_cmd="docker-compose -f $COMPOSE_FILE"

    if [ -n "$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
        compose_cmd="$compose_cmd --env-file $ENV_FILE"
    fi

    compose_cmd="$compose_cmd up -d"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] $compose_cmd"
        return 0
    fi

    if eval "$compose_cmd"; then
        log_success "服务启动成功"
    else
        log_error "服务启动失败"
        exit 1
    fi
}

# 等待服务就绪
wait_for_services() {
    local timeout="$DEPLOY_TIMEOUT"
    local interval=10
    local elapsed=0

    log_step "等待服务就绪..."

    # 默认健康检查URL
    if [ -z "$HEALTH_CHECK_URL" ]; then
        HEALTH_CHECK_URL="http://localhost:${PORT}/health"
    fi

    while [ $elapsed -lt $timeout ]; do
        if [ "$DRY_RUN" = true ]; then
            log_info "[DRY RUN] 健康检查: $HEALTH_CHECK_URL"
            break
        fi

        if curl -f -s --max-time 5 "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
            log_success "服务健康检查通过"
            return 0
        fi

        log_info "等待服务启动... ($elapsed/$timeout)"
        sleep $interval
        elapsed=$((elapsed + interval))
    done

    if [ "$FORCE_DEPLOY" = false ]; then
        log_error "服务启动超时或健康检查失败"
        log_error "请检查服务日志: docker-compose -f $COMPOSE_FILE logs"
        exit 1
    else
        log_warning "健康检查失败，但强制部署模式继续"
    fi
}

# 显示服务状态
show_service_status() {
    log_step "显示服务状态:"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker-compose -f $COMPOSE_FILE ps"
        return 0
    fi

    docker-compose -f "$COMPOSE_FILE" ps

    # 显示容器日志（最近的20行）
    echo ""
    log_info "=== 最近的日志 ==="
    docker-compose -f "$COMPOSE_FILE" logs --tail=20
}

# 回滚到上一个版本
rollback_to_previous() {
    log_step "回滚到上一个版本..."

    # 查找最新的备份
    local latest_backup=$(ls -t backups/ 2>/dev/null | head -n 1)

    if [ -z "$latest_backup" ]; then
        log_error "没有找到备份文件，无法回滚"
        exit 1
    fi

    local backup_dir="backups/$latest_backup"
    log_info "使用备份: $backup_dir"

    # 恢复配置文件
    if [ -f "$backup_dir/docker-compose.yml" ]; then
        cp "$backup_dir/docker-compose.yml" "$COMPOSE_FILE"
        log_info "已恢复 Docker Compose 配置"
    fi

    if [ -f "$backup_dir/.env" ]; then
        cp "$backup_dir/.env" "$ENV_FILE"
        log_info "已恢复环境配置"
    fi

    # 恢复镜像并重启
    if [ -f "$backup_dir/current_image.txt" ]; then
        local previous_image=$(cat "$backup_dir/current_image.txt")
        log_info "回滚到镜像: $previous_image"

        pull_image "$previous_image"
        stop_services
        start_services
        wait_for_services
        show_service_status
    else
        log_error "备份文件中缺少镜像信息"
        exit 1
    fi
}

# 清理旧镜像
cleanup_old_images() {
    log_step "清理旧镜像..."

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker image prune -f"
        return 0
    fi

    # 清理未使用的镜像
    docker image prune -f >/dev/null 2>&1 || true
    log_info "旧镜像清理完成"
}

# 主函数
main() {
    log_info "=== Docker 服务器部署脚本 ==="
    log_info "开始时间: $(date '+%Y-%m-%d %H:%M:%S')"
    log_info "部署环境: $ENVIRONMENT"

    # 解析参数
    parse_args "$@"

    # 检查环境
    check_docker

    # 加载配置
    load_config

    # 检查配置文件
    check_config_files

    # 回滚模式
    if [ "$ROLLBACK_MODE" = true ]; then
        rollback_to_previous
        log_success "回滚完成！"
        exit 0
    fi

    # 检查镜像名称
    if [ -z "$IMAGE_NAME" ]; then
        log_error "请指定要部署的镜像名称"
        show_usage
        exit 1
    fi

    # 显示部署信息
    echo ""
    log_info "=== 部署信息 ==="
    log_info "镜像名称: $FULL_IMAGE_NAME"
    log_info "配置文件: $COMPOSE_FILE"
    log_info "环境文件: $ENV_FILE"
    log_info "健康检查: ${HEALTH_CHECK_URL:-http://localhost:${PORT}/health}"
    log_info "超时时间: ${DEPLOY_TIMEOUT}秒"
    echo ""

    # 备份当前版本
    backup_current_version

    # 拉取新镜像
    pull_image "$FULL_IMAGE_NAME"

    # 停止当前服务
    stop_services

    # 启动新服务
    start_services

    # 等待服务就绪
    wait_for_services

    # 显示服务状态
    show_service_status

    # 清理旧镜像
    cleanup_old_images

    log_success "部署完成！"
    log_info "结束时间: $(date '+%Y-%m-%d %H:%M:%S')"
}

# 执行主函数
main "$@"