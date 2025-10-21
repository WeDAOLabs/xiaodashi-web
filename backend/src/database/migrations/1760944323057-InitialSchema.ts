import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1760944323057 implements MigrationInterface {
  name = 'InitialSchema1760944323057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_login_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "email" character varying(320) NOT NULL, "ipAddress" inet, "userAgent" text, "location" character varying(100), "success" boolean NOT NULL, "failureReason" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bcad8136a91a5fdba07ea1284f7" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_login_logs"."id" IS '登录日志唯一标识符'; COMMENT ON COLUMN "user_login_logs"."userId" IS '用户ID，关联到用户表，可为空（登录失败时）'; COMMENT ON COLUMN "user_login_logs"."email" IS '尝试登录的邮箱地址'; COMMENT ON COLUMN "user_login_logs"."ipAddress" IS '登录IP地址'; COMMENT ON COLUMN "user_login_logs"."userAgent" IS '用户浏览器代理字符串'; COMMENT ON COLUMN "user_login_logs"."location" IS '登录地理位置'; COMMENT ON COLUMN "user_login_logs"."success" IS '登录是否成功'; COMMENT ON COLUMN "user_login_logs"."failureReason" IS '登录失败原因'; COMMENT ON COLUMN "user_login_logs"."createdAt" IS '登录尝试时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5178ad2692da19409114900270" ON "user_login_logs" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_657f75c65a23bfc752b69df10b" ON "user_login_logs" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b586014863f7d7d2d1af215a0" ON "user_login_logs" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fb50882e8ac0cd140b71bbfa8" ON "user_login_logs" ("success") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a46ddf94a4c42ad2f54f08137" ON "user_login_logs" ("userId", "success", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d484976a9516925744d741d237" ON "user_login_logs" ("createdAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "user_login_logs" IS '用户登录日志表'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "phone" character varying(20), "company" character varying(100), "position" character varying(100), "bio" text, "location" character varying(100), "website" text, "preferences" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_profiles"."id" IS '用户资料唯一标识符'; COMMENT ON COLUMN "user_profiles"."userId" IS '用户ID，关联到用户表'; COMMENT ON COLUMN "user_profiles"."phone" IS '用户手机号码'; COMMENT ON COLUMN "user_profiles"."company" IS '用户所在公司'; COMMENT ON COLUMN "user_profiles"."position" IS '用户职位'; COMMENT ON COLUMN "user_profiles"."bio" IS '用户个人简介'; COMMENT ON COLUMN "user_profiles"."location" IS '用户所在地区'; COMMENT ON COLUMN "user_profiles"."website" IS '用户个人网站或博客地址'; COMMENT ON COLUMN "user_profiles"."preferences" IS '用户个性化设置和偏好'; COMMENT ON COLUMN "user_profiles"."createdAt" IS '创建时间'; COMMENT ON COLUMN "user_profiles"."updatedAt" IS '更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8481388d6325e752cd4d7e26c6" ON "user_profiles" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_464d6ab6f131b990d6cf139488" ON "user_profiles" ("company") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "user_profiles" IS '用户详细资料表'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "refreshTokenHash" character varying(255) NOT NULL, "deviceId" character varying(100), "deviceName" character varying(100), "deviceType" character varying(20), "ipAddress" inet, "userAgent" text, "location" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastActiveAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_13b1c9fea2562acc4db7a080ad" CHECK ("expiresAt" > "createdAt"), CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_sessions"."id" IS '会话唯一标识符'; COMMENT ON COLUMN "user_sessions"."userId" IS '用户ID，关联到用户表'; COMMENT ON COLUMN "user_sessions"."refreshTokenHash" IS '刷新令牌哈希值'; COMMENT ON COLUMN "user_sessions"."deviceId" IS '设备ID，用于识别设备'; COMMENT ON COLUMN "user_sessions"."deviceName" IS '设备名称'; COMMENT ON COLUMN "user_sessions"."deviceType" IS '设备类型：mobile-手机，tablet-平板，desktop-桌面，unknown-未知'; COMMENT ON COLUMN "user_sessions"."ipAddress" IS '用户IP地址'; COMMENT ON COLUMN "user_sessions"."userAgent" IS '用户浏览器代理字符串'; COMMENT ON COLUMN "user_sessions"."location" IS '用户地理位置'; COMMENT ON COLUMN "user_sessions"."isActive" IS '会话是否处于活跃状态'; COMMENT ON COLUMN "user_sessions"."expiresAt" IS '会话过期时间'; COMMENT ON COLUMN "user_sessions"."createdAt" IS '创建时间'; COMMENT ON COLUMN "user_sessions"."lastActiveAt" IS '最后活跃时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55fa4db8406ed66bc704432842" ON "user_sessions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ed9d6042a764c80befeeacc595" ON "user_sessions" ("refreshTokenHash") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10c813f98c21cd7b6a5e59f757" ON "user_sessions" ("deviceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2904024eefc78b5832daff179b" ON "user_sessions" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8da92f9b10e513921836cab2ce" ON "user_sessions" ("isActive") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5f2c875043dcf84df7b73ed73" ON "user_sessions" ("expiresAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef767b3bed56bf20659569da1c" ON "user_sessions" ("expiresAt", "isActive") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12341ff731c2b108113dfd6479" ON "user_sessions" ("userId", "deviceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36cbbaa23a16cc814fc39f1a7e" ON "user_sessions" ("userId", "isActive") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "user_sessions" IS '用户会话表'`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'premium', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "name" character varying(100) NOT NULL, "passwordHash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "avatar" text, "emailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying(1024), "emailVerificationExpiresAt" TIMESTAMP WITH TIME ZONE, "passwordResetToken" character varying(1024), "passwordResetExpiresAt" TIMESTAMP WITH TIME ZONE, "lastLoginAt" TIMESTAMP WITH TIME ZONE, "loginAttempts" integer NOT NULL DEFAULT '0', "lockedUntil" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS '用户唯一标识符'; COMMENT ON COLUMN "users"."email" IS '用户邮箱地址，作为登录用户名'; COMMENT ON COLUMN "users"."name" IS '用户显示名称'; COMMENT ON COLUMN "users"."passwordHash" IS '密码哈希值'; COMMENT ON COLUMN "users"."role" IS '用户角色：USER-普通用户，ADMIN-管理员'; COMMENT ON COLUMN "users"."status" IS '用户状态：ACTIVE-活跃，INACTIVE-非活跃，SUSPENDED-已暂停'; COMMENT ON COLUMN "users"."avatar" IS '用户头像URL'; COMMENT ON COLUMN "users"."emailVerified" IS '邮箱是否已验证'; COMMENT ON COLUMN "users"."emailVerificationToken" IS '邮箱验证令牌'; COMMENT ON COLUMN "users"."emailVerificationExpiresAt" IS '邮箱验证令牌过期时间'; COMMENT ON COLUMN "users"."passwordResetToken" IS '密码重置令牌'; COMMENT ON COLUMN "users"."passwordResetExpiresAt" IS '密码重置令牌过期时间'; COMMENT ON COLUMN "users"."lastLoginAt" IS '最后登录时间'; COMMENT ON COLUMN "users"."loginAttempts" IS '登录失败尝试次数'; COMMENT ON COLUMN "users"."lockedUntil" IS '账户锁定至指定时间'; COMMENT ON COLUMN "users"."createdAt" IS '创建时间'; COMMENT ON COLUMN "users"."updatedAt" IS '更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ad75a333a7bcf6a2b5d3517ca" ON "users" ("emailVerificationToken") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bffe933a388d6bde48891ff95a" ON "users" ("passwordResetToken") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0f30dcc205fa03b0d77e95118" ON "users" ("lastLoginAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_204e9b624861ff4a5b26819210" ON "users" ("createdAt") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "users" IS '用户基础信息表'`);
    await queryRunner.query(
      `CREATE TYPE "public"."captcha_sessions_captchatype_enum" AS ENUM('image', 'slider')`,
    );
    await queryRunner.query(
      `CREATE TABLE "captcha_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" character varying(64) NOT NULL, "captchaData" character varying(255) NOT NULL, "captchaType" "public"."captcha_sessions_captchatype_enum" NOT NULL DEFAULT 'image', "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "ipAddress" character varying(45), "userAgent" text, "attempts" integer NOT NULL DEFAULT '0', "isVerified" boolean NOT NULL DEFAULT false, "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_3bda19533c127a7a66c467e5f4f" UNIQUE ("sessionId"), CONSTRAINT "PK_4d37a9d7793d39d9b394a3ab7d3" PRIMARY KEY ("id")); COMMENT ON COLUMN "captcha_sessions"."id" IS '验证码会话唯一标识符，用于数据库主键'; COMMENT ON COLUMN "captcha_sessions"."sessionId" IS '前端会话标识符，用于关联验证码生成和验证请求'; COMMENT ON COLUMN "captcha_sessions"."captchaData" IS '验证码文本或滑动位置信息，使用bcrypt加密存储以防止泄露'; COMMENT ON COLUMN "captcha_sessions"."captchaType" IS '验证码类型：image-图形验证码，slider-滑动验证码'; COMMENT ON COLUMN "captcha_sessions"."expiresAt" IS '验证码过期时间，超过此时间验证码将失效'; COMMENT ON COLUMN "captcha_sessions"."ipAddress" IS '客户端IP地址，用于安全审计和异常检测'; COMMENT ON COLUMN "captcha_sessions"."userAgent" IS '客户端User-Agent字符串，用于设备识别和风险分析'; COMMENT ON COLUMN "captcha_sessions"."attempts" IS '验证尝试次数，用于防止暴力破解验证码'; COMMENT ON COLUMN "captcha_sessions"."isVerified" IS '验证码是否已验证成功，成功的验证码会被标记防止重复使用'; COMMENT ON COLUMN "captcha_sessions"."isUsed" IS '验证码是否已使用，用于防止验证码重复攻击'; COMMENT ON COLUMN "captcha_sessions"."createdAt" IS '验证码创建时间，用于审计和分析'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3bda19533c127a7a66c467e5f4" ON "captcha_sessions" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34e87cdc830537269f86ddcb33" ON "captcha_sessions" ("expiresAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "captcha_sessions" IS '验证码会话表，用于管理登录验证码的生命周期和验证状态'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_action_enum" AS ENUM('create', 'read', 'update', 'delete', 'manage')`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "resource" character varying(50) NOT NULL, "action" "public"."permissions_action_enum" NOT NULL, "description" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")); COMMENT ON COLUMN "permissions"."id" IS '权限唯一标识符'; COMMENT ON COLUMN "permissions"."name" IS '权限名称，系统内唯一'; COMMENT ON COLUMN "permissions"."resource" IS '权限所属资源模块'; COMMENT ON COLUMN "permissions"."action" IS '权限操作类型：CREATE-创建，READ-读取，UPDATE-更新，DELETE-删除'; COMMENT ON COLUMN "permissions"."description" IS '权限详细描述'; COMMENT ON COLUMN "permissions"."createdAt" IS '创建时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_48ce552495d14eae9b187bb671" ON "permissions" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89456a09b598ce8915c702c528" ON "permissions" ("resource") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c1e0637ecf1f6401beb9a68ab" ON "permissions" ("action") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "permissions" IS '权限定义表'`);
    await queryRunner.query(
      `CREATE TYPE "public"."role_permissions_role_enum" AS ENUM('user', 'premium', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."role_permissions_role_enum" NOT NULL, "permissionId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_960cb22301f2d35aac0448d6683" UNIQUE ("role", "permissionId"), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")); COMMENT ON COLUMN "role_permissions"."id" IS '角色权限关联唯一标识符'; COMMENT ON COLUMN "role_permissions"."role" IS '用户角色：USER-普通用户，ADMIN-管理员'; COMMENT ON COLUMN "role_permissions"."permissionId" IS '权限ID，关联到权限表'; COMMENT ON COLUMN "role_permissions"."createdAt" IS '关联创建时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d5086bd299f773d403574cf1c" ON "role_permissions" ("role") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_06792d0c62ce6b0203c03643cd" ON "role_permissions" ("permissionId") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "role_permissions" IS '角色权限关联表'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ip_whitelists_type_enum" AS ENUM('single', 'range')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ip_whitelists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" inet NOT NULL, "type" "public"."ip_whitelists_type_enum" NOT NULL, "description" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdBy" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e1feff8f27f7506cf2223fe1c2f" UNIQUE ("ipAddress"), CONSTRAINT "PK_1c23a56c96be20b6257d1c7e952" PRIMARY KEY ("id")); COMMENT ON COLUMN "ip_whitelists"."id" IS 'IP白名单记录唯一标识符'; COMMENT ON COLUMN "ip_whitelists"."ipAddress" IS 'IP地址或CIDR格式的IP段'; COMMENT ON COLUMN "ip_whitelists"."type" IS 'IP类型：single-单个IP地址，range-IP地址段'; COMMENT ON COLUMN "ip_whitelists"."description" IS '白名单说明，如"公司办公网络"、"CDN节点"等'; COMMENT ON COLUMN "ip_whitelists"."isActive" IS '白名单规则是否生效'; COMMENT ON COLUMN "ip_whitelists"."createdBy" IS '创建该白名单记录的管理员用户ID'; COMMENT ON COLUMN "ip_whitelists"."createdAt" IS '记录创建时间'; COMMENT ON COLUMN "ip_whitelists"."updatedAt" IS '记录更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1feff8f27f7506cf2223fe1c2" ON "ip_whitelists" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97ef0d818bede3b6d51b6efb40" ON "ip_whitelists" ("isActive") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "ip_whitelists" IS 'IP白名单表，记录可信任的IP地址，白名单IP将跳过频率限制'`,
    );
    await queryRunner.query(
      `CREATE TABLE "ip_rate_limits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" inet NOT NULL, "action" character varying(50) NOT NULL, "requestCount" integer NOT NULL DEFAULT '1', "windowStartAt" TIMESTAMP WITH TIME ZONE NOT NULL, "windowEndAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedUntil" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_98ee90b0b0178071e0135310d6c" PRIMARY KEY ("id")); COMMENT ON COLUMN "ip_rate_limits"."id" IS 'IP频率限制记录唯一标识符'; COMMENT ON COLUMN "ip_rate_limits"."ipAddress" IS 'IP地址'; COMMENT ON COLUMN "ip_rate_limits"."action" IS '限流动作类型：login-登录，register-注册，api-API调用，captcha-验证码'; COMMENT ON COLUMN "ip_rate_limits"."requestCount" IS '当前窗口内的请求次数'; COMMENT ON COLUMN "ip_rate_limits"."windowStartAt" IS '窗口开始时间，用于滑动窗口算法计算'; COMMENT ON COLUMN "ip_rate_limits"."windowEndAt" IS '窗口结束时间（=窗口开始时间+窗口大小）'; COMMENT ON COLUMN "ip_rate_limits"."isBlocked" IS '是否已被限流阻止'; COMMENT ON COLUMN "ip_rate_limits"."blockedUntil" IS '限流解除时间，超过此时间自动解除限流'; COMMENT ON COLUMN "ip_rate_limits"."createdAt" IS '记录创建时间'; COMMENT ON COLUMN "ip_rate_limits"."updatedAt" IS '记录更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85d55cbe472951841401de038f" ON "ip_rate_limits" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_311fce37e2e18e8e07a29ad95a" ON "ip_rate_limits" ("action") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc8a3f097d8ec84137dd156a83" ON "ip_rate_limits" ("windowStartAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c45fe537a0978d978807449369" ON "ip_rate_limits" ("windowEndAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6b648f15987083aed5ef94feac" ON "ip_rate_limits" ("blockedUntil") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_382176219f3fadae37d699d5e2" ON "ip_rate_limits" ("ipAddress", "action") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "ip_rate_limits" IS 'IP频率限制记录表，用于记录IP的访问频率，支持滑动窗口算法'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ip_blacklists_type_enum" AS ENUM('single', 'range')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ip_blacklists_severity_enum" AS ENUM('low', 'medium', 'high', 'critical')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ip_blacklists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" inet NOT NULL, "type" "public"."ip_blacklists_type_enum" NOT NULL, "reason" text NOT NULL, "severity" "public"."ip_blacklists_severity_enum" NOT NULL DEFAULT 'medium', "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP WITH TIME ZONE, "blockedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdBy" uuid, "metadata" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_513d840dbbe7cc4e29a16d7b890" UNIQUE ("ipAddress"), CONSTRAINT "PK_285856ebd46e2441b6fa2727239" PRIMARY KEY ("id")); COMMENT ON COLUMN "ip_blacklists"."id" IS 'IP黑名单记录唯一标识符'; COMMENT ON COLUMN "ip_blacklists"."ipAddress" IS 'IP地址或CIDR格式的IP段（如192.168.1.0/24），使用PostgreSQL INET类型'; COMMENT ON COLUMN "ip_blacklists"."type" IS 'IP类型：single-单个IP地址，range-IP地址段（CIDR格式）'; COMMENT ON COLUMN "ip_blacklists"."reason" IS '封禁原因说明，如"暴力破解攻击"、"恶意扫描"等'; COMMENT ON COLUMN "ip_blacklists"."severity" IS '威胁严重程度：low-低危，medium-中危，high-高危，critical-严重'; COMMENT ON COLUMN "ip_blacklists"."isActive" IS '黑名单规则是否生效，false表示暂时禁用'; COMMENT ON COLUMN "ip_blacklists"."expiresAt" IS '黑名单过期时间，null表示永久封禁'; COMMENT ON COLUMN "ip_blacklists"."blockedAt" IS 'IP被加入黑名单的时间'; COMMENT ON COLUMN "ip_blacklists"."createdBy" IS '创建该黑名单记录的管理员用户ID'; COMMENT ON COLUMN "ip_blacklists"."metadata" IS '额外元数据，如触发次数、相关事件ID等'; COMMENT ON COLUMN "ip_blacklists"."createdAt" IS '记录创建时间'; COMMENT ON COLUMN "ip_blacklists"."updatedAt" IS '记录更新时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_513d840dbbe7cc4e29a16d7b89" ON "ip_blacklists" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e46be9afa8cef003d8e1d0bf8c" ON "ip_blacklists" ("isActive") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70d22dff1267ae74ed1311e71f" ON "ip_blacklists" ("expiresAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "ip_blacklists" IS 'IP黑名单表，记录被封禁的IP地址和IP段，支持CIDR格式'`,
    );
    await queryRunner.query(
      `CREATE TABLE "ip_access_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" inet NOT NULL, "endpoint" character varying(200) NOT NULL, "method" character varying(10) NOT NULL, "statusCode" integer NOT NULL, "userAgent" text, "userId" uuid, "riskScore" integer NOT NULL DEFAULT '0', "blocked" boolean NOT NULL DEFAULT false, "blockReason" character varying(200), "location" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_113c2f6fcc4f6da2513247c77f5" PRIMARY KEY ("id")); COMMENT ON COLUMN "ip_access_logs"."id" IS 'IP访问日志唯一标识符'; COMMENT ON COLUMN "ip_access_logs"."ipAddress" IS 'IP地址'; COMMENT ON COLUMN "ip_access_logs"."endpoint" IS '访问的API端点路径'; COMMENT ON COLUMN "ip_access_logs"."method" IS 'HTTP请求方法：GET、POST、PUT、DELETE等'; COMMENT ON COLUMN "ip_access_logs"."statusCode" IS 'HTTP响应状态码'; COMMENT ON COLUMN "ip_access_logs"."userAgent" IS '用户代理字符串'; COMMENT ON COLUMN "ip_access_logs"."userId" IS '关联的用户ID，未登录时为空'; COMMENT ON COLUMN "ip_access_logs"."riskScore" IS 'IP风险评分（0-100），由风险评估服务计算'; COMMENT ON COLUMN "ip_access_logs"."blocked" IS '该请求是否被安全策略拦截'; COMMENT ON COLUMN "ip_access_logs"."blockReason" IS '拦截原因说明'; COMMENT ON COLUMN "ip_access_logs"."location" IS '地理位置信息，格式：国家,城市'; COMMENT ON COLUMN "ip_access_logs"."createdAt" IS '访问时间'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e17c2e6296461aeb8a73b9de33" ON "ip_access_logs" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_592c5557f7b0b242cf3af1c5a7" ON "ip_access_logs" ("statusCode") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c4f6111333be8b8397ce99904" ON "ip_access_logs" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efff5b20f93a9c5d05f76dd6af" ON "ip_access_logs" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_891ab977ad7612f808f27b156c" ON "ip_access_logs" ("userId", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc7b72308d845b05bbf8731813" ON "ip_access_logs" ("ipAddress", "createdAt") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "ip_access_logs" IS 'IP访问日志表，记录所有IP的访问行为用于安全分析'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_logs" ADD CONSTRAINT "FK_5178ad2692da194091149002702" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_55fa4db8406ed66bc7044328427" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_55fa4db8406ed66bc7044328427"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_logs" DROP CONSTRAINT "FK_5178ad2692da194091149002702"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "ip_access_logs" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc7b72308d845b05bbf8731813"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_891ab977ad7612f808f27b156c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efff5b20f93a9c5d05f76dd6af"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c4f6111333be8b8397ce99904"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_592c5557f7b0b242cf3af1c5a7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e17c2e6296461aeb8a73b9de33"`,
    );
    await queryRunner.query(`DROP TABLE "ip_access_logs"`);
    await queryRunner.query(`COMMENT ON TABLE "ip_blacklists" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_70d22dff1267ae74ed1311e71f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e46be9afa8cef003d8e1d0bf8c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_513d840dbbe7cc4e29a16d7b89"`,
    );
    await queryRunner.query(`DROP TABLE "ip_blacklists"`);
    await queryRunner.query(`DROP TYPE "public"."ip_blacklists_severity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."ip_blacklists_type_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "ip_rate_limits" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_382176219f3fadae37d699d5e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6b648f15987083aed5ef94feac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c45fe537a0978d978807449369"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc8a3f097d8ec84137dd156a83"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_311fce37e2e18e8e07a29ad95a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_85d55cbe472951841401de038f"`,
    );
    await queryRunner.query(`DROP TABLE "ip_rate_limits"`);
    await queryRunner.query(`COMMENT ON TABLE "ip_whitelists" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97ef0d818bede3b6d51b6efb40"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e1feff8f27f7506cf2223fe1c2"`,
    );
    await queryRunner.query(`DROP TABLE "ip_whitelists"`);
    await queryRunner.query(`DROP TYPE "public"."ip_whitelists_type_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "role_permissions" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_06792d0c62ce6b0203c03643cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d5086bd299f773d403574cf1c"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TYPE "public"."role_permissions_role_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "permissions" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c1e0637ecf1f6401beb9a68ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_89456a09b598ce8915c702c528"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48ce552495d14eae9b187bb671"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_action_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "captcha_sessions" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34e87cdc830537269f86ddcb33"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3bda19533c127a7a66c467e5f4"`,
    );
    await queryRunner.query(`DROP TABLE "captcha_sessions"`);
    await queryRunner.query(
      `DROP TYPE "public"."captcha_sessions_captchatype_enum"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "users" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_204e9b624861ff4a5b26819210"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0f30dcc205fa03b0d77e95118"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bffe933a388d6bde48891ff95a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ad75a333a7bcf6a2b5d3517ca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3676155292d72c67cd4e090514"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`COMMENT ON TABLE "user_sessions" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_36cbbaa23a16cc814fc39f1a7e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12341ff731c2b108113dfd6479"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef767b3bed56bf20659569da1c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5f2c875043dcf84df7b73ed73"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8da92f9b10e513921836cab2ce"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2904024eefc78b5832daff179b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10c813f98c21cd7b6a5e59f757"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ed9d6042a764c80befeeacc595"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55fa4db8406ed66bc704432842"`,
    );
    await queryRunner.query(`DROP TABLE "user_sessions"`);
    await queryRunner.query(`COMMENT ON TABLE "user_profiles" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_464d6ab6f131b990d6cf139488"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8481388d6325e752cd4d7e26c6"`,
    );
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`COMMENT ON TABLE "user_login_logs" IS NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d484976a9516925744d741d237"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a46ddf94a4c42ad2f54f08137"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5fb50882e8ac0cd140b71bbfa8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b586014863f7d7d2d1af215a0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_657f75c65a23bfc752b69df10b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5178ad2692da19409114900270"`,
    );
    await queryRunner.query(`DROP TABLE "user_login_logs"`);
  }
}
