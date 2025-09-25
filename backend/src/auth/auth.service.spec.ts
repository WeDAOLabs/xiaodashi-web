import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../database/entities/user/user.entity';
import { UserRole, UserStatus, LoginRequest } from '@xiaodashi/shared';
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

  // Mock JWT Service
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  // Mock Config Service
  const mockConfigService = {
    get: jest.fn().mockReturnValue(mockAuthConfig),
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
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // 重置所有mock
    jest.clearAllMocks();

    // 重置bcrypt mocks
    jest.mocked(bcrypt.hash).mockClear();
    jest.mocked(bcrypt.compare).mockClear();
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

      jest.mocked(bcrypt.hash).mockResolvedValue(hashedPassword);

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

      jest.mocked(bcrypt.compare).mockResolvedValue(true);

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

      jest.mocked(bcrypt.compare).mockResolvedValue(false);

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

      const mockTokens = {
        accessToken: 'mock.access.token',
        refreshToken: 'mock.refresh.token',
        expiresIn: 900,
        tokenType: 'Bearer' as const,
        issuedAt: 1640995200,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(true);
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
      jest.mocked(bcrypt.compare).mockResolvedValue(false);

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
});
