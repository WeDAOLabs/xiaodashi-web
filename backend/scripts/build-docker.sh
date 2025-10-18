#!/bin/bash
# =============================================================================
# Docker 镜像构建脚本 - xiaodashi-web Backend
# =============================================================================
# 功能：构建开发和生产环境的Docker镜像
# 支持：多阶段构建、镜像标签管理、构建缓存优化
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
Docker 镜像构建脚本 - xiaodashi-web Backend

使用方法:
    $0 [选项] [环境]

环境:
    dev         构建开发环境镜像 (默认)
    prod        构建生产环境镜像
    all         构建所有环境镜像

选项:
    -t, --tag TAG            指定镜像标签 (默认: latest, dev-latest)
    -p, --push               构建完成后推送镜像
    -c, --cache              启用构建缓存
    -r, --registry REGISTRY  指定镜像仓库地址前缀
    --no-cache               不使用缓存构建
    -h, --help               显示帮助信息

示例:
    $0 dev                    # 构建开发环境镜像
    $0 prod -t v1.0.0        # 构建生产环境镜像并指定标签
    $0 all -p -c             # 构建所有镜像并推送，启用缓存
    $0 prod --registry registry.cn-hangzhou.aliyuncs.com

EOF
}

# 解析命令行参数
parse_args() {
    # 默认值
    ENVIRONMENT="dev"
    IMAGE_TAG="latest"
    PUSH_AFTER_BUILD=false
    ENABLE_CACHE=false
    DOCKER_REGISTRY=""
    NO_CACHE=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            dev|prod|all)
                ENVIRONMENT="$1"
                shift
                ;;
            -t|--tag)
                IMAGE_TAG="$2"
                shift 2
                ;;
            -p|--push)
                PUSH_AFTER_BUILD=true
                shift
                ;;
            -c|--cache)
                ENABLE_CACHE=true
                shift
                ;;
            -r|--registry)
                DOCKER_REGISTRY="$2"
                shift 2
                ;;
            --no-cache)
                NO_CACHE=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

# 检查Docker环境
check_docker() {
    log_step "检查Docker环境..."

    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker 未安装或未在PATH中"
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        log_error "无法连接到Docker daemon，请检查Docker服务是否运行"
        exit 1
    fi

    log_success "Docker环境检查通过"
}

# 获取项目信息
get_project_info() {
    log_step "获取项目信息..."

    # 使用 pushd 确保目录切换安全
    pushd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null

    # 获取项目根目录（上两级目录）
    cd ../..
    PROJECT_ROOT="$(pwd)"

    # 获取项目信息（项目名称使用固定值，版本号从package.json读取）
    PROJECT_NAME="xiaodashi-backend"
    PROJECT_VERSION=$(node -p "require('./backend/package.json').version" 2>/dev/null || echo "1.0.0")

    # 设置固定的镜像基础名称
    BASE_IMAGE_NAME="registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend"

    # 如果没有指定标签，使用环境+时间戳
    if [ "$IMAGE_TAG" = "latest" ]; then
        TIMESTAMP=$(date +%Y%m%d%H%M%S)
        if [ "$ENVIRONMENT" = "prod" ]; then
            IMAGE_TAG="latest"
        else
            IMAGE_TAG="dev-${TIMESTAMP}"
        fi
    fi

    # 构建完整的镜像名称
    if [ -n "$DOCKER_REGISTRY" ]; then
        FULL_IMAGE_NAME="${DOCKER_REGISTRY}/${BASE_IMAGE_NAME}:${IMAGE_TAG}"
    else
        FULL_IMAGE_NAME="${BASE_IMAGE_NAME}:${IMAGE_TAG}"
    fi

    log_info "项目名称: $PROJECT_NAME"
    log_info "项目版本: $PROJECT_VERSION"
    log_info "构建环境: $ENVIRONMENT"
    log_info "镜像标签: $IMAGE_TAG"
    log_info "镜像名称: $FULL_IMAGE_NAME"
    log_info "项目根目录: $PROJECT_ROOT"

    # 恢复原始目录
    popd >/dev/null
}

# 构建Docker镜像
build_image() {
    local env="$1"
    local dockerfile="$2"
    local tag="$3"

    log_step "构建 $env 环境镜像..."

    # 使用 pushd 切换到项目根目录
    pushd "$PROJECT_ROOT" >/dev/null

    # 构建参数
    local build_args=""
    if [ "$ENABLE_CACHE" = true ]; then
        build_args="$build_args --build-arg BUILDKIT_INLINE_CACHE=1"
    fi

    # 添加环境参数
    build_args="$build_args --build-arg NODE_ENV=$env"

    # 缓存参数
    local cache_from=""
    local cache_to=""
    if [ "$ENABLE_CACHE" = true ]; then
        cache_from="--cache-from ${BASE_IMAGE_NAME}:cache"
        cache_to="--cache-to ${BASE_IMAGE_NAME}:cache"
    fi

    # 构建命令（注意：Dockerfile 路径需要相对于 PROJECT_ROOT）
    local dockerfile_relative_path="${dockerfile#$PROJECT_ROOT/}"
    local build_cmd="docker build"
    build_cmd="$build_cmd --file $dockerfile_relative_path"
    build_cmd="$build_cmd --tag $tag"

    if [ "$NO_CACHE" = false ]; then
        build_cmd="$build_cmd $cache_from $cache_to"
    else
        build_cmd="$build_cmd --no-cache"
    fi

    build_cmd="$build_cmd $build_args"
    build_cmd="$build_cmd ."

    log_info "执行构建命令: $build_cmd"
    log_info "构建上下文: $PROJECT_ROOT"
    log_info "Dockerfile: $dockerfile_relative_path"

    # 执行构建
    local build_result=0
    eval "$build_cmd" || build_result=$?

    # 恢复原始目录
    popd >/dev/null

    if [ $build_result -eq 0 ]; then
        log_success "$env 环境镜像构建成功: $tag"
    else
        log_error "$env 环境镜像构建失败"
        exit 1
    fi
}

