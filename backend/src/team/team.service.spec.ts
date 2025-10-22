import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamRoleType, TeamTier } from '@xiaodashi/shared';
import type { QueryRunner, Repository } from 'typeorm';
import { TeamService } from './team.service';
import { Team } from '../database/entities/team/team.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: Repository<Team>;
  let teamMemberRepository: Repository<TeamMember>;

  // Mock repositories
  const mockTeamRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTeamMemberRepository = {
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
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    teamMemberRepository = module.get<Repository<TeamMember>>(
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
        const result = await service.createDefaultTeam(mockUserId, mockUserName);

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
});
