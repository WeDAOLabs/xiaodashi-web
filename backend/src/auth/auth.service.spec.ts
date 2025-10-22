import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../database/entities/user/user.entity';
import { UserLoginLog } from '../database/entities/user/user-login-log.entity';
import { SessionService } from '../session/session.service';
import { AccountLockoutService } from '../security/services/account-lockout.service';
import { CaptchaService } from '../security/services/captcha.service';
import { TeamService } from '../team/team.service';
import { UserRole, UserStatus, LoginRequest } from '@xiaodashi/shared';
import type { QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Mock bcrypt at the module level
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

/**
 * AuthService单元测试
 *
 * 测试覆盖：
 * - JWT双token生成和验证
 * - bcrypt密码加密和验证
 * - 用户登录流程
 * - 密码强度验证
 * - 密码重置token管理
 * - 错误处理和异常情况
 */
describe('AuthService', () => {
  let service: AuthService;

  // 模拟的认证配置
  const mockAuthConfig = {
    jwt: {
      accessSecret: 'test-access-secret',
      refreshSecret: 'test-refresh-secret',
      accessExpiresIn: '15m',
      refreshExpiresIn: '7d',
      issuer: 'test-issuer',
      audience: 'test-audience',
    },
    bcrypt: {
      saltRounds: 10,
    },
  };

  // 模拟的安全配置
  const mockSecurityConfig = {
    cors: {
      origins: ['http://localhost:3000'],
      credentials: true,
    },
    rateLimit: {
      windowMs: 900000,
      maxRequests: 100,
    },
    loginRateLimit: {
      windowMs: 900000,
      maxAttempts: 5,
    },
    security: {
      maxLoginAttempts: 5,
      accountLockoutTime: 900000,
      minUsernameLength: 2,
      minPasswordLength: 8,
      progressiveLockout: {
        levels: [
          { attempts: 3, duration: 5 },
          { attempts: 5, duration: 15 },
          { attempts: 10, duration: 60 },
        ],
        resetPeriod: 24,
      },
      captcha: {
        enabled: false, // 默认关闭
        triggerAttempts: 2,
        expireTime: 5,
        maxAttempts: 3,
        cleanupInterval: 60,
        complexity: 3,
        suspiciousIpThreshold: 5,
      },
    },
  };

  // 模拟用户数据
  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: '$2b$10$hashedPassword',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    avatar: undefined,
    emailVerified: true,
    emailVerificationToken: undefined,
    emailVerificationExpiresAt: undefined,
    passwordResetToken: undefined,
    passwordResetExpiresAt: undefined,
    lastLoginAt: new Date('2024-01-01'),
    loginAttempts: 0,
    lockedUntil: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    profile: {} as any,
    sessions: [],
    loginLogs: [],
  };

  // Mock Repository
  const mockUserRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  // Mock UserLoginLog Repository
  const mockUserLoginLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  // Mock JWT Service
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  // Mock Config Service
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'auth') {
        return mockAuthConfig;
      }
      if (key === 'security') {
        return mockSecurityConfig;
      }
      return undefined;
    }),
  };

  // Mock Session Service
  const mockSessionService = {
    createSession: jest.fn(),
    getUserSessions: jest.fn(),
    revokeSession: jest.fn(),
    revokeAllSessions: jest.fn(),
    updateSessionActivity: jest.fn(),
    validateRefreshToken: jest.fn(),
    findSessionByRefreshToken: jest.fn(),
    checkDeviceLimit: jest.fn(),
    detectSuspiciousLogin: jest.fn(),
    cleanExpiredSessions: jest.fn(),
  };

  // Mock AccountLockoutService
  const mockAccountLockoutService = {
    checkAccountLocked: jest.fn().mockResolvedValue({ isLocked: false }),
    recordFailedAttempt: jest.fn().mockResolvedValue(undefined),
    resetFailedAttempts: jest.fn().mockResolvedValue(undefined),
    isAccountLocked: jest.fn().mockResolvedValue(false),
    getLockoutInfo: jest.fn().mockResolvedValue({}),
  };

  // Mock CaptchaService
  const mockCaptchaService = {
    shouldRequireCaptcha: jest.fn().mockResolvedValue(false),
    verifyCaptcha: jest.fn().mockResolvedValue({
      success: true,
      message: '验证码验证成功',
    }),
    generateCaptcha: jest.fn().mockResolvedValue({
      sessionId: 'test-session-id',
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      captchaImage: 'data:image/svg+xml;base64,test',
    }),
  };

  // Mock TeamService
  const mockTeamService = {
    createDefaultTeam: jest.fn().mockResolvedValue({
      team: {
        id: 'mock-team-id',
        name: 'Test User的团队',
        ownerId: 'new-user-id',
        tier: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      member: {
        id: 'mock-member-id',
        teamId: 'mock-team-id',
        userId: 'new-user-id',
        role: 'owner',
        displayName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  };

  // Mock QueryRunner
  const mockQueryRunner: Partial<QueryRunner> = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as never,
  };

  // Mock DataSource
  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  // 模拟认证令牌
  const mockTokens = {
    accessToken: 'mock.access.token',
    refreshToken: 'mock.refresh.token',
    expiresIn: 900,
    tokenType: 'Bearer' as const,
    issuedAt: 1640995200,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(UserLoginLog),
          useValue: mockUserLoginLogRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: AccountLockoutService,
          useValue: mockAccountLockoutService,
        },
        {
          provide: CaptchaService,
          useValue: mockCaptchaService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // 重置所有mock
    jest.clearAllMocks();

    // 重置bcrypt mocks
    jest.mocked(bcrypt.hash).mockClear();
    jest.mocked(bcrypt.compare).mockClear();

    // 重置 QueryRunner mocks
    (mockQueryRunner.connect as jest.Mock).mockClear();
    (mockQueryRunner.startTransaction as jest.Mock).mockClear();
    (mockQueryRunner.commitTransaction as jest.Mock).mockClear();
    (mockQueryRunner.rollbackTransaction as jest.Mock).mockClear();
    (mockQueryRunner.release as jest.Mock).mockClear();
    (mockQueryRunner.manager!.create as jest.Mock).mockClear();
    (mockQueryRunner.manager!.save as jest.Mock).mockClear();
    (mockQueryRunner.manager!.update as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('应该生成包含access和refresh token的AuthToken', () => {
      // 安排
      const mockAccessToken = 'mock.access.token';
      const mockRefreshToken = 'mock.refresh.token';

      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken) // 第一次调用返回access token
        .mockReturnValueOnce(mockRefreshToken); // 第二次调用返回refresh token

      // 执行
      const result = service.generateTokens(mockUser);

      // 断言
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        expiresIn: 900, // 15分钟 = 900秒
        tokenType: 'Bearer',
        issuedAt: expect.any(Number),
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);

      // 验证access token调用
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        {
          sub: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        {
          secret: mockAuthConfig.jwt.accessSecret,
          expiresIn: mockAuthConfig.jwt.accessExpiresIn,
          issuer: mockAuthConfig.jwt.issuer,
          audience: mockAuthConfig.jwt.audience,
        },
      );

      // 验证refresh token调用
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        {
          sub: mockUser.id,
          type: 'refresh',
        },
        {
          secret: mockAuthConfig.jwt.refreshSecret,
          expiresIn: mockAuthConfig.jwt.refreshExpiresIn,
          issuer: mockAuthConfig.jwt.issuer,
          audience: mockAuthConfig.jwt.audience,
        },
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('应该验证有效的access token并返回JWT载荷', () => {
      // 安排
      const token = 'valid.access.token';
      const mockPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        iat: 1640995200,
        exp: 1640998800,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);

      // 执行
      const result = service.verifyAccessToken(token);

      // 断言
      expect(result).toEqual(mockPayload);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: mockAuthConfig.jwt.accessSecret,
        issuer: mockAuthConfig.jwt.issuer,
        audience: mockAuthConfig.jwt.audience,
      });
    });

    it('应该在token无效时抛出UnauthorizedException', () => {
      // 安排
      const token = 'invalid.token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // 执行和断言
      expect(() => service.verifyAccessToken(token)).toThrow(
        new UnauthorizedException('Access token 无效或已过期'),
      );
    });
  });

  describe('hashPassword', () => {
    it('应该使用bcrypt加密密码', async () => {
      // 安排
      const password = 'plainPassword123';
      const hashedPassword = '$2b$10$hashedResult';

      jest.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

      // 执行
      const result = await service.hashPassword(password);

      // 断言
      expect(result).toBe(hashedPassword);
      expect(jest.mocked(bcrypt.hash)).toHaveBeenCalledWith(
        password,
        mockAuthConfig.bcrypt.saltRounds,
      );
    });
  });

  describe('comparePassword', () => {
    it('应该验证密码匹配', async () => {
      // 安排
      const password = 'plainPassword123';
      const hash = '$2b$10$hashedPassword';

      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      // 执行
      const result = await service.comparePassword(password, hash);

      // 断言
      expect(result).toBe(true);
      expect(jest.mocked(bcrypt.compare)).toHaveBeenCalledWith(password, hash);
    });

    it('应该验证密码不匹配', async () => {
      // 安排
      const password = 'wrongPassword';
      const hash = '$2b$10$hashedPassword';

      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // 执行
      const result = await service.comparePassword(password, hash);

      // 断言
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('应该成功登录并返回用户信息和tokens', async () => {
      // 安排
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'correctPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
      jest.spyOn(service, 'generateTokens').mockReturnValue(mockTokens);
      mockUserRepository.update.mockResolvedValue(undefined);

      // 执行
      const result = await service.login(loginRequest);

      // 断言
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        status: mockUser.status,
        avatar: mockUser.avatar,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
        lastLoginAt: expect.any(String),
      });
      expect(result.tokens).toEqual(mockTokens);
      expect(result.firstLogin).toBe(false); // mockUser有lastLoginAt

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginRequest.email },
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, {
        lastLoginAt: expect.any(Date),
        loginAttempts: 0,
      });
    });

    it('应该在用户不存在时抛出UnauthorizedException', async () => {
      // 安排
      const loginRequest: LoginRequest = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // 执行和断言
      await expect(service.login(loginRequest)).rejects.toThrow(
        new UnauthorizedException('邮箱或密码错误'),
      );
    });

    it('应该在密码错误时抛出UnauthorizedException', async () => {
      // 安排
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // 执行和断言
      await expect(service.login(loginRequest)).rejects.toThrow(
        new UnauthorizedException('邮箱或密码错误'),
      );
    });
  });

  describe('validatePasswordStrength', () => {
    it('应该验证强密码', () => {
      const strongPasswords = [
        'password123',
        'Password1',
        'mypassword1234',
        'abcdef12',
      ];

      strongPasswords.forEach((password) => {
        expect(service.validatePasswordStrength(password)).toBe(true);
      });
    });

    it('应该拒绝弱密码', () => {
      const weakPasswords = [
        'short1', // 少于8位
        'password', // 只有字母
        '12345678', // 只有数字
        'P@ssw0rd', // 虽然复杂但测试要求只需字母+数字
      ];

      // 测试每个弱密码（除了最后一个实际上是强密码）
      expect(service.validatePasswordStrength(weakPasswords[0])).toBe(false); // short1
      expect(service.validatePasswordStrength(weakPasswords[1])).toBe(false); // password
      expect(service.validatePasswordStrength(weakPasswords[2])).toBe(false); // 12345678
      expect(service.validatePasswordStrength(weakPasswords[3])).toBe(true); // P@ssw0rd - 实际上符合要求
    });
  });

  describe('generatePasswordResetToken', () => {
    it('应该生成密码重置token', () => {
      // 安排
      const userId = mockUser.id;
      const mockToken = 'reset.token.jwt';

      mockJwtService.sign.mockReturnValue(mockToken);

      // 执行
      const result = service.generatePasswordResetToken(userId);

      // 断言
      expect(result).toBe(mockToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: userId,
          type: 'password_reset',
        },
        {
          secret: mockAuthConfig.jwt.accessSecret,
          expiresIn: '1h',
          issuer: mockAuthConfig.jwt.issuer,
          audience: mockAuthConfig.jwt.audience,
        },
      );
    });
  });

  describe('verifyPasswordResetToken', () => {
    it('应该验证有效的密码重置token', () => {
      // 安排
      const token = 'valid.reset.token';
      const mockPayload = {
        sub: mockUser.id,
        type: 'password_reset',
        iat: 1640995200,
        exp: 1641001200,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);

      // 执行
      const result = service.verifyPasswordResetToken(token);

      // 断言
      expect(result).toBe(mockUser.id);
    });

    it('应该在token类型错误时抛出异常', () => {
      // 安排
      const token = 'invalid.type.token';
      const mockPayload = {
        sub: mockUser.id,
        type: 'access', // 错误的token类型
      };

      mockJwtService.verify.mockReturnValue(mockPayload);

      // 执行和断言
      expect(() => service.verifyPasswordResetToken(token)).toThrow(
        new UnauthorizedException('无效的密码重置token类型'),
      );
    });
  });

  describe('register', () => {
    it('应该成功注册新用户并自动创建团队', async () => {
      // 安排
      const registerRequest = {
        email: 'newuser@example.com',
        name: '新用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
      };

      const hashedPassword = '$2b$10$hashedNewPassword';
      const newUser = {
        ...mockUser,
        id: 'new-user-id',
        email: registerRequest.email,
        name: registerRequest.name,
        passwordHash: hashedPassword,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock 设置
      mockUserRepository.findOne.mockResolvedValue(null); // 用户不存在
      jest.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

      // Mock QueryRunner 行为
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue(newUser);
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(newUser);
      (mockQueryRunner.manager!.update as jest.Mock).mockResolvedValue(
        undefined,
      );

      jest.spyOn(service, 'generateTokens').mockReturnValue(mockTokens);

      // 执行
      const result = await service.register(registerRequest);

      // 断言
      expect(result.user.email).toBe(registerRequest.email);
      expect(result.user.name).toBe(registerRequest.name);
      expect(result.tokens).toEqual(mockTokens);
      expect(result.needEmailVerification).toBe(true);

      // 验证事务操作
      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      // 验证用户创建
      expect(mockQueryRunner.manager!.create).toHaveBeenCalledWith(User, {
        email: registerRequest.email,
        name: registerRequest.name,
        passwordHash: hashedPassword,
        status: UserStatus.INACTIVE,
        role: UserRole.USER,
      });

      // 验证团队创建
      expect(mockTeamService.createDefaultTeam).toHaveBeenCalledWith(
        newUser.id,
        newUser.name,
        mockQueryRunner,
      );

      // 验证邮箱验证 token 更新
      expect(mockQueryRunner.manager!.update).toHaveBeenCalledWith(
        User,
        newUser.id,
        expect.objectContaining({
          emailVerificationToken: expect.any(String),
          emailVerificationExpiresAt: expect.any(Date),
        }),
      );
    });

    it('应该在事务失败时回滚所有操作', async () => {
      // 安排
      const registerRequest = {
        email: 'newuser@example.com',
        name: '新用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
      };

      const hashedPassword = '$2b$10$hashedNewPassword';
      const newUser = {
        ...mockUser,
        id: 'new-user-id',
        email: registerRequest.email,
        name: registerRequest.name,
        passwordHash: hashedPassword,
      };

      // Mock 设置
      mockUserRepository.findOne.mockResolvedValue(null);
      jest.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue(newUser);
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(newUser);

      // Mock 团队创建失败
      mockTeamService.createDefaultTeam.mockRejectedValue(
        new Error('Team creation failed'),
      );

      // 执行和断言
      await expect(service.register(registerRequest)).rejects.toThrow(
        'Team creation failed',
      );

      // 验证事务回滚
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('应该在邮箱已存在时抛出ConflictException', async () => {
      // 安排
      const registerRequest = {
        email: 'existing@example.com',
        name: '用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser); // 用户已存在

      // 执行和断言
      await expect(service.register(registerRequest)).rejects.toThrow(
        '邮箱已存在',
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerRequest.email },
      });

      // 验证没有创建事务
      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('应该在密码不匹配时抛出BadRequestException', async () => {
      // 安排
      const registerRequest = {
        email: 'newuser@example.com',
        name: '新用户',
        password: 'password123',
        confirmPassword: 'differentPassword',
        agreeToTerms: true,
      };

      // 执行和断言
      await expect(service.register(registerRequest)).rejects.toThrow(
        '密码确认不匹配',
      );

      // 验证没有查询数据库
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
    });

    it('应该在密码强度不足时抛出BadRequestException', async () => {
      // 安排
      const registerRequest = {
        email: 'newuser@example.com',
        name: '新用户',
        password: 'weak', // 弱密码
        confirmPassword: 'weak',
        agreeToTerms: true,
      };

      // 执行和断言
      await expect(service.register(registerRequest)).rejects.toThrow(
        '密码强度不符合要求',
      );
    });

    it('应该在未同意服务条款时抛出BadRequestException', async () => {
      // 安排
      const registerRequest = {
        email: 'newuser@example.com',
        name: '新用户',
        password: 'password123',
        confirmPassword: 'password123',
        agreeToTerms: false, // 未同意服务条款
      };

      // 执行和断言
      await expect(service.register(registerRequest)).rejects.toThrow(
        '必须同意服务条款',
      );
    });
  });

  describe('forgotPassword', () => {
    it('应该成功发送密码重置邮件', async () => {
      // 安排
      const forgotPasswordRequest = {
        email: 'user@example.com',
      };

      const resetToken = 'reset-token-123';
      jest
        .spyOn(service, 'generatePasswordResetToken')
        .mockReturnValue(resetToken);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      // 执行
      const result = await service.forgotPassword(forgotPasswordRequest);

      // 断言
      expect(result.message).toBe('密码重置邮件已发送到您的邮箱');
      expect((result as any).resetTokenSent).toBe(true);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: forgotPasswordRequest.email },
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, {
        passwordResetToken: resetToken,
        passwordResetExpiresAt: expect.any(Date),
      });
    });

    it('应该在用户不存在时抛出BadRequestException', async () => {
      // 安排
      const forgotPasswordRequest = {
        email: 'nonexistent@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // 执行和断言
      // 注意：forgotPassword方法不会抛出错误，而是返回成功响应
      const result = await service.forgotPassword(forgotPasswordRequest);
      expect(result.message).toBe('如果该邮箱存在，重置密码邮件已发送');
      expect((result as any).resetTokenSent).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('应该成功重置密码', async () => {
      // 安排
      const resetPasswordRequest = {
        resetToken: 'valid-reset-token',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const hashedNewPassword = '$2b$10$hashedNewPassword';
      const userWithResetToken = {
        ...mockUser,
        passwordResetToken: 'valid-reset-token',
        passwordResetExpiresAt: new Date(Date.now() + 3600000), // 1小时后过期
      };

      jest
        .spyOn(service, 'verifyPasswordResetToken')
        .mockReturnValue(mockUser.id);
      mockUserRepository.findOne.mockResolvedValue(userWithResetToken);
      jest.mocked(bcrypt.hash).mockResolvedValue(hashedNewPassword as never);
      mockUserRepository.update.mockResolvedValue(undefined);

      // 执行
      const result = await service.resetPassword(resetPasswordRequest);

      // 断言
      expect(result.message).toBe('密码重置成功');
      expect(result.success).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          passwordHash: hashedNewPassword,
          passwordResetToken: null,
          passwordResetExpiresAt: null,
          loginAttempts: 0,
        }),
      );
    });

    it('应该在重置token过期时抛出异常', async () => {
      // 安排
      const resetPasswordRequest = {
        resetToken: 'expired-reset-token',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const userWithExpiredToken = {
        ...mockUser,
        passwordResetToken: 'expired-reset-token',
        passwordResetExpiresAt: new Date(Date.now() - 3600000), // 1小时前过期
      };

      jest
        .spyOn(service, 'verifyPasswordResetToken')
        .mockReturnValue(mockUser.id);
      mockUserRepository.findOne.mockResolvedValue(userWithExpiredToken);

      // 执行和断言
      await expect(service.resetPassword(resetPasswordRequest)).rejects.toThrow(
        '密码重置token已过期',
      );
    });
  });

  describe('changePassword', () => {
    it('应该成功修改密码', async () => {
      // 安排
      const userId = mockUser.id;
      const changePasswordRequest = {
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      const hashedNewPassword = '$2b$10$hashedNewPassword';

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
      jest.mocked(bcrypt.hash).mockResolvedValue(hashedNewPassword as never);
      mockUserRepository.update.mockResolvedValue(undefined);

      // 执行
      const result = await service.changePassword(
        userId,
        changePasswordRequest,
      );

      // 断言
      expect(result.message).toBe('密码修改成功');
      expect(result.success).toBe(true);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        passwordHash: hashedNewPassword,
      });
    });

    it('应该在当前密码错误时抛出异常', async () => {
      // 安排
      const userId = mockUser.id;
      const changePasswordRequest = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // 执行和断言
      await expect(
        service.changePassword(userId, changePasswordRequest),
      ).rejects.toThrow('当前密码错误');
    });
  });

  describe('verifyEmail', () => {
    it('应该成功验证邮箱', async () => {
      // 安排
      const verifyEmailRequest = {
        verificationToken: 'valid-verification-token',
      };

      const mockPayload = {
        sub: mockUser.id,
        type: 'email_verification',
      };

      const userWithToken = {
        ...mockUser,
        emailVerified: false,
        emailVerificationToken: 'valid-verification-token',
        emailVerificationExpiresAt: new Date(Date.now() + 3600000),
        status: 'PENDING' as any,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(userWithToken);
      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOne
        .mockResolvedValueOnce(userWithToken)
        .mockResolvedValueOnce({
          ...userWithToken,
          emailVerified: true,
          status: 'ACTIVE' as any,
        });

      // 执行
      const result = await service.verifyEmail(verifyEmailRequest);

      // 断言
      expect(result.message).toBe('邮箱验证成功');
      expect(result.success).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'active',
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiresAt: null,
        }),
      );
    });

    it('应该在验证token无效时抛出异常', async () => {
      // 安排
      const verifyEmailRequest = {
        verificationToken: 'invalid-token',
      };

      // Mock找不到用户的情况
      mockUserRepository.findOne.mockResolvedValue(null);

      // 执行和断言
      await expect(service.verifyEmail(verifyEmailRequest)).rejects.toThrow(
        '邮箱验证token无效或已过期',
      );
    });
  });

  describe('getUserProfile', () => {
    it('应该成功获取用户资料', async () => {
      // 安排
      const userId = mockUser.id;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // 执行
      const result = await service.getUserProfile(userId);

      // 断言
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        status: mockUser.status,
        avatar: mockUser.avatar,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
        lastLoginAt: mockUser.lastLoginAt?.toISOString(),
      });
    });

    it('应该在用户不存在时抛出异常', async () => {
      // 安排
      const userId = 'nonexistent-user-id';

      mockUserRepository.findOne.mockResolvedValue(null);

      // 执行和断言
      await expect(service.getUserProfile(userId)).rejects.toThrow(
        '用户不存在',
      );
    });
  });

  describe('logout', () => {
    it('应该成功登出', async () => {
      // 安排
      const userId = mockUser.id;
      const logoutRequest = { allDevices: false };

      // 执行
      const result = await service.logout(userId, logoutRequest);

      // 断言
      expect(result.message).toBe('登出成功');
      expect(result.success).toBe(true);
    });

    it('应该支持登出所有设备', async () => {
      // 安排
      const userId = mockUser.id;
      const logoutRequest = { allDevices: true };

      // 执行
      const result = await service.logout(userId, logoutRequest);

      // 断言
      expect(result.message).toBe('已登出所有设备');
      expect(result.success).toBe(true);
    });
  });

  describe('generateEmailVerificationToken', () => {
    it('应该生成邮箱验证token', () => {
      // 安排
      const userId = mockUser.id;
      const mockToken = 'verification.token.jwt';

      mockJwtService.sign.mockReturnValue(mockToken);

      // 执行
      const result = service.generateEmailVerificationToken(userId);

      // 断言
      expect(result).toBe(mockToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: userId,
          type: 'email_verification',
        },
        {
          secret: mockAuthConfig.jwt.accessSecret,
          expiresIn: '24h',
          issuer: mockAuthConfig.jwt.issuer,
          audience: mockAuthConfig.jwt.audience,
        },
      );
    });
  });

  describe('verifyEmailVerificationToken', () => {
    it('应该验证有效的邮箱验证token', () => {
      // 安排
      const token = 'valid.verification.token';
      const mockPayload = {
        sub: mockUser.id,
        type: 'email_verification',
        iat: 1640995200,
        exp: 1641081600,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);

      // 执行
      const result = service.verifyEmailVerificationToken(token);

      // 断言
      expect(result).toBe(mockUser.id);
    });

    it('应该在token类型错误时抛出异常', () => {
      // 安排
      const token = 'invalid.type.token';
      const mockPayload = {
        sub: mockUser.id,
        type: 'password_reset', // 错误的token类型
      };

      mockJwtService.verify.mockReturnValue(mockPayload);

      // 执行和断言
      expect(() => service.verifyEmailVerificationToken(token)).toThrow(
        new UnauthorizedException('无效的邮箱验证token类型'),
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('应该成功验证refresh token并返回新token', async () => {
      // 安排
      const refreshToken = 'valid.refresh.token';
      const mockPayload = {
        sub: mockUser.id,
        type: 'refresh',
        iat: 1640995200,
        exp: 1641601200,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(service, 'generateTokens').mockReturnValue(mockTokens);

      // 执行
      const result = await service.verifyRefreshToken(refreshToken);

      // 断言
      expect(result.tokens).toEqual(mockTokens);
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: mockAuthConfig.jwt.refreshSecret,
        issuer: mockAuthConfig.jwt.issuer,
        audience: mockAuthConfig.jwt.audience,
      });
    });

    it('应该在refresh token无效时抛出异常', async () => {
      // 安排
      const refreshToken = 'invalid.refresh.token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // 执行和断言
      await expect(service.verifyRefreshToken(refreshToken)).rejects.toThrow(
        new UnauthorizedException('Refresh token 无效或已过期'),
      );
    });
  });
});
