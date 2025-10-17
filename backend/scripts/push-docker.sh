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
    镜像名称          要推送的镜像名称，必须包含完整路径 (必需)
                     格式: registry.cn-beijing.aliyuncs.com/huyuan/app:tag

选项:
    -u, --username USER      阿里云用户名
    -p, --password PASS      阿里云密码
    --config-file FILE       配置文件路径
    --dry-run               仅显示将要执行的命令，不实际执行
    -h, --help              显示帮助信息

示例:
    # 推送单个镜像
    $0 registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest \\
       --username 布鲁托2000 --password 'your_password'
    
    # 使用配置文件
    $0 registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:v1.0.0 \\
       --config-file backend/docker/.env.docker
    
    # 测试模式（不实际推送）
    $0 registry.cn-beijing.aliyuncs.com/huyuan/xiao-da-shi-app-backend:latest \\
       --username 布鲁托2000 --password 'your_password' --dry-run

配置文件示例 (backend/docker/.env.docker):
    ALIYUN_DOCKER_USERNAME=布鲁托2000
    ALIYUN_DOCKER_PASSWORD=your_password

注意:
    - 镜像名称必须包含完整的 registry 路径
    - Registry 地址会从镜像名称自动提取
    - 推送前请确保已通过 build-docker.sh 构建镜像

EOF
}

# 解析命令行参数
parse_args() {
    # 默认值
    IMAGE_NAME=""
    CLI_IMAGE_NAME=""  # 保存命令行参数，防止被配置文件覆盖
    ALIYUN_DOCKER_USERNAME=""
    ALIYUN_DOCKER_PASSWORD=""
    CONFIG_FILE=""
    DRY_RUN=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            -u|--username)
                ALIYUN_DOCKER_USERNAME="$2"
                shift 2
                ;;
            -p|--password)
                ALIYUN_DOCKER_PASSWORD="$2"
                shift 2
                ;;
            --config-file)
                CONFIG_FILE="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
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
                if [ -z "$CLI_IMAGE_NAME" ]; then
                    CLI_IMAGE_NAME="$1"
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
    if [ -z "$CLI_IMAGE_NAME" ]; then
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
    elif [ -f "./backend/docker/.env.docker" ]; then
        log_step "发现环境配置文件: ./backend/docker/.env.docker"
        set -a
        source "./backend/docker/.env.docker"
        set +a
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

    if ! docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^${image}$"; then
        log_error "本地镜像不存在: $image"
        log_info "请先使用构建脚本构建镜像"
        exit 1
    fi

    log_success "本地镜像存在"
}

# 获取镜像信息
get_image_info() {
    local image="$1"
    
    log_info "镜像: $image"
    
    # 获取镜像大小
    IMAGE_SIZE=$(docker images --format "{{.Size}}" "$image" 2>/dev/null || echo "Unknown")
    log_info "镜像大小: $IMAGE_SIZE"
}

# Docker登录
docker_login() {
    local image="$1"
    local username="$2"
    local password="$3"
    
    # 从镜像名称提取 registry（第一个 / 之前的部分）
    local registry
    if [[ "$image" == *"/"* ]]; then
        registry="${image%%/*}"
    else
        log_error "镜像名称格式错误，应包含完整路径（例如: registry.cn-beijing.aliyuncs.com/huyuan/app:latest）"
        exit 1
    fi
    
    log_step "登录镜像仓库: $registry"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker login --username=$username $registry"
        return 0
    fi
    
    if [ -n "$username" ] && [ -n "$password" ]; then
        echo "$password" | docker login "$registry" --username "$username" --password-stdin
        log_success "登录成功"
    else
        log_error "请提供阿里云用户名和密码"
        log_info "使用方式: $0 <镜像名称> --username <用户名> --password <密码>"
        log_info "或在配置文件中设置 ALIYUN_DOCKER_USERNAME 和 ALIYUN_DOCKER_PASSWORD"
        exit 1
    fi
}

# 推送镜像
push_image() {
    local image="$1"
    
    log_step "推送镜像: $image"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] docker push $image"
        return 0
    fi
    
    log_info "执行推送命令: docker push $image"
    if docker push "$image"; then
        log_success "镜像推送成功: $image"
    else
        log_error "镜像推送失败: $image"
        return 1
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
    
    # 恢复命令行参数（防止被配置文件覆盖）
    if [ -n "$CLI_IMAGE_NAME" ]; then
        IMAGE_NAME="$CLI_IMAGE_NAME"
    fi
    
    # 检查环境
    check_docker
    
    # 检查镜像
    check_image "$IMAGE_NAME"
    
    # 获取镜像信息
    get_image_info "$IMAGE_NAME"
    
    # 登录镜像仓库
    docker_login "$IMAGE_NAME" "$ALIYUN_DOCKER_USERNAME" "$ALIYUN_DOCKER_PASSWORD"
    
    # 推送镜像
    push_image "$IMAGE_NAME"
    
    log_success "镜像推送完成！"
    log_info "结束时间: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # 显示推送的镜像信息
    echo ""
    log_info "=== 推送镜像信息 ==="
    log_info "镜像: $IMAGE_NAME"
    log_info "大小: $IMAGE_SIZE"
}

# 执行主函数
main "$@"