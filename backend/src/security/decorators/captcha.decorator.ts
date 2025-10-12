import { SetMetadata } from '@nestjs/common';

/**
 * 验证码必需装饰器
 *
 * 用于标记需要验证码的路由，当应用此装饰器时，
 * CaptchaGuard 会强制要求验证码验证。
 */
export const CaptchaRequired = () => SetMetadata('captchaRequired', true);

/**
 * 验证码可选装饰器
 *
 * 用于标记验证码可选的路由，当应用此装饰器时，
 * CaptchaGuard 会根据智能策略决定是否需要验证码。
 */
export const CaptchaOptional = () => SetMetadata('captchaOptional', true);
