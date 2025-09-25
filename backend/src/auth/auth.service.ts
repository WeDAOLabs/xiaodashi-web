import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  AuthToken,
  JWTPayload,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@xiaodashi/shared';
import { User } from '../database/entities/user/user.entity';
import { AuthConfig } from '../config/auth.config';

/**
 * 认证服务类
 *
 * 提供JWT双token认证机制的核心功能：
 * - JWT token生成与验证
 * - bcrypt密码加密与验证
 * - 双token机制（access token + refresh token）
 * - 密码强度验证与重置token生成
 * - 用户登录验证与token管理
 */
@Injectable()
export class AuthService {
  private readonly authConfig: AuthConfig;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfig>('auth')!;
  }

  /**
   * 生成双token（access token + refresh token）
   *
   * @param user - 用户实体对象
   * @returns AuthToken - 包含access和refresh token的完整认证信息
   */
  generateTokens(user: User): AuthToken {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const now = Math.floor(Date.now() / 1000);

    // 生成access token (短期，15分钟)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.accessSecret,
      expiresIn: this.authConfig.jwt.accessExpiresIn,
      issuer: this.authConfig.jwt.issuer,
      audience: this.authConfig.jwt.audience,
    });

    // 生成refresh token (长期，7天)
    const refreshPayload = {
      sub: user.id,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.authConfig.jwt.refreshSecret,
      expiresIn: this.authConfig.jwt.refreshExpiresIn,
      issuer: this.authConfig.jwt.issuer,
      audience: this.authConfig.jwt.audience,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpirationTime(this.authConfig.jwt.accessExpiresIn),
      tokenType: 'Bearer',
      issuedAt: now,
    };
  }

  /**
   * 验证access token的有效性
   *
   * @param token - JWT access token字符串
   * @returns JWTPayload - 解码后的JWT载荷信息
   * @throws UnauthorizedException - token无效或过期时抛出
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      const payload = this.jwtService.verify<JWTPayload>(token, {
        secret: this.authConfig.jwt.accessSecret,
        issuer: this.authConfig.jwt.issuer,
        audience: this.authConfig.jwt.audience,
      });

      return payload;
    } catch {
      throw new UnauthorizedException('Access token 无效或已过期');
    }
  }

  /**
   * 验证refresh token并生成新的token对
   *
   * @param token - JWT refresh token字符串
   * @returns RefreshTokenResponse - 新的token对
   * @throws UnauthorizedException - refresh token无效或用户不存在时抛出
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenResponse> {
    try {
      const payload = this.jwtService.verify<{ sub: string; type: string }>(
        token,
        {
          secret: this.authConfig.jwt.refreshSecret,
          issuer: this.authConfig.jwt.issuer,
          audience: this.authConfig.jwt.audience,
        },
      );

      // 验证是否为refresh token类型
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('无效的refresh token类型');
      }

      // 获取最新的用户信息
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 生成新的token对
      const tokens = this.generateTokens(user);

      return { tokens };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Refresh token 无效或已过期');
    }
  }

  /**
   * 使用bcrypt加密密码
   *
   * @param password - 明文密码
   * @returns Promise<string> - 加密后的密码哈希值
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.authConfig.bcrypt.saltRounds;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * 验证密码是否正确
   *
   * @param password - 明文密码
   * @param hash - 存储的密码哈希值
   * @returns Promise<boolean> - 密码是否匹配
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * 用户登录验证
   *
   * @param loginRequest - 登录请求参数（邮箱、密码等）
   * @returns Promise<LoginResponse> - 登录响应（用户信息和token）
   * @throws UnauthorizedException - 邮箱不存在或密码错误时抛出
   */
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest;

    // 查找用户
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await this.comparePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 生成tokens
    const tokens = this.generateTokens(user);

    // 更新最后登录时间
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      loginAttempts: 0, // 成功登录后重置失败次数
    });

    // 构造响应（不包含敏感信息）
    const userResponse: LoginResponse['user'] = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    return {
      user: userResponse,
      tokens,
      firstLogin: !user.lastLoginAt, // 如果之前没有登录记录，则为首次登录
    };
  }

  /**
   * 验证密码强度
   *
   * 要求：最少8位，包含字母和数字
   *
   * @param password - 待验证的密码
   * @returns boolean - 密码是否符合强度要求
   */
  validatePasswordStrength(password: string): boolean {
    // 最少8位
    if (password.length < 8) {
      return false;
    }

    // 包含字母
    const hasLetter = /[a-zA-Z]/.test(password);

    // 包含数字
    const hasNumber = /\d/.test(password);

    return hasLetter && hasNumber;
  }

  /**
   * 生成密码重置token
   *
   * @param userId - 用户ID
   * @returns string - 密码重置token
   */
  generatePasswordResetToken(userId: string): string {
    const payload = {
      sub: userId,
      type: 'password_reset',
    };

    return this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.accessSecret,
      expiresIn: '1h', // 密码重置token有效期1小时
      issuer: this.authConfig.jwt.issuer,
      audience: this.authConfig.jwt.audience,
    });
  }

  /**
   * 验证密码重置token
   *
   * @param token - 密码重置token
   * @returns string - 用户ID
   * @throws UnauthorizedException - token无效时抛出
   */
  verifyPasswordResetToken(token: string): string {
    try {
      const payload = this.jwtService.verify<{ sub: string; type: string }>(
        token,
        {
          secret: this.authConfig.jwt.accessSecret,
          issuer: this.authConfig.jwt.issuer,
          audience: this.authConfig.jwt.audience,
        },
      );

      if (payload.type !== 'password_reset') {
        throw new UnauthorizedException('无效的密码重置token类型');
      }

      return payload.sub;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('密码重置token无效或已过期');
    }
  }

  /**
   * 解析过期时间字符串为秒数
   *
   * @param expiresIn - 过期时间字符串（如 '15m', '7d'）
   * @returns number - 过期秒数
   * @private
   */
  private parseExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 900; // 默认15分钟
    }
  }
}
