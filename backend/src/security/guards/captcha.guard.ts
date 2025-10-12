import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { CaptchaService } from '../services/captcha.service';

/**
 * 验证码守卫
 *
 * 用于智能触发验证码验证，基于失败次数、IP风险等因素判断是否需要验证码。
 * 可以通过装饰器应用于路由级别。
 */
@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * 检查是否允许访问
   *
   * @param context 执行上下文
   * @returns Promise<boolean> 是否允许访问
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { captcha } = request.body as {
      captcha?: { sessionId: string; code: string };
    };

    // 获取客户端IP地址
    const ipAddress = this.getClientIp(request);

    // 检查是否需要验证码（基于失败次数等因素）
    const captchaRequired = await this.captchaService.shouldRequireCaptcha(
      undefined, // 非绑定用户
      ipAddress,
    );

    // 如果不需要验证码，直接允许访问
    if (!captchaRequired) {
      return true;
    }

    // 检查是否提供了验证码
    if (!captcha || !captcha.sessionId || !captcha.code) {
      throw new BadRequestException({
        success: false,
        message: '当前需要验证码，请提供验证码',
        captchaRequired: captchaRequired,
      });
    }

    // 验证验证码
    try {
      const verifyResult = await this.captchaService.verifyCaptcha(
        captcha.sessionId,
        captcha.code,
        undefined, // 非绑定用户
        ipAddress,
      );

      if (!verifyResult.success) {
        throw new BadRequestException({
          success: false,
          message: verifyResult.message,
          captchaRequired: captchaRequired,
          attemptsRemaining: verifyResult.attemptsRemaining,
        });
      }

      // 验证成功，允许访问
      return true;
    } catch (error) {
      // 如果是验证码验证失败，重新生成验证码要求
      if (error instanceof BadRequestException) {
        throw error;
      }

      // 其他错误也重新生成验证码要求
      const newCaptchaRequired = await this.captchaService.shouldRequireCaptcha(
        undefined, // 非绑定用户
        ipAddress,
      );

      throw new BadRequestException({
        success: false,
        message: '验证码验证失败，请重新获取',
        captchaRequired: newCaptchaRequired,
      });
    }
  }

  /**
   * 获取客户端真实IP地址
   *
   * @param request Express请求对象
   * @returns string IP地址
   * @private
   */
  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }
}
