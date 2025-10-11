import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type {
  SessionListResponse,
  RevokeSessionResponse,
  RevokeAllSessionsResponse,
} from '@xiaodashi/shared';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RevokeAllSessionsDto } from './dto/session.dto';
import type { AuthenticatedRequest } from '../types';

/**
 * SessionController - 会话管理控制器
 *
 * 提供用户会话管理的REST API：
 * - 获取会话列表
 * - 撤销单个会话
 * - 撤销所有会话
 *
 * 所有接口均需要JWT认证
 */
@ApiTags('会话管理')
@Controller('v1/sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * 获取当前用户的所有会话
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取当前用户的所有会话',
    description: '返回当前用户的所有会话列表，按最后活跃时间降序排列',
  })
  @ApiResponse({
    status: 200,
    description: '成功获取会话列表',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  async getUserSessions(
    @Request() req: AuthenticatedRequest,
  ): Promise<SessionListResponse> {
    const userId = req.user.id;
    return this.sessionService.getUserSessions(userId);
  }

  /**
   * 撤销指定会话
   */
  @Delete(':sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '撤销指定会话',
    description: '撤销指定的会话，使该设备的登录状态失效',
  })
  @ApiParam({
    name: 'sessionId',
    description: '会话ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: '会话撤销成功',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问或无权撤销该会话',
  })
  @ApiResponse({
    status: 404,
    description: '会话不存在',
  })
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<RevokeSessionResponse> {
    const userId = req.user.id;
    return this.sessionService.revokeSession(sessionId, userId);
  }

  /**
   * 撤销所有会话
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '撤销所有会话',
    description: '撤销当前用户的所有会话，可选择保留当前会话',
  })
  @ApiResponse({
    status: 200,
    description: '会话撤销成功',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  async revokeAllSessions(
    @Request() req: AuthenticatedRequest,
    @Body() revokeAllDto?: RevokeAllSessionsDto,
  ): Promise<RevokeAllSessionsResponse> {
    const userId = req.user.id;

    // TODO: 需要从JWT或请求中获取当前会话ID
    // 目前简化处理，不保留当前会话
    const currentSessionId = undefined;

    return this.sessionService.revokeAllSessions(
      userId,
      revokeAllDto?.exceptCurrentSession,
      currentSessionId,
    );
  }
}
