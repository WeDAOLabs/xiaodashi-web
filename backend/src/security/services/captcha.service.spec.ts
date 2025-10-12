import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, GoneException } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaSession } from '../../database/entities/user/captcha-session.entity';
import { CaptchaType } from '@xiaodashi/shared';
import { SecurityConfig } from '../../config/security.config';
import { LoginRiskAssessmentService } from './login-risk-assessment.service';

// Mock modules
jest.mock('bcrypt');
jest.mock('svg-captcha', () => ({
  create: jest.fn().mockReturnValue({
    text: 'test123',
    data: '<svg>test</svg>',
  }),
}));

describe('CaptchaService', () => {
  let service: CaptchaService;
  let captchaSessionRepository: jest.Mocked<Repository<CaptchaSession>>;
  let module: TestingModule;
  const bcryptHash = jest.requireMock('bcrypt').hash;
  const bcryptCompare = jest.requireMock('bcrypt').compare;

  const mockSecurityConfig: SecurityConfig = {
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
        enabled: true,
        triggerAttempts: 2,
        expireTime: 5,
        maxAttempts: 3,
        cleanupInterval: 60,
        complexity: 3,
        suspiciousIpThreshold: 5,
      },
    },
  };

  beforeEach(async () => {
    const mockCaptchaSessionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any;

    const mockConfigService = {
      get: jest.fn().mockReturnValue(mockSecurityConfig),
    } as any;

    // Mock LoginRiskAssessmentService
    const mockLoginRiskAssessmentService = {
      assessLoginRisk: jest.fn().mockResolvedValue({
        required: false,
        reason: '低风险登录',
        riskScore: 5,
      }),
    } as any;

    module = await Test.createTestingModule({
      providers: [
        CaptchaService,
        {
          provide: getRepositoryToken(CaptchaSession),
          useValue: mockCaptchaSessionRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: LoginRiskAssessmentService,
          useValue: mockLoginRiskAssessmentService,
        },
      ],
    }).compile();

    service = module.get<CaptchaService>(CaptchaService);
    captchaSessionRepository = module.get(getRepositoryToken(CaptchaSession));

    // Setup default mocks
    bcryptHash.mockResolvedValue('encrypted_data');
    bcryptCompare.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCaptcha', () => {
    it('应该成功生成图形验证码', async () => {
      // Arrange
      const mockSession = {
        id: '1',
        sessionId: 'captcha_test123',
        captchaData: 'encrypted_data',
        captchaType: CaptchaType.IMAGE,
        expiresAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        attempts: 0,
        isVerified: false,
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      captchaSessionRepository.create.mockReturnValue(mockSession);
      captchaSessionRepository.save.mockResolvedValue(mockSession);

      // Act
      const result = await service.generateCaptcha(
        { type: CaptchaType.IMAGE, complexity: 3 },
        { ipAddress: '127.0.0.1', userAgent: 'test-agent' },
      );

      // Assert
      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('captchaImage');
      expect(result.captchaImage).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(captchaSessionRepository.create).toHaveBeenCalled();
      expect(captchaSessionRepository.save).toHaveBeenCalled();
    });

    it('应该成功生成滑动验证码', async () => {
      // Arrange
      const mockSession = {
        id: '1',
        sessionId: 'captcha_test123',
        captchaData: 'encrypted_data',
        captchaType: CaptchaType.SLIDER,
        expiresAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        attempts: 0,
        isVerified: false,
        isUsed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      captchaSessionRepository.create.mockReturnValue(mockSession);
      captchaSessionRepository.save.mockResolvedValue(mockSession);

      // Act
      const result = await service.generateCaptcha(
        { type: CaptchaType.SLIDER },
        { ipAddress: '127.0.0.1' },
      );

      // Assert
      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('sliderData');
      expect(result.sliderData).toHaveProperty('backgroundImage');
      expect(result.sliderData).toHaveProperty('puzzlePiece');
      expect(result.sliderData).toHaveProperty('xPosition');
      expect(result.sliderData).toHaveProperty('tolerance');
    });
  });

  describe('verifyCaptcha', () => {
    const mockSession = {
      id: '1',
      sessionId: 'test_session_id',
      captchaData: 'encrypted_correct_code',
      captchaType: CaptchaType.IMAGE,
      expiresAt: new Date(Date.now() + 300000), // 5分钟后过期
      attempts: 0,
      isVerified: false,
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      captchaSessionRepository.findOne.mockResolvedValue(mockSession);
      captchaSessionRepository.update.mockResolvedValue({ affected: 1 } as any);
    });

    it('应该成功验证正确的验证码', async () => {
      // Act
      const result = await service.verifyCaptcha(
        'test_session_id',
        'correct_code',
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('验证码验证成功');
      expect(captchaSessionRepository.update).toHaveBeenCalledWith('1', {
        isVerified: true,
        isUsed: true,
      });
    });

    it('应该拒绝不正确的验证码', async () => {
      // Arrange
      bcryptCompare.mockResolvedValue(false);

      // Act
      const result = await service.verifyCaptcha(
        'test_session_id',
        'wrong_code',
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('验证码错误，请重新输入');
      expect(result.attemptsRemaining).toBe(2);
    });

    it('应该拒绝验证码会话不存在的情况', async () => {
      // Arrange
      captchaSessionRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.verifyCaptcha('invalid_session', 'code'),
      ).rejects.toThrow(BadRequestException);
    });

    it('应该拒绝已过期的验证码', async () => {
      // Arrange
      const expiredSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000), // 已过期
      };
      captchaSessionRepository.findOne.mockResolvedValue(expiredSession);

      // Act & Assert
      await expect(
        service.verifyCaptcha('expired_session', 'code'),
      ).rejects.toThrow(GoneException);
    });

    it('应该拒绝已使用的验证码', async () => {
      // Arrange
      const usedSession = {
        ...mockSession,
        isUsed: true,
      };
      captchaSessionRepository.findOne.mockResolvedValue(usedSession);

      // Act & Assert
      await expect(
        service.verifyCaptcha('used_session', 'code'),
      ).rejects.toThrow(BadRequestException);
    });

    it('应该拒绝尝试次数过多的验证码', async () => {
      // Arrange
      const maxAttemptsSession = {
        ...mockSession,
        attempts: 3, // 已达到最大尝试次数
      };
      captchaSessionRepository.findOne.mockResolvedValue(maxAttemptsSession);

      // Act & Assert
      await expect(
        service.verifyCaptcha('max_attempts_session', 'code'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('shouldRequireCaptcha', () => {
    it('应该在没有IP地址时返回false', async () => {
      // Act
      const result = await service.shouldRequireCaptcha('user123', undefined);

      // Assert
      expect(result.required).toBe(false);
    });

    it('应该在IP地址失败次数不足时返回false', async () => {
      // Act
      const result = await service.shouldRequireCaptcha(undefined, '127.0.0.1');

      // Assert - 检查基本结构
      expect(result).toHaveProperty('required');
      expect(result.required).toBe(false);
      // reason和riskScore是可选的，所以不强制检查
    });

    it('应该在风险评估失败时使用降级方案', async () => {
      // Arrange - 模拟风险评估服务失败
      const mockLoginRiskAssessmentService = module.get(
        LoginRiskAssessmentService,
      );
      mockLoginRiskAssessmentService.assessLoginRisk.mockRejectedValueOnce(
        new Error('风险评估失败'),
      );

      // Act
      const result = await service.shouldRequireCaptcha(undefined, '127.0.0.1');

      // Assert - 应该使用降级方案返回false
      expect(result.required).toBe(false);
    });
  });

  describe('manualCleanupExpiredCaptchas', () => {
    it('应该手动清理过期的验证码会话并返回清理数量', async () => {
      // Arrange
      const deleteResult = { affected: 3, raw: [] };
      captchaSessionRepository.delete.mockResolvedValue(deleteResult);

      // Act
      const result = await service.manualCleanupExpiredCaptchas();

      // Assert
      expect(result).toBe(3);
      expect(captchaSessionRepository.delete).toHaveBeenCalled();
    });

    it('应该在没有过期会话时返回0', async () => {
      // Arrange
      const deleteResult = { affected: 0, raw: [] };
      captchaSessionRepository.delete.mockResolvedValue(deleteResult);

      // Act
      const result = await service.manualCleanupExpiredCaptchas();

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('getCaptchaStatistics', () => {
    it('应该返回正确的统计信息', async () => {
      // Arrange
      captchaSessionRepository.count
        .mockResolvedValueOnce(100) // totalSessions
        .mockResolvedValueOnce(20) // activeSessions
        .mockResolvedValueOnce(70) // expiredSessions
        .mockResolvedValueOnce(25) // usedSessions
        .mockResolvedValueOnce(18); // verifiedSessions

      // Act
      const result = await service.getCaptchaStatistics();

      // Assert
      expect(result).toEqual({
        totalSessions: 100,
        activeSessions: 20,
        expiredSessions: 70,
        usedSessions: 25,
        verifiedSessions: 18,
      });
    });
  });
});
