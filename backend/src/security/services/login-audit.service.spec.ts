import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAuditService } from './login-audit.service';
import { UserLoginLog } from '../../database/entities/user/user-login-log.entity';
import { User } from '../../database/entities/user/user.entity';
import { LoginLogQueryParams, LoginAnomalyType } from '@xiaodashi/shared';

describe('LoginAuditService', () => {
  let service: LoginAuditService;
  let userLoginLogRepository: Repository<UserLoginLog>;
  let userRepository: Repository<User>;

  // Mock数据
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hash',
    role: 'user' as const,
    status: 'active' as const,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    loginAttempts: 0,
  } as User;

  const createMockLoginLog = (
    overrides?: Partial<UserLoginLog>,
  ): UserLoginLog =>
    ({
      id: 'log-123',
      userId: 'user-123',
      email: 'test@example.com',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      location: 'Beijing, China',
      success: true,
      failureReason: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    }) as UserLoginLog;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAuditService,
        {
          provide: getRepositoryToken(UserLoginLog),
          useValue: {
            findAndCount: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoginAuditService>(LoginAuditService);
    userLoginLogRepository = module.get<Repository<UserLoginLog>>(
      getRepositoryToken(UserLoginLog),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('queryLoginLogs', () => {
    it('应该成功查询登录日志并返回分页结果', async () => {
      const mockLogs = [
        createMockLoginLog({ id: 'log-1' }),
        createMockLoginLog({ id: 'log-2' }),
      ];
      const params: LoginLogQueryParams = {
        page: 1,
        pageSize: 20,
      };

      jest
        .spyOn(userLoginLogRepository, 'findAndCount')
        .mockResolvedValue([mockLogs, 2]);

      const result = await service.queryLoginLogs(params);

      expect(result).toEqual({
        logs: expect.arrayContaining([
          expect.objectContaining({ id: 'log-1' }),
          expect.objectContaining({ id: 'log-2' }),
        ]),
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(userLoginLogRepository.findAndCount).toHaveBeenCalled();
    });

    it('应该根据userId筛选日志', async () => {
      const mockLogs = [createMockLoginLog()];
      const params: LoginLogQueryParams = {
        userId: 'user-123',
        page: 1,
        pageSize: 20,
      };

      jest
        .spyOn(userLoginLogRepository, 'findAndCount')
        .mockResolvedValue([mockLogs, 1]);

      const result = await service.queryLoginLogs(params);

      expect(result.logs).toHaveLength(1);
      expect(userLoginLogRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-123' }),
        }),
      );
    });

    it('应该根据success状态筛选日志', async () => {
      const mockLogs = [createMockLoginLog({ success: false })];
      const params: LoginLogQueryParams = {
        success: false,
        page: 1,
        pageSize: 20,
      };

      jest
        .spyOn(userLoginLogRepository, 'findAndCount')
        .mockResolvedValue([mockLogs, 1]);

      const result = await service.queryLoginLogs(params);

      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].success).toBe(false);
    });

    it('应该限制每页最大数量为100', async () => {
      const params: LoginLogQueryParams = {
        page: 1,
        pageSize: 200, // 超过最大限制
      };

      jest
        .spyOn(userLoginLogRepository, 'findAndCount')
        .mockResolvedValue([[], 0]);

      const result = await service.queryLoginLogs(params);

      expect(result.pageSize).toBe(100);
      expect(userLoginLogRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        }),
      );
    });

    it('应该正确计算分页skip值', async () => {
      const params: LoginLogQueryParams = {
        page: 3,
        pageSize: 20,
      };

      jest
        .spyOn(userLoginLogRepository, 'findAndCount')
        .mockResolvedValue([[], 0]);

      await service.queryLoginLogs(params);

      expect(userLoginLogRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40, // (3-1) * 20
        }),
      );
    });

    it('应该支持日期范围筛选', async () => {
      const params: LoginLogQueryParams = {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-01-31T23:59:59Z',
        page: 1,
        pageSize: 20,
      };

      jest
        .spyOn(userLoginLogRepository, 'findAndCount')
        .mockResolvedValue([[], 0]);

      await service.queryLoginLogs(params);

      expect(userLoginLogRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('analyzeLoginPatterns', () => {
    it('应该成功分析用户登录模式', async () => {
      const mockLogs = Array.from({ length: 10 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // 过去10天
          ipAddress: i % 3 === 0 ? '192.168.1.1' : '192.168.1.2',
        }),
      );

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.analyzeLoginPatterns('user-123');

      expect(result.pattern).toBeDefined();
      expect(result.pattern.userId).toBe('user-123');
      expect(result.pattern.email).toBe('test@example.com');
      expect(result.pattern.analysisData).toBeDefined();
      expect(result.pattern.analysisData.commonIPs).toBeDefined();
      expect(result.pattern.analysisData.commonLoginHours).toBeDefined();
      expect(result.pattern.riskAssessment).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('应该在用户不存在时抛出错误', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.analyzeLoginPatterns('nonexistent-user'),
      ).rejects.toThrow('用户 nonexistent-user 不存在');
    });

    it('应该正确识别常用IP地址', async () => {
      const mockLogs = [
        createMockLoginLog({ ipAddress: '192.168.1.1' }),
        createMockLoginLog({ ipAddress: '192.168.1.1' }),
        createMockLoginLog({ ipAddress: '192.168.1.1' }),
        createMockLoginLog({ ipAddress: '192.168.1.2' }),
      ];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.analyzeLoginPatterns('user-123');

      expect(result.pattern.analysisData.commonIPs).toContain('192.168.1.1');
      expect(result.pattern.analysisData.commonIPs[0]).toBe('192.168.1.1');
    });

    it('应该正确计算平均登录频率', async () => {
      const mockLogs = Array.from({ length: 45 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        }),
      );

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.analyzeLoginPatterns('user-123');

      // 45次登录 / 90天 = 0.5次/天
      expect(result.pattern.analysisData.averageLoginFrequency).toBe(0.5);
    });

    it('应该正确评估风险等级', async () => {
      // 创建一些正常的登录记录
      const normalLogs = Array.from({ length: 10 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          ipAddress: '192.168.1.1', // 相同IP
          success: true,
        }),
      );

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(normalLogs);

      const result = await service.analyzeLoginPatterns('user-123');

      expect(result.pattern.riskAssessment.riskLevel).toBe('low');
      expect(result.pattern.riskAssessment.overallRiskScore).toBeLessThan(25);
    });
  });

  describe('detectAnomalies', () => {
    it('应该检测IP变更异常', async () => {
      const now = new Date();
      const mockLogs = Array.from({ length: 5 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          userId: 'user-123',
          ipAddress: `192.168.1.${i + 1}`, // 5个不同IP
          createdAt: new Date(now.getTime() - i * 60 * 60 * 1000), // 过去5小时
        }),
      );

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.detectAnomalies();

      expect(result.anomalies.length).toBeGreaterThan(0);
      const ipChangeAnomaly = result.anomalies.find(
        (a) => a.type === LoginAnomalyType.IP_CHANGE,
      );
      expect(ipChangeAnomaly).toBeDefined();
      expect(ipChangeAnomaly?.severity).toBe('high');
    });

    it('应该检测高频登录异常', async () => {
      const now = new Date();
      const mockLogs = Array.from({ length: 15 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          userId: 'user-123',
          createdAt: new Date(now.getTime() - i * 10 * 1000), // 过去2.5分钟内15次登录
        }),
      );

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.detectAnomalies();

      expect(result.anomalies.length).toBeGreaterThan(0);
      const highFreqAnomaly = result.anomalies.find(
        (a) => a.type === LoginAnomalyType.HIGH_FREQUENCY,
      );
      expect(highFreqAnomaly).toBeDefined();
      expect(highFreqAnomaly?.severity).toBe('high');
    });

    it('应该检测暴力破解异常', async () => {
      const now = new Date();
      const mockLogs = [
        ...Array.from({ length: 8 }, (_, i) =>
          createMockLoginLog({
            id: `fail-${i}`,
            userId: 'user-123',
            success: false,
            createdAt: new Date(now.getTime() - (8 - i) * 30 * 1000), // 失败登录
          }),
        ),
        createMockLoginLog({
          id: 'success-1',
          userId: 'user-123',
          success: true,
          createdAt: now, // 最后成功
        }),
      ];

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.detectAnomalies();

      expect(result.anomalies.length).toBeGreaterThan(0);
      const bruteForceAnomaly = result.anomalies.find(
        (a) => a.type === LoginAnomalyType.BRUTE_FORCE,
      );
      expect(bruteForceAnomaly).toBeDefined();
      expect(bruteForceAnomaly?.severity).toBe('critical');
    });

    it('应该检测异常时间登录', async () => {
      const mockLogs = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setHours(3, 0, 0, 0); // 凌晨3点
        return createMockLoginLog({
          id: `log-${i}`,
          userId: 'user-123',
          createdAt: new Date(date.getTime() - i * 24 * 60 * 60 * 1000),
        });
      });

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.detectAnomalies();

      expect(result.anomalies.length).toBeGreaterThan(0);
      const timeAnomaly = result.anomalies.find(
        (a) => a.type === LoginAnomalyType.TIME_ANOMALY,
      );
      expect(timeAnomaly).toBeDefined();
      expect(timeAnomaly?.severity).toBe('medium');
    });

    it('应该正确统计异常数量', async () => {
      const now = new Date();
      const mockLogs = [
        // IP变更异常
        ...Array.from({ length: 5 }, (_, i) =>
          createMockLoginLog({
            id: `log-${i}`,
            userId: 'user-123',
            ipAddress: `192.168.1.${i + 1}`,
            createdAt: new Date(now.getTime() - i * 60 * 60 * 1000),
          }),
        ),
      ];

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.detectAnomalies();

      expect(result.total).toBeGreaterThan(0);
      expect(result.total).toBe(result.anomalies.length);
      expect(
        result.highCount +
          result.mediumCount +
          result.lowCount +
          result.criticalCount,
      ).toBe(result.total);
    });

    it('应该能够筛选特定用户的异常', async () => {
      const mockLogs = [
        createMockLoginLog({ id: 'log-1', userId: 'user-123' }),
        createMockLoginLog({ id: 'log-2', userId: 'user-456' }),
      ];

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      await service.detectAnomalies('user-123');

      expect(userLoginLogRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-123',
          }),
        }),
      );
    });

    it('应该在没有异常时返回空数组', async () => {
      const normalLogs = [
        createMockLoginLog({ id: 'log-1', ipAddress: '192.168.1.1' }),
        createMockLoginLog({ id: 'log-2', ipAddress: '192.168.1.1' }),
      ];

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(normalLogs);

      const result = await service.detectAnomalies();

      expect(result.anomalies).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.criticalCount).toBe(0);
      expect(result.highCount).toBe(0);
    });
  });

  describe('generateSecurityReport', () => {
    it('应该成功生成安全审计报告', async () => {
      const mockLogs = Array.from({ length: 50 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          success: i % 5 !== 0, // 20%失败率
          failureReason: i % 5 === 0 ? '密码错误' : undefined,
        }),
      );

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.generateSecurityReport(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z',
      );

      expect(result.summary).toBeDefined();
      expect(result.summary.totalLogs).toBe(50);
      expect(result.statistics).toBeDefined();
      expect(result.anomalies).toBeDefined();
      expect(result.topRiskUsers).toBeDefined();
      expect(result.topRiskIPs).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('应该正确计算统计信息', async () => {
      const mockLogs = [
        ...Array.from({ length: 80 }, (_, i) =>
          createMockLoginLog({
            id: `success-${i}`,
            success: true,
          }),
        ),
        ...Array.from({ length: 20 }, (_, i) =>
          createMockLoginLog({
            id: `fail-${i}`,
            success: false,
            failureReason: '密码错误',
          }),
        ),
      ];

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.generateSecurityReport(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z',
      );

      expect(result.statistics.totalAttempts).toBe(100);
      expect(result.statistics.successfulLogins).toBe(80);
      expect(result.statistics.failedLogins).toBe(20);
      expect(result.statistics.successRate).toBe(80);
    });

    it('应该正确识别高风险用户', async () => {
      const now = new Date();
      // 创建一个有异常行为的用户
      const riskUserLogs = Array.from({ length: 5 }, (_, i) =>
        createMockLoginLog({
          id: `risk-${i}`,
          userId: 'risk-user',
          email: 'risk@example.com',
          ipAddress: `192.168.1.${i + 1}`, // 多个不同IP
          createdAt: new Date(now.getTime() - i * 60 * 60 * 1000),
        }),
      );

      // 创建一个正常用户
      const normalUserLogs = Array.from({ length: 3 }, (_, i) =>
        createMockLoginLog({
          id: `normal-${i}`,
          userId: 'normal-user',
          email: 'normal@example.com',
          ipAddress: '192.168.1.1', // 同一IP
        }),
      );

      jest
        .spyOn(userLoginLogRepository, 'find')
        .mockResolvedValue([...riskUserLogs, ...normalUserLogs]);

      const result = await service.generateSecurityReport(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z',
      );

      expect(result.topRiskUsers.length).toBeGreaterThan(0);
      const riskUser = result.topRiskUsers.find(
        (u) => u.userId === 'risk-user',
      );
      expect(riskUser).toBeDefined();
      expect(riskUser?.riskScore).toBeGreaterThan(0);
    });

    it('应该正确识别高风险IP', async () => {
      const mockLogs = [
        // 高失败率IP
        ...Array.from({ length: 8 }, (_, i) =>
          createMockLoginLog({
            id: `risk-ip-${i}`,
            ipAddress: '192.168.1.100',
            success: false,
          }),
        ),
        ...Array.from({ length: 2 }, (_, i) =>
          createMockLoginLog({
            id: `risk-ip-success-${i}`,
            ipAddress: '192.168.1.100',
            success: true,
          }),
        ),
        // 正常IP
        ...Array.from({ length: 10 }, (_, i) =>
          createMockLoginLog({
            id: `normal-ip-${i}`,
            ipAddress: '192.168.1.1',
            success: true,
          }),
        ),
      ];

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.generateSecurityReport(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z',
      );

      expect(result.topRiskIPs.length).toBeGreaterThan(0);
      const riskIP = result.topRiskIPs.find(
        (ip) => ip.ipAddress === '192.168.1.100',
      );
      expect(riskIP).toBeDefined();
      expect(riskIP?.riskScore).toBeGreaterThan(0);
      expect(riskIP?.failureCount).toBe(8);
    });

    it('应该生成合适的安全建议', async () => {
      // 低成功率的登录日志
      const mockLogs = Array.from({ length: 100 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          success: i < 60, // 60%成功率
        }),
      );

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.generateSecurityReport(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z',
      );

      expect(result.recommendations.length).toBeGreaterThan(0);
      const lowSuccessRateWarning = result.recommendations.some((r) =>
        r.includes('成功率较低'),
      );
      expect(lowSuccessRateWarning).toBe(true);
    });

    it('应该在安全状态良好时给出正面建议', async () => {
      const mockLogs = Array.from({ length: 50 }, (_, i) =>
        createMockLoginLog({
          id: `log-${i}`,
          success: true, // 全部成功
          ipAddress: '192.168.1.1', // 同一IP
        }),
      );

      jest.spyOn(userLoginLogRepository, 'find').mockResolvedValue(mockLogs);

      const result = await service.generateSecurityReport(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z',
      );

      expect(result.recommendations.length).toBeGreaterThan(0);
      const positiveRecommendation = result.recommendations.some(
        (r) => r.includes('良好') || r.includes('保持'),
      );
      expect(positiveRecommendation).toBe(true);
    });
  });
});
