import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPWhitelistService } from './ip-whitelist.service';
import { IPWhitelist } from '../../database/entities/security/ip-whitelist.entity';
import { IPType } from '@xiaodashi/shared';

describe('IPWhitelistService', () => {
  let service: IPWhitelistService;
  let _repository: jest.Mocked<Repository<IPWhitelist>>;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const mockWhitelistEntry: IPWhitelist = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    ipAddress: '10.0.0.1',
    type: 'single',
    description: 'Office network',
    isActive: true,
    createdBy: 'admin-user-id',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IPWhitelistService,
        {
          provide: getRepositoryToken(IPWhitelist),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IPWhitelistService>(IPWhitelistService);
    _repository = module.get(getRepositoryToken(IPWhitelist));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToWhitelist', () => {
    it('should add a new IP to whitelist', async () => {
      const request = {
        ipAddress: '10.0.0.1',
        type: IPType.SINGLE,
        description: 'Office network',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockWhitelistEntry);
      mockRepository.save.mockResolvedValue(mockWhitelistEntry);

      const result = await service.addToWhitelist(request);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { ipAddress: request.ipAddress },
      });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.ipAddress).toBe(request.ipAddress);
      expect(result.description).toBe(request.description);
    });

    it('should update existing IP in whitelist', async () => {
      const request = {
        ipAddress: '10.0.0.1',
        type: IPType.SINGLE,
        description: 'Updated description',
      };

      const existing = { ...mockWhitelistEntry };
      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue({
        ...existing,
        description: request.description,
      });

      const result = await service.addToWhitelist(request);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.description).toBe(request.description);
    });

    it('should add IP range (CIDR) to whitelist', async () => {
      const request = {
        ipAddress: '10.0.0.0/24',
        type: IPType.RANGE,
        description: 'Office network range',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({
        ...mockWhitelistEntry,
        ipAddress: request.ipAddress,
        type: 'range',
        description: request.description,
      });
      mockRepository.save.mockResolvedValue({
        ...mockWhitelistEntry,
        ipAddress: request.ipAddress,
        type: 'range',
        description: request.description,
      });

      const result = await service.addToWhitelist(request, 'admin-id');

      expect(result.ipAddress).toBe(request.ipAddress);
      expect(result.type).toBe(IPType.RANGE);
    });
  });

  describe('removeFromWhitelist', () => {
    it('should remove IP from whitelist successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.removeFromWhitelist('10.0.0.1');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith({
        ipAddress: '10.0.0.1',
      });
    });

    it('should return false when IP not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      const result = await service.removeFromWhitelist('10.0.0.1');

      expect(result).toBe(false);
    });
  });

  describe('updateWhitelist', () => {
    it('should update whitelist entry successfully', async () => {
      const updateRequest = {
        description: 'Updated office network',
        isActive: false,
      };

      const existing = { ...mockWhitelistEntry };
      mockRepository.findOne.mockResolvedValue(existing);
      mockRepository.save.mockResolvedValue({
        ...existing,
        ...updateRequest,
      });

      const result = await service.updateWhitelist('10.0.0.1', updateRequest);

      expect(result).not.toBeNull();
      expect(result?.description).toBe(updateRequest.description);
      expect(result?.isActive).toBe(false);
    });

    it('should return null when IP not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.updateWhitelist('10.0.0.1', {
        description: 'New description',
      });

      expect(result).toBeNull();
    });
  });

  describe('isWhitelisted', () => {
    it('should return true when IP is whitelisted', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockWhitelistEntry),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.isWhitelisted('10.0.0.1');

      expect(result).toBe(true);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should return false when IP is not whitelisted', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.isWhitelisted('192.168.1.1');

      expect(result).toBe(false);
    });

    it('should match IP within whitelisted CIDR range', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          ...mockWhitelistEntry,
          ipAddress: '10.0.0.0/24',
          type: 'range',
        }),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.isWhitelisted('10.0.0.50');

      expect(result).toBe(true);
    });
  });

  describe('getWhitelist', () => {
    it('should get whitelist entry by IP', async () => {
      mockRepository.findOne.mockResolvedValue(mockWhitelistEntry);

      const result = await service.getWhitelist('10.0.0.1');

      expect(result).not.toBeNull();
      expect(result?.ipAddress).toBe('10.0.0.1');
    });

    it('should return null when entry not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getWhitelist('10.0.0.2');

      expect(result).toBeNull();
    });
  });

  describe('queryWhitelist', () => {
    it('should query whitelist with filters and pagination', async () => {
      const queryParams = {
        isActive: true,
        page: 1,
        pageSize: 10,
      };

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockWhitelistEntry], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.queryWhitelist(queryParams);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should filter by IP address', async () => {
      const queryParams = {
        ipAddress: '10.0.0.1',
        page: 1,
        pageSize: 10,
      };

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockWhitelistEntry], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.queryWhitelist(queryParams);

      expect(result.items).toHaveLength(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should return whitelist statistics', async () => {
      mockRepository.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(45); // active

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { type: 'single', count: '40' },
          { type: 'range', count: '5' },
        ]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.getStatistics();

      expect(result.total).toBe(50);
      expect(result.active).toBe(45);
      expect(result.byType).toBeDefined();
      expect(result.byType[IPType.SINGLE]).toBe(40);
      expect(result.byType[IPType.RANGE]).toBe(5);
    });
  });
});
