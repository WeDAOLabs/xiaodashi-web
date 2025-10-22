import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeviceInfo } from '@xiaodashi/shared';
import {
  AdminPasswordResetTokenResponse,
  AuthToken,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  JWTPayload,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PasswordResetTokenStatus,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserRole,
  UserStatus,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@xiaodashi/shared';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { AuthConfig } from '../config/auth.config';
import { SecurityConfig } from '../config/security.config';
import { UserLoginLog } from '../database/entities/user/user-login-log.entity';
import { User } from '../database/entities/user/user.entity';
import { AccountLockoutService } from '../security/services/account-lockout.service';
import { CaptchaService } from '../security/services/captcha.service';
import { SessionService } from '../session/session.service';
import { TeamService } from '../team/team.service';

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
    @InjectRepository(UserLoginLog)
    private readonly userLoginLogRepository: Repository<UserLoginLog>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly accountLockoutService: AccountLockoutService,
    private readonly captchaService: CaptchaService,
    private readonly dataSource: DataSource,
    private readonly teamService: TeamService,
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
   * 提取设备信息
   *
   * @param request - Express请求对象
   * @returns 设备信息对象
   * @private
   */
  private extractDeviceInfo(request: Request) {
    const userAgent = request.headers['user-agent'] || '';
    const ipAddress = this.getClientIP(request);

    return {
      userAgent,
      ipAddress,
      location: undefined, // TODO: 可以集成IP地理位置服务
    };
  }

  /**
   * 解析User-Agent获取设备信息
   *
   * @param userAgent - User-Agent字符串
   * @returns DeviceInfo - 设备信息
   * @private
   */
  private parseDeviceInfo(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();

    // 简单的设备类型检测
    let deviceType: DeviceInfo['deviceType'] = 'unknown';
    if (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone')
    ) {
      deviceType = 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = 'tablet';
    } else if (
      ua.includes('windows') ||
      ua.includes('macintosh') ||
      ua.includes('linux')
    ) {
      deviceType = 'desktop';
    }

    // 简单的浏览器检测
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('edge')) browser = 'Edge';

    // 简单的操作系统检测
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad'))
      os = 'iOS';

    return {
      deviceType,
      browser,
      os,
    };
  }

  /**
   * 获取客户端真实IP地址
   *
   * @param request - Express请求对象
   * @returns 客户端IP地址
   * @private
   */
  private getClientIP(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      ''
    );
  }

  /**
   * 记录登录日志
   *
   * @param email - 登录邮箱
   * @param userId - 用户ID（可选，登录失败时为空）
   * @param success - 登录是否成功
   * @param deviceInfo - 设备信息
   * @param failureReason - 登录失败原因（可选）
   * @private
   */
  private async logLoginAttempt(
    email: string,
    userId: string | undefined,
    success: boolean,
    deviceInfo: {
      userAgent: string;
      ipAddress: string;
      location?: string;
    },
    failureReason?: string,
  ): Promise<void> {
    try {
      const loginLog = this.userLoginLogRepository.create({
        userId,
        email,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        location: deviceInfo.location,
        success,
        failureReason,
      });
      await this.userLoginLogRepository.save(loginLog);
    } catch (error) {
      // 登录日志记录失败不应影响正常登录流程
      console.error('登录日志记录失败:', error);
    }
  }

  /**
   * 用户登录验证
   *
   * @param loginRequest - 登录请求参数（邮箱、密码等）
   * @param request - Express请求对象（用于提取设备信息）
   * @returns Promise<LoginResponse> - 登录响应（用户信息和token）
   * @throws UnauthorizedException - 邮箱不存在或密码错误时抛出
   */
  async login(
    loginRequest: LoginRequest,
    request?: Request,
  ): Promise<LoginResponse> {
    const { email, password, captcha } = loginRequest;

    // 提取设备信息
    const deviceInfo = request
      ? this.extractDeviceInfo(request)
      : { userAgent: '', ipAddress: '', location: undefined };

    // 查找用户
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // 记录登录失败日志
      await this.logLoginAttempt(
        email,
        undefined,
        false,
        deviceInfo,
        '用户不存在',
      );
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 检查账户锁定状态
    const lockoutStatus = await this.accountLockoutService.checkAccountLocked(
      user.id,
    );
    if (lockoutStatus.isLocked) {
      // 账户被锁定，记录登录失败日志
      await this.logLoginAttempt(
        email,
        user.id,
        false,
        deviceInfo,
        '账户已被锁定',
      );

      // 抛出账户锁定异常，包含锁定信息
      throw new UnauthorizedException(
        `账户已被锁定，锁定时间：${lockoutStatus.lockoutDuration}分钟。请稍后再试或联系管理员。`,
      );
    }

    // 验证密码
    const isPasswordValid = await this.comparePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      // 使用AccountLockoutService记录失败尝试（会自动处理锁定逻辑）
      const ipAddress = deviceInfo.ipAddress;
      await this.accountLockoutService.recordFailedAttempt(user.id, ipAddress);

      // 记录登录失败日志
      await this.logLoginAttempt(email, user.id, false, deviceInfo, '密码错误');
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 检查是否需要验证码验证
    const captchaAssessment = await this.captchaService.shouldRequireCaptcha(
      user.id,
      email,
      deviceInfo.ipAddress,
      deviceInfo.userAgent,
    );

    const shouldRequireCaptcha = captchaAssessment.required;
    // 从安全配置中读取登录验证码开关
    const enabledCaptcha =
      this.configService.get<SecurityConfig>('security')!.security.captcha
        .enabled;

    if (enabledCaptcha && shouldRequireCaptcha) {
      // 如果需要验证码但未提供，则拒绝登录
      if (!captcha || !captcha.sessionId || !captcha.code) {
        await this.logLoginAttempt(
          email,
          user.id,
          false,
          deviceInfo,
          '需要验证码但未提供',
        );
        throw new UnauthorizedException('当前需要验证码验证，请提供验证码');
      }

      // 验证验证码
      const captchaResult = await this.captchaService.verifyCaptcha(
        captcha.sessionId,
        captcha.code,
        user.id,
        deviceInfo.ipAddress,
      );

      if (!captchaResult.success) {
        await this.logLoginAttempt(
          email,
          user.id,
          false,
          deviceInfo,
          `验证码验证失败: ${captchaResult.message}`,
        );
        throw new UnauthorizedException(
          `验证码验证失败: ${captchaResult.message}`,
        );
      }
    }

    // 生成tokens
    const tokens = this.generateTokens(user);

    // 解析设备信息
    const parsedDeviceInfo: DeviceInfo = {
      ...this.parseDeviceInfo(deviceInfo.userAgent),
      location: deviceInfo.location,
    };

    // 创建会话
    await this.sessionService.createSession(
      user.id,
      parsedDeviceInfo,
      tokens.refreshToken,
      deviceInfo.ipAddress,
      deviceInfo.userAgent,
    );

    // 更新最后登录时间，成功登录时重置失败次数
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      loginAttempts: 0, // 成功登录后重置失败次数
    });

    // 记录登录成功日志
    await this.logLoginAttempt(email, user.id, true, deviceInfo);

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
   * 生成邮箱验证token
   *
   * @param userId - 用户ID
   * @returns string - 邮箱验证token
   */
  generateEmailVerificationToken(userId: string): string {
    const payload = {
      sub: userId,
      type: 'email_verification',
    };

    return this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.accessSecret,
      expiresIn: '24h', // 邮箱验证token有效期24小时
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
   * 验证邮箱验证token
   *
   * @param token - 邮箱验证token
   * @returns string - 用户ID
   * @throws UnauthorizedException - token无效时抛出
   */
  verifyEmailVerificationToken(token: string): string {
    try {
      const payload = this.jwtService.verify<{ sub: string; type: string }>(
        token,
        {
          secret: this.authConfig.jwt.accessSecret,
          issuer: this.authConfig.jwt.issuer,
          audience: this.authConfig.jwt.audience,
        },
      );

      if (payload.type !== 'email_verification') {
        throw new UnauthorizedException('无效的邮箱验证token类型');
      }

      return payload.sub;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('邮箱验证token无效或已过期');
    }
  }

  /**
   * 用户注册
   *
   * @param registerRequest - 注册请求参数
   * @returns Promise<RegisterResponse> - 注册响应（用户信息和token）
   * @throws ConflictException - 邮箱已存在时抛出
   * @throws BadRequestException - 密码强度不符合要求时抛出
   */
  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const { email, name, password, confirmPassword, agreeToTerms } =
      registerRequest;

    // 验证密码确认
    if (password !== confirmPassword) {
      throw new BadRequestException('密码确认不匹配');
    }

    // 验证密码强度
    if (!this.validatePasswordStrength(password)) {
      throw new BadRequestException(
        '密码强度不符合要求：至少8位，包含字母和数字',
      );
    }

    // 验证服务条款同意
    if (!agreeToTerms) {
      throw new BadRequestException('必须同意服务条款');
    }

    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('邮箱已存在');
    }

    // 加密密码
    const passwordHash = await this.hashPassword(password);

    // 使用事务确保用户创建和团队创建的原子性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 创建用户
      const user = queryRunner.manager.create(User, {
        email,
        name,
        passwordHash,
        status: UserStatus.INACTIVE, // 默认未激活，需要邮箱验证
        role: UserRole.USER, // 默认角色
      });

      const savedUser = await queryRunner.manager.save(User, user);

      // 2. 创建默认团队和成员关系
      await this.teamService.createDefaultTeam(
        savedUser.id,
        savedUser.name,
        queryRunner,
      );

      // 3. 更新用户的邮箱验证token（使用真实的用户ID重新生成）
      const actualEmailVerificationToken = this.generateEmailVerificationToken(
        savedUser.id,
      );
      await queryRunner.manager.update(User, savedUser.id, {
        emailVerificationToken: actualEmailVerificationToken,
        emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时
      });

      // 提交事务
      await queryRunner.commitTransaction();

      // 生成登录tokens
      const tokens = this.generateTokens(savedUser);

      // 构造响应
      const userResponse = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        status: savedUser.status,
        avatar: savedUser.avatar,
        createdAt: savedUser.createdAt.toISOString(),
        updatedAt: savedUser.updatedAt.toISOString(),
      };

      return {
        user: userResponse,
        tokens,
        needEmailVerification: true,
      };
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放连接
      await queryRunner.release();
    }
  }

  /**
   * 忘记密码处理
   *
   * @param forgotPasswordRequest - 忘记密码请求
   * @returns Promise<ForgotPasswordResponse> - 忘记密码响应
   */
  async forgotPassword(
    forgotPasswordRequest: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const { email } = forgotPasswordRequest;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // 为了安全，即使用户不存在也返回成功消息
      return {
        message: '如果该邮箱存在，重置密码邮件已发送',
        resetTokenSent: false,
      };
    }

    // 生成密码重置token
    const resetToken = this.generatePasswordResetToken(user.id);

    // 存储密码重置token到数据库
    await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1小时过期
    });

    // 这里应该发送邮件，目前先返回成功消息
    // TODO: 集成邮件服务发送包含resetToken的重置邮件

    return {
      message: '密码重置邮件已发送到您的邮箱',
      resetTokenSent: true,
    };
  }

  /**
   * 重置密码
   *
   * @param resetPasswordRequest - 重置密码请求
   * @returns Promise<ResetPasswordResponse> - 重置密码响应
   */
  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const { resetToken, newPassword, confirmPassword } = resetPasswordRequest;

    // 验证密码确认
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('密码确认不匹配');
    }

    // 验证密码强度
    if (!this.validatePasswordStrength(newPassword)) {
      throw new BadRequestException(
        '密码强度不符合要求：至少8位，包含字母和数字',
      );
    }

    // 从数据库查找并验证密码重置token
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: resetToken,
      },
    });

    if (!user) {
      throw new BadRequestException('密码重置token无效或已过期');
    }

    // 检查token是否过期
    if (
      user.passwordResetExpiresAt &&
      user.passwordResetExpiresAt < new Date()
    ) {
      throw new BadRequestException('密码重置token已过期');
    }

    // 加密新密码
    const passwordHash = await this.hashPassword(newPassword);

    // 更新用户密码并清除重置token
    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpiresAt = null;
    user.loginAttempts = 0; // 重置登录失败次数
    await this.userRepository.save(user);

    return {
      message: '密码重置成功',
      success: true,
    };
  }

  /**
   * 修改密码
   *
   * @param userId - 用户ID
   * @param changePasswordRequest - 修改密码请求
   * @returns Promise<ChangePasswordResponse> - 修改密码响应
   */
  async changePassword(
    userId: string,
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const { currentPassword, newPassword, confirmPassword } =
      changePasswordRequest;

    // 验证密码确认
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('密码确认不匹配');
    }

    // 验证密码强度
    if (!this.validatePasswordStrength(newPassword)) {
      throw new BadRequestException(
        '密码强度不符合要求：至少8位，包含字母和数字',
      );
    }

    // 获取用户信息
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证当前密码
    const isCurrentPasswordValid = await this.comparePassword(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('当前密码错误');
    }

    // 加密新密码
    const passwordHash = await this.hashPassword(newPassword);

    // 更新密码
    await this.userRepository.update(userId, {
      passwordHash,
    });

    return {
      message: '密码修改成功',
      success: true,
    };
  }

  /**
   * 邮箱验证
   *
   * @param verifyEmailRequest - 邮箱验证请求
   * @returns Promise<VerifyEmailResponse> - 邮箱验证响应
   */
  async verifyEmail(
    verifyEmailRequest: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> {
    const { verificationToken } = verifyEmailRequest;

    // 从数据库查找并验证邮箱验证token
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: verificationToken,
      },
    });

    if (!user) {
      throw new BadRequestException('邮箱验证token无效或已过期');
    }

    // 检查token是否过期
    if (
      user.emailVerificationExpiresAt &&
      user.emailVerificationExpiresAt < new Date()
    ) {
      throw new BadRequestException('邮箱验证token已过期');
    }

    // 激活用户账户并清除验证token
    user.status = UserStatus.ACTIVE;
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await this.userRepository.save(user);

    // 获取更新后的用户信息
    const updatedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!updatedUser) {
      throw new NotFoundException('用户不存在');
    }

    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      status: updatedUser.status,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      lastLoginAt: updatedUser.lastLoginAt?.toISOString(),
    };

    return {
      message: '邮箱验证成功',
      success: true,
      user: userResponse,
    };
  }

  /**
   * 用户登出
   *
   * @param userId - 用户ID
   * @param logoutRequest - 登出请求选项
   * @returns Promise<LogoutResponse> - 登出响应
   */
  async logout(
    userId: string,
    logoutRequest?: LogoutRequest,
  ): Promise<LogoutResponse> {
    const allDevices = logoutRequest?.allDevices || false;

    if (allDevices) {
      // 登出所有设备
      await this.sessionService.revokeAllSessions(userId);
    } else if (logoutRequest?.refreshToken) {
      // 登出当前设备 - 通过refresh token查找会话并撤销
      const session = await this.sessionService.findSessionByRefreshToken(
        userId,
        logoutRequest.refreshToken,
      );

      if (session) {
        await this.sessionService.revokeSession(session.id, userId);
      }
    }

    // 更新用户最后活动时间
    await this.userRepository.update(userId, {
      updatedAt: new Date(),
    });

    const message = allDevices ? '已登出所有设备' : '登出成功';

    return {
      message,
      success: true,
    };
  }

  /**
   * 获取用户资料
   *
   * @param userId - 用户ID
   * @returns Promise<User> - 用户信息
   */
  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 返回安全的用户信息（不包含敏感数据）
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };
  }

  /**
   * 管理员查询用户密码重置token
   *
   * @param email - 用户邮箱
   * @returns Promise<AdminPasswordResetTokenResponse> - 查询结果
   * @throws NotFoundException - 用户不存在时抛出
   */
  async getPasswordResetToken(
    email: string,
  ): Promise<AdminPasswordResetTokenResponse> {
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return {
        user: {
          id: '',
          email,
          name: '',
        },
        status: PasswordResetTokenStatus.NOT_FOUND,
        message: '用户不存在',
      };
    }

    // 检查是否存在密码重置token
    if (!user.passwordResetToken) {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        status: PasswordResetTokenStatus.NOT_FOUND,
        message: '该用户没有申请密码重置',
      };
    }

    // 检查token是否过期
    if (
      user.passwordResetExpiresAt &&
      user.passwordResetExpiresAt < new Date()
    ) {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        status: PasswordResetTokenStatus.EXPIRED,
        message: '密码重置token已过期',
        expiresAt: user.passwordResetExpiresAt.toISOString(),
      };
    }

    // token有效
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      resetToken: user.passwordResetToken,
      expiresAt: user.passwordResetExpiresAt?.toISOString(),
      status: PasswordResetTokenStatus.VALID,
      message: '密码重置token有效',
    };
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
