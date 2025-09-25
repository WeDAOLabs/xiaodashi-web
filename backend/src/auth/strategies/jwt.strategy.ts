import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload, UserStatus } from '@xiaodashi/shared';
import { User } from '../../database/entities/user/user.entity';
import { AuthConfig } from '../../config/auth.config';

/**
 * JWT认证策略
 *
 * 实现基于JWT的用户认证策略，用于：
 * - 从HTTP请求中提取JWT token
 * - 验证token的有效性和签名
 * - 根据token载荷信息验证用户存在性和状态
 * - 为后续的路由守卫提供已认证的用户信息
 *
 * 该策略会被JwtAuthGuard使用，在需要认证的路由上自动执行
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    const authConfig = configService.get<AuthConfig>('auth')!;

    super({
      // 从Authorization header中提取Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // JWT签名密钥
      secretOrKey: authConfig.jwt.accessSecret,
      // JWT发行者验证
      issuer: authConfig.jwt.issuer,
      // JWT受众验证
      audience: authConfig.jwt.audience,
    });
  }

  /**
   * 验证JWT载荷并返回用户信息
   *
   * 此方法会在JWT token验证通过后自动调用
   * 用于进一步验证用户的存在性和账户状态
   *
   * @param payload - JWT解码后的载荷信息
   * @returns Promise<User> - 验证通过的用户实体
   * @throws UnauthorizedException - 用户不存在或账户被锁定时抛出
   */
  async validate(payload: JWTPayload): Promise<User> {
    const { sub: userId } = payload;

    // 根据JWT中的用户ID查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'name',
        'role',
        'status',
        'avatar',
        'emailVerified',
        'lastLoginAt',
        'createdAt',
        'updatedAt',
      ],
    });

    // 用户不存在
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 检查用户账户状态
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('账户已被暂停，请联系管理员');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('账户未激活，请先激活账户');
    }

    // 验证通过，返回用户信息
    // 注意：返回的用户信息会被添加到request.user中，供后续处理器使用
    return user;
  }
}
