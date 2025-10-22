import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamRoleType, TeamTier } from '@xiaodashi/shared';
import type { QueryRunner, Repository } from 'typeorm';
import { TeamInvitation } from '../database/entities/team/team-invitation.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';
import { Team } from '../database/entities/team/team.entity';
import { User } from '../database/entities/user/user.entity';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let _teamRepository: Repository<Team>;
  let _teamMemberRepository: Repository<TeamMember>;

  // Mock repositories
  const mockTeamRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTeamMemberRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTeamInvitationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: getRepositoryToken(TeamMember),
          useValue: mockTeamMemberRepository,
        },
        {
          provide: getRepositoryToken(TeamInvitation),
          useValue: mockTeamInvitationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    _teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    _teamMemberRepository = module.get<Repository<TeamMember>>(
      getRepositoryToken(TeamMember),
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

  describe('createDefaultTeam', () => {
    const mockUserId = 'test-user-id-123';
    const mockUserName = '测试用户';
    const mockTeamId = 'test-team-id-456';
    const mockMemberId = 'test-member-id-789';

    const mockTeam = {
      id: mockTeamId,
      name: `${mockUserName}的团队`,
      ownerId: mockUserId,
      tier: TeamTier.FREE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTeamMember = {
      id: mockMemberId,
      teamId: mockTeamId,
      userId: mockUserId,
      role: TeamRoleType.OWNER,
      displayName: mockUserName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('独立使用（不使用事务）', () => {
      beforeEach(() => {
        mockTeamRepository.create.mockReturnValue(mockTeam);
        mockTeamRepository.save.mockResolvedValue(mockTeam);
        mockTeamMemberRepository.create.mockReturnValue(mockTeamMember);
        mockTeamMemberRepository.save.mockResolvedValue(mockTeamMember);
      });

      it('应该成功创建默认团队和成员关系', async () => {
        const result = await service.createDefaultTeam(
          mockUserId,
          mockUserName,
        );

        // 验证返回值
        expect(result).toEqual({
          team: mockTeam,
          member: mockTeamMember,
        });

        // 验证团队创建调用
        expect(mockTeamRepository.create).toHaveBeenCalledWith({
          name: `${mockUserName}的团队`,
          ownerId: mockUserId,
          tier: TeamTier.FREE,
        });
        expect(mockTeamRepository.save).toHaveBeenCalledWith(mockTeam);

        // 验证成员关系创建调用
        expect(mockTeamMemberRepository.create).toHaveBeenCalledWith({
          teamId: mockTeamId,
          userId: mockUserId,
          role: TeamRoleType.OWNER,
          displayName: mockUserName,
        });
        expect(mockTeamMemberRepository.save).toHaveBeenCalledWith(
          mockTeamMember,
        );
      });

      it('应该使用正确的团队名称格式', async () => {
        await service.createDefaultTeam(mockUserId, mockUserName);

        expect(mockTeamRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: `${mockUserName}的团队`,
          }),
        );
      });

      it('应该设置团队等级为 FREE', async () => {
        await service.createDefaultTeam(mockUserId, mockUserName);

        expect(mockTeamRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            tier: TeamTier.FREE,
          }),
        );
      });

      it('应该设置成员角色为 OWNER', async () => {
        await service.createDefaultTeam(mockUserId, mockUserName);

        expect(mockTeamMemberRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            role: TeamRoleType.OWNER,
          }),
        );
      });

      it('应该使用用户名作为显示名称', async () => {
        await service.createDefaultTeam(mockUserId, mockUserName);

        expect(mockTeamMemberRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            displayName: mockUserName,
          }),
        );
      });
    });

    describe('在事务中使用', () => {
      let mockQueryRunner: Partial<QueryRunner>;

      beforeEach(() => {
        // 创建 mock QueryRunner
        mockQueryRunner = {
          manager: {
            create: jest.fn(),
            save: jest.fn(),
          } as never,
        };

        // 配置 mock 返回值
        (mockQueryRunner.manager!.create as jest.Mock)
          .mockReturnValueOnce(mockTeam)
          .mockReturnValueOnce(mockTeamMember);

        (mockQueryRunner.manager!.save as jest.Mock)
          .mockResolvedValueOnce(mockTeam)
          .mockResolvedValueOnce(mockTeamMember);
      });

      it('应该使用 QueryRunner 创建团队和成员关系', async () => {
        const result = await service.createDefaultTeam(
          mockUserId,
          mockUserName,
          mockQueryRunner as QueryRunner,
        );

        // 验证返回值
        expect(result).toEqual({
          team: mockTeam,
          member: mockTeamMember,
        });

        // 验证使用 queryRunner.manager 而不是 repository
        expect(mockQueryRunner.manager!.create).toHaveBeenCalledTimes(2);
        expect(mockQueryRunner.manager!.save).toHaveBeenCalledTimes(2);

        // 验证没有使用 repository
        expect(mockTeamRepository.create).not.toHaveBeenCalled();
        expect(mockTeamRepository.save).not.toHaveBeenCalled();
        expect(mockTeamMemberRepository.create).not.toHaveBeenCalled();
        expect(mockTeamMemberRepository.save).not.toHaveBeenCalled();
      });

      it('应该使用 QueryRunner 创建团队实体', async () => {
        await service.createDefaultTeam(
          mockUserId,
          mockUserName,
          mockQueryRunner as QueryRunner,
        );

        expect(mockQueryRunner.manager!.create).toHaveBeenNthCalledWith(
          1,
          Team,
          {
            name: `${mockUserName}的团队`,
            ownerId: mockUserId,
            tier: TeamTier.FREE,
          },
        );
      });

      it('应该使用 QueryRunner 创建成员关系', async () => {
        await service.createDefaultTeam(
          mockUserId,
          mockUserName,
          mockQueryRunner as QueryRunner,
        );

        expect(mockQueryRunner.manager!.create).toHaveBeenNthCalledWith(
          2,
          TeamMember,
          {
            teamId: mockTeamId,
            userId: mockUserId,
            role: TeamRoleType.OWNER,
            displayName: mockUserName,
          },
        );
      });

      it('应该先保存团队再保存成员关系', async () => {
        await service.createDefaultTeam(
          mockUserId,
          mockUserName,
          mockQueryRunner as QueryRunner,
        );

        const saveCalls = (mockQueryRunner.manager!.save as jest.Mock).mock
          .calls;

        // 第一次调用保存团队
        expect(saveCalls[0]).toEqual([Team, mockTeam]);

        // 第二次调用保存成员关系
        expect(saveCalls[1]).toEqual([TeamMember, mockTeamMember]);
      });
    });

    describe('错误处理', () => {
      it('独立使用时，团队保存失败应该抛出异常', async () => {
        const mockError = new Error('Database error');
        mockTeamRepository.create.mockReturnValue(mockTeam);
        mockTeamRepository.save.mockRejectedValue(mockError);

        await expect(
          service.createDefaultTeam(mockUserId, mockUserName),
        ).rejects.toThrow('Database error');

        // 验证成员关系没有被创建
        expect(mockTeamMemberRepository.create).not.toHaveBeenCalled();
        expect(mockTeamMemberRepository.save).not.toHaveBeenCalled();
      });

      it('独立使用时，成员关系保存失败应该抛出异常', async () => {
        const mockError = new Error('Member save error');
        mockTeamRepository.create.mockReturnValue(mockTeam);
        mockTeamRepository.save.mockResolvedValue(mockTeam);
        mockTeamMemberRepository.create.mockReturnValue(mockTeamMember);
        mockTeamMemberRepository.save.mockRejectedValue(mockError);

        await expect(
          service.createDefaultTeam(mockUserId, mockUserName),
        ).rejects.toThrow('Member save error');
      });

      it('在事务中使用时，保存失败应该抛出异常', async () => {
        const mockError = new Error('Transaction error');
        const mockQueryRunner: Partial<QueryRunner> = {
          manager: {
            create: jest.fn().mockReturnValue(mockTeam),
            save: jest.fn().mockRejectedValue(mockError),
          } as never,
        };

        await expect(
          service.createDefaultTeam(
            mockUserId,
            mockUserName,
            mockQueryRunner as QueryRunner,
          ),
        ).rejects.toThrow('Transaction error');
      });
    });

    describe('边界情况', () => {
      beforeEach(() => {
        mockTeamRepository.create.mockReturnValue(mockTeam);
        mockTeamRepository.save.mockResolvedValue(mockTeam);
        mockTeamMemberRepository.create.mockReturnValue(mockTeamMember);
        mockTeamMemberRepository.save.mockResolvedValue(mockTeamMember);
      });

      it('应该处理包含特殊字符的用户名', async () => {
        const specialUserName = '测试<script>用户</script>';
        await service.createDefaultTeam(mockUserId, specialUserName);

        expect(mockTeamRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: `${specialUserName}的团队`,
          }),
        );
      });

      it('应该处理很长的用户名', async () => {
        const longUserName = 'A'.repeat(100);
        await service.createDefaultTeam(mockUserId, longUserName);

        expect(mockTeamRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: `${longUserName}的团队`,
          }),
        );
      });

      it('应该处理空字符串用户名', async () => {
        const emptyUserName = '';
        await service.createDefaultTeam(mockUserId, emptyUserName);

        expect(mockTeamRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: `${emptyUserName}的团队`,
          }),
        );
      });
    });
  });

  describe('getUserTeams', () => {
    const mockUserId = 'test-user-id-123';
    const mockTeamId = 'test-team-id-456';
    // const mockUserId2 = 'test-user-id-789'; // 预留用于未来的测试用例

    const mockTeamMembers = [
      {
        id: 'member-1',
        teamId: mockTeamId,
        userId: mockUserId,
        role: TeamRoleType.OWNER,
        displayName: '张三',
        createdAt: new Date('2024-01-01'),
        team: {
          id: mockTeamId,
          name: '开发团队',
          tier: TeamTier.PRO,
          createdAt: new Date('2024-01-01'),
          members: [
            {
              role: TeamRoleType.OWNER,
              user: { name: '张三' },
            },
            {
              role: TeamRoleType.MEMBER,
              user: { name: '李四' },
            },
          ],
        },
      },
      {
        id: 'member-2',
        teamId: 'team-2',
        userId: mockUserId,
        role: TeamRoleType.ADMIN,
        displayName: '张三',
        createdAt: new Date('2024-01-02'),
        team: {
          id: 'team-2',
          name: '产品团队',
          tier: TeamTier.FREE,
          createdAt: new Date('2024-01-02'),
          members: [
            {
              role: TeamRoleType.OWNER,
              user: { name: '王五' },
            },
          ],
        },
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      mockTeamMemberRepository.findAndCount.mockResolvedValue([
        mockTeamMembers,
        mockTeamMembers.length,
      ]);
    });

    it('应该成功获取用户团队列表', async () => {
      const result = await service.getUserTeams(mockUserId, {
        page: 1,
        limit: 20,
      });

      expect(result.teams).toHaveLength(2);
      expect(result.teams[0]).toEqual({
        id: mockTeamId,
        name: '开发团队',
        tier: TeamTier.PRO,
        memberCount: 2,
        ownerName: '张三',
        createdAt: '2024-01-01T00:00:00.000Z',
        userRole: TeamRoleType.OWNER,
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it('应该正确处理分页参数', async () => {
      await service.getUserTeams(mockUserId, { page: 2, limit: 10 });

      expect(mockTeamMemberRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        relations: ['team', 'team.members', 'team.members.user'],
        skip: 10,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('应该使用默认分页参数', async () => {
      await service.getUserTeams(mockUserId);

      expect(mockTeamMemberRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        relations: ['team', 'team.members', 'team.members.user'],
        skip: 0,
        take: 20,
        order: { createdAt: 'DESC' },
      });
    });

    it('应该正确处理未知所有者', async () => {
      const teamWithoutOwner = {
        ...mockTeamMembers[0],
        team: {
          ...mockTeamMembers[0].team,
          members: [],
        },
      };
      mockTeamMemberRepository.findAndCount.mockResolvedValue([
        [teamWithoutOwner],
        1,
      ]);

      const result = await service.getUserTeams(mockUserId);

      expect(result.teams[0].ownerName).toBe('未知用户');
    });

    it('应该正确计算成员数量', async () => {
      const result = await service.getUserTeams(mockUserId);

      expect(result.teams[0].memberCount).toBe(2);
      expect(result.teams[1].memberCount).toBe(1);
    });

    it('应该正确计算总页数', async () => {
      mockTeamMemberRepository.findAndCount.mockResolvedValue([
        mockTeamMembers,
        25,
      ]);

      const result = await service.getUserTeams(mockUserId, { limit: 10 });

      expect(result.pagination.totalPages).toBe(3);
    });

    it('应该处理空团队列表', async () => {
      mockTeamMemberRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.getUserTeams(mockUserId);

      expect(result.teams).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('getTeamDetail', () => {
    const mockTeamId = 'test-team-id-456';
    const mockUserId = 'test-user-id-123';
    const mockOwnerId = 'test-owner-id-789';

    const mockTeamMember = {
      id: 'member-1',
      teamId: mockTeamId,
      userId: mockUserId,
      role: TeamRoleType.ADMIN,
      displayName: '张三',
      createdAt: new Date('2024-01-01'),
    };

    const mockTeam = {
      id: mockTeamId,
      name: '开发团队',
      tier: TeamTier.PRO,
      ownerId: mockOwnerId,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      // 设置多次调用的mock返回值序列
      mockTeamMemberRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(mockTeamMember) // 第一次调用：检查用户权限
        .mockResolvedValueOnce({
          // 第二次调用：查找团队所有者
          ...mockTeamMember,
          role: TeamRoleType.OWNER,
          user: {
            id: 'test-owner-id-789',
            email: 'owner@example.com',
            name: '张三',
            avatar: 'owner-avatar.jpg',
          },
        });
      mockTeamRepository.findOne = jest.fn().mockResolvedValue(mockTeam);
      mockTeamMemberRepository.count = jest.fn().mockResolvedValue(5);
      mockTeamInvitationRepository.count = jest.fn().mockResolvedValue(2);
    });

    it('应该成功获取团队详情', async () => {
      const team = await service.getTeamDetail(mockTeamId, mockUserId);

      expect(team).toEqual({
        id: mockTeamId,
        name: '开发团队',
        tier: TeamTier.PRO,
        ownerId: mockOwnerId,
        memberCount: 5,
        owner: {
          id: 'test-owner-id-789',
          email: 'owner@example.com',
          name: '张三',
          avatar: 'owner-avatar.jpg',
        },
        pendingInvitations: 2,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('应该使用正确的查询条件', async () => {
      await service.getTeamDetail(mockTeamId, mockUserId);

      expect(mockTeamMemberRepository.findOne).toHaveBeenCalledWith({
        where: { teamId: mockTeamId, userId: mockUserId },
      });
      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTeamId },
      });
    });
  });

  describe('updateTeam', () => {
    const mockTeamId = 'test-team-id-456';
    const mockUserId = 'test-user-id-123';
    const mockOwnerId = 'test-owner-id-789';

    const mockTeamMember = {
      id: 'member-1',
      teamId: mockTeamId,
      userId: mockUserId,
      role: TeamRoleType.OWNER,
      displayName: '张三',
      createdAt: new Date('2024-01-01'),
    };

    const mockTeam = {
      id: mockTeamId,
      name: '开发团队',
      tier: TeamTier.PRO,
      ownerId: mockOwnerId,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockTeamRepository.findOne = jest.fn().mockResolvedValue(mockTeam);
      mockTeamMemberRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(mockTeamMember) // updateTeam权限检查
        .mockResolvedValueOnce(mockTeamMember) // getTeamDetail权限检查
        .mockResolvedValueOnce({
          // getTeamDetail owner查询
          ...mockTeamMember,
          role: TeamRoleType.OWNER,
          user: {
            id: mockOwnerId,
            email: 'owner@example.com',
            name: '张三',
            avatar: 'owner-avatar.jpg',
          },
        });
      mockTeamRepository.save = jest.fn().mockResolvedValue(mockTeam);
      mockTeamMemberRepository.count = jest.fn().mockResolvedValue(5);
      mockTeamInvitationRepository.count = jest.fn().mockResolvedValue(2);
    });

    it('应该成功更新团队信息', async () => {
      const updateData = { name: '新团队名称' };
      const result = await service.updateTeam(
        mockTeamId,
        updateData,
        mockUserId,
      );

      expect(result).toBeDefined();
      expect(mockTeamRepository.save).toHaveBeenCalled();
    });
  });

  describe('getTeamMembers', () => {
    const mockTeamId = 'test-team-id-456';
    const mockUserId = 'test-user-id-123';

    const mockTeamMember = {
      id: 'member-1',
      teamId: mockTeamId,
      userId: mockUserId,
      role: TeamRoleType.ADMIN,
      displayName: '张三',
      createdAt: new Date('2024-01-01'),
    };

    const mockTeamMembers = [
      {
        id: 'member-1',
        teamId: mockTeamId,
        userId: 'user-1',
        role: TeamRoleType.OWNER,
        displayName: '张三',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        user: {
          id: 'user-1',
          name: '张三',
          email: 'zhangsan@example.com',
          avatar: 'avatar1.jpg',
        },
      },
      {
        id: 'member-2',
        teamId: mockTeamId,
        userId: 'user-2',
        role: TeamRoleType.MEMBER,
        displayName: '李四',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        user: {
          id: 'user-2',
          name: '李四',
          email: 'lisi@example.com',
          avatar: 'avatar2.jpg',
        },
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      mockTeamMemberRepository.findOne.mockResolvedValue(mockTeamMember);
      mockTeamMemberRepository.findAndCount.mockResolvedValue([
        mockTeamMembers,
        mockTeamMembers.length,
      ]);
    });

    it('应该成功获取团队成员列表', async () => {
      const result = await service.getTeamMembers(mockTeamId, mockUserId, {
        page: 1,
        limit: 20,
      });

      expect(result.members).toHaveLength(2);
      expect(result.members[0]).toEqual({
        id: 'member-1',
        teamId: mockTeamId,
        userId: 'user-1',
        role: TeamRoleType.OWNER,
        displayName: '张三',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        user: {
          id: 'user-1',
          name: '张三',
          email: 'zhangsan@example.com',
          avatar: 'avatar1.jpg',
        },
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it('应该正确处理分页', async () => {
      await service.getTeamMembers(mockTeamId, mockUserId, {
        page: 2,
        limit: 10,
      });

      expect(mockTeamMemberRepository.findAndCount).toHaveBeenCalledWith({
        where: { teamId: mockTeamId },
        relations: ['user'],
        skip: 10,
        take: 10,
        order: { createdAt: 'ASC' },
      });
    });
  });

  describe('removeTeamMember', () => {
    const mockTeamId = 'test-team-id-456';
    const mockUserId = 'test-user-id-123';
    const mockTargetUserId = 'target-user-id-789';

    const mockRequesterMember = {
      id: 'member-1',
      teamId: mockTeamId,
      userId: mockUserId,
      role: TeamRoleType.ADMIN,
      displayName: '张三',
      createdAt: new Date('2024-01-01'),
    };

    const mockTargetMember = {
      id: 'member-2',
      teamId: mockTeamId,
      userId: mockTargetUserId,
      role: TeamRoleType.MEMBER,
      displayName: '李四',
      createdAt: new Date('2024-01-01'),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockTeamRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockTeamId });
      mockTeamMemberRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(mockRequesterMember)
        .mockResolvedValueOnce(mockTargetMember);
      mockTeamMemberRepository.remove = jest
        .fn()
        .mockResolvedValue(mockTargetMember);
    });

    it('应该成功移除团队成员', async () => {
      const result = await service.removeTeamMember(
        mockTeamId,
        mockTargetUserId,
        mockUserId,
      );

      expect(result).toBeDefined();
      expect(mockTeamMemberRepository.remove).toHaveBeenCalledWith(
        mockTargetMember,
      );
    });
  });

  describe('createTeamInvitation', () => {
    const mockTeamId = 'test-team-id-456';
    const mockInviterId = 'inviter-id-123';
    const mockInviteeEmail = 'invitee@example.com';

    const mockTeamMember = {
      id: 'member-1',
      teamId: mockTeamId,
      userId: mockInviterId,
      role: TeamRoleType.ADMIN,
      displayName: '张三',
      createdAt: new Date('2024-01-01'),
    };

    const mockInvitation = {
      id: 'invitation-1',
      teamId: mockTeamId,
      email: mockInviteeEmail,
      role: TeamRoleType.MEMBER,
      inviterId: mockInviterId,
      status: 'pending',
      token: 'invitation-token',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      expiresAt: new Date('2024-01-08'),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockTeamMemberRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockTeamMember);
      mockTeamInvitationRepository.findOne = jest.fn().mockResolvedValue(null);
      mockTeamInvitationRepository.create = jest
        .fn()
        .mockReturnValue(mockInvitation);
      mockTeamInvitationRepository.save = jest
        .fn()
        .mockResolvedValue(mockInvitation);
      mockTeamRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockTeamId });
      mockTeamMemberRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
    });

    it('应该成功创建团队邀请', async () => {
      const invitationDto = {
        email: mockInviteeEmail,
        role: TeamRoleType.MEMBER,
      };
      const result = await service.createTeamInvitation(
        mockTeamId,
        invitationDto,
        mockInviterId,
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(mockTeamInvitationRepository.save).toHaveBeenCalled();
    });
  });
});