# 为镜像打标签
tag_image() {
    local source_tag="$1"
    local target_tag="$2"

    log_step "为镜像打标签: $target_tag"

    if docker tag "$source_tag" "$target_tag"; then
        log_success "标签创建成功: $target_tag"
    else
        log_error "标签创建失败: $target_tag"
        exit 1
    fi
}

# 推送镜像
push_image() {
    local tag="$1"

    log_step "推送镜像: $tag"

    if docker push "$tag"; then
        log_success "镜像推送成功: $tag"
    else
        log_error "镜像推送失败: $tag"
        exit 1
    fi
}

# 显示镜像信息
show_image_info() {
    log_step "镜像信息:"

    # 显示镜像详情
    docker images | grep "$BASE_IMAGE_NAME" || log_warning "未找到本地镜像"

    # 显示镜像大小（兼容 macOS 和 Linux）
    if docker inspect "$FULL_IMAGE_NAME" >/dev/null 2>&1; then
        local size_bytes=$(docker inspect --format='{{.Size}}' "$FULL_IMAGE_NAME")
        # 将字节转换为可读格式（兼容 macOS）
        local size
        if command -v numfmt >/dev/null 2>&1; then
            # Linux: 使用 numfmt
            size=$(echo "$size_bytes" | numfmt --to=iec)
        else
            # macOS: 使用 awk 计算
            size=$(awk -v bytes="$size_bytes" 'BEGIN {
                if (bytes < 1024) printf "%.0f B", bytes
                else if (bytes < 1048576) printf "%.2f KB", bytes/1024
                else if (bytes < 1073741824) printf "%.2f MB", bytes/1048576
                else printf "%.2f GB", bytes/1073741824
            }')
        fi
        log_info "镜像大小: $size"
    fi
}

# 主函数
main() {
    log_info "=== Docker 镜像构建脚本 ==="
    log_info "开始时间: $(date '+%Y-%m-%d %H:%M:%S')"

    # 解析参数
    parse_args "$@"

    # 检查环境
    check_docker

    # 获取项目信息
    get_project_info

    # 构建镜像
    case "$ENVIRONMENT" in
        "dev")
            DEV_TAG="${BASE_IMAGE_NAME}:${IMAGE_TAG}"
            build_image "dev" "$PROJECT_ROOT/backend/Dockerfile" "$DEV_TAG"
            ;;
        "prod")
            PROD_TAG="${BASE_IMAGE_NAME}:${IMAGE_TAG}"
            build_image "prod" "$PROJECT_ROOT/backend/Dockerfile" "$PROD_TAG"
            
            # 如果使用默认 latest 标签，同时创建版本号标签
            if [ "$IMAGE_TAG" = "latest" ]; then
                VERSION_TAG="${BASE_IMAGE_NAME}:v${PROJECT_VERSION}"
                tag_image "$PROD_TAG" "$VERSION_TAG"
                log_info "已创建版本标签: $VERSION_TAG"
            fi
            ;;
        "all")
            # 构建开发环境镜像
            DEV_TAG="${BASE_IMAGE_NAME}:dev-${IMAGE_TAG}"
            build_image "dev" "$PROJECT_ROOT/backend/Dockerfile" "$DEV_TAG"

            # 构建生产环境镜像
            PROD_TAG="${BASE_IMAGE_NAME}:${IMAGE_TAG}"
            build_image "prod" "$PROJECT_ROOT/backend/Dockerfile" "$PROD_TAG"
            ;;
    esac

    # 推送镜像
    if [ "$PUSH_AFTER_BUILD" = true ]; then
        case "$ENVIRONMENT" in
            "dev")
                push_image "$DEV_TAG"
                ;;
            "prod")
                push_image "$PROD_TAG"
                # 如果创建了版本标签，也推送版本标签
                if [ "$IMAGE_TAG" = "latest" ]; then
                    VERSION_TAG="${BASE_IMAGE_NAME}:v${PROJECT_VERSION}"
                    push_image "$VERSION_TAG"
                fi
                ;;
            "all")
                push_image "$DEV_TAG"
                push_image "$PROD_TAG"
                ;;
        esac
    fi

    # 显示镜像信息
    show_image_info

    log_success "镜像构建完成！"
    log_info "结束时间: $(date '+%Y-%m-%d %H:%M:%S')"
}

# 执行主函数
main "$@"