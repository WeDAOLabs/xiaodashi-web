import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPRateLimiterService } from './ip-rate-limiter.service';
import { IPRateLimit } from '../../database/entities/security/ip-rate-limit.entity';

describe('IPRateLimiterService', () => {
  let service: IPRateLimiterService;
  let repository: jest.Mocked<Repository<IPRateLimit>>;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const now = new Date('2025-01-01T12:00:00.000Z');
  const mockRateLimitRecord: IPRateLimit = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    ipAddress: '192.168.1.100',
    action: 'login',
    requestCount: 3,
    windowStartAt: new Date('2025-01-01T11:45:00.000Z'),
    windowEndAt: new Date('2025-01-01T12:00:00.000Z'),
    isBlocked: false,
    blockedUntil: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IPRateLimiterService,
        {
          provide: getRepositoryToken(IPRateLimit),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IPRateLimiterService>(IPRateLimiterService);
    repository = module.get(getRepositoryToken(IPRateLimit));

    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkRateLimit', () => {
    it('should create new record for first request', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const newRecord = { ...mockRateLimitRecord, requestCount: 1 };
      mockRepository.create.mockReturnValue(newRecord);
      mockRepository.save.mockResolvedValue(newRecord);

      const result = await service.checkRateLimit('192.168.1.100', 'login');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.isLimited).toBe(false);
      expect(result.requestsInWindow).toBe(1);
    });

    it('should increment request count within window', async () => {
      const record = {
        ...mockRateLimitRecord,
        requestCount: 3,
        windowStartAt: new Date('2025-01-01T11:45:00.000Z'),
        windowEndAt: new Date('2025-01-01T13:00:00.000Z'), // 未过期
      };
      mockRepository.findOne.mockResolvedValue(record);
      mockRepository.save.mockResolvedValue({ ...record, requestCount: 4 });

      const result = await service.checkRateLimit('192.168.1.100', 'login');

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.requestsInWindow).toBe(4);
      expect(result.isLimited).toBe(false);
    });

    it('should block IP when exceeding rate limit', async () => {
      const record = {
        ...mockRateLimitRecord,
        requestCount: 5,
        windowStartAt: new Date('2025-01-01T11:45:00.000Z'),
        windowEndAt: new Date('2025-01-01T13:00:00.000Z'),
      };
      mockRepository.findOne.mockResolvedValue(record);
      const blockedRecord = {
        ...record,
        requestCount: 6,
        isBlocked: true,
        blockedUntil: record.windowEndAt,
      };
      mockRepository.save.mockResolvedValue(blockedRecord);

      const result = await service.checkRateLimit('192.168.1.100', 'login');

      expect(result.isLimited).toBe(true);
      expect(result.requestsInWindow).toBe(6);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should reset window when expired', async () => {
      const expiredRecord = {
        ...mockRateLimitRecord,
        windowEndAt: new Date('2025-01-01T11:00:00.000Z'), // 过期
        requestCount: 10,
      };
      mockRepository.findOne.mockResolvedValue(expiredRecord);
      mockRepository.save.mockResolvedValue({
        ...expiredRecord,
        requestCount: 1,
        isBlocked: false,
        blockedUntil: undefined,
      });

      const result = await service.checkRateLimit('192.168.1.100', 'login');

      expect(result.requestsInWindow).toBe(1);
      expect(result.isLimited).toBe(false);
    });

    it('should return blocked status for active block', async () => {
      const blockedRecord = {
        ...mockRateLimitRecord,
        requestCount: 10,
        isBlocked: true,
        blockedUntil: new Date('2025-01-01T13:00:00.000Z'),
        windowStartAt: new Date('2025-01-01T11:45:00.000Z'),
        windowEndAt: new Date('2025-01-01T13:00:00.000Z'),
      };
      mockRepository.findOne.mockResolvedValue(blockedRecord);

      const result = await service.checkRateLimit('192.168.1.100', 'login');

      expect(result.isLimited).toBe(true);
      expect(result.requestsInWindow).toBe(10);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should unblock when block period expires', async () => {
      const expiredBlockRecord = {
        ...mockRateLimitRecord,
        isBlocked: true,
        blockedUntil: new Date('2025-01-01T11:00:00.000Z'), // 已过期
      };
      mockRepository.findOne.mockResolvedValue(expiredBlockRecord);
      mockRepository.save.mockResolvedValue({
        ...expiredBlockRecord,
        isBlocked: false,
        blockedUntil: undefined,
        requestCount: 1,
      });

      const result = await service.checkRateLimit('192.168.1.100', 'login');

      expect(result.isLimited).toBe(false);
      expect(result.requestsInWindow).toBe(1);
    });

    it('should use custom limits when provided', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockRateLimitRecord);
      mockRepository.save.mockResolvedValue(mockRateLimitRecord);

      const customLimits = { windowMs: 5, maxRequests: 3 };
      const result = await service.checkRateLimit(
        '192.168.1.100',
        'custom',
        customLimits,
      );

      expect(result.maxRequests).toBe(3);
    });

    it('should throw error for unknown action type without custom limits', async () => {
      await expect(
        service.checkRateLimit('192.168.1.100', 'unknown'),
      ).rejects.toThrow('Unknown action type: unknown');
    });
  });

  describe('getRateLimitStatus', () => {
    it('should return status for existing record', async () => {
      mockRepository.findOne.mockResolvedValue(mockRateLimitRecord);

      const result = await service.getRateLimitStatus('192.168.1.100', 'login');

      expect(result).not.toBeNull();
      expect(result?.ipAddress).toBe('192.168.1.100');
      expect(result?.action).toBe('login');
    });

    it('should return null when no record exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getRateLimitStatus('192.168.1.100', 'login');

      expect(result).toBeNull();
    });
  });

  describe('resetRateLimit', () => {
    it('should reset rate limit for specific action', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.resetRateLimit('192.168.1.100', 'login');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith({
        ipAddress: '192.168.1.100',
        action: 'login',
      });
    });

    it('should reset all actions when action not specified', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 3, raw: {} });

      const result = await service.resetRateLimit('192.168.1.100');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith({
        ipAddress: '192.168.1.100',
      });
    });

    it('should return false when no records found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      const result = await service.resetRateLimit('192.168.1.100', 'login');

      expect(result).toBe(false);
    });
  });

  describe('blockIP', () => {
    it('should manually block IP', async () => {
      const record = { ...mockRateLimitRecord };
      mockRepository.findOne.mockResolvedValue(record);
      mockRepository.save.mockResolvedValue({
        ...record,
        isBlocked: true,
        blockedUntil: new Date('2025-01-01T13:00:00.000Z'),
      });

      const result = await service.blockIP('192.168.1.100', 'login', 60);

      expect(result).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create block record if not exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockRateLimitRecord);
      mockRepository.save.mockResolvedValue(mockRateLimitRecord);

      const result = await service.blockIP('192.168.1.100', 'login', 60);

      expect(result).toBe(true);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should return false for unknown action', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.blockIP('192.168.1.100', 'unknown', 60);

      expect(result).toBe(false);
    });
  });

  describe('unblockIP', () => {
    it('should unblock IP successfully', async () => {
      const blockedRecord = {
        ...mockRateLimitRecord,
        isBlocked: true,
        blockedUntil: new Date('2025-01-01T13:00:00.000Z'),
      };
      mockRepository.findOne.mockResolvedValue(blockedRecord);
      mockRepository.save.mockResolvedValue({
        ...blockedRecord,
        isBlocked: false,
        blockedUntil: undefined,
      });

      const result = await service.unblockIP('192.168.1.100', 'login');

      expect(result).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should return false when record not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.unblockIP('192.168.1.100', 'login');

      expect(result).toBe(false);
    });
  });

  describe('cleanupExpiredRecords', () => {
    it('should cleanup expired records', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 10, raw: {} });

      await service.cleanupExpiredRecords();

      expect(mockRepository.delete).toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should return rate limit statistics', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(15); // blocked

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { action: 'login', total: '50', blocked: '10' },
          { action: 'register', total: '30', blocked: '5' },
        ]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.getStatistics();

      expect(result.total).toBe(100);
      expect(result.blocked).toBe(15);
      expect(result.byAction).toBeDefined();
      expect(result.byAction['login'].total).toBe(50);
      expect(result.byAction['login'].blocked).toBe(10);
    });
  });
});
