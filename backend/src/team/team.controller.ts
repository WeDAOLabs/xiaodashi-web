import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  TeamRoleGuard,
  TeamRoles,
  RequireTeamMembership,
} from './guards/team-role.guard';
import { TeamRoleType, AuthenticatedUser } from '@xiaodashi/shared';
import { TeamService } from './team.service';

// 扩展 Request 接口以包含认证用户信息
interface RequestWithUser {
  user: AuthenticatedUser;
  id?: string;
  params: {
    teamId?: string;
  };
}
import {
  UpdateTeamDto,
  CreateInvitationDto,
  TeamQueryDto,
  TeamMemberQueryDto,
  JoinTeamDto,
  InvitationQueryDto,
} from './dto';
import { ApiResponse as StandardApiResponse } from '@xiaodashi/shared';
import {
  GetTeamsResponse,
  GetTeamResponse,
  GetTeamMembersResponse,
  CreateTeamInvitationResponse,
  RemoveTeamMemberResponse,
  GetMyInvitationsResponse,
  JoinTeamResponse,
} from '@xiaodashi/shared';

/**
 * 团队管理控制器
 *
 * 提供团队相关的API端点，包括：
 * - 团队信息查询和更新
 * - 团队成员管理
 * - 团队邀请管理
 * - 基于角色的权限控制
 */
