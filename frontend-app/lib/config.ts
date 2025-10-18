/**
 * 应用配置管理
 * 区分客户端和服务端环境变量，提供类型安全的配置访问
 *
 * 使用说明：
 * - 客户端代码：使用 publicConfig
 * - 服务端代码：使用 publicConfig 和 serverConfig
 */

// ========== 客户端配置 ==========
// 可以在浏览器和服务端使用
// 环境变量必须以 NEXT_PUBLIC_ 开头才能暴露到客户端
export const publicConfig = {
  /** Backend API 基础地址 */
  backendUrl: process.env.APP_BACKEND_URL!,

  /** Token 刷新时间（过期前多少秒开始刷新） */
  tokenRefreshBeforeExpiry: Number(
    process.env.TOKEN_REFRESH_BEFORE_EXPIRY || 300
  ),

  /** 是否为开发环境 */
  isDevelopment: process.env.NODE_ENV === 'development',

  /** 是否为生产环境 */
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// ========== 服务端配置 ==========
// ⚠️ 只能在服务端使用（API Routes, Server Components, Middleware）
// ⚠️ 这些变量不会暴露到客户端
export const serverConfig = {
  /** JWT 密钥（与 backend 保持一致） */
  jwtSecret: process.env.JWT_SECRET!,

  /** OpenAI API Key（可选） */
  openaiApiKey: process.env.OPENAI_API_KEY,

  /** Claude API Key（可选） */
  claudeApiKey: process.env.CLAUDE_API_KEY,
} as const;

// ========== 运行时验证 ==========

// 验证客户端必需的环境变量
if (!publicConfig.backendUrl) {
  throw new Error('❌ 缺少必需的环境变量: APP_BACKEND_URL');
}

// 验证服务端必需的环境变量（仅在服务端）
if (typeof window === 'undefined') {
  if (!serverConfig.jwtSecret) {
    throw new Error('❌ 缺少必需的服务端环境变量: JWT_SECRET');
  }

  // 开发环境下输出配置信息
  if (publicConfig.isDevelopment) {
    console.log('🔧 应用配置:', {
      backendUrl: publicConfig.backendUrl,
      tokenRefreshBeforeExpiry: publicConfig.tokenRefreshBeforeExpiry,
      environment: process.env.NODE_ENV,
      hasJwtSecret: !!serverConfig.jwtSecret,
    });
  }
}
