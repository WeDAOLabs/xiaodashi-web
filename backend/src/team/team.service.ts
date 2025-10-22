import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TeamRoleType,
  TeamTier,
  TeamListItem,
  TeamDetail,
  TeamMemberDetail,
  TeamInvitation as ITeamInvitation,
  InvitationStatus,
  GetTeamsResponse,
  GetTeamMembersResponse,
  GetMyInvitationsResponse,
  MyInvitationItem,
  JoinTeamResponse,
  TeamQueryParams,
  TeamMemberQueryParams,
} from '@xiaodashi/shared';
import type { QueryRunner, Repository } from 'typeorm';
import { In } from 'typeorm';
import { Team } from '../database/entities/team/team.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';
import { TeamInvitation } from '../database/entities/team/team-invitation.entity';
import { User } from '../database/entities/user/user.entity';

/**
 * 团队服务类
 *
 * 提供团队管理的核心功能：
 * - 创建默认团队和成员关系
 * - 支持事务化操作确保数据一致性
 * - 为用户注册流程提供团队初始化服务
 */
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(TeamInvitation)
    private readonly teamInvitationRepository: Repository<TeamInvitation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 为新注册用户创建默认团队和成员关系
   *
   * @param userId - 用户ID
   * @param userName - 用户姓名，用于生成团队名称
   * @param queryRunner - 可选的QueryRunner，用于事务管理
   * @returns Promise<{ team: Team; member: TeamMember }> - 创建的团队和成员关系
   *
   * @example
   * ```typescript
   * // 在事务中使用
   * const { team, member } = await teamService.createDefaultTeam(
   *   user.id,
   *   user.name,
   *   queryRunner
   * );
   *
   * // 独立使用（自动创建事务）
   * const { team, member } = await teamService.createDefaultTeam(
   *   user.id,
   *   user.name
   * );
   * ```
   */
  async createDefaultTeam(
    userId: string,
    userName: string,
    queryRunner?: QueryRunner,
  ): Promise<{ team: Team; member: TeamMember }> {
    // 生成默认团队名称
    const teamName = `${userName}的团队`;

    // 创建团队实体
    const team = queryRunner
      ? queryRunner.manager.create(Team, {
          name: teamName,
          ownerId: userId,
          tier: TeamTier.FREE, // 默认免费版
        })
      : this.teamRepository.create({
          name: teamName,
          ownerId: userId,
          tier: TeamTier.FREE,
        });

    // 保存团队
    const savedTeam = queryRunner
      ? await queryRunner.manager.save(Team, team)
      : await this.teamRepository.save(team);

    // 创建团队成员关系
    const teamMember = queryRunner
      ? queryRunner.manager.create(TeamMember, {
          teamId: savedTeam.id,
          userId: userId,
          role: TeamRoleType.OWNER, // 设置为所有者
          displayName: userName, // 使用用户姓名作为显示名称
        })
      : this.teamMemberRepository.create({
          teamId: savedTeam.id,
          userId: userId,
          role: TeamRoleType.OWNER,
          displayName: userName,
        });

    // 保存团队成员关系
    const savedMember = queryRunner
      ? await queryRunner.manager.save(TeamMember, teamMember)
      : await this.teamMemberRepository.save(teamMember);

    return {
      team: savedTeam,
      member: savedMember,
    };
  }

  /**
   * 获取用户所属团队列表
   *
   * @param userId - 用户ID
   * @param pagination - 分页参数
   * @returns Promise<GetTeamsResponse> - 团队列表响应
   */
  async getUserTeams(
    userId: string,
    pagination: TeamQueryParams = { page: 1, limit: 20 },
  ): Promise<GetTeamsResponse> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    // 查询用户作为成员的团队，预加载相关数据避免N+1查询
    const [teamMembers, total] = await this.teamMemberRepository.findAndCount({
      where: { userId },
      relations: ['team', 'team.members', 'team.members.user'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // 构建团队列表项
    const teams: TeamListItem[] = teamMembers.map((member) => {
      const team = member.team;
      const memberCount = team.members?.length || 0;
      const owner = team.members?.find((m) => m.role === TeamRoleType.OWNER);

      return {
        id: team.id,
        name: team.name,
        tier: team.tier,
        memberCount,
        ownerName: owner?.user?.name || '未知用户',
        createdAt: team.createdAt.toISOString(),
        userRole: member.role,
      };
    });

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取团队详情
   *
   * @param teamId - 团队ID
   * @param requestingUserId - 请求用户ID
   * @returns Promise<TeamDetail> - 团队详情
   */
  async getTeamDetail(
    teamId: string,
    requestingUserId: string,
  ): Promise<TeamDetail> {
    // 验证团队存在
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`团队 ID ${teamId} 不存在`);
    }

    // 验证用户是否为团队成员
    const member = await this.teamMemberRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });
    if (!member) {
      throw new ForbiddenException(`您不是该团队的成员`);
    }

    // 查询团队成员数量
    const memberCount = await this.teamMemberRepository.count({
      where: { teamId },
    });

    // 查询团队所有者信息
    const ownerMember = await this.teamMemberRepository.findOne({
      where: { teamId, role: TeamRoleType.OWNER },
      relations: ['user'],
    });

    if (!ownerMember?.user) {
      throw new NotFoundException(`团队所有者信息不存在`);
    }

    // 查询待处理邀请数量
    const pendingInvitationsCount = await this.teamInvitationRepository.count({
      where: { teamId, status: InvitationStatus.PENDING },
    });

    return {
      id: team.id,
      name: team.name,
      ownerId: team.ownerId,
      tier: team.tier,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
      memberCount,
      owner: {
        id: ownerMember.user.id,
        email: ownerMember.user.email,
        name: ownerMember.user.name,
        avatar: ownerMember.user.avatar,
      },
      pendingInvitations: pendingInvitationsCount,
    };
  }

  /**
   * 更新团队信息
   *
   * @param teamId - 团队ID
   * @param updateData - 更新数据
   * @param requestingUserId - 请求用户ID
   * @returns Promise<TeamDetail> - 更新后的团队详情
   */
  async updateTeam(
    teamId: string,
    updateData: { name?: string },
    requestingUserId: string,
  ): Promise<TeamDetail> {
    // 验证团队存在
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`团队 ID ${teamId} 不存在`);
    }

    // 验证权限（只有owner或admin可以更新）
    const member = await this.teamMemberRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });
    if (
      !member ||
      ![TeamRoleType.OWNER, TeamRoleType.ADMIN].includes(member.role)
    ) {
      throw new ForbiddenException(`您没有权限更新该团队信息`);
    }

    // 更新团队信息
    if (updateData.name !== undefined) {
      team.name = updateData.name;
    }

    await this.teamRepository.save(team);

    // 返回更新后的团队详情
    return this.getTeamDetail(teamId, requestingUserId);
  }

  /**
   * 获取团队成员列表
   *
   * @param teamId - 团队ID
   * @param requestingUserId - 请求用户ID
   * @param pagination - 分页参数
   * @returns Promise<GetTeamMembersResponse> - 团队成员列表
   */
  async getTeamMembers(
    teamId: string,
    requestingUserId: string,
    pagination: TeamMemberQueryParams = { page: 1, limit: 20 },
  ): Promise<GetTeamMembersResponse> {
    // 验证用户是否为团队成员
    const member = await this.teamMemberRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });
    if (!member) {
      throw new ForbiddenException(`您不是该团队的成员`);
    }

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    // 查询团队成员
    const [teamMembers, total] = await this.teamMemberRepository.findAndCount({
      where: { teamId },
      relations: ['user'],
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    // 构建成员详细信息
    const members: TeamMemberDetail[] = teamMembers.map((teamMember) => ({
      id: teamMember.id,
      teamId: teamMember.teamId,
      userId: teamMember.userId,
      role: teamMember.role,
      displayName: teamMember.displayName,
      createdAt: teamMember.createdAt.toISOString(),
      updatedAt: teamMember.updatedAt.toISOString(),
      user: {
        id: teamMember.user.id,
        email: teamMember.user.email,
        name: teamMember.user.name,
        avatar: teamMember.user.avatar,
      },
    }));

    return {
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 移除团队成员
   *
   * @param teamId - 团队ID
   * @param targetUserId - 被移除用户ID
   * @param requestingUserId - 请求用户ID
   * @returns Promise<{ message: string; removedUserId: string }> - 操作结果
   */
  async removeTeamMember(
    teamId: string,
    targetUserId: string,
    requestingUserId: string,
  ): Promise<{ message: string; removedUserId: string }> {
    // 验证团队存在
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`团队 ID ${teamId} 不存在`);
    }

    // 获取请求者的成员信息
    const requesterMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: requestingUserId },
    });
    if (!requesterMember) {
      throw new ForbiddenException(`您不是该团队的成员`);
    }

    // 获取目标成员信息
    const targetMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: targetUserId },
    });
    if (!targetMember) {
      throw new NotFoundException(`目标用户不是该团队的成员`);
    }

    // 权限检查
    const canRemove =
      requesterMember.role === TeamRoleType.OWNER || // 所有者可以移除任何人
      (requesterMember.role === TeamRoleType.ADMIN &&
        targetMember.role === TeamRoleType.MEMBER); // 管理员可以移除普通成员

    if (!canRemove) {
      throw new ForbiddenException(`您没有权限移除该成员`);
    }

    // 不能移除团队所有者
    if (targetMember.role === TeamRoleType.OWNER) {
      throw new ForbiddenException(`不能移除团队所有者`);
    }

    // 不能移除自己
    if (targetUserId === requestingUserId) {
      throw new ForbiddenException(`不能移除自己，请使用退出团队功能`);
    }

    // 移除成员
    await this.teamMemberRepository.remove(targetMember);

    return {
      message: `成功移除团队成员`,
      removedUserId: targetUserId,
    };
  }

  /**
   * 创建团队邀请
   *
   * @param teamId - 团队ID
   * @param invitationData - 邀请数据
   * @param inviterId - 邀请者ID
   * @returns Promise<TeamInvitation> - 创建的邀请记录
   */
  async createTeamInvitation(
    teamId: string,
    invitationData: { email: string; role?: TeamRoleType },
    inviterId: string,
  ): Promise<ITeamInvitation> {
    // 验证团队存在
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`团队 ID ${teamId} 不存在`);
    }

    // 验证邀请者权限
    const inviterMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: inviterId },
    });
    if (
      !inviterMember ||
      ![TeamRoleType.OWNER, TeamRoleType.ADMIN].includes(inviterMember.role)
    ) {
      throw new ForbiddenException(`您没有权限邀请成员`);
    }

    // 检查被邀请用户是否已经是团队成员
    const existingMember = await this.teamMemberRepository
      .createQueryBuilder('member')
      .leftJoin('member.user', 'user')
      .where('member.teamId = :teamId', { teamId })
      .andWhere('user.email = :email', { email: invitationData.email })
      .getOne();

    if (existingMember) {
      throw new ForbiddenException(`该用户已经是团队成员`);
    }

    // 检查是否已有未处理的邀请
    const existingInvitation = await this.teamInvitationRepository.findOne({
      where: {
        teamId,
        email: invitationData.email,
        status: InvitationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new ForbiddenException(`该用户已有待处理的邀请`);
    }

    // 生成邀请令牌
    const token = this.generateInvitationToken();

    // 设置邀请过期时间（7天后过期）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 创建邀请记录
    const invitation = this.teamInvitationRepository.create({
      teamId,
      inviterId,
      email: invitationData.email,
      token,
      expiresAt,
      status: InvitationStatus.PENDING,
    });

    const savedInvitation =
      await this.teamInvitationRepository.save(invitation);

    // TODO: 发送邀请邮件

    return {
      id: savedInvitation.id,
      teamId: savedInvitation.teamId,
      inviterId: savedInvitation.inviterId,
      email: savedInvitation.email,
      token: savedInvitation.token,
      expiresAt: savedInvitation.expiresAt.toISOString(),
      status: savedInvitation.status,
      createdAt: savedInvitation.createdAt.toISOString(),
      updatedAt: savedInvitation.updatedAt.toISOString(),
    };
  }

  /**
   * 获取我的邀请列表
   *
   * @param userId - 用户ID
   * @param pagination - 分页参数
   * @returns Promise<GetMyInvitationsResponse> - 我的邀请列表响应
   */
  async getMyInvitations(
    userId: string,
    pagination: {
      page?: number;
      limit?: number;
      status?: InvitationStatus;
      email?: string;
    } = {},
  ): Promise<GetMyInvitationsResponse> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const whereCondition: {
      inviterId: string;
      status?: InvitationStatus;
      email?: string;
    } = { inviterId: userId };
    if (pagination.status) {
      whereCondition.status = pagination.status;
    }
    if (pagination.email) {
      whereCondition.email = pagination.email;
    }

    // 查询我创建的邀请，预加载团队信息
    const [invitations, total] =
      await this.teamInvitationRepository.findAndCount({
        where: whereCondition,
        relations: ['team'],
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

    // 构建邀请列表项
    const myInvitations: MyInvitationItem[] = invitations.map((invitation) => ({
      id: invitation.id,
      teamId: invitation.teamId,
      teamName: invitation.team?.name || '未知团队',
      inviterId: invitation.inviterId,
      inviterName: '', // 需要通过查询获取邀请者姓名，或者从上下文获取
      email: invitation.email,
      token: invitation.token,
      expiresAt: invitation.expiresAt.toISOString(),
      status: invitation.status,
      createdAt: invitation.createdAt.toISOString(),
      updatedAt: invitation.updatedAt.toISOString(),
    }));

    // 如果需要邀请者姓名，批量查询用户信息
    if (myInvitations.length > 0) {
      const inviterIds = [
        ...new Set(myInvitations.map((item) => item.inviterId)),
      ];
      const inviters = await this.userRepository.find({
        where: { id: In(inviterIds) },
      });

      const inviterMap = new Map(inviters.map((user) => [user.id, user.name]));

      myInvitations.forEach((item) => {
        item.inviterName = inviterMap.get(item.inviterId) || '未知用户';
      });
    }

    return {
      invitations: myInvitations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 通过邀请令牌加入团队
   *
   * @param token - 邀请令牌
   * @param userId - 用户ID
   * @returns Promise<JoinTeamResponse> - 加入团队响应
   */
  async joinTeamByToken(
    token: string,
    userId: string,
  ): Promise<JoinTeamResponse> {
    // 查找有效的邀请
    const invitation = await this.teamInvitationRepository.findOne({
      where: { token },
      relations: ['team'],
    });

    if (!invitation) {
      throw new NotFoundException(`邀请令牌无效`);
    }

    // 检查邀请是否已过期
    const now = new Date();
    if (invitation.expiresAt < now) {
      // 更新邀请状态为已过期
      await this.teamInvitationRepository.update(invitation.id, {
        status: InvitationStatus.EXPIRED,
      });
      throw new ForbiddenException(`邀请已过期`);
    }

    // 检查邀请状态
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ForbiddenException(
        `邀请已被${this.getInvitationStatusText(invitation.status)}`,
      );
    }

    // 检查用户是否已是团队成员
    const existingMember = await this.teamMemberRepository.findOne({
      where: { teamId: invitation.teamId, userId },
    });

    if (existingMember) {
      throw new ForbiddenException(`您已经是该团队的成员`);
    }

    // 使用事务处理加入团队
    const queryRunner =
      this.teamInvitationRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 创建团队成员记录
      const newMember = queryRunner.manager.create(TeamMember, {
        teamId: invitation.teamId,
        userId: userId,
        role: TeamRoleType.MEMBER, // 默认为普通成员
        displayName: '', // 将在后续通过用户信息获取
      });

      const savedMember = await queryRunner.manager.save(TeamMember, newMember);

      // 更新邀请状态为已接受
      await queryRunner.manager.update(TeamInvitation, invitation.id, {
        status: InvitationStatus.ACCEPTED,
      });

      await queryRunner.commitTransaction();

      // 获取用户信息用于显示名称
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        savedMember.displayName = user.name;
        await this.teamMemberRepository.update(savedMember.id, {
          displayName: user.name,
        });
      }

      // 获取团队详情
      const teamDetail = await this.getTeamDetail(invitation.teamId, userId);

      // 构建成员详细信息
      const memberDetail: TeamMemberDetail = {
        id: savedMember.id,
        teamId: savedMember.teamId,
        userId: savedMember.userId,
        role: savedMember.role,
        displayName: savedMember.displayName,
        createdAt: savedMember.createdAt.toISOString(),
        updatedAt: savedMember.updatedAt.toISOString(),
        user: {
          id: user!.id,
          email: user!.email,
          name: user!.name,
          avatar: user!.avatar,
        },
      };

      return {
        team: teamDetail,
        member: memberDetail,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 获取邀请状态文本
   *
   * @param status - 邀请状态
   * @returns string - 状态文本
   */
  private getInvitationStatusText(status: InvitationStatus): string {
    switch (status) {
      case InvitationStatus.PENDING:
        return '处理';
      case InvitationStatus.ACCEPTED:
        return '接受';
      case InvitationStatus.EXPIRED:
        return '过期';
      case InvitationStatus.CANCELLED:
        return '取消';
      default:
        return '处理';
    }
  }

  /**
   * 生成邀请令牌
   *
   * @returns string - 随机邀请令牌
   */
  private generateInvitationToken(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}