@ApiTags('团队管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  /**
   * 获取用户所属团队列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取用户团队列表',
    description:
      '获取当前用户所属的所有团队，包含团队等级信息和用户在团队中的角色',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取团队列表',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            teams: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '550e8400-e29b-41d4-a716-446655440000',
                  },
                  name: { type: 'string', example: '开发团队' },
                  tier: {
                    type: 'string',
                    example: 'pro',
                    enum: ['free', 'pro', 'plus', 'ultra'],
                  },
                  memberCount: { type: 'number', example: 5 },
                  ownerName: { type: 'string', example: '张三' },
                  createdAt: {
                    type: 'string',
                    example: '2024-01-01T00:00:00Z',
                  },
                  userRole: {
                    type: 'string',
                    example: 'admin',
                    enum: ['owner', 'admin', 'member'],
                  },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 20 },
                total: { type: 'number', example: 3 },
                totalPages: { type: 'number', example: 1 },
              },
            },
          },
        },
        message: { type: 'string', example: '获取团队列表成功' },
        code: { type: 'number', example: 200 },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00Z' },
        requestId: { type: 'string', example: 'req_123456789' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  async getUserTeams(
    @Request() req: RequestWithUser,
    @Query() query: TeamQueryDto,
  ): Promise<StandardApiResponse<GetTeamsResponse>> {
    const { page = 1, limit = 20 } = query;
    const userId = req.user.id; // 从认证用户信息中获取用户ID

    const result = await this.teamService.getUserTeams(userId, { page, limit });

    return {
      success: true,
      data: result,
      message: '获取团队列表成功',
      code: 200,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 获取团队详情
   */
  @Get(':teamId')
  @UseGuards(TeamRoleGuard)
  @RequireTeamMembership()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取团队详情',
    description:
      '获取指定团队的详细信息，包含成员数量、所有者信息和待处理邀请数量',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: '成功获取团队详情' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '不是团队成员' })
  @ApiResponse({ status: 404, description: '团队不存在' })
  async getTeamDetail(
    @Param('teamId') teamId: string,
    @Request() req: RequestWithUser,
  ): Promise<StandardApiResponse<GetTeamResponse>> {
    const userId = req.user.id;

    const team = await this.teamService.getTeamDetail(teamId, userId);

    return {
      success: true,
      data: { team },
      message: '获取团队详情成功',
      code: 200,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 更新团队信息
   */
  @Patch(':teamId')
  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleType.OWNER, TeamRoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '更新团队信息',
    description: '更新团队名称，只有团队所有者或管理员可以操作',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: '成功更新团队信息' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '无权限更新团队信息' })
  @ApiResponse({ status: 404, description: '团队不存在' })
  @ApiResponse({ status: 422, description: '请求参数验证失败' })
  async updateTeam(
    @Param('teamId') teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Request() req: RequestWithUser,
  ): Promise<StandardApiResponse<GetTeamResponse>> {
    const userId = req.user.id;

    const team = await this.teamService.updateTeam(
      teamId,
      updateTeamDto,
      userId,
    );

    return {
      success: true,
      data: { team },
      message: '更新团队信息成功',
      code: 200,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 获取团队成员列表
   */
  @Get(':teamId/members')
  @UseGuards(TeamRoleGuard)
  @RequireTeamMembership()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取团队成员列表',
    description: '获取指定团队的成员列表，包含成员角色和用户信息',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: '成功获取团队成员列表' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '不是团队成员' })
  @ApiResponse({ status: 404, description: '团队不存在' })
  async getTeamMembers(
    @Param('teamId') teamId: string,
    @Query() query: TeamMemberQueryDto,
    @Request() req: RequestWithUser,
  ): Promise<StandardApiResponse<GetTeamMembersResponse>> {
    const { page = 1, limit = 20 } = query;
    const userId = req.user.id;

    const result = await this.teamService.getTeamMembers(teamId, userId, {
      page,
      limit,
    });

    return {
      success: true,
      data: result,
      message: '获取团队成员列表成功',
      code: 200,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 移除团队成员
   */
  @Delete(':teamId/members/:userId')
  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleType.OWNER, TeamRoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '移除团队成员',
    description: '从团队中移除指定成员，只有团队所有者或管理员可以操作',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'userId',
    description: '被移除用户ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({ status: 200, description: '成功移除团队成员' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '无权限移除成员' })
  @ApiResponse({ status: 404, description: '团队或成员不存在' })
  async removeTeamMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Request() req: RequestWithUser,
  ): Promise<StandardApiResponse<RemoveTeamMemberResponse>> {
    const requestingUserId = req.user.id;

    const result = await this.teamService.removeTeamMember(
      teamId,
      userId,
      requestingUserId,
    );

    return {
      success: true,
      data: result,
      message: '移除团队成员成功',
      code: 200,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 创建团队邀请
   */
  @Post(':teamId/invitations')
  @UseGuards(TeamRoleGuard)
  @TeamRoles(TeamRoleType.OWNER, TeamRoleType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '创建团队邀请',
    description:
      '向指定邮箱发送团队邀请，邀请者ID会自动记录。只有团队所有者或管理员可以邀请成员',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 201, description: '成功创建团队邀请' })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '无权限邀请成员' })
  @ApiResponse({ status: 409, description: '用户已是团队成员或已有待处理邀请' })
  @ApiResponse({ status: 422, description: '请求参数验证失败' })
  async createTeamInvitation(
    @Param('teamId') teamId: string,
    @Body() createInvitationDto: CreateInvitationDto,
    @Request() req: RequestWithUser,
  ): Promise<StandardApiResponse<CreateTeamInvitationResponse>> {
    const inviterId = req.user.id; // 从认证用户信息中获取邀请者ID

    const invitation = await this.teamService.createTeamInvitation(
      teamId,
      createInvitationDto,
      inviterId,
    );

    return {
      success: true,
      data: {
        invitation,
      },
      message: '创建团队邀请成功',
      code: 201,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 获取我的邀请列表
   */
  @Get('invitations/my-invitations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取我的邀请列表',
    description: '获取当前用户创建的所有团队邀请，包含邀请状态和团队信息',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取邀请列表',
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  async getMyInvitations(
    @Request() req: RequestWithUser,
    @Query() query: InvitationQueryDto,
  ): Promise<StandardApiResponse<GetMyInvitationsResponse>> {
    const userId = req.user.id;
    const { page, limit, status, email } = query;

    const result = await this.teamService.getMyInvitations(userId, {
      page,
      limit,
      status,
      email,
    });

    return {
      success: true,
      data: result,
      message: '获取邀请列表成功',
      code: 200,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }

  /**
   * 加入团队
   */
  @Post('join-team')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '通过邀请令牌加入团队',
    description: '使用邀请令牌加入对应的团队，用户需要已登录状态',
  })
  @ApiResponse({
    status: 201,
    description: '成功加入团队',
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 404, description: '邀请令牌无效' })
  @ApiResponse({ status: 403, description: '邀请已过期或已被处理' })
  @ApiResponse({ status: 409, description: '用户已经是团队成员' })
  @ApiResponse({ status: 422, description: '请求参数验证失败' })
  async joinTeam(
    @Request() req: RequestWithUser,
    @Query() joinTeamDto: JoinTeamDto,
  ): Promise<StandardApiResponse<JoinTeamResponse>> {
    const userId = req.user.id;
    const { token } = joinTeamDto;

    const result = await this.teamService.joinTeamByToken(token, userId);

    return {
      success: true,
      data: result,
      message: '成功加入团队',
      code: 201,
      timestamp: new Date().toISOString(),
      requestId: req.id || 'unknown',
    };
  }
}
