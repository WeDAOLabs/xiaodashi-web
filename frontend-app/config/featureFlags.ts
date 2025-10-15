/**
 * 功能开关配置
 *
 * 用于控制各种功能的显示/隐藏
 * 遵循 KISS 原则，使用简单的布尔值配置
 */

/**
 * 手机验证码登录功能开关
 * - true: 显示手机验证码登录功能
 * - false: 隐藏手机验证码登录功能
 */
export const PHONE_LOGIN_ENABLED = false;

/**
 * 第三方登录功能开关
 * - true: 显示第三方登录功能（如飞书登录）
 * - false: 隐藏第三方登录功能
 */
export const SOCIAL_LOGIN_ENABLED = false;