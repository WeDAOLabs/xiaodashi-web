import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthenticatedUser,
  GetPointHistoryResponse,
  GetTeamPointsResponse,
} from '@xiaodashi/shared';
import { Admin } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  RequireTeamMembership,
  TeamRoleGuard,
} from '../team/guards/team-role.guard';
import {
  CreateTransactionResponseDto,
  GetPointHistoryResponseDto,
  GetTeamPointsResponseDto,
  PointHistoryQueryDto,
  RechargePointsDto,
} from './dto';
import { PointsService } from './points.service';

// 扩展 Request 接口以包含认证用户信息
interface RequestWithUser {
  user: AuthenticatedUser;
  params: {
    teamId?: string;
  };
}

/**
 * 积分管理控制器
 *
 * 提供积分相关的API端点，包括：
 * - 积分余额查询
 * - 积分交易历史查询
 * - 积分充值（支付回调）
 */
@ApiTags('积分管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /**
   * 获取团队积分余额
   */
  @Get('teams/:teamId/points')
  @UseGuards(TeamRoleGuard)
  @RequireTeamMembership()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '查询团队积分余额',
    description: '获取指定团队的当前积分余额和状态信息',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取团队积分余额',
    type: GetTeamPointsResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '不是团队成员' })
  async getTeamPoints(
    @Param('teamId') teamId: string,
  ): Promise<GetTeamPointsResponse> {
    return this.pointsService.getBalance(teamId);
  }

  /**
   * 获取团队积分交易历史
   */
  @Get('teams/:teamId/points/history')
  @UseGuards(TeamRoleGuard)
  @RequireTeamMembership()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '查询团队积分交易历史',
    description:
      '分页查询指定团队的积分交易记录，支持按类型、日期、业务类型筛选',
  })
  @ApiParam({
    name: 'teamId',
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取积分交易历史',
    type: GetPointHistoryResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '不是团队成员' })
  @ApiResponse({ status: 422, description: '请求参数验证失败' })
  async getTeamPointsHistory(
    @Param('teamId') teamId: string,
    @Query() query: PointHistoryQueryDto,
  ): Promise<GetPointHistoryResponse> {
    return this.pointsService.getHistory(teamId, {
      page: query.page,
      limit: query.limit,
      type: query.type,
      startDate: query.startDate,
      endDate: query.endDate,
      businessType: query.businessType,
    });
  }

  /**
   * 充值积分（管理员专用）
   */
  @Post('points/recharge')
  @UseGuards(RolesGuard)
  @Admin()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '充值积分（管理员）',
    description:
      '为指定团队充值积分，仅限管理员操作。后续将通过支付系统自动调用',
  })
  @ApiResponse({
    status: 201,
    description: '成功充值积分',
    type: CreateTransactionResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权访问' })
  @ApiResponse({ status: 403, description: '权限不足（需要管理员权限）' })
  @ApiResponse({ status: 422, description: '请求参数验证失败' })
  async rechargePoints(
    @Body() rechargeDto: RechargePointsDto,
    @Request() req: RequestWithUser,
  ) {
    // 使用请求体中的用户ID，如果没有则使用当前登录用户ID
    const userId = rechargeDto.userId || req.user.id;

    return this.pointsService.recharge({
      teamId: rechargeDto.teamId,
      userId,
      amount: rechargeDto.amount,
      description: rechargeDto.description,
      businessId: rechargeDto.businessId,
      businessType: rechargeDto.businessType || 'payment', // 默认业务类型
    });
  }
}
