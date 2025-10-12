import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CaptchaService } from '../security/services/captcha.service';
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
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  VerifyEmailResponse,
  LogoutResponse,
  UserRole,
  UserStatus,
} from '@xiaodashi/shared';
import { AuthenticatedRequest } from '../types/auth.types';

/**
 * AuthController单元测试
 *
 * 测试覆盖：
 * - 所有认证API端点的业务逻辑
 * - 请求参数验证和错误处理
 * - HTTP状态码和响应格式
 * - 守卫和装饰器的集成
 * - 异常情况的处理流程
 */
describe('AuthController', () => {
  let controller: AuthController;

  // 模拟用户数据
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    avatar: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-01-01T00:00:00.000Z',
  };

  // 模拟认证令牌
  const mockTokens = {
    accessToken: 'mock.access.token',
    refreshToken: 'mock.refresh.token',
    expiresIn: 900,
    tokenType: 'Bearer' as const,
    issuedAt: 1640995200,
  };

  // 模拟JWT用户信息（从请求中提取）
  const mockJwtUser = {
    id: mockUser.id,
    sub: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    role: mockUser.role,
  };

  // Mock AuthService
  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    verifyRefreshToken: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    changePassword: jest.fn(),
    verifyEmail: jest.fn(),
    getUserProfile: jest.fn(),
  };

  // Mock CaptchaService
  const mockCaptchaService = {
    generateCaptcha: jest.fn(),
    verifyCaptcha: jest.fn(),
    shouldRequireCaptcha: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60000, // 时间窗口：60秒
            limit: 10, // 默认限制：每分钟10次请求
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: CaptchaService,
          useValue: mockCaptchaService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);

    // 重置所有mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /api/v1/auth/login', () => {
    it('应该成功登录并返回用户信息和tokens', async () => {
      // 安排
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      };

      const expectedResponse: LoginResponse = {
        user: mockUser,
        tokens: mockTokens,
        firstLogin: false,
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      // 执行
      const mockRequest = { headers: {}, connection: {}, socket: {} } as any;
      const result = await controller.login(loginDto, mockRequest);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto, mockRequest);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('应该处理登录失败的情况', async () => {
      // 安排
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('邮箱或密码错误'),
      );

      // 执行和断言
      const mockRequest = { headers: {}, connection: {}, socket: {} } as any;
      await expect(controller.login(loginDto, mockRequest)).rejects.toThrow(
        new UnauthorizedException('邮箱或密码错误'),
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto, mockRequest);
    });

    it('应该处理带验证码的登录请求', async () => {
      // 安排
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
        captcha: {
          sessionId: 'test-session-123',
          code: '1234',
        },
        rememberMe: true,
      };

      const expectedResponse: LoginResponse = {
        user: mockUser,
        tokens: mockTokens,
        firstLogin: false,
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      // 执行
      const mockRequest = { headers: {}, connection: {}, socket: {} } as any;
      const result = await controller.login(loginDto, mockRequest);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto, mockRequest);
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('应该成功注册并返回用户信息', async () => {
      // 安排
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        name: '新用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
      };

      const expectedResponse: RegisterResponse = {
        user: { ...mockUser, email: 'new@example.com', name: '新用户' },
        tokens: mockTokens,
        needEmailVerification: false,
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.register(registerDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
    });

    it('应该处理邮箱已存在的情况', async () => {
      // 安排
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        name: '用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
      };

      mockAuthService.register.mockRejectedValue(
        new ConflictException('邮箱已存在'),
      );

      // 执行和断言
      await expect(controller.register(registerDto)).rejects.toThrow(
        new ConflictException('邮箱已存在'),
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('应该处理带邀请码的注册请求', async () => {
      // 安排
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        name: '新用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
        inviteCode: 'INVITE123',
        captcha: {
          sessionId: 'test-session-456',
          code: '5678',
        },
      };

      const expectedResponse: RegisterResponse = {
        user: mockUser,
        tokens: mockTokens,
        needEmailVerification: false,
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.register(registerDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('应该成功刷新访问令牌', async () => {
      // 安排
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid.refresh.token',
      };

      const expectedResponse: RefreshTokenResponse = {
        tokens: mockTokens,
      };

      mockAuthService.verifyRefreshToken.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.refreshToken(refreshTokenDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.verifyRefreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(mockAuthService.verifyRefreshToken).toHaveBeenCalledTimes(1);
    });

    it('应该处理无效的refresh token', async () => {
      // 安排
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'invalid.refresh.token',
      };

      mockAuthService.verifyRefreshToken.mockRejectedValue(
        new UnauthorizedException('Refresh token无效或已过期'),
      );

      // 执行和断言
      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('Refresh token无效或已过期'),
      );
      expect(mockAuthService.verifyRefreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    const mockRequest = {
      user: mockJwtUser,
    } as any;

    it('应该成功登出', async () => {
      // 安排
      const logoutDto: LogoutDto = {
        allDevices: false,
      };

      const expectedResponse: LogoutResponse = {
        message: '登出成功',
        success: true,
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.logout(
        mockRequest as AuthenticatedRequest,
        logoutDto,
      );

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        mockJwtUser.sub,
        logoutDto,
      );
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('应该支持登出所有设备', async () => {
      // 安排
      const logoutDto: LogoutDto = {
        allDevices: true,
        refreshToken: 'token.to.revoke',
      };

      const expectedResponse: LogoutResponse = {
        message: '已登出所有设备',
        success: true,
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.logout(
        mockRequest as AuthenticatedRequest,
        logoutDto,
      );

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        mockJwtUser.sub,
        logoutDto,
      );
    });

    it('应该支持不带请求体的登出', async () => {
      // 安排
      const expectedResponse: LogoutResponse = {
        message: '登出成功',
        success: true,
      };

      mockAuthService.logout.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.logout(
        mockRequest as AuthenticatedRequest,
      );

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        mockJwtUser.sub,
        undefined,
      );
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('应该成功发送密码重置邮件', async () => {
      // 安排
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'user@example.com',
      };

      const expectedResponse: ForgotPasswordResponse = {
        message: '密码重置邮件已发送',
        resetTokenSent: true,
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.forgotPassword(forgotPasswordDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
      expect(mockAuthService.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('应该处理邮箱不存在的情况', async () => {
      // 安排
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      mockAuthService.forgotPassword.mockRejectedValue(
        new BadRequestException('邮箱不存在'),
      );

      // 执行和断言
      await expect(
        controller.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow(new BadRequestException('邮箱不存在'));
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
    });

    it('应该处理带验证码的忘记密码请求', async () => {
      // 安排
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'user@example.com',
        captcha: {
          sessionId: 'test-session-999',
          code: '9999',
        },
      };

      const expectedResponse: ForgotPasswordResponse = {
        message: '密码重置邮件已发送',
        resetTokenSent: true,
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.forgotPassword(forgotPasswordDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    it('应该成功重置密码', async () => {
      // 安排
      const resetPasswordDto: ResetPasswordDto = {
        resetToken: 'valid.reset.token',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const expectedResponse: ResetPasswordResponse = {
        message: '密码重置成功',
        success: true,
      };

      mockAuthService.resetPassword.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.resetPassword(resetPasswordDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto,
      );
      expect(mockAuthService.resetPassword).toHaveBeenCalledTimes(1);
    });

    it('应该处理无效的重置token', async () => {
      // 安排
      const resetPasswordDto: ResetPasswordDto = {
        resetToken: 'invalid.reset.token',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('重置token无效或已过期'),
      );

      // 执行和断言
      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        new BadRequestException('重置token无效或已过期'),
      );
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto,
      );
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    const mockRequest = {
      user: mockJwtUser,
    } as any;

    it('应该成功修改密码', async () => {
      // 安排
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const expectedResponse: ChangePasswordResponse = {
        message: '密码修改成功',
        success: true,
      };

      mockAuthService.changePassword.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.changePassword(
        mockRequest as AuthenticatedRequest,
        changePasswordDto,
      );

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        mockJwtUser.sub,
        changePasswordDto,
      );
      expect(mockAuthService.changePassword).toHaveBeenCalledTimes(1);
    });

    it('应该处理当前密码错误的情况', async () => {
      // 安排
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      mockAuthService.changePassword.mockRejectedValue(
        new BadRequestException('当前密码错误'),
      );

      // 执行和断言
      await expect(
        controller.changePassword(
          mockRequest as AuthenticatedRequest,
          changePasswordDto,
        ),
      ).rejects.toThrow(new BadRequestException('当前密码错误'));
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        mockJwtUser.sub,
        changePasswordDto,
      );
    });
  });

  describe('POST /api/v1/auth/verify-email', () => {
    it('应该成功验证邮箱', async () => {
      // 安排
      const verifyEmailDto: VerifyEmailDto = {
        verificationToken: 'valid.verification.token',
      };

      const expectedResponse: VerifyEmailResponse = {
        message: '邮箱验证成功',
        success: true,
        user: mockUser,
      };

      mockAuthService.verifyEmail.mockResolvedValue(expectedResponse);

      // 执行
      const result = await controller.verifyEmail(verifyEmailDto);

      // 断言
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(verifyEmailDto);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledTimes(1);
    });

    it('应该处理无效的验证token', async () => {
      // 安排
      const verifyEmailDto: VerifyEmailDto = {
        verificationToken: 'invalid.verification.token',
      };

      mockAuthService.verifyEmail.mockRejectedValue(
        new BadRequestException('验证token无效或已过期'),
      );

      // 执行和断言
      await expect(controller.verifyEmail(verifyEmailDto)).rejects.toThrow(
        new BadRequestException('验证token无效或已过期'),
      );
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(verifyEmailDto);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    const mockRequest = {
      user: mockJwtUser,
    } as any;

    it('应该成功获取当前用户信息', async () => {
      // 安排
      const expectedUserProfile = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        status: mockUser.status,
        avatar: mockUser.avatar,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        lastLoginAt: mockUser.lastLoginAt,
      };

      mockAuthService.getUserProfile.mockResolvedValue(expectedUserProfile);

      // 执行
      const result = await controller.getCurrentUser(
        mockRequest as AuthenticatedRequest,
      );

      // 断言
      expect(result).toEqual(expectedUserProfile);
      expect(mockAuthService.getUserProfile).toHaveBeenCalledWith(
        mockJwtUser.sub,
      );
      expect(mockAuthService.getUserProfile).toHaveBeenCalledTimes(1);
    });

    it('应该处理用户不存在的情况', async () => {
      // 安排
      mockAuthService.getUserProfile.mockRejectedValue(
        new BadRequestException('用户不存在'),
      );

      // 执行和断言
      await expect(
        controller.getCurrentUser(mockRequest as AuthenticatedRequest),
      ).rejects.toThrow(new BadRequestException('用户不存在'));
      expect(mockAuthService.getUserProfile).toHaveBeenCalledWith(
        mockJwtUser.sub,
      );
    });
  });
});
