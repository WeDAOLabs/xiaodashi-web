import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConsumePointsRequest,
  PointStatus,
  PointTransactionType,
  RechargePointsRequest,
} from '@xiaodashi/shared';
import type { QueryRunner, Repository } from 'typeorm';
import { PointTransaction } from '../database/entities/points/point-transaction.entity';
import { TeamPoint } from '../database/entities/points/team-point.entity';
import { PointsService } from './points.service';

describe('PointsService', () => {
  let service: PointsService;
  let teamPointRepository: Repository<TeamPoint>;
  let pointTransactionRepository: Repository<PointTransaction>;

  // Mock repositories
  const mockTeamPointRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    manager: {
      connection: {
        createQueryRunner: jest.fn(),
      },
    },
  };

  const mockPointTransactionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        {
          provide: getRepositoryToken(TeamPoint),
          useValue: mockTeamPointRepository,
        },
        {
          provide: getRepositoryToken(PointTransaction),
          useValue: mockPointTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<PointsService>(PointsService);
    teamPointRepository = module.get<Repository<TeamPoint>>(
      getRepositoryToken(TeamPoint),
    );
    pointTransactionRepository = module.get<Repository<PointTransaction>>(
      getRepositoryToken(PointTransaction),
    );

    // 清除所有 mock 调用记录
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    const mockTeamId = 'test-team-id-123';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('应该成功获取团队积分余额', async () => {
      const mockTeamPoint = {
        id: 'point-1',
        teamId: mockTeamId,
        balance: 1000.5,
        status: PointStatus.ACTIVE,
        expiresAt: new Date('2024-12-31'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      };

      const mockLastTransaction = {
        id: 'tx-1',
        teamId: mockTeamId,
        createdAt: new Date('2024-01-15T10:30:00Z'),
      };

      mockTeamPointRepository.findOne.mockResolvedValue(mockTeamPoint);
      mockPointTransactionRepository.findOne.mockResolvedValue(
        mockLastTransaction,
      );

      const result = await service.getBalance(mockTeamId);

      expect(result).toEqual({
        teamId: mockTeamId,
        balance: 1000.5,
        status: PointStatus.ACTIVE,
        expiresAt: '2024-12-31T00:00:00.000Z',
        lastTransactionAt: '2024-01-15T10:30:00.000Z',
      });
    });

    it('团队无积分记录时应该返回0余额', async () => {
      mockTeamPointRepository.findOne.mockResolvedValue(null);

      const result = await service.getBalance(mockTeamId);

      expect(result).toEqual({
        teamId: mockTeamId,
        balance: 0,
        status: PointStatus.ACTIVE,
      });
    });

    it('应该查询最后一次交易时间', async () => {
      const mockTeamPoint = {
        id: 'point-1',
        teamId: mockTeamId,
        balance: 500,
        status: PointStatus.ACTIVE,
        createdAt: new Date('2024-01-01'),
      };

      mockTeamPointRepository.findOne.mockResolvedValue(mockTeamPoint);
      mockPointTransactionRepository.findOne.mockResolvedValue(null);

      const result = await service.getBalance(mockTeamId);

      expect(result.lastTransactionAt).toBeUndefined();
      expect(mockPointTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { teamId: mockTeamId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getHistory', () => {
    const mockTeamId = 'test-team-id-123';

    const mockTransactions = [
      {
        id: 'tx-1',
        teamId: mockTeamId,
        userId: 'user-1',
        type: PointTransactionType.CONSUMPTION,
        amount: -10.5,
        balanceAfter: 990,
        description: '使用AI工具',
        businessId: 'business-1',
        businessType: 'tool_usage',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        id: 'tx-2',
        teamId: mockTeamId,
        userId: 'user-1',
        type: PointTransactionType.RECHARGE,
        amount: 100,
        balanceAfter: 1000.5,
        description: '支付充值',
        businessId: 'order-1',
        businessType: 'payment',
        createdAt: new Date('2024-01-14T08:00:00Z'),
      },
    ];

    beforeEach(() => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockTransactions, mockTransactions.length]),
      };

      mockPointTransactionRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
    });

    it('应该成功获取交易历史', async () => {
      const result = await service.getHistory(mockTeamId, {
        page: 1,
        limit: 20,
      });

      expect(result.transactions).toHaveLength(2);
      expect(result.transactions[0]).toEqual({
        id: 'tx-1',
        teamId: mockTeamId,
        userId: 'user-1',
        type: PointTransactionType.CONSUMPTION,
        amount: -10.5,
        balanceAfter: 990,
        description: '使用AI工具',
        businessId: 'business-1',
        businessType: 'tool_usage',
        createdAt: '2024-01-15T10:30:00.000Z',
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it('应该正确处理分页参数', async () => {
      await service.getHistory(mockTeamId, { page: 2, limit: 10 });

      const mockQueryBuilder =
        mockPointTransactionRepository.createQueryBuilder();
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('应该支持按类型筛选', async () => {
      await service.getHistory(mockTeamId, {
        type: PointTransactionType.CONSUMPTION,
      });

      const mockQueryBuilder =
        mockPointTransactionRepository.createQueryBuilder();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.type = :type',
        { type: PointTransactionType.CONSUMPTION },
      );
    });

    it('应该支持按日期范围筛选', async () => {
      await service.getHistory(mockTeamId, {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
      });

      const mockQueryBuilder =
        mockPointTransactionRepository.createQueryBuilder();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.createdAt >= :startDate',
        { startDate: '2024-01-01T00:00:00Z' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.createdAt <= :endDate',
        { endDate: '2024-01-31T23:59:59Z' },
      );
    });

    it('应该处理空列表', async () => {
      const mockQueryBuilder =
        mockPointTransactionRepository.createQueryBuilder();
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.getHistory(mockTeamId);

      expect(result.transactions).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('consume', () => {
    const mockTeamId = 'test-team-id-123';
    const mockUserId = 'user-1';

    const mockConsumeRequest: ConsumePointsRequest = {
      teamId: mockTeamId,
      userId: mockUserId,
      amount: 10.5,
      description: '使用AI工具消耗积分',
      businessId: 'business-1',
      businessType: 'tool_usage',
    };

    const mockTeamPoint = {
      id: 'point-1',
      teamId: mockTeamId,
      balance: 1000,
      status: PointStatus.ACTIVE,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    };

    let mockQueryRunner: Partial<QueryRunner>;

    beforeEach(() => {
      mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn(),
          save: jest.fn(),
          create: jest.fn(),
        } as never,
      };

      mockTeamPointRepository.manager.connection.createQueryRunner.mockReturnValue(
        mockQueryRunner,
      );
    });

    it('应该成功扣减积分', async () => {
      const savedTransaction = {
        id: 'tx-1',
        teamId: mockTeamId,
        userId: mockUserId,
        type: PointTransactionType.CONSUMPTION,
        amount: -10.5,
        balanceAfter: 989.5,
        description: '使用AI工具消耗积分',
        businessId: 'business-1',
        businessType: 'tool_usage',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      };

      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue(
        savedTransaction,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        savedTransaction,
      );

      const result = await service.consume(mockConsumeRequest);

      expect(result.newBalance).toBe(989.5);
      expect(result.transaction.amount).toBe(-10.5);
      expect(result.transaction.type).toBe(PointTransactionType.CONSUMPTION);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('应该使用行锁查询积分记录', async () => {
      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue({});

      await service.consume(mockConsumeRequest);

      expect(mockQueryRunner.manager!.findOne).toHaveBeenCalledWith(TeamPoint, {
        where: { teamId: mockTeamId },
        lock: { mode: 'pessimistic_write' },
      });
    });

    it('积分不足时应该抛出异常', async () => {
      const lowBalanceTeamPoint = {
        ...mockTeamPoint,
        balance: 5,
      };

      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        lowBalanceTeamPoint,
      );

      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        '积分不足',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('积分状态非ACTIVE时应该抛出异常', async () => {
      const frozenTeamPoint = {
        ...mockTeamPoint,
        status: PointStatus.FROZEN,
      };

      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        frozenTeamPoint,
      );

      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        '团队积分状态为',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('团队积分记录不存在时应该抛出异常', async () => {
      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        '的积分记录不存在',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('应该创建负数金额的交易记录', async () => {
      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue({});

      await service.consume(mockConsumeRequest);

      expect(mockQueryRunner.manager!.create).toHaveBeenCalledWith(
        PointTransaction,
        expect.objectContaining({
          teamId: mockTeamId,
          userId: mockUserId,
          type: PointTransactionType.CONSUMPTION,
          amount: -10.5, // 消耗记录为负数
          description: '使用AI工具消耗积分',
        }),
      );
    });

    it('数据库错误时应该回滚事务', async () => {
      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.consume(mockConsumeRequest)).rejects.toThrow(
        'Database error',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('recharge', () => {
    const mockTeamId = 'test-team-id-123';
    const mockUserId = 'user-1';

    const mockRechargeRequest: RechargePointsRequest = {
      teamId: mockTeamId,
      userId: mockUserId,
      amount: 100.5,
      description: '通过支付订单充值积分',
      businessId: 'order-1',
      businessType: 'payment',
    };

    const mockTeamPoint = {
      id: 'point-1',
      teamId: mockTeamId,
      balance: 1000,
      status: PointStatus.ACTIVE,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
    };

    let mockQueryRunner: Partial<QueryRunner>;

    beforeEach(() => {
      mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn(),
          save: jest.fn(),
          create: jest.fn(),
        } as never,
      };

      mockTeamPointRepository.manager.connection.createQueryRunner.mockReturnValue(
        mockQueryRunner,
      );
    });

    it('应该成功充值积分', async () => {
      const savedTransaction = {
        id: 'tx-1',
        teamId: mockTeamId,
        userId: mockUserId,
        type: PointTransactionType.RECHARGE,
        amount: 100.5,
        balanceAfter: 1100.5,
        description: '通过支付订单充值积分',
        businessId: 'order-1',
        businessType: 'payment',
        createdAt: new Date('2024-01-15T10:30:00Z'),
      };

      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue(
        savedTransaction,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        savedTransaction,
      );

      const result = await service.recharge(mockRechargeRequest);

      expect(result.newBalance).toBe(1100.5);
      expect(result.transaction.amount).toBe(100.5);
      expect(result.transaction.type).toBe(PointTransactionType.RECHARGE);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('团队无积分记录时应该自动创建', async () => {
      const createdTeamPoint = {
        id: 'point-new',
        teamId: mockTeamId,
        balance: 0,
        status: PointStatus.ACTIVE,
      };

      const savedTeamPoint = {
        id: 'point-new',
        teamId: mockTeamId,
        balance: 100.5,
        status: PointStatus.ACTIVE,
        updatedAt: new Date('2024-01-15'),
      };

      const createdTransaction = {
        id: 'tx-1',
        teamId: mockTeamId,
        userId: mockUserId,
        type: PointTransactionType.RECHARGE,
        amount: 100.5,
        balanceAfter: 100.5,
        description: '通过支付订单充值积分',
        businessId: 'order-1',
        businessType: 'payment',
      };

      const savedTransaction = {
        ...createdTransaction,
        createdAt: new Date('2024-01-15T10:30:00Z'),
      };

      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(null);

      const createMock = mockQueryRunner.manager!.create as jest.Mock;
      createMock.mockReturnValueOnce(createdTeamPoint);
      createMock.mockReturnValueOnce(createdTransaction);

      // recharge 方法会调用 save 3 次：
      // 1. 保存新创建的 TeamPoint
      // 2. 更新 TeamPoint 的余额
      // 3. 保存交易记录
      const saveMock = mockQueryRunner.manager!.save as jest.Mock;
      saveMock.mockResolvedValueOnce(savedTeamPoint); // 第一次保存 TeamPoint
      saveMock.mockResolvedValueOnce(savedTeamPoint); // 第二次更新 TeamPoint 余额
      saveMock.mockResolvedValueOnce(savedTransaction); // 第三次保存交易记录

      const result = await service.recharge(mockRechargeRequest);

      expect(result.newBalance).toBe(100.5);
      expect(mockQueryRunner.manager!.create).toHaveBeenCalledWith(
        TeamPoint,
        expect.objectContaining({
          teamId: mockTeamId,
          balance: 0,
          status: PointStatus.ACTIVE,
        }),
      );
    });

    it('应该创建正数金额的交易记录', async () => {
      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.create as jest.Mock).mockReturnValue({});

      await service.recharge(mockRechargeRequest);

      expect(mockQueryRunner.manager!.create).toHaveBeenCalledWith(
        PointTransaction,
        expect.objectContaining({
          teamId: mockTeamId,
          userId: mockUserId,
          type: PointTransactionType.RECHARGE,
          amount: 100.5, // 充值记录为正数
          description: '通过支付订单充值积分',
        }),
      );
    });

    it('数据库错误时应该回滚事务', async () => {
      (mockQueryRunner.manager!.findOne as jest.Mock).mockResolvedValue(
        mockTeamPoint,
      );
      (mockQueryRunner.manager!.save as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.recharge(mockRechargeRequest)).rejects.toThrow(
        'Database error',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('createInitialBalance', () => {
    const mockTeamId = 'test-team-id-123';
    const mockUserId = 'user-1';

    it('应该成功创建初始积分记录', async () => {
      const newTeamPoint = {
        id: 'point-1',
        teamId: mockTeamId,
        balance: 0,
        status: PointStatus.ACTIVE,
        createdAt: new Date('2024-01-01'),
      };

      mockTeamPointRepository.findOne.mockResolvedValue(null);
      mockTeamPointRepository.create.mockReturnValue(newTeamPoint);
      mockTeamPointRepository.save.mockResolvedValue(newTeamPoint);

      const result = await service.createInitialBalance(mockTeamId);

      expect(result).toEqual(newTeamPoint);
      expect(mockTeamPointRepository.create).toHaveBeenCalledWith({
        teamId: mockTeamId,
        balance: 0,
        status: PointStatus.ACTIVE,
      });
      expect(mockTeamPointRepository.save).toHaveBeenCalledWith(newTeamPoint);
    });

    it('已存在积分记录时应该直接返回', async () => {
      const existingTeamPoint = {
        id: 'point-1',
        teamId: mockTeamId,
        balance: 500,
        status: PointStatus.ACTIVE,
      };

      mockTeamPointRepository.findOne.mockResolvedValue(existingTeamPoint);

      const result = await service.createInitialBalance(mockTeamId);

      expect(result).toEqual(existingTeamPoint);
      expect(mockTeamPointRepository.create).not.toHaveBeenCalled();
      expect(mockTeamPointRepository.save).not.toHaveBeenCalled();
    });

    it('有初始积分时应该创建交易记录', async () => {
      const newTeamPoint = {
        id: 'point-1',
        teamId: mockTeamId,
        balance: 100,
        status: PointStatus.ACTIVE,
      };

      const transaction = {
        id: 'tx-1',
        teamId: mockTeamId,
        userId: mockUserId,
        type: PointTransactionType.INITIAL_GRANT,
        amount: 100,
        balanceAfter: 100,
        description: '团队初始积分发放',
      };

      mockTeamPointRepository.findOne.mockResolvedValue(null);
      mockTeamPointRepository.create.mockReturnValue(newTeamPoint);
      mockTeamPointRepository.save.mockResolvedValue(newTeamPoint);
      mockPointTransactionRepository.create.mockReturnValue(transaction);
      mockPointTransactionRepository.save.mockResolvedValue(transaction);

      await service.createInitialBalance(mockTeamId, 100, mockUserId);

      expect(mockPointTransactionRepository.create).toHaveBeenCalledWith({
        teamId: mockTeamId,
        userId: mockUserId,
        type: PointTransactionType.INITIAL_GRANT,
        amount: 100,
        balanceAfter: 100,
        description: '团队初始积分发放',
      });
      expect(mockPointTransactionRepository.save).toHaveBeenCalled();
    });

    it('初始积分为0时不应该创建交易记录', async () => {
      const newTeamPoint = {
        id: 'point-1',
        teamId: mockTeamId,
        balance: 0,
        status: PointStatus.ACTIVE,
      };

      mockTeamPointRepository.findOne.mockResolvedValue(null);
      mockTeamPointRepository.create.mockReturnValue(newTeamPoint);
      mockTeamPointRepository.save.mockResolvedValue(newTeamPoint);

      await service.createInitialBalance(mockTeamId, 0, mockUserId);

      expect(mockPointTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockPointTransactionRepository.save).not.toHaveBeenCalled();
    });
  });
});
