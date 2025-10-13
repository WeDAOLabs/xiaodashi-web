import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPRiskAssessmentService } from './ip-risk-assessment.service';
import { IPAccessLog } from '../../database/entities/security/ip-access-log.entity';
import { IPBlacklistService } from './ip-blacklist.service';
import { IPWhitelistService } from './ip-whitelist.service';
import { IPRateLimiterService } from './ip-rate-limiter.service';
import { IPRiskLevel, ThreatSeverity } from '@xiaodashi/shared';

// Mock geoip-lite
jest.mock('geoip-lite', () => ({
  lookup: jest.fn((ip: string) => {
    if (ip === '8.8.8.8') {
      return {
        country: 'US',
        city: 'Mountain View',
        region: 'CA',
        ll: [37.386, -122.0838],
        timezone: 'America/Los_Angeles',
      };
    }
    return null;
  }),
}));

describe('IPRiskAssessmentService', () => {
  let service: IPRiskAssessmentService;
  let accessLogRepository: jest.Mocked<Repository<IPAccessLog>>;
  let blacklistService: jest.Mocked<IPBlacklistService>;
  let whitelistService: jest.Mocked<IPWhitelistService>;
  let rateLimiterService: jest.Mocked<IPRateLimiterService>;

  const mockAccessLogRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockBlacklistService = {
    isBlacklisted: jest.fn(),
  };

  const mockWhitelistService = {
    isWhitelisted: jest.fn(),
  };

  const mockRateLimiterService = {
    getRateLimitStatus: jest.fn(),
  };

  const mockAccessLog: IPAccessLog = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    ipAddress: '192.168.1.100',
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    statusCode: 401,
    userAgent: 'Mozilla/5.0',
    userId: undefined,
    riskScore: 50,
    blocked: false,
    blockReason: undefined,
    location: 'US,Mountain View',
    createdAt: new Date('2025-01-01T12:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IPRiskAssessmentService,
        {
          provide: getRepositoryToken(IPAccessLog),
          useValue: mockAccessLogRepository,
        },
        {
          provide: IPBlacklistService,
          useValue: mockBlacklistService,
        },
        {
          provide: IPWhitelistService,
          useValue: mockWhitelistService,
        },
        {
          provide: IPRateLimiterService,
          useValue: mockRateLimiterService,
        },
      ],
    }).compile();

    service = module.get<IPRiskAssessmentService>(IPRiskAssessmentService);
    accessLogRepository = module.get(getRepositoryToken(IPAccessLog));
    blacklistService = module.get(IPBlacklistService);
    whitelistService = module.get(IPWhitelistService);
    rateLimiterService = module.get(IPRateLimiterService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assessIPRisk', () => {
    it('should return safe report for whitelisted IP', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(true);

      const result = await service.assessIPRisk('8.8.8.8');

      expect(result.riskScore).toBe(0);
      expect(result.riskLevel).toBe(IPRiskLevel.SAFE);
      expect(result.isWhitelisted).toBe(true);
      expect(result.recommendation).toBe('allow');
      expect(mockBlacklistService.isBlacklisted).not.toHaveBeenCalled();
    });

    it('should add 50 points for blacklisted IP', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue({
        id: '1',
        ipAddress: '192.168.1.100',
        type: 'single' as any,
        reason: 'Malicious',
        severity: ThreatSeverity.HIGH,
        isActive: true,
        blockedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.assessIPRisk('192.168.1.100');

      expect(result.riskScore).toBeGreaterThanOrEqual(50);
      expect(result.isBlacklisted).toBe(true);
      expect(result.riskFactors).toContain('IP在黑名单中');
    });

    it('should calculate risk based on failed login attempts', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const failedLoginLogs = Array(6)
        .fill(null)
        .map(() => ({
          ...mockAccessLog,
          statusCode: 401,
          endpoint: '/api/v1/auth/login',
        }));
      mockAccessLogRepository.find.mockResolvedValue(failedLoginLogs);

      const result = await service.assessIPRisk('192.168.1.100');

      expect(result.riskScore).toBeGreaterThan(0);
      expect(result.riskFactors.some((f) => f.includes('失败登录'))).toBe(true);
    });

    it('should add points for rate limit violations', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue({
        ipAddress: '192.168.1.100',
        action: 'login',
        isLimited: true,
        requestsInWindow: 10,
        maxRequests: 5,
        windowStartAt: new Date().toISOString(),
        windowEndAt: new Date().toISOString(),
        resetAt: new Date().toISOString(),
      });

      const result = await service.assessIPRisk('192.168.1.100');

      expect(result.riskFactors).toContain('触发频率限制');
      expect(result.riskScore).toBeGreaterThanOrEqual(15);
    });

    it('should calculate correct risk level', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.assessIPRisk('192.168.1.100');

      expect(result.riskLevel).toBe(IPRiskLevel.SAFE);
      expect(result.riskScore).toBeLessThan(20);
    });

    it('should include geolocation information', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.assessIPRisk('8.8.8.8');

      expect(result.geolocation).toBeDefined();
      expect(result.geolocation?.country).toBe('US');
      expect(result.geolocation?.city).toBe('Mountain View');
    });

    it('should recommend block for critical risk', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue({
        id: '1',
        ipAddress: '192.168.1.100',
        type: 'single' as any,
        reason: 'Malicious',
        severity: ThreatSeverity.CRITICAL,
        isActive: true,
        blockedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.assessIPRisk('192.168.1.100');

      expect(result.recommendation).toBe('block');
    });

    it('should recommend captcha for medium-high risk', async () => {
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue({
        ipAddress: '192.168.1.100',
        action: 'login',
        isLimited: true,
        requestsInWindow: 10,
        maxRequests: 5,
        windowStartAt: new Date().toISOString(),
        windowEndAt: new Date().toISOString(),
        resetAt: new Date().toISOString(),
      });

      // 创建多次失败登录
      const failedLogs = Array(10)
        .fill(null)
        .map(() => ({
          ...mockAccessLog,
          statusCode: 401,
          endpoint: '/api/v1/auth/login',
        }));
      mockAccessLogRepository.find.mockResolvedValue(failedLogs);

      const result = await service.assessIPRisk('192.168.1.100');

      expect(result.riskScore).toBeGreaterThanOrEqual(60);
      expect(result.recommendation).toBe('captcha');
    });
  });

  describe('logIPAccess', () => {
    it('should log IP access with geolocation', async () => {
      const logData = {
        ipAddress: '8.8.8.8',
        endpoint: '/api/v1/auth/login',
        method: 'POST',
        statusCode: 200,
        userAgent: 'Mozilla/5.0',
        userId: 'user-123',
      };

      mockAccessLogRepository.create.mockReturnValue(mockAccessLog);
      mockAccessLogRepository.save.mockResolvedValue(mockAccessLog);
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.logIPAccess(logData);

      expect(mockAccessLogRepository.create).toHaveBeenCalled();
      expect(mockAccessLogRepository.save).toHaveBeenCalled();
      expect(result.location).toBe('US,Mountain View');
    });

    it('should use provided risk score', async () => {
      const logData = {
        ipAddress: '192.168.1.100',
        endpoint: '/api/v1/auth/login',
        method: 'POST',
        statusCode: 401,
        riskScore: 75,
      };

      mockAccessLogRepository.create.mockReturnValue(mockAccessLog);
      mockAccessLogRepository.save.mockResolvedValue(mockAccessLog);

      await service.logIPAccess(logData);

      const createCall = mockAccessLogRepository.create.mock.calls[0][0];
      expect(createCall.riskScore).toBe(75);
    });

    it('should calculate risk score when not provided', async () => {
      const logData = {
        ipAddress: '192.168.1.100',
        endpoint: '/api/v1/auth/login',
        method: 'POST',
        statusCode: 401,
      };

      mockAccessLogRepository.create.mockReturnValue(mockAccessLog);
      mockAccessLogRepository.save.mockResolvedValue(mockAccessLog);
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      await service.logIPAccess(logData);

      expect(mockWhitelistService.isWhitelisted).toHaveBeenCalled();
      expect(mockAccessLogRepository.create).toHaveBeenCalled();
    });

    it('should handle blocked requests', async () => {
      const logData = {
        ipAddress: '192.168.1.100',
        endpoint: '/api/v1/auth/login',
        method: 'POST',
        statusCode: 403,
        blocked: true,
        blockReason: 'Rate limit exceeded',
      };

      mockAccessLogRepository.create.mockReturnValue({
        ...mockAccessLog,
        blocked: true,
        blockReason: 'Rate limit exceeded',
      });
      mockAccessLogRepository.save.mockResolvedValue({
        ...mockAccessLog,
        blocked: true,
        blockReason: 'Rate limit exceeded',
      });
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.logIPAccess(logData);

      expect(result.blocked).toBe(true);
      expect(result.blockReason).toBe('Rate limit exceeded');
    });

    it('should handle IP without geolocation data', async () => {
      const logData = {
        ipAddress: '127.0.0.1', // localhost不会有geo信息
        endpoint: '/api/v1/health',
        method: 'GET',
        statusCode: 200,
      };

      mockAccessLogRepository.create.mockReturnValue({
        ...mockAccessLog,
        ipAddress: '127.0.0.1',
        location: undefined,
      });
      mockAccessLogRepository.save.mockResolvedValue({
        ...mockAccessLog,
        ipAddress: '127.0.0.1',
        location: undefined,
      });
      mockWhitelistService.isWhitelisted.mockResolvedValue(false);
      mockBlacklistService.isBlacklisted.mockResolvedValue(null);
      mockAccessLogRepository.find.mockResolvedValue([]);
      mockRateLimiterService.getRateLimitStatus.mockResolvedValue(null);

      const result = await service.logIPAccess(logData);

      // geoip-lite为localhost返回null，所以location应该是undefined
      expect(result.location).toBeUndefined();
    });
  });
});
