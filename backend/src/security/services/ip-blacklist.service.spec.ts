import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPBlacklistService } from './ip-blacklist.service';
import { IPBlacklist } from '../../database/entities/security/ip-blacklist.entity';
import { ThreatSeverity, IPType } from '@xiaodashi/shared';

describe('IPBlacklistService', () => {
  let service: IPBlacklistService;
  let _repository: jest.Mocked<Repository<IPBlacklist>>;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const mockBlacklistEntry: IPBlacklist = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    ipAddress: '192.168.1.100',
    type: 'single',
    reason: 'Brute force attack',
    severity: 'high',
    isActive: true,
    expiresAt: undefined,
    blockedAt: new Date('2025-01-01T00:00:00.000Z'),
    createdBy: 'admin-user-id',
    metadata: { attempts: 10 },
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IPBlacklistService,
        {
          provide: getRepositoryToken(IPBlacklist),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IPBlacklistService>(IPBlacklistService);
    _repository = module.get(getRepositoryToken(IPBlacklist));

    // 重置所有mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToBlacklist', () => {
    it('should add a new IP to blacklist', async () => {
      const request = {
        ipAddress: '192.168.1.100',
        type: IPType.SINGLE,
        reason: 'Brute force attack',
        severity: ThreatSeverity.HIGH,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBlacklistEntry);
      mockRepository.save.mockResolvedValue(mockBlacklistEntry);

      const result = await service.addToBlacklist(request);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { ipAddress: request.ipAddress },
      });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.ipAddress).toBe(request.ipAddress);
      expect(result.severity).toBe(ThreatSeverity.HIGH);
    });

    it('should update existing IP in blacklist', async () => {
      const request = {
        ipAddress: '192.168.1.100',
        type: IPType.SINGLE,
        reason: 'Updated reason',
        severity: ThreatSeverity.CRITICAL,
      };

      const existing = { ...mockBlacklistEntry };
      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue({
        ...existing,
        reason: request.reason,
        severity: 'critical',
      });

      const result = await service.addToBlacklist(request);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.reason).toBe(request.reason);
    });

    it('should set expiration time when duration is provided', async () => {
      const request = {
        ipAddress: '192.168.1.100',
        type: IPType.SINGLE,
        reason: 'Temporary ban',
        severity: ThreatSeverity.MEDIUM,
        duration: 60, // 60 minutes
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBlacklistEntry);
      mockRepository.save.mockResolvedValue(mockBlacklistEntry);

      await service.addToBlacklist(request);

      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('removeFromBlacklist', () => {
    it('should remove IP from blacklist successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.removeFromBlacklist('192.168.1.100');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith({
        ipAddress: '192.168.1.100',
      });
    });

    it('should return false when IP not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      const result = await service.removeFromBlacklist('192.168.1.100');

      expect(result).toBe(false);
    });
  });

  describe('updateBlacklist', () => {
    it('should update blacklist entry successfully', async () => {
      const updateRequest = {
        reason: 'Updated reason',
        severity: ThreatSeverity.CRITICAL,
      };

      const existing = { ...mockBlacklistEntry };
      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue({
        ...existing,
        ...updateRequest,
        severity: 'critical',
      });

      const result = await service.updateBlacklist(
        '192.168.1.100',
        updateRequest,
      );

      expect(result).not.toBeNull();
      expect(result?.reason).toBe(updateRequest.reason);
    });

    it('should return null when IP not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.updateBlacklist('192.168.1.100', {
        reason: 'New reason',
      });

      expect(result).toBeNull();
    });
  });

  describe('isBlacklisted', () => {
    it('should return blacklist entry when IP is blacklisted', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockBlacklistEntry),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.isBlacklisted('192.168.1.100');

      expect(result).not.toBeNull();
      expect(result?.ipAddress).toBe('192.168.1.100');
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should return null when IP is not blacklisted', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.isBlacklisted('192.168.1.200');

      expect(result).toBeNull();
    });
  });

  describe('queryBlacklist', () => {
    it('should query blacklist with filters and pagination', async () => {
      const queryParams = {
        severity: ThreatSeverity.HIGH,
        isActive: true,
        page: 1,
        pageSize: 10,
      };

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockBlacklistEntry], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.queryBlacklist(queryParams);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('getBlacklist', () => {
    it('should get blacklist entry by IP', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlacklistEntry);

      const result = await service.getBlacklist('192.168.1.100');

      expect(result).not.toBeNull();
      expect(result?.ipAddress).toBe('192.168.1.100');
    });

    it('should return null when entry not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getBlacklist('192.168.1.200');

      expect(result).toBeNull();
    });
  });

  describe('cleanupExpired', () => {
    it('should cleanup expired blacklist entries', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 5 }),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.cleanupExpired();

      expect(result).toBe(5);
      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({ isActive: false });
    });
  });

  describe('getStatistics', () => {
    it('should return blacklist statistics', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80); // active

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { severity: 'high', count: '30' },
          { type: 'single', count: '70' },
        ]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.getStatistics();

      expect(result.total).toBe(100);
      expect(result.active).toBe(80);
      expect(result.bySeverity).toBeDefined();
      expect(result.byType).toBeDefined();
    });
  });
});
