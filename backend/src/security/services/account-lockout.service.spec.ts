import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AccountLockoutService } from './account-lockout.service';
import { User } from '../../database/entities/user/user.entity';
import { UserRole, UserStatus } from '@xiaodashi/shared';
import { SecurityConfig } from '../../config/security.config';

describe('AccountLockoutService', () => {
  let service: AccountLockoutService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockSecurityConfig: SecurityConfig = {
    cors: { origins: ['http://localhost:3000'], credentials: true },
    rateLimit: { windowMs: 900000, maxRequests: 100 },
    loginRateLimit: { windowMs: 900000, maxAttempts: 5 },
    security: {
      maxLoginAttempts: 5,
      accountLockoutTime: 15 * 60 * 1000,
      minUsernameLength: 2,
      minPasswordLength: 8,
      progressiveLockout: {
        levels: [
          { attempts: 3, duration: 5 }, // 3次失败 - 锁定5分钟
          { attempts: 5, duration: 15 }, // 5次失败 - 锁定15分钟
          { attempts: 10, duration: 60 }, // 10次失败 - 锁定1小时
        ],
        resetPeriod: 24,
      },
      captcha: {
        enabled: true,
        triggerAttempts: 3,
        expireTime: 5,
        maxAttempts: 3,
        cleanupInterval: 60,
        complexity: 3,
        suspiciousIpThreshold: 5,
      },
    },
  };

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashedPassword',
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

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue(mockSecurityConfig),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountLockoutService,
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

    service = module.get<AccountLockoutService>(AccountLockoutService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('recordFailedAttempt', () => {
    it('应该增加失败次数但不锁定用户（未达到锁定阈值）', async () => {
      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        loginAttempts: 1,
      });
      userRepository.update.mockResolvedValue({ affected: 1 } as any);

      jest.spyOn(service, 'getLockoutStatus').mockResolvedValue({
        isLocked: false,
        remainingAttempts: 2, // 3 - 1 = 2
        currentAttempts: 2,
        nextLockThreshold: 3,
        nextLockDuration: 5,
      } as any);

      const result = await service.recordFailedAttempt('user-123', '127.0.0.1');

      expect(userRepository.update).toHaveBeenCalledWith('user-123', {
        loginAttempts: 2,
      });
      expect(result.isLocked).toBe(false);
    });

    it('应该在达到锁定阈值时锁定用户', async () => {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + 5);

      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        loginAttempts: 2,
      });
      userRepository.update.mockResolvedValue({ affected: 1 } as any);

      jest.spyOn(service, 'getLockoutStatus').mockResolvedValue({
        isLocked: true,
        lockedUntil: lockedUntil.toISOString(),
        remainingAttempts: 0,
        currentAttempts: 3,
        lockoutDuration: 5,
        lockReason: '登录失败次数过多',
        nextLockThreshold: 5,
        nextLockDuration: 15,
      } as any);

      const result = await service.recordFailedAttempt('user-123', '127.0.0.1');

      expect(userRepository.update).toHaveBeenCalledWith('user-123', {
        loginAttempts: 3,
        lockedUntil: expect.any(Date),
      });
      expect(result.isLocked).toBe(true);
    });

    it('应该在用户不存在时抛出错误', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.recordFailedAttempt('invalid-user', '127.0.0.1'),
      ).rejects.toThrow('用户不存在: invalid-user');
    });
  });

  describe('checkAccountLocked', () => {
    it('应该返回用户锁定状态', async () => {
      jest.spyOn(service, 'getLockoutStatus').mockResolvedValue({
        isLocked: false,
        remainingAttempts: 3,
        currentAttempts: 0,
        nextLockThreshold: 3,
        nextLockDuration: 5,
      } as any);

      const result = await service.checkAccountLocked('user-123');

      expect(result.isLocked).toBe(false);
      expect(result.remainingAttempts).toBe(3);
    });
  });

  describe('unlockAccount', () => {
    it('应该成功解锁用户账户', async () => {
      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        loginAttempts: 10,
        lockedUntil: new Date(Date.now() + 60000),
      });
      userRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.unlockAccount(
        'user-123',
        '用户身份验证通过',
        'admin-123',
      );

      expect(userRepository.update).toHaveBeenCalledWith('user-123', {
        loginAttempts: 0,
        lockedUntil: undefined,
      });
      expect(result.success).toBe(true);
      expect(result.message).toContain('已成功解锁');
    });

    it('应该在用户不存在时返回失败', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.unlockAccount('invalid-user', '测试解锁');

      expect(result.success).toBe(false);
      expect(result.message).toBe('用户不存在');
    });
  });

  describe('getLockoutStatus', () => {
    it('应该返回正确的锁定状态（未锁定）', async () => {
      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        loginAttempts: 2,
      });

      const result = await service.getLockoutStatus('user-123');

      expect(result.isLocked).toBe(false);
      expect(result.currentAttempts).toBe(2);
      expect(result.remainingAttempts).toBe(1); // 3 - 2 = 1
      expect(result.nextLockThreshold).toBe(3);
      expect(result.nextLockDuration).toBe(5);
    });

    it('应该返回正确的锁定状态（已锁定）', async () => {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + 15);

      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        loginAttempts: 5,
        lockedUntil,
      });

      const result = await service.getLockoutStatus('user-123');

      expect(result.isLocked).toBe(true);
      expect(result.currentAttempts).toBe(5);
      expect(result.lockedUntil).toBe(lockedUntil.toISOString());
      expect(result.lockoutDuration).toBeGreaterThan(10); // 约15分钟
      expect(result.nextLockThreshold).toBe(10);
      expect(result.nextLockDuration).toBe(60);
    });

    it('应该在锁定时间已过期时返回未锁定状态', async () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10);

      userRepository.findOne.mockResolvedValue({
        ...mockUser,
        loginAttempts: 3,
        lockedUntil: pastDate,
      });

      const result = await service.getLockoutStatus('user-123');

      expect(result.isLocked).toBe(false);
    });

    it('应该在用户不存在时抛出错误', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getLockoutStatus('invalid-user')).rejects.toThrow(
        '用户不存在: invalid-user',
      );
    });
  });

  describe('getUserInfo', () => {
    it('应该返回用户基本信息', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserInfo('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
      });
    });

    it('应该在用户不存在时返回null', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserInfo('invalid-user');

      expect(result).toBeNull();
    });
  });

  describe('cleanupExpiredLockouts', () => {
    it('应该清理过期的锁定状态', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 5 }),
      };

      userRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.cleanupExpiredLockouts();

      expect(result).toBe(5);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        loginAttempts: 0,
        lockedUntil: undefined,
      });
    });

    it('应该在没有过期锁定时返回0', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 0 }),
      };

      userRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.cleanupExpiredLockouts();

      expect(result).toBe(0);
    });
  });

  describe('内部方法逻辑测试', () => {
    describe('getLockoutDuration 边界测试', () => {
      let serviceInstance: AccountLockoutService;

      beforeEach(async () => {
        serviceInstance = service;
      });

      it('应该在未达到任何锁定阈值时返回0', async () => {
        // 通过实际调用 getLockoutStatus 来测试内部逻辑
        userRepository.findOne.mockResolvedValue({
          ...mockUser,
          loginAttempts: 0,
        });

        const result = await serviceInstance.getLockoutStatus('user-123');

        expect(result.isLocked).toBe(false);
        expect(result.nextLockThreshold).toBe(3);
      });

      it('应该在达到第一个锁定阈值时返回对应时长', async () => {
        userRepository.findOne.mockResolvedValue({
          ...mockUser,
          loginAttempts: 3,
        });

        const result = await serviceInstance.getLockoutStatus('user-123');

        expect(result.nextLockThreshold).toBe(5);
        expect(result.nextLockDuration).toBe(15);
      });

      it('应该在达到最高锁定阈值时返回0剩余次数', async () => {
        const lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + 60); // 锁定60分钟

        userRepository.findOne.mockResolvedValue({
          ...mockUser,
          loginAttempts: 10,
          lockedUntil, // 设置锁定时间
        });

        const result = await serviceInstance.getLockoutStatus('user-123');

        expect(result.nextLockThreshold).toBeNull(); // 已达最高惩罚等级
        expect(result.remainingAttempts).toBe(0); // 剩余尝试次数为0
        expect(result.nextLockDuration).toBe(0); // 无下一个锁定时长
        expect(result.isLocked).toBe(true); // 应该被锁定
        expect(result.lockoutDuration).toBe(60); // 锁定60分钟
      });

      it('应该在超过最高锁定阈值时也返回0剩余次数', async () => {
        const lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + 60); // 锁定60分钟

        userRepository.findOne.mockResolvedValue({
          ...mockUser,
          loginAttempts: 15, // 超过最高阈值
          lockedUntil, // 设置锁定时间
        });

        const result = await serviceInstance.getLockoutStatus('user-123');

        expect(result.nextLockThreshold).toBeNull(); // 已达最高惩罚等级
        expect(result.remainingAttempts).toBe(0); // 剩余尝试次数为0
        expect(result.nextLockDuration).toBe(0); // 无下一个锁定时长
        expect(result.isLocked).toBe(true); // 应该被锁定
        expect(result.lockoutDuration).toBe(60); // 锁定60分钟
      });
    });
  });
});
