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
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  VerifyEmailResponse,
  LogoutResponse,
} from '@xiaodashi/shared';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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

/**
 * JWT认证用户接口
 */
interface JwtUser {
  sub: string;
  email: string;
  name: string;
  role: string;
}

/**
 * 带JWT用户信息的请求接口
 */
interface AuthenticatedRequest extends ExpressRequest {
  user: JwtUser;
}

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
  constructor(private readonly authService: AuthService) {}

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
    const userId = req.user.sub;
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
    const userId = req.user.sub;
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
    const userId = req.user.sub;
    return this.authService.getUserProfile(userId);
  }
}
