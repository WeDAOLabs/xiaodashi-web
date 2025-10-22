import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JWTPayload, UserRole, UserStatus } from '@xiaodashi/shared';
import { User } from '../../database/entities/user/user.entity';
import { JwtStrategy } from './jwt.strategy';

/**
 * JwtStrategy单元测试
 *
 * 测试覆盖：
 * - JWT载荷验证和用户查找
 * - 用户状态检查（active, inactive, suspended）
 * - 错误处理和异常情况
 * - 返回的用户信息格式验证
 */
describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

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
  };

  // 模拟用户数据
  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: '$2b$10$hashedPassword',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    avatar: 'https://example.com/avatar.jpg',
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpiresAt: null,
    passwordResetToken: null,
    passwordResetExpiresAt: null,
    lastLoginAt: new Date('2024-01-01T10:00:00Z'),
    loginAttempts: 0,
    lockedUntil: undefined,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
    profile: {} as any,
    sessions: [],
    loginLogs: [],
  };

  // Mock Repository
  const mockUserRepository = {
    findOne: jest.fn(),
  };

  // Mock Config Service
  const mockConfigService = {
    get: jest.fn().mockReturnValue(mockAuthConfig),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);

    // 重置所有mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const mockPayload: JWTPayload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER,
      iat: 1640995200,
      exp: 1640998800,
    };

    it('应该验证有效用户并返回用户信息', async () => {
      // 安排
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // 执行
      const result = await strategy.validate(mockPayload);

      // 断言 - 现在应该返回 AuthenticatedUser 类型，只包含基本字段
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
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
    });

    it('应该在用户不存在时抛出UnauthorizedException', async () => {
      // 安排
      mockUserRepository.findOne.mockResolvedValue(null);

      // 执行和断言
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        new UnauthorizedException('用户不存在'),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
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
    });

    it('应该在用户账户被暂停时抛出UnauthorizedException', async () => {
      // 安排
      const suspendedUser = {
        ...mockUser,
        status: UserStatus.SUSPENDED,
      };
      mockUserRepository.findOne.mockResolvedValue(suspendedUser);

      // 执行和断言
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        new UnauthorizedException('账户已被暂停，请联系管理员'),
      );
    });

    it('应该在用户账户未激活时抛出UnauthorizedException', async () => {
      // 安排
      const inactiveUser = {
        ...mockUser,
        status: UserStatus.INACTIVE,
      };
      mockUserRepository.findOne.mockResolvedValue(inactiveUser);

      // 执行和断言
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        new UnauthorizedException('账户未激活，请先激活账户'),
      );
    });

    it('应该允许活跃用户通过验证', async () => {
      // 安排
      const activeUser = {
        ...mockUser,
        status: UserStatus.ACTIVE,
      };
      mockUserRepository.findOne.mockResolvedValue(activeUser);

      // 执行
      const result = await strategy.validate(mockPayload);

      // 断言 - 现在应该返回 AuthenticatedUser 类型，只包含基本字段
      expect(result).toEqual({
        id: activeUser.id,
        email: activeUser.email,
        name: activeUser.name,
        role: activeUser.role,
      });
    });

    it('应该正确处理管理员角色用户', async () => {
      // 安排
      const adminPayload: JWTPayload = {
        ...mockPayload,
        role: UserRole.ADMIN,
      };

      const adminUser = {
        ...mockUser,
        role: UserRole.ADMIN,
      };

      mockUserRepository.findOne.mockResolvedValue(adminUser);

      // 执行
      const result = await strategy.validate(adminPayload);

      // 断言 - 现在应该返回 AuthenticatedUser 类型，只包含基本字段
      expect(result).toEqual({
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      });
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('应该正确处理高级用户角色', async () => {
      // 安排
      const premiumPayload: JWTPayload = {
        ...mockPayload,
        role: UserRole.PREMIUM,
      };

      const premiumUser = {
        ...mockUser,
        role: UserRole.PREMIUM,
      };

      mockUserRepository.findOne.mockResolvedValue(premiumUser);

      // 执行
      const result = await strategy.validate(premiumPayload);

      // 断言 - 现在应该返回 AuthenticatedUser 类型，只包含基本字段
      expect(result).toEqual({
        id: premiumUser.id,
        email: premiumUser.email,
        name: premiumUser.name,
        role: premiumUser.role,
      });
      expect(result.role).toBe(UserRole.PREMIUM);
    });

    it('应该正确选择特定字段', async () => {
      // 安排
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // 执行
      await strategy.validate(mockPayload);

      // 断言 - 验证select字段包含了所需的字段，不包含敏感信息如passwordHash
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
        select: expect.arrayContaining([
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
        ]),
      });

      // 确保不包含敏感信息
      const selectFields = mockUserRepository.findOne.mock.calls[0][0].select;
      expect(selectFields).not.toContain('passwordHash');
      expect(selectFields).not.toContain('passwordResetToken');
      expect(selectFields).not.toContain('emailVerificationToken');
    });

    it('应该处理数据库连接错误', async () => {
      // 安排
      const dbError = new Error('Database connection failed');
      mockUserRepository.findOne.mockRejectedValue(dbError);

      // 执行和断言
      await expect(strategy.validate(mockPayload)).rejects.toThrow(dbError);
    });

    it('应该处理不同的用户ID格式', async () => {
      // 安排
      const differentPayload: JWTPayload = {
        ...mockPayload,
        sub: 'different-user-id-format',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // 执行和断言
      await expect(strategy.validate(differentPayload)).rejects.toThrow(
        new UnauthorizedException('用户不存在'),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'different-user-id-format' },
        select: expect.any(Array),
      });
    });
  });
});
