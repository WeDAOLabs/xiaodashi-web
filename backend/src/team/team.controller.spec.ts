import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm'; // 仅用于测试模块配置
// import { ConfigService } from '@nestjs/config'; // 仅用于测试模块配置
import { AuthenticatedUser, TeamRoleType, TeamTier } from '@xiaodashi/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamRoleGuard } from './guards/team-role.guard';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
// import type { Repository } from 'typeorm'; // 仅用于类型定义
// import { Team } from '../database/entities/team/team.entity'; // 仅用于类型定义
// import { TeamMember } from '../database/entities/team/team-member.entity'; // 仅用于类型定义
// import { TeamInvitation } from '../database/entities/team/team-invitation.entity'; // 仅用于类型定义
// import { User } from '../database/entities/user/user.entity'; // 仅用于类型定义

describe('TeamController', () => {
  let controller: TeamController;
  let teamService: TeamService;

  // Mock service
  const mockTeamService = {
    getUserTeams: jest.fn(),
    getTeamDetail: jest.fn(),
    updateTeam: jest.fn(),
    getTeamMembers: jest.fn(),
    removeTeamMember: jest.fn(),
    createTeamInvitation: jest.fn(),
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
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TeamRoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);

    // 清除所有 mock 调用记录
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserTeams', () => {
    const mockTeamsResponse = {
      teams: [
        {
          id: 'team-1',
          name: '开发团队',
          tier: TeamTier.PRO,
          memberCount: 5,
          ownerName: '张三',
          createdAt: '2024-01-01T00:00:00Z',
          userRole: TeamRoleType.ADMIN,
        },
        {
          id: 'team-2',
          name: '产品团队',
          tier: TeamTier.FREE,
          memberCount: 3,
          ownerName: '李四',
          createdAt: '2024-01-02T00:00:00Z',
          userRole: TeamRoleType.MEMBER,
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
      mockTeamService.getUserTeams.mockResolvedValue(mockTeamsResponse);
    });

    it('应该成功获取用户团队列表', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const result = await controller.getUserTeams(mockRequest, {
        page: 1,
        limit: 20,
      });

      expect(result).toEqual(mockTeamsResponse);
      expect(mockTeamService.getUserTeams).toHaveBeenCalledWith(mockUser.id, {
        page: 1,
        limit: 20,
      });
    });

    it('应该使用默认分页参数', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      await controller.getUserTeams(mockRequest, {});

      expect(mockTeamService.getUserTeams).toHaveBeenCalledWith(mockUser.id, {
        page: 1,
        limit: 20,
      });
    });

    it('应该传递用户ID给service', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      await controller.getUserTeams(mockRequest, { page: 2, limit: 10 });

      expect(mockTeamService.getUserTeams).toHaveBeenCalledWith(mockUser.id, {
        page: 2,
        limit: 10,
      });
    });
  });

  describe('getTeamDetail', () => {
    const mockTeamId = 'team-123';
    const mockTeamDetail = {
      id: mockTeamId,
      name: '开发团队',
      tier: TeamTier.PRO,
      ownerId: 'owner-123',
      memberCount: 5,
      owner: {
        id: 'owner-123',
        email: 'owner@example.com',
        name: '张三',
        avatar: 'avatar.jpg',
      },
      pendingInvitations: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      mockTeamService.getTeamDetail.mockResolvedValue(mockTeamDetail);
    });

    it('应该成功获取团队详情', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const result = await controller.getTeamDetail(mockTeamId, mockRequest);

      expect(result.team).toEqual(mockTeamDetail);
      expect(mockTeamService.getTeamDetail).toHaveBeenCalledWith(
        mockTeamId,
        mockUser.id,
      );
    });
  });

  describe('updateTeam', () => {
    const mockTeamId = 'team-123';
    const mockUpdateDto = {
      name: '新团队名称',
    };

    const mockUpdatedTeam = {
      id: mockTeamId,
      name: '新团队名称',
      tier: TeamTier.PRO,
      ownerId: 'owner-123',
      memberCount: 5,
      owner: {
        id: 'owner-123',
        email: 'owner@example.com',
        name: '张三',
        avatar: 'avatar.jpg',
      },
      pendingInvitations: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      mockTeamService.updateTeam.mockResolvedValue(mockUpdatedTeam);
    });

    it('应该成功更新团队信息', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const result = await controller.updateTeam(
        mockTeamId,
        mockUpdateDto,
        mockRequest,
      );

      expect(result.team).toEqual(mockUpdatedTeam);
      expect(mockTeamService.updateTeam).toHaveBeenCalledWith(
        mockTeamId,
        mockUpdateDto,
        mockUser.id,
      );
    });
  });

  describe('getTeamMembers', () => {
    const mockTeamId = 'team-123';
    const mockMembersResponse = {
      members: [
        {
          id: 'member-1',
          userId: 'user-1',
          role: TeamRoleType.OWNER,
          displayName: '张三',
          email: 'zhangsan@example.com',
          avatar: 'avatar1.jpg',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'member-2',
          userId: 'user-2',
          role: TeamRoleType.MEMBER,
          displayName: '李四',
          email: 'lisi@example.com',
          avatar: 'avatar2.jpg',
          createdAt: '2024-01-02T00:00:00Z',
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
      mockTeamService.getTeamMembers.mockResolvedValue(mockMembersResponse);
    });

    it('应该成功获取团队成员列表', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const result = await controller.getTeamMembers(
        mockTeamId,
        { page: 1, limit: 20 },
        mockRequest,
      );

      expect(result).toEqual(mockMembersResponse);
      expect(mockTeamService.getTeamMembers).toHaveBeenCalledWith(
        mockTeamId,
        mockUser.id,
        { page: 1, limit: 20 },
      );
    });

    it('应该使用默认分页参数', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      await controller.getTeamMembers(mockTeamId, {}, mockRequest);

      expect(mockTeamService.getTeamMembers).toHaveBeenCalledWith(
        mockTeamId,
        mockUser.id,
        { page: 1, limit: 20 },
      );
    });
  });

  describe('removeTeamMember', () => {
    const mockTeamId = 'team-123';
    const mockTargetUserId = 'target-user-123';
    const mockRemoveResponse = {
      removedMember: {
        id: 'member-2',
        userId: mockTargetUserId,
        role: TeamRoleType.MEMBER,
      },
    };

    beforeEach(() => {
      mockTeamService.removeTeamMember.mockResolvedValue(mockRemoveResponse);
    });

    it('应该成功移除团队成员', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const result = await controller.removeTeamMember(
        mockTeamId,
        mockTargetUserId,
        mockRequest,
      );

      expect(result).toEqual(mockRemoveResponse);
      expect(mockTeamService.removeTeamMember).toHaveBeenCalledWith(
        mockTeamId,
        mockTargetUserId,
        mockUser.id,
      );
    });
  });

  describe('createTeamInvitation', () => {
    const mockTeamId = 'team-123';
    const mockInvitationDto = {
      email: 'invitee@example.com',
      role: TeamRoleType.MEMBER,
    };

    const mockInvitation = {
      id: 'invitation-123',
      teamId: mockTeamId,
      email: 'invitee@example.com',
      role: TeamRoleType.MEMBER,
      inviterId: mockUser.id,
      status: 'pending',
      token: 'invitation-token',
      createdAt: '2024-01-01T00:00:00Z',
      expiresAt: '2024-01-08T00:00:00Z',
    };

    beforeEach(() => {
      mockTeamService.createTeamInvitation.mockResolvedValue(mockInvitation);
    });

    it('应该成功创建团队邀请', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const result = await controller.createTeamInvitation(
        mockTeamId,
        mockInvitationDto,
        mockRequest,
      );

      expect(result).toEqual({ invitation: mockInvitation });
      expect(mockTeamService.createTeamInvitation).toHaveBeenCalledWith(
        mockTeamId,
        mockInvitationDto,
        mockUser.id,
      );
    });

    it('应该使用默认角色MEMBER', async () => {
      const mockRequest = {
        user: mockUser,
        id: 'req-123',
        params: {},
      };

      const invitationDtoWithoutRole = { email: 'invitee@example.com' };

      await controller.createTeamInvitation(
        mockTeamId,
        invitationDtoWithoutRole,
        mockRequest,
      );

      expect(mockTeamService.createTeamInvitation).toHaveBeenCalledWith(
        mockTeamId,
        invitationDtoWithoutRole,
        mockUser.id,
      );
    });
  });
});
