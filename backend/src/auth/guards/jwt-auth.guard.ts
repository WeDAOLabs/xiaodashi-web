import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JWTPayload } from '@xiaodashi/shared';

/**
 * JWT认证守卫
 *
 * 基于Passport JWT策略的路由守卫，用于：
 * - 保护需要认证的API端点
 * - 自动从请求头中提取和验证JWT token
 * - 支持公开路由的跳过认证（通过@Public装饰器）
 * - 提供详细的认证失败日志记录
 *
 * 使用方式：
 * - 全局守卫：在AppModule中配置为APP_GUARD
 * - 控制器级别：@UseGuards(JwtAuthGuard)
 * - 路由级别：在特定路由方法上使用
 * - 跳过认证：使用@Public装饰器标记公开路由
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 判断是否可以激活路由（是否允许访问）
   *
   * @param context - 执行上下文，包含请求信息
   * @returns boolean | Promise<boolean> | Observable<boolean> - 是否允许访问
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 检查是否为公开路由（使用@Public装饰器标记）
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 公开路由跳过认证
      return true;
    }

    // 调用父类的JWT认证逻辑
    return super.canActivate(context);
  }

  /**
   * 处理认证请求
   *
   * 重写父类方法以提供更详细的错误处理和日志记录
   *
   * @param err - 认证过程中的错误
   * @param user - 认证成功后的用户信息
   * @param info - 认证相关的附加信息
   * @param context - 执行上下文
   * @returns JWTPayload - 认证结果
   * @throws UnauthorizedException - 认证失败时抛出
   */
  handleRequest<TUser = JWTPayload>(
    err: Error | null,
    user: JWTPayload | false,
    info: { name?: string; message?: string } | undefined,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    // 如果有错误或用户不存在，则认证失败
    if (err || !user) {
      // 记录认证失败的详细信息
      this.logger.warn(`认证失败 - ${method} ${url}`, {
        error: err?.message,
        info: info?.message,
        userAgent: request.get('user-agent'),
        ip: request.ip,
      });

      // 根据具体错误类型提供不同的错误信息
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('登录已过期，请重新登录');
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('无效的认证令牌');
      }

      if (info?.name === 'NotBeforeError') {
        throw new UnauthorizedException('认证令牌尚未生效');
      }

      if (err?.message?.includes('用户不存在')) {
        throw new UnauthorizedException('用户账户不存在');
      }

      if (err?.message?.includes('账户已被暂停')) {
        throw new UnauthorizedException('账户已被暂停，请联系管理员');
      }

      if (err?.message?.includes('账户未激活')) {
        throw new UnauthorizedException('账户未激活，请先激活账户');
      }

      // 默认认证失败错误
      throw new UnauthorizedException('认证失败，请登录后访问');
    }

    // 记录认证成功的信息（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`认证成功 - ${method} ${url}`, {
        userId: user.sub,
        userEmail: user.email,
        userRole: user.role,
      });
    }

    // 认证成功，返回用户信息
    return user as TUser;
  }
}

/**
 * Public装饰器
 *
 * 用于标记无需认证的公开路由
 * 被此装饰器标记的路由将跳过JWT认证检查
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('/health')
 * getHealth() {
 *   return { status: 'ok' };
 * }
 * ```
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
