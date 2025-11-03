import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthenticatedUser,
  PointTransactionType,
  PointStatus,
} from '@xiaodashi/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamRoleGuard } from '../team/guards/team-role.guard';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

describe('PointsController', () => {
  let controller: PointsController;
  let pointsService: PointsService;

  // Mock service
  const mockPointsService = {
    getBalance: jest.fn(),
    getHistory: jest.fn(),
    recharge: jest.fn(),
  };

  // Mock user
  const mockUser: AuthenticatedUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    name: '测试用户',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [
        {
          provide: PointsService,
          useValue: mockPointsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TeamRoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PointsController>(PointsController);
    pointsService = module.get<PointsService>(PointsService);

    // 清除所有 mock 调用记录
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTeamPoints', () => {
    const mockTeamId = 'team-123';
    const mockBalanceResponse = {
      teamId: mockTeamId,
      balance: 1000.5,
      status: PointStatus.ACTIVE,
      expiresAt: '2024-12-31T23:59:59Z',
      lastTransactionAt: '2024-01-15T10:30:00Z',
    };

    beforeEach(() => {
      mockPointsService.getBalance.mockResolvedValue(mockBalanceResponse);
    });

    it('应该成功获取团队积分余额', async () => {
      const result = await controller.getTeamPoints(mockTeamId);

      expect(result).toEqual(mockBalanceResponse);
      expect(mockPointsService.getBalance).toHaveBeenCalledWith(mockTeamId);
    });

    it('应该正确调用 service.getBalance()', async () => {
      await controller.getTeamPoints(mockTeamId);

      expect(mockPointsService.getBalance).toHaveBeenCalledTimes(1);
      expect(mockPointsService.getBalance).toHaveBeenCalledWith(mockTeamId);
    });
  });

  describe('getTeamPointsHistory', () => {
    const mockTeamId = 'team-123';
    const mockHistoryResponse = {
      transactions: [
        {
          id: 'tx-1',
          teamId: mockTeamId,
          userId: 'user-1',
          type: PointTransactionType.CONSUMPTION,
          amount: -10.5,
          balanceAfter: 990.0,
          description: '使用AI工具消耗积分',
          businessId: 'business-1',
          businessType: 'tool_usage',
          createdAt: '2024-01-15T10:30:00Z',
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
          createdAt: '2024-01-14T08:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      },
    };

    beforeEach(() => {
      mockPointsService.getHistory.mockResolvedValue(mockHistoryResponse);
    });

    it('应该成功获取交易历史', async () => {
      const query = {
        page: 1,
        limit: 20,
      };

      const result = await controller.getTeamPointsHistory(mockTeamId, query);

      expect(result).toEqual(mockHistoryResponse);
      expect(mockPointsService.getHistory).toHaveBeenCalledWith(mockTeamId, {
        page: 1,
        limit: 20,
        type: undefined,
        startDate: undefined,
        endDate: undefined,
        businessType: undefined,
      });
    });

    it('应该正确传递所有查询参数', async () => {
      const query = {
        page: 2,
        limit: 10,
        type: PointTransactionType.CONSUMPTION,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        businessType: 'tool_usage',
      };

      await controller.getTeamPointsHistory(mockTeamId, query);

      expect(mockPointsService.getHistory).toHaveBeenCalledWith(mockTeamId, {
        page: 2,
        limit: 10,
        type: PointTransactionType.CONSUMPTION,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        businessType: 'tool_usage',
      });
    });

    it('应该使用默认分页参数', async () => {
      const query = {};

      await controller.getTeamPointsHistory(mockTeamId, query);

      expect(mockPointsService.getHistory).toHaveBeenCalledWith(mockTeamId, {
        page: undefined,
        limit: undefined,
        type: undefined,
        startDate: undefined,
        endDate: undefined,
        businessType: undefined,
      });
    });
  });

  describe('rechargePoints', () => {
    const mockRechargeDto = {
      teamId: 'team-123',
      userId: 'user-1',
      amount: 100.5,
      description: '通过支付订单充值积分',
      businessId: 'order-1',
      businessType: 'payment',
    };

    const mockRechargeResponse = {
      transaction: {
        id: 'tx-1',
        teamId: 'team-123',
        userId: 'user-1',
        type: PointTransactionType.RECHARGE,
        amount: 100.5,
        balanceAfter: 1100.5,
        description: '通过支付订单充值积分',
        businessId: 'order-1',
        businessType: 'payment',
        createdAt: '2024-01-15T10:30:00Z',
      },
      newBalance: 1100.5,
    };

    beforeEach(() => {
      mockPointsService.recharge.mockResolvedValue(mockRechargeResponse);
    });

    it('应该成功充值积分', async () => {
      const mockRequest = {
        user: mockUser,
        params: {},
      };

      const result = await controller.rechargePoints(
        mockRechargeDto,
        mockRequest,
      );

      expect(result).toEqual(mockRechargeResponse);
      expect(mockPointsService.recharge).toHaveBeenCalledWith(
        expect.objectContaining({
          teamId: 'team-123',
          userId: 'user-1',
          amount: 100.5,
          description: '通过支付订单充值积分',
          businessId: 'order-1',
          businessType: 'payment',
        }),
      );
    });

    it('应该使用请求体中的userId', async () => {
      const mockRequest = {
        user: mockUser,
        params: {},
      };

      await controller.rechargePoints(mockRechargeDto, mockRequest);

      expect(mockPointsService.recharge).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
        }),
      );
    });

    it('userId为空时应该使用当前登录用户ID', async () => {
      const dtoWithoutUserId = {
        ...mockRechargeDto,
        userId: undefined as never,
      };

      const mockRequest = {
        user: mockUser,
        params: {},
      };

      await controller.rechargePoints(dtoWithoutUserId, mockRequest);

      expect(mockPointsService.recharge).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
        }),
      );
    });

    it('businessType为空时应该使用默认值payment', async () => {
      const dtoWithoutBusinessType = {
        ...mockRechargeDto,
        businessType: undefined,
      };

      const mockRequest = {
        user: mockUser,
        params: {},
      };

      await controller.rechargePoints(dtoWithoutBusinessType, mockRequest);

      expect(mockPointsService.recharge).toHaveBeenCalledWith(
        expect.objectContaining({
          businessType: 'payment',
        }),
      );
    });
  });
});
