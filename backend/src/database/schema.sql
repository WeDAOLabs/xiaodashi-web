-- ========================================================
-- 肖大师 (xiaodashi-web) 用户认证系统数据库表结构
-- 数据库: PostgreSQL
-- 版本: 1.0
-- 创建日期: 2025-09-24
-- ========================================================

-- 用户角色枚举类型
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin');
    END IF;
END $$;

-- 用户状态枚举类型
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
    END IF;
END $$;

-- 权限操作枚举类型
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_action') THEN
        CREATE TYPE permission_action AS ENUM ('create', 'read', 'update', 'delete', 'manage');
    END IF;
END $$;

-- ========================================================
-- 用户主表
-- ========================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) UNIQUE NOT NULL,                    -- RFC 5321 邮箱最大长度
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,                   -- bcrypt hash
    role user_role DEFAULT 'user' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    avatar TEXT,                                           -- 头像URL
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0 NOT NULL,            -- 登录尝试次数
    locked_until TIMESTAMP WITH TIME ZONE,                -- 账户锁定到期时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- 约束
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT users_login_attempts_range CHECK (login_attempts >= 0 AND login_attempts <= 10)
);

-- ========================================================
-- 用户档案表（扩展信息）
-- ========================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    company VARCHAR(100),
    position VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    website TEXT,
    preferences JSONB DEFAULT '{}' NOT NULL,              -- 用户偏好设置
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- 约束
    CONSTRAINT user_profiles_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$'),
    CONSTRAINT user_profiles_website_format CHECK (website IS NULL OR website ~* '^https?://.+')
);

-- ========================================================
-- 权限表
-- ========================================================
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,                    -- 权限标识符，如 'user:read'
    resource VARCHAR(50) NOT NULL,                        -- 资源类型，如 'user', 'order'
    action permission_action NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- 约束
    CONSTRAINT permissions_name_format CHECK (name ~* '^[a-z][a-z0-9_]*:[a-z]+$')
);

-- ========================================================
-- 角色权限关联表
-- ========================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- 唯一约束：同一角色不能有重复权限
    UNIQUE(role, permission_id)
);

-- ========================================================
-- 用户会话表（JWT刷新令牌管理）
-- ========================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,             -- 刷新令牌hash
    device_id VARCHAR(100),                               -- 设备标识
    device_name VARCHAR(100),
    device_type VARCHAR(20) CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(100),                                -- 大概地理位置
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- 约束
    CONSTRAINT user_sessions_expires_future CHECK (expires_at > created_at)
);

-- ========================================================
-- 用户登录日志表
-- ========================================================
CREATE TABLE IF NOT EXISTS user_login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- 允许NULL以保留删除用户的日志
    email VARCHAR(320) NOT NULL,                          -- 冗余存储，防止用户删除后丢失
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(100),
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),                          -- 登录失败原因
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ========================================================
-- 索引优化
-- ========================================================

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);

-- 用户档案表索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company);

-- 权限表索引
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);

-- 角色权限关联表索引
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- 用户会话表索引
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token_hash ON user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_id ON user_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- 用户登录日志表索引
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_email ON user_login_logs(email);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_ip_address ON user_login_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_created_at ON user_login_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_success ON user_login_logs(success);

-- ========================================================
-- 触发器：自动更新 updated_at 字段
-- ========================================================

-- 更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 用户表更新时间触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 用户档案表更新时间触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- 基础数据：插入默认权限
-- ========================================================

INSERT INTO permissions (name, resource, action, description) VALUES
-- 用户相关权限
('user:read', 'user', 'read', '查看用户信息'),
('user:create', 'user', 'create', '创建用户'),
('user:update', 'user', 'update', '更新用户信息'),
('user:delete', 'user', 'delete', '删除用户'),
('user:manage', 'user', 'manage', '完全管理用户'),

-- 个人档案权限
('profile:read', 'profile', 'read', '查看个人档案'),
('profile:update', 'profile', 'update', '更新个人档案'),

-- 会话管理权限
('session:read', 'session', 'read', '查看会话信息'),
('session:delete', 'session', 'delete', '删除会话'),
('session:manage', 'session', 'manage', '管理所有会话')

ON CONFLICT (name) DO NOTHING;

-- ========================================================
-- 基础数据：角色权限分配
-- ========================================================

-- 普通用户权限
INSERT INTO role_permissions (role, permission_id)
SELECT 'user', id FROM permissions WHERE name IN (
    'profile:read', 'profile:update',
    'session:read', 'session:delete'
) ON CONFLICT DO NOTHING;

-- 付费用户权限（继承普通用户权限）
INSERT INTO role_permissions (role, permission_id)
SELECT 'premium', id FROM permissions WHERE name IN (
    'profile:read', 'profile:update',
    'session:read', 'session:delete'
) ON CONFLICT DO NOTHING;

-- 管理员权限（全部权限）
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions
ON CONFLICT DO NOTHING;

-- ========================================================
-- 视图：用户详细信息（包含档案）
-- ========================================================

CREATE OR REPLACE VIEW user_details AS
SELECT
    u.id,
    u.email,
    u.name,
    u.role,
    u.status,
    u.avatar,
    u.email_verified,
    u.last_login_at,
    u.created_at,
    u.updated_at,
    p.phone,
    p.company,
    p.position,
    p.bio,
    p.location,
    p.website,
    p.preferences
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id;

-- ========================================================
-- 清理任务：定期清理过期会话和重置令牌
-- ========================================================

-- 此部分应该通过后端定时任务执行，这里提供SQL示例：

-- 清理过期会话
-- DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;

-- 清理过期的邮箱验证令牌
-- UPDATE users SET
--     email_verification_token = NULL,
--     email_verification_expires_at = NULL
-- WHERE email_verification_expires_at < CURRENT_TIMESTAMP;

-- 清理过期的密码重置令牌
-- UPDATE users SET
--     password_reset_token = NULL,
--     password_reset_expires_at = NULL
-- WHERE password_reset_expires_at < CURRENT_TIMESTAMP;

-- ========================================================
-- 数据库表结构创建完成
-- ========================================================