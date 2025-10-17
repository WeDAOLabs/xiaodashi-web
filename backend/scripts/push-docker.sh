#!/bin/bash
# =============================================================================
# Docker 镜像推送脚本 - xiaodashi-web Backend
# =============================================================================
# 功能：推送Docker镜像到阿里云镜像仓库
# 支持：自动登录、多仓库推送、标签管理
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
Docker 镜像推送脚本 - xiaodashi-web Backend

使用方法:
    $0 [选项] <镜像名称>

参数:
    镜像名称          要推送的镜像名称 (必需)

选项:
    -r, --registry REGISTRY  目标镜像仓库地址 (默认: 阿里云)
    -u, --username USER      仓库用户名
    -p, --password PASS      仓库密码
    --config-file FILE       配置文件路径
    --multi-region           推送到多个区域仓库
    --dry-run               仅显示将要执行的命令，不实际执行
    -f, --force             强制推送，覆盖已存在的镜像
    -h, --help              显示帮助信息

示例:
    $0 xiaodashi/backend:latest
    $0 xiaodashi/backend:v1.0.0 -r registry.cn-hangzhou.aliyuncs.com
    $0 xiaodashi/backend:latest --multi-region
    $0 --config-file .docker.env xiaodashi/backend:latest

配置文件示例 (.docker.env):
    DOCKER_REGISTRY=registry.cn-hangzhou.aliyuncs.com
    DOCKER_USERNAME=your_username
    DOCKER_PASSWORD=your_password
    DOCKER_NAMESPACE=your_namespace

EOF
}

# 解析命令行参数
parse_args() {
    # 默认值
    IMAGE_NAME=""
    DOCKER_REGISTRY=""
    DOCKER_USERNAME=""
    DOCKER_PASSWORD=""
    CONFIG_FILE=""
    MULTI_REGION=false
    DRY_RUN=false
    FORCE_PUSH=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            -r|--registry)
                DOCKER_REGISTRY="$2"
                shift 2
                ;;
            -u|--username)
                DOCKER_USERNAME="$2"
                shift 2
                ;;
            -p|--password)
                DOCKER_PASSWORD="$2"
                shift 2
                ;;
            --config-file)
                CONFIG_FILE="$2"
                shift 2
                ;;
            --multi-region)
                MULTI_REGION=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            -f|--force)
                FORCE_PUSH=true
                shift
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
                if [ -z "$IMAGE_NAME" ]; then
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

    # 检查必需参数
    if [ -z "$IMAGE_NAME" ]; then
        log_error "请指定要推送的镜像名称"
        show_usage
        exit 1
    fi
}

# 加载配置文件
load_config() {
    if [ -n "$CONFIG_FILE" ] && [ -f "$CONFIG_FILE" ]; then
        log_step "加载配置文件: $CONFIG_FILE"
        set -a  # 自动导出变量
        source "$CONFIG_FILE"
        set +a
        log_success "配置文件加载完成"
    elif [ -f "./docker/.env.docker" ]; then
        log_step "发现环境配置文件: ./docker/.env.docker"
        set -a
        source "./docker/.env.docker"
        set +a
    fi

    # 设置默认的阿里云镜像仓库
    if [ -z "$DOCKER_REGISTRY" ]; then
        DOCKER_REGISTRY="registry.cn-hangzhou.aliyuncs.com"
        log_info "使用默认镜像仓库: $DOCKER_REGISTRY"
    fi
}

# 检查Docker环境
check_docker() {
    log_step "检查Docker环境..."

    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker 未安装或未在PATH中"
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        log_error "无法连接到Docker daemon"
        exit 1
    fi

    log_success "Docker环境检查通过"
}

# 检查镜像是否存在
check_image() {
    local image="$1"

    log_step "检查本地镜像: $image"

    if ! docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "^${image}$"; then
        log_error "本地镜像不存在: $image"
        log_info "请先使用构建脚本构建镜像"
        exit 1
    fi

    log_success "本地镜像存在"
}

# 获取镜像标签信息
get_image_info() {
    local image="$1"

    # 分离镜像名称和标签
    if [[ "$image" == *":"* ]]; then
        IMAGE_REPOSITORY="${image%:*}"
        IMAGE_TAG="${image#*:}"
    else
        IMAGE_REPOSITORY="$image"
        IMAGE_TAG="latest"
    fi

    # 获取镜像大小
    IMAGE_SIZE=$(docker images --format "{{.Size}}" "$image" 2>/dev/null || echo "Unknown")

    log_info "镜像仓库: $IMAGE_REPOSITORY"
    log_info "镜像标签: $IMAGE_TAG"
    log_info "镜像大小: $IMAGE_SIZE"
}

# Docker登录
docker_login() {
    local registry="$1"
    local username="$2"
    local password="$3"

    log_step "登录镜像仓库: $registry"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker login $registry"
        return 0
    fi

    if [ -n "$username" ] && [ -n "$password" ]; then
        echo "$password" | docker login "$registry" -u "$username" --password-stdin
    else
        log_warning "未提供登录凭证，尝试匿名登录"
        docker login "$registry" || true
    fi

    log_success "登录成功"
}

# 推送镜像
push_image() {
    local source_image="$1"
    local target_registry="$2"
    local namespace="$3"

    # 构建目标镜像名称（如果有 namespace 则包含，否则直接使用）
    if [ -n "$namespace" ]; then
        local target_image="${target_registry}/${namespace}/${IMAGE_REPOSITORY}:${IMAGE_TAG}"
    else
        local target_image="${target_registry}/${IMAGE_REPOSITORY}:${IMAGE_TAG}"
    fi

    log_step "准备推送镜像:"
    log_info "  源镜像: $source_image"
    log_info "  目标镜像: $target_image"

    # 标记镜像
    if [ "$DRY_RUN" = false ]; then
        log_info "标记镜像: docker tag $source_image $target_image"
        docker tag "$source_image" "$target_image"
    else
        log_info "[DRY RUN] docker tag $source_image $target_image"
    fi

    # 推送镜像
    local push_cmd="docker push"
    if [ "$FORCE_PUSH" = true ]; then
        # 对于某些仓库，可能需要特殊参数来强制推送
        log_info "使用强制推送模式"
    fi

    push_cmd="$push_cmd $target_image"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] $push_cmd"
    else
        log_info "执行推送命令: $push_cmd"
        if eval "$push_cmd"; then
            log_success "镜像推送成功: $target_image"
        else
            log_error "镜像推送失败: $target_image"
            return 1
        fi
    fi

    # 清理临时标签
    if [ "$DRY_RUN" = false ] && [ "$source_image" != "$target_image" ]; then
        log_info "清理临时标签: docker rmi $target_image"
        docker rmi "$target_image" 2>/dev/null || true
    fi
}

# 多区域推送
push_multi_region() {
    local source_image="$1"

    log_step "多区域推送模式"

    # 阿里云多个区域
    local regions=(
        "registry.cn-hangzhou.aliyuncs.com"
        "registry.cn-beijing.aliyuncs.com"
        "registry.cn-shanghai.aliyuncs.com"
        "registry.cn-shenzhen.aliyuncs.com"
    )

    for region in "${regions[@]}"; do
        log_info "推送到区域: $region"
        if ! push_image "$source_image" "$region" "$DOCKER_NAMESPACE"; then
            log_warning "区域推送失败: $region"
        fi
    done
}

# 验证推送结果
verify_push() {
    local target_image="$1"

    log_step "验证推送结果: $target_image"

    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 验证镜像: $target_image"
        return 0
    fi

    # 尝试拉取镜像摘要来验证推送是否成功
    if docker pull "$target_image" --quiet >/dev/null 2>&1; then
        log_success "镜像推送验证成功"
        # 清理验证时拉取的镜像
        docker rmi "$target_image" 2>/dev/null || true
    else
        log_warning "无法验证镜像推送，可能需要手动检查"
    fi
}

# 主函数
main() {
    log_info "=== Docker 镜像推送脚本 ==="
    log_info "开始时间: $(date '+%Y-%m-%d %H:%M:%S')"

    # 解析参数
    parse_args "$@"

    # 加载配置
    load_config

    # 检查环境
    check_docker

    # 检查镜像
    check_image "$IMAGE_NAME"

    # 获取镜像信息
    get_image_info "$IMAGE_NAME"

    # 设置默认命名空间（可选，如果镜像名称已包含完整路径则不需要）
    if [ -z "$DOCKER_NAMESPACE" ]; then
        DOCKER_NAMESPACE=""
    fi

    # 登录镜像仓库
    docker_login "$DOCKER_REGISTRY" "$DOCKER_USERNAME" "$DOCKER_PASSWORD"

    # 推送镜像
    if [ "$MULTI_REGION" = true ]; then
        push_multi_region "$IMAGE_NAME"
    else
        target_image="${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${IMAGE_REPOSITORY}:${IMAGE_TAG}"
        push_image "$IMAGE_NAME" "$DOCKER_REGISTRY" "$DOCKER_NAMESPACE"

        # 验证推送结果
        verify_push "$target_image"
    fi

    log_success "镜像推送完成！"
    log_info "结束时间: $(date '+%Y-%m-%d %H:%M:%S')"

    # 显示推送的镜像信息
    echo ""
    log_info "=== 推送镜像信息 ==="
    log_info "源镜像: $IMAGE_NAME"
    log_info "目标仓库: $DOCKER_REGISTRY"
    log_info "命名空间: $DOCKER_NAMESPACE"
    log_info "镜像大小: $IMAGE_SIZE"
}

# 执行主函数
main "$@"