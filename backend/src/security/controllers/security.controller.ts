import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Admin } from '../../auth/decorators/roles.decorator';
import { AccountLockoutService } from '../services/account-lockout.service';
import { LockStatusQueryDto, UnlockAccountDto } from '../dto/lock-status.dto';
import {
  LockStatusResponseDto,
  UnlockAccountResponseDto,
  AccountLockoutStatusDto,
} from '../dto/responses.dto';
import type { AuthenticatedRequest } from '../../types';

/**
 * 安全控制器
 *
 * 提供账户锁定相关的API端点，包括：
 * - 查询用户锁定状态
 * - 管理员解锁账户
 * - 用户自查锁定状态
 *
 * 权限控制：
 * - admin/* 端点需要管理员权限
 * - 普通端点只需要认证即可访问
 */
@ApiTags('安全相关')
@Controller('security')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SecurityController {
  constructor(private readonly accountLockoutService: AccountLockoutService) {}

  /**
   * 管理员查询用户锁定状态
   *
   * @param query 包含用户ID的查询参数
   * @returns 用户锁定状态信息
   */
  @Get('admin/lock-status')
  @Admin()
  @ApiOperation({
    summary: '管理员查询用户锁定状态',
    description:
      '查询指定用户的账户锁定状态详情，包含锁定时间、剩余尝试次数等信息',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '查询成功',
    type: LockStatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权访问',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足，需要管理员权限',
  })
  async getLockStatus(
    @Query() query: LockStatusQueryDto,
  ): Promise<LockStatusResponseDto> {
    try {
      const [lockoutStatus, userInfo] = await Promise.all([
        this.accountLockoutService.checkAccountLocked(query.userId),
        this.accountLockoutService.getUserInfo(query.userId),
      ]);

      if (!userInfo) {
        throw new NotFoundException('指定的用户不存在');
      }

      return {
        userId: query.userId,
        email: userInfo.email,
        status: lockoutStatus,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      if (errorMessage.includes('用户不存在')) {
        throw new NotFoundException('指定的用户不存在');
      }
      throw new BadRequestException('查询锁定状态失败');
    }
  }

  /**
   * 用户查询自己的锁定状态
   *
   * @param request HTTP请求对象，包含用户认证信息
   * @returns 用户自己的锁定状态信息
   */
  @Get('lock-status')
  @ApiOperation({
    summary: '用户查询自己的锁定状态',
    description: '当前登录用户查询自己账户的锁定状态',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '查询成功',
    type: AccountLockoutStatusDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权访问',
  })
  async getMyLockStatus(
    @Request() req: AuthenticatedRequest,
  ): Promise<AccountLockoutStatusDto> {
    const userId = req.user.id; // 从JWT token中获取用户ID

    try {
      return await this.accountLockoutService.checkAccountLocked(userId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      if (errorMessage.includes('用户不存在')) {
        throw new NotFoundException('用户账户不存在');
      }
      throw new BadRequestException('查询锁定状态失败');
    }
  }

  /**
   * 管理员解锁用户账户
   *
   * @param unlockAccountDto 解锁请求参数
   * @param request HTTP请求对象，包含管理员信息
   * @returns 解锁操作结果
   */
  @Post('admin/unlock-account')
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '管理员解锁用户账户',
    description: '管理员手动解锁被锁定的用户账户，需要提供解锁原因',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '解锁成功',
    type: UnlockAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误或用户不存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权访问或权限不足',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足，需要管理员权限',
  })
  async unlockAccount(
    @Body() unlockAccountDto: UnlockAccountDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<UnlockAccountResponseDto> {
    const adminUserId = req.user.id; // 获取管理员用户ID

    try {
      const result = await this.accountLockoutService.unlockAccount(
        unlockAccountDto.userId,
        unlockAccountDto.reason,
        adminUserId,
      );

      if (!result.success) {
        throw new BadRequestException(result.message);
      }

      return {
        success: true,
        message: result.message,
        unlockedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      if (errorMessage.includes('用户不存在')) {
        throw new NotFoundException('指定的用户不存在');
      }
      throw new BadRequestException('解锁账户失败');
    }
  }

  /**
   * 用户申请解锁自己的账户
   *
   * @param request HTTP请求对象
   * @returns 申请结果
   */
  @Post('request-unlock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '用户申请解锁账户',
    description:
      '用户申请解锁自己被锁定的账户（仅用于记录，实际解锁仍需管理员操作）',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '申请已提交，等待管理员处理',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '解锁申请已提交，请联系管理员处理',
        },
        requestId: { type: 'string', example: 'req_123456789' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权访问',
  })
  async requestUnlock(@Request() req: AuthenticatedRequest): Promise<{
    message: string;
    requestId: string;
  }> {
    const userId = req.user.id;

    try {
      // 检查账户是否真的被锁定
      const lockoutStatus =
        await this.accountLockoutService.checkAccountLocked(userId);

      if (!lockoutStatus.isLocked) {
        throw new BadRequestException('您的账户当前未被锁定');
      }

      // 生成解锁申请ID
      const requestId = `unlock_${userId}_${Date.now()}`;

      // TODO: 这里可以记录解锁申请到数据库或发送通知给管理员
      // 目前仅返回成功消息

      return {
        message: '解锁申请已提交，请联系管理员处理',
        requestId,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      if (errorMessage.includes('用户不存在')) {
        throw new NotFoundException('用户账户不存在');
      }
      if (errorMessage.includes('当前未被锁定')) {
        throw new BadRequestException(errorMessage);
      }
      throw new BadRequestException('提交解锁申请失败');
    }
  }
}
