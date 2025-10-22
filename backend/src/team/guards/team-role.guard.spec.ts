import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  TeamRoleGuard,
  // TeamRoles, // 用于装饰器测试
  // RequireTeamMembership, // 用于装饰器测试
} from './team-role.guard';
import { TeamRoleType, AuthenticatedUser } from '@xiaodashi/shared';
import type { Repository } from 'typeorm';
import { TeamMember } from '../../database/entities/team/team-member.entity';

describe('TeamRoleGuard', () => {
  let guard: TeamRoleGuard;
  // let reflector: Reflector; // 从测试模块中获取
  let teamMemberRepository: jest.Mocked<Repository<TeamMember>>;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockTeamMemberRepository = {
    findOne: jest.fn(),
  };

  const mockUser: AuthenticatedUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    name: '测试用户',
    role: 'user',
  };

  const mockTeamMember = {
    id: 'member-123',
    teamId: 'team-123',
    userId: mockUser.id,
    role: TeamRoleType.MEMBER,
    displayName: '测试用户',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamRoleGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: getRepositoryToken(TeamMember),
          useValue: mockTeamMemberRepository,
        },
      ],
    }).compile();

    guard = module.get<TeamRoleGuard>(TeamRoleGuard);
    reflector = module.get<Reflector>(Reflector);
    teamMemberRepository = module.get(getRepositoryToken(TeamMember));

    // 清除所有 mock 调用记录
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('基本权限检查', () => {
    it('没有权限要求时应该直接通过', async () => {
      // Mock没有权限要求
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(teamMemberRepository.findOne).not.toHaveBeenCalled();
    });

    it('只需要成员身份时，用户是团队成员应该通过', async () => {
      // Mock只需要成员身份
      mockReflector.getAllAndOverride.mockImplementation((key) => {
        if (key === 'teamRoles') {
          return undefined; // 没有角色要求
        } else if (key === 'requireTeamMembership') {
          return true; // 需要成员身份
        }
        return undefined;
      });

      teamMemberRepository.findOne.mockResolvedValue(mockTeamMember);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(teamMemberRepository.findOne).toHaveBeenCalledWith({
        where: { teamId: 'team-123', userId: mockUser.id },
      });
    });

    it('只需要成员身份时，用户不是团队成员应该拒绝', async () => {
      // Mock只需要成员身份
      mockReflector.getAllAndOverride.mockImplementation((key) => {
        if (key === 'teamRoles') {
          return undefined; // 没有角色要求
        } else if (key === 'requireTeamMembership') {
          return true; // 需要成员身份
        }
        return undefined;
      });

      teamMemberRepository.findOne.mockResolvedValue(null);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        '您不是该团队的成员',
      );
    });
  });

  describe('角色权限检查', () => {
    it('用户具有所需角色应该通过', async () => {
      // Mock需要ADMIN或OWNER角色
      mockReflector.getAllAndOverride.mockReturnValue([
        TeamRoleType.ADMIN,
        TeamRoleType.OWNER,
      ]);

      const mockAdminMember = {
        ...mockTeamMember,
        role: TeamRoleType.ADMIN,
      };

      teamMemberRepository.findOne.mockResolvedValue(mockAdminMember);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('用户不具有所需角色应该拒绝', async () => {
      // Mock需要ADMIN或OWNER角色
      mockReflector.getAllAndOverride.mockReturnValue([
        TeamRoleType.ADMIN,
        TeamRoleType.OWNER,
      ]);

      // 用户只有MEMBER角色
      teamMemberRepository.findOne.mockResolvedValue(mockTeamMember);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        '您的角色权限不足，需要以下角色之一: admin, owner',
      );
    });

    it('OWNER应该能访问OWNER专属功能', async () => {
      // Mock需要OWNER角色
      mockReflector.getAllAndOverride.mockReturnValue([TeamRoleType.OWNER]);

      const mockOwnerMember = {
        ...mockTeamMember,
        role: TeamRoleType.OWNER,
      };

      teamMemberRepository.findOne.mockResolvedValue(mockOwnerMember);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('MEMBER不能访问OWNER专属功能', async () => {
      // Mock需要OWNER角色
      mockReflector.getAllAndOverride.mockReturnValue([TeamRoleType.OWNER]);

      teamMemberRepository.findOne.mockResolvedValue(mockTeamMember);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('边界情况处理', () => {
    it('请求中缺少用户信息应该拒绝', async () => {
      const mockExecutionContext = createMockExecutionContext('team-123', null);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        '用户认证信息缺失',
      );
    });

    it('请求中缺少团队ID应该拒绝', async () => {
      const mockExecutionContext = createMockExecutionContext(null, mockUser);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        '团队ID缺失',
      );
    });

    it('查询团队成员失败应该抛出错误', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([TeamRoleType.MEMBER]);

      const error = new Error('Database error');
      teamMemberRepository.findOne.mockRejectedValue(error);

      const mockExecutionContext = createMockExecutionContext(
        'team-123',
        mockUser,
      );

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        error,
      );
    });
  });

  describe('装饰器元数据解析', () => {
    it('应该正确处理@TeamRoles装饰器', async () => {
      // 模拟装饰器设置的元数据
      mockReflector.getAllAndOverride.mockImplementation((key) => {
        if (key === 'teamRoles') {
          return [TeamRoleType.ADMIN, TeamRoleType.OWNER];
        }
        return undefined;
      });

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: mockUser,
            params: { teamId: 'team-123' },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      };

      teamMemberRepository.findOne.mockResolvedValue({
        ...mockTeamMember,
        role: TeamRoleType.ADMIN,
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        'teamRoles',
        [expect.anything(), expect.anything()],
      );
    });

    it('应该正确处理@RequireTeamMembership装饰器', async () => {
      // 模拟装饰器设置的元数据
      mockReflector.getAllAndOverride.mockImplementation((key) => {
        if (key === 'requireTeamMembership') {
          return true;
        }
        return undefined;
      });

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: mockUser,
            params: { teamId: 'team-123' },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      };

      teamMemberRepository.findOne.mockResolvedValue(mockTeamMember);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        'requireTeamMembership',
        [expect.anything(), expect.anything()],
      );
    });
  });

  // 辅助函数：创建模拟的ExecutionContext
  function createMockExecutionContext(
    teamId: string | null,
    user: AuthenticatedUser | null,
  ) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params: teamId ? { teamId } : {},
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
  }
});
