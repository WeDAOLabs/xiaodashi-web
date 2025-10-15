import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  ValidationPipe,
  UsePipes,
  Query,
  BadRequestException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type {
  AdminPasswordResetTokenResponse,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  VerifyEmailResponse,
  LogoutResponse,
  CaptchaGenerateResponse,
  CaptchaVerifyResponse,
  CaptchaRequiredResponse,
} from '@xiaodashi/shared';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Admin } from './decorators/roles.decorator';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  LogoutDto,
} from './dto/auth.dto';
import {
  CaptchaGenerateDto,
  CaptchaVerifyDto,
} from '../security/dto/captcha.dto';
import { CaptchaService } from '../security/services/captcha.service';
import type { AuthenticatedRequest } from '../types';

/**
 * 认证控制器
 *
 * 提供完整的JWT双token认证REST API，包括：
 * - 用户登录/注册
 * - Token刷新和管理
 * - 密码重置和修改
 * - 邮箱验证
 * - 用户登出
 */
@ApiTags('认证管理')
@Controller('v1/auth')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  /**
   * 用户登录
   */
  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5分钟内最多5次登录尝试
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '用户登录',
    description:
      '使用邮箱和密码登录，返回JWT双token。为防止暴力破解，5分钟内限制5次尝试。',
  })
  @ApiBody({ type: LoginDto, description: '登录信息' })
  @ApiResponse({
    status: 200,
    description: '登录成功，返回用户信息和token',
  })
  @ApiResponse({
    status: 401,
    description: '邮箱或密码错误',
  })
  @ApiResponse({
    status: 429,
    description: '请求过于频繁，请稍后再试',
  })
  async login(
    @Body() loginRequest: LoginDto,
    @Request() req: ExpressRequest,
  ): Promise<LoginResponse> {
    return this.authService.login(loginRequest, req);
  }

  /**
   * 用户注册
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '用户注册',
    description: '创建新用户账户，返回用户信息和token',
  })
  @ApiBody({ type: RegisterDto, description: '注册信息' })
  @ApiResponse({
    status: 201,
    description: '注册成功，返回用户信息和token',
  })
  @ApiResponse({
    status: 400,
    description: '注册信息验证失败',
  })
  @ApiResponse({
    status: 409,
    description: '邮箱已存在',
  })
  async register(
    @Body() registerRequest: RegisterDto,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerRequest);
  }

  /**
   * 刷新访问令牌
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '刷新访问令牌',
    description: '使用refresh token获取新的access token',
  })
  @ApiBody({ type: RefreshTokenDto, description: 'Refresh token信息' })
  @ApiResponse({
    status: 200,
    description: '刷新成功，返回新的token对',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token无效或已过期',
  })
  async refreshToken(
    @Body() refreshTokenRequest: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.authService.verifyRefreshToken(
      refreshTokenRequest.refreshToken,
    );
  }

  /**
   * 用户登出
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '用户登出',
    description: '撤销当前token，可选择登出所有设备',
  })
  @ApiBody({ type: LogoutDto, description: '登出选项', required: false })
  @ApiResponse({
    status: 200,
    description: '登出成功',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  async logout(
    @Request() req: AuthenticatedRequest,
    @Body() logoutRequest?: LogoutDto,
  ): Promise<LogoutResponse> {
    const userId = req.user.id;
    return await this.authService.logout(userId, logoutRequest);
  }

  /**
   * 忘记密码
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '忘记密码',
    description: '发送密码重置邮件到用户邮箱',
  })
  @ApiBody({ type: ForgotPasswordDto, description: '用户邮箱' })
  @ApiResponse({
    status: 200,
    description: '密码重置邮件已发送',
  })
  @ApiResponse({
    status: 404,
    description: '邮箱不存在',
  })
  async forgotPassword(
    @Body() forgotPasswordRequest: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(forgotPasswordRequest);
  }

  /**
   * 重置密码
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '重置密码',
    description: '使用重置token设置新密码',
  })
  @ApiBody({ type: ResetPasswordDto, description: '重置密码信息' })
  @ApiResponse({
    status: 200,
    description: '密码重置成功',
  })
  @ApiResponse({
    status: 400,
    description: '重置token无效或密码验证失败',
  })
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetPasswordRequest);
  }

  /**
   * 修改密码
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '修改密码',
    description: '用户修改当前密码',
  })
  @ApiBody({ type: ChangePasswordDto, description: '密码修改信息' })
  @ApiResponse({
    status: 200,
    description: '密码修改成功',
  })
  @ApiResponse({
    status: 400,
    description: '当前密码错误或新密码验证失败',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordRequest: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const userId = req.user.id;
    return this.authService.changePassword(userId, changePasswordRequest);
  }

  /**
   * 邮箱验证
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '邮箱验证',
    description: '验证用户邮箱地址',
  })
  @ApiBody({ type: VerifyEmailDto, description: '邮箱验证token' })
  @ApiResponse({
    status: 200,
    description: '邮箱验证成功',
  })
  @ApiResponse({
    status: 400,
    description: '验证token无效或已过期',
  })
  async verifyEmail(
    @Body() verifyEmailRequest: VerifyEmailDto,
  ): Promise<VerifyEmailResponse> {
    return this.authService.verifyEmail(verifyEmailRequest);
  }

  /**
   * 获取当前用户信息
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取当前用户信息',
    description: '获取当前登录用户的基本信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取用户信息成功',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  async getCurrentUser(@Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.authService.getUserProfile(userId);
  }

  /**
   * 生成验证码
   */
  @Post('captcha/generate')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 1分钟内最多10次生成请求
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '生成验证码',
    description: '生成图片验证码或滑块验证码，用于登录安全验证',
  })
  @ApiBody({
    type: CaptchaGenerateDto,
    description: '验证码生成参数',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '验证码生成成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        sessionId: { type: 'string', example: 'captcha_1k2j3h4g5f6d7s8a9b0c' },
        captchaImage: {
          type: 'string',
          description: 'Base64编码的验证码图片（图片验证码）',
        },
        sliderData: {
          type: 'object',
          description: '滑块验证码数据（滑块验证码）',
        },
        type: { type: 'string', enum: ['image', 'slider'], example: 'image' },
        expiresIn: { type: 'number', example: 300 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '验证码生成参数错误',
  })
  @ApiResponse({
    status: 429,
    description: '请求过于频繁，请稍后再试',
  })
  async generateCaptcha(
    @Request() req: ExpressRequest,
    @Body() generateRequest?: CaptchaGenerateDto,
  ): Promise<CaptchaGenerateResponse> {
    const clientInfo = {
      ipAddress: this.getClientIP(req),
      userAgent: req.headers['user-agent'] || '',
    };

    return this.captchaService.generateCaptcha(
      generateRequest || {},
      clientInfo,
    );
  }

  /**
   * 验证验证码
   */
  @Post('captcha/verify')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 1分钟内最多20次验证请求
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '验证验证码',
    description: '验证用户提交的验证码是否正确',
  })
  @ApiBody({ type: CaptchaVerifyDto, description: '验证码验证参数' })
  @ApiResponse({
    status: 200,
    description: '验证码验证成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '验证码验证成功' },
        attemptsRemaining: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '验证码验证失败或参数错误',
  })
  @ApiResponse({
    status: 429,
    description: '请求过于频繁，请稍后再试',
  })
  async verifyCaptcha(
    @Body() verifyRequest: CaptchaVerifyDto,
    @Request() req: ExpressRequest,
  ): Promise<CaptchaVerifyResponse> {
    const clientInfo = {
      ipAddress: this.getClientIP(req),
      userAgent: req.headers['user-agent'] || '',
    };

    return this.captchaService.verifyCaptcha(
      verifyRequest.sessionId,
      verifyRequest.code,
      undefined, // 非绑定用户验证
      clientInfo.ipAddress,
      false, // 预验证模式，不标记为已使用
    );
  }

  /**
   * 检查是否需要验证码
   */
  @Get('captcha/required')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // 1分钟内最多15次查询请求
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '检查是否需要验证码',
    description: '根据IP地址或用户ID判断当前是否需要验证码验证',
  })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    schema: {
      type: 'object',
      properties: {
        required: { type: 'boolean', example: true },
        reason: { type: 'string', example: '检测到多次登录失败' },
        type: { type: 'string', enum: ['image', 'slider'], example: 'image' },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: '请求过于频繁，请稍后再试',
  })
  async checkCaptchaRequired(
    @Request() req: ExpressRequest,
  ): Promise<CaptchaRequiredResponse> {
    const clientInfo = {
      ipAddress: this.getClientIP(req),
      userAgent: req.headers['user-agent'] || '',
    };

    // 检查IP地址是否需要验证码
    const captchaAssessment = await this.captchaService.shouldRequireCaptcha(
      undefined, // 非绑定用户
      undefined, // 邮箱
      clientInfo.ipAddress,
      clientInfo.userAgent,
    );

    return {
      required: captchaAssessment.required,
      reason: captchaAssessment.reason,
      riskScore: captchaAssessment.riskScore,
    };
  }

  /**
   * 管理员查询用户密码重置token
   */
  @Get('admin/password-reset/token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '管理员查询密码重置token',
    description: '管理员根据邮箱查询用户的密码重置token信息，仅ADMIN角色可访问',
  })
  @ApiResponse({
    status: 200,
    description: '查询成功，返回用户和重置token信息',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @ApiResponse({
    status: 403,
    description: '权限不足（非管理员）',
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
  })
  async getAdminPasswordResetToken(
    @Query('email') email: string,
  ): Promise<AdminPasswordResetTokenResponse> {
    // 验证邮箱参数
    if (!email || !email.includes('@')) {
      throw new BadRequestException('邮箱格式不正确');
    }

    return this.authService.getPasswordResetToken(email.trim());
  }

  /**
   * 获取客户端真实IP地址
   *
   * @param request - Express请求对象
   * @returns 客户端IP地址
   * @private
   */
  private getClientIP(request: ExpressRequest): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      ''
    );
  }
}
