import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Admin } from '../../auth/decorators/roles.decorator';
import { IPBlacklistService } from '../services/ip-blacklist.service';
import { IPWhitelistService } from '../services/ip-whitelist.service';
import { IPRiskAssessmentService } from '../services/ip-risk-assessment.service';
import { IPRateLimiterService } from '../services/ip-rate-limiter.service';
import type { AuthenticatedUser } from '@xiaodashi/shared';
import {
  IPBlacklistQueryDto,
  AddIPBlacklistDto,
  UpdateIPBlacklistDto,
  IPWhitelistQueryDto,
  AddIPWhitelistDto,
  UpdateIPWhitelistDto,
  BatchIPCheckDto,
  ManualBlockIPDto,
} from '../dto/ip-security.dto';
import {
  IPBlacklistQueryResponseDto,
  IPWhitelistQueryResponseDto,
  IPSecurityStatisticsDto,
  BatchIPCheckResponseDto,
  IPSecurityActionResponseDto,
  IPCheckResultDto,
} from '../dto/ip-security-responses.dto';
import type {
  IPRiskReport,
  IPRateLimitStatus,
} from '@xiaodashi/shared';

/**
 * IP安全管理控制器
 *
 * 提供完整的IP安全管理API，包括：
 * - IP黑名单管理（查询、添加、更新、删除）
 * - IP白名单管理（查询、添加、更新、删除）
 * - IP风险评估和查询
 * - IP频率限制管理
 * - 批量IP操作
 * - IP安全统计
 *
 * 权限控制：
 * - 所有端点都需要管理员权限（@Admin()）
 * - 统一的JWT认证和授权
 * - 完整的参数验证和错误处理
 */
@ApiTags('IP安全管理')
@Controller({ path: 'v1/security/ip', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IPSecurityController {
  constructor(
    private readonly blacklistService: IPBlacklistService,
    private readonly whitelistService: IPWhitelistService,
    private readonly riskAssessmentService: IPRiskAssessmentService,
    private readonly rateLimiterService: IPRateLimiterService,
  ) {}

  // ========== IP黑名单管理端点 ==========

  /**
   * 查询IP黑名单
   *
   * @param query 查询参数
   * @returns 分页的IP黑名单列表
   */
  @Get('admin/blacklist')
  @Admin()
  @ApiOperation({
    summary: '查询IP黑名单',
    description: '查询系统中的IP黑名单，支持多种筛选条件和分页',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '查询成功',
    type: IPBlacklistQueryResponseDto,
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
  async queryBlacklist(
    @Query() query: IPBlacklistQueryDto,
  ): Promise<IPBlacklistQueryResponseDto> {
    try {
      return await this.blacklistService.queryBlacklist(query);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`查询IP黑名单失败: ${errorMessage}`);
    }
  }

  /**
   * 添加IP到黑名单
   *
   * @param addBlacklistDto 添加黑名单请求
   * @param request HTTP请求对象
   * @returns 添加结果
   */
  @Post('admin/blacklist')
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '添加IP到黑名单',
    description: '将IP地址或IP段添加到黑名单中',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '添加成功',
    type: IPSecurityActionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误或IP已存在',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '未授权访问',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '权限不足，需要管理员权限',
  })
  async addToBlacklist(
    @Body() addBlacklistDto: AddIPBlacklistDto,
    @Request() req: ExpressRequest & { user: AuthenticatedUser },
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const adminUserId = req.user.id;
      const result = await this.blacklistService.addToBlacklist(
        addBlacklistDto,
        adminUserId,
      );

      return {
        success: true,
        message: `IP ${addBlacklistDto.ipAddress} 已成功添加到黑名单`,
        ipAddress: addBlacklistDto.ipAddress,
        action: 'add_blacklist',
        operatedAt: new Date().toISOString(),
        details: {
          id: result.id,
          type: result.type,
          severity: result.severity,
          expiresAt: result.expiresAt,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`添加IP黑名单失败: ${errorMessage}`);
    }
  }

  /**
   * 更新IP黑名单条目
   *
   * @param ipAddress IP地址
   * @param updateBlacklistDto 更新请求
   * @returns 更新结果
   */
  @Put('admin/blacklist/:ipAddress')
  @Admin()
  @ApiOperation({
    summary: '更新IP黑名单条目',
    description: '更新现有IP黑名单条目的信息',
  })
  @ApiParam({
    name: 'ipAddress',
    description: 'IP地址或CIDR',
    example: '192.168.1.0/24',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: IPSecurityActionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误或IP不存在',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IP黑名单条目不存在',
  })
  async updateBlacklist(
    @Param('ipAddress') ipAddress: string,
    @Body() updateBlacklistDto: UpdateIPBlacklistDto,
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const result = await this.blacklistService.updateBlacklist(
        ipAddress,
        updateBlacklistDto,
      );

      if (!result) {
        throw new NotFoundException(`IP ${ipAddress} 的黑名单条目不存在`);
      }

      return {
        success: true,
        message: `IP ${ipAddress} 的黑名单条目已更新`,
        ipAddress,
        action: 'update_blacklist',
        operatedAt: new Date().toISOString(),
        details: {
          id: result.id,
          type: result.type,
          severity: result.severity,
          expiresAt: result.expiresAt,
        },
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`更新IP黑名单失败: ${errorMessage}`);
    }
  }

  /**
   * 从黑名单中移除IP
   *
   * @param ipAddress IP地址
   * @returns 移除结果
   */
  @Delete('admin/blacklist/:ipAddress')
  @Admin()
  @ApiOperation({
    summary: '移除IP黑名单',
    description: '将IP地址从黑名单中移除',
  })
  @ApiParam({
    name: 'ipAddress',
    description: 'IP地址或CIDR',
    example: '192.168.1.0/24',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '移除成功',
    type: IPSecurityActionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IP黑名单条目不存在',
  })
  async removeFromBlacklist(
    @Param('ipAddress') ipAddress: string,
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const success =
        await this.blacklistService.removeFromBlacklist(ipAddress);

      if (!success) {
        throw new NotFoundException(`IP ${ipAddress} 不在黑名单中`);
      }

      return {
        success: true,
        message: `IP ${ipAddress} 已从黑名单中移除`,
        ipAddress,
        action: 'remove_blacklist',
        operatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`移除IP黑名单失败: ${errorMessage}`);
    }
  }

  // ========== IP白名单管理端点 ==========

  /**
   * 查询IP白名单
   *
   * @param query 查询参数
   * @returns 分页的IP白名单列表
   */
  @Get('admin/whitelist')
  @Admin()
  @ApiOperation({
    summary: '查询IP白名单',
    description: '查询系统中的IP白名单，支持多种筛选条件和分页',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '查询成功',
    type: IPWhitelistQueryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误',
  })
  async queryWhitelist(
    @Query() query: IPWhitelistQueryDto,
  ): Promise<IPWhitelistQueryResponseDto> {
    try {
      return await this.whitelistService.queryWhitelist(query);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`查询IP白名单失败: ${errorMessage}`);
    }
  }

  /**
   * 添加IP到白名单
   *
   * @param addWhitelistDto 添加白名单请求
   * @param request HTTP请求对象
   * @returns 添加结果
   */
  @Post('admin/whitelist')
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '添加IP到白名单',
    description: '将IP地址或IP段添加到白名单中',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '添加成功',
    type: IPSecurityActionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误或IP已存在',
  })
  async addToWhitelist(
    @Body() addWhitelistDto: AddIPWhitelistDto,
    @Request() req: ExpressRequest & { user: AuthenticatedUser },
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const adminUserId = req.user.id;
      const result = await this.whitelistService.addToWhitelist(
        addWhitelistDto,
        adminUserId,
      );

      return {
        success: true,
        message: `IP ${addWhitelistDto.ipAddress} 已成功添加到白名单`,
        ipAddress: addWhitelistDto.ipAddress,
        action: 'add_whitelist',
        operatedAt: new Date().toISOString(),
        details: {
          id: result.id,
          type: result.type,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`添加IP白名单失败: ${errorMessage}`);
    }
  }

  /**
   * 更新IP白名单条目
   *
   * @param ipAddress IP地址
   * @param updateWhitelistDto 更新请求
   * @returns 更新结果
   */
  @Put('admin/whitelist/:ipAddress')
  @Admin()
  @ApiOperation({
    summary: '更新IP白名单条目',
    description: '更新现有IP白名单条目的信息',
  })
  @ApiParam({
    name: 'ipAddress',
    description: 'IP地址或CIDR',
    example: '192.168.1.100',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: IPSecurityActionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IP白名单条目不存在',
  })
  async updateWhitelist(
    @Param('ipAddress') ipAddress: string,
    @Body() updateWhitelistDto: UpdateIPWhitelistDto,
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const result = await this.whitelistService.updateWhitelist(
        ipAddress,
        updateWhitelistDto,
      );

      if (!result) {
        throw new NotFoundException(`IP ${ipAddress} 的白名单条目不存在`);
      }

      return {
        success: true,
        message: `IP ${ipAddress} 的白名单条目已更新`,
        ipAddress,
        action: 'update_whitelist',
        operatedAt: new Date().toISOString(),
        details: {
          id: result.id,
          type: result.type,
        },
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`更新IP白名单失败: ${errorMessage}`);
    }
  }

  /**
   * 从白名单中移除IP
   *
   * @param ipAddress IP地址
   * @returns 移除结果
   */
  @Delete('admin/whitelist/:ipAddress')
  @Admin()
  @ApiOperation({
    summary: '移除IP白名单',
    description: '将IP地址从白名单中移除',
  })
  @ApiParam({
    name: 'ipAddress',
    description: 'IP地址或CIDR',
    example: '192.168.1.100',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '移除成功',
    type: IPSecurityActionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IP白名单条目不存在',
  })
  async removeFromWhitelist(
    @Param('ipAddress') ipAddress: string,
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const success =
        await this.whitelistService.removeFromWhitelist(ipAddress);

      if (!success) {
        throw new NotFoundException(`IP ${ipAddress} 不在白名单中`);
      }

      return {
        success: true,
        message: `IP ${ipAddress} 已从白名单中移除`,
        ipAddress,
        action: 'remove_whitelist',
        operatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`移除IP白名单失败: ${errorMessage}`);
    }
  }

  // ========== IP风险评估与查询端点 ==========

  /**
   * 获取IP风险报告
   *
   * @param ipAddress IP地址
   * @returns IP风险报告
   */
  @Get('admin/risk/:ipAddress')
  @Admin()
  @ApiOperation({
    summary: '获取IP风险报告',
    description: '评估指定IP地址的安全风险，返回详细的风险报告',
  })
  @ApiParam({
    name: 'ipAddress',
    description: '要评估的IP地址',
    example: '192.168.1.100',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '评估成功',
    schema: {
      type: 'object',
      properties: {
        ipAddress: { type: 'string', example: '192.168.1.100' },
        riskScore: { type: 'number', example: 75 },
        riskLevel: { type: 'string', example: 'high' },
        riskFactors: { type: 'array', items: { type: 'string' } },
        isBlacklisted: { type: 'boolean', example: false },
        isWhitelisted: { type: 'boolean', example: false },
        geolocation: { type: 'object', nullable: true },
        statistics: { type: 'object' },
        recommendation: { type: 'string', example: 'monitor' },
        assessedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'IP地址格式错误',
  })
  async getIPRiskReport(
    @Param('ipAddress') ipAddress: string,
  ): Promise<IPRiskReport> {
    try {
      return await this.riskAssessmentService.assessIPRisk(ipAddress);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`获取IP风险报告失败: ${errorMessage}`);
    }
  }

  /**
   * 批量IP检查
   *
   * @param batchCheckDto 批量检查请求
   * @returns 批量检查结果
   */
  @Post('admin/check')
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '批量IP检查',
    description: '批量检查多个IP地址的安全状态',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '检查完成',
    type: BatchIPCheckResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误',
  })
  async batchIPCheck(
    @Body() batchCheckDto: BatchIPCheckDto,
  ): Promise<BatchIPCheckResponseDto> {
    const startTime = Date.now();
    const results: IPCheckResultDto[] = [];
    let allowedCount = 0;
    let blockedCount = 0;
    let highRiskCount = 0;

    try {
      // 并行处理所有IP检查
      const checkPromises = batchCheckDto.ipAddresses.map(async (ipAddress) => {
        try {
          const riskReport =
            await this.riskAssessmentService.assessIPRisk(ipAddress);
          const rateLimitStatus =
            await this.rateLimiterService.getRateLimitStatus(
              ipAddress,
              'login',
            );

          const result: IPCheckResultDto = {
            ipAddress,
            allowed: riskReport.recommendation !== 'block',
            reason:
              riskReport.recommendation === 'block' ? 'IP风险过高' : undefined,
            riskScore: riskReport.riskScore,
            isBlacklisted: riskReport.isBlacklisted,
            isWhitelisted: riskReport.isWhitelisted,
            isRateLimited: rateLimitStatus?.isLimited || false,
            rateLimitStatus: rateLimitStatus || undefined,
            requiresCaptcha: riskReport.recommendation === 'captcha',
            riskReport,
          };

          // 统计计数
          if (result.allowed) {
            allowedCount++;
          } else {
            blockedCount++;
          }
          if (riskReport.riskScore >= 80) {
            highRiskCount++;
          }

          return result;
        } catch (error) {
          // 单个IP检查失败时返回默认结果
          return {
            ipAddress,
            allowed: false,
            reason: '检查失败',
            riskScore: 100,
            isBlacklisted: false,
            isWhitelisted: false,
            isRateLimited: false,
            requiresCaptcha: true,
          };
        }
      });

      const settledResults = await Promise.allSettled(checkPromises);

      // 处理结果
      settledResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      });

      const processingTime = Date.now() - startTime;

      return {
        results,
        total: batchCheckDto.ipAddresses.length,
        allowedCount,
        blockedCount,
        highRiskCount,
        processingTimeMs: processingTime,
        checkedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`批量IP检查失败: ${errorMessage}`);
    }
  }

  // ========== IP频率限制管理端点 ==========

  /**
   * 查询IP频率限制状态
   *
   * @param ipAddress IP地址
   * @param action 动作类型
   * @returns 频率限制状态
   */
  @Get('admin/rate-limit/:ipAddress')
  @Admin()
  @ApiOperation({
    summary: '查询IP频率限制状态',
    description: '查询指定IP地址的频率限制状态',
  })
  @ApiParam({
    name: 'ipAddress',
    description: 'IP地址',
    example: '192.168.1.100',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '查询成功',
    schema: {
      type: 'object',
      properties: {
        ipAddress: { type: 'string', example: '192.168.1.100' },
        action: { type: 'string', example: 'login' },
        isLimited: { type: 'boolean', example: false },
        requestsInWindow: { type: 'number', example: 3 },
        maxRequests: { type: 'number', example: 5 },
        windowStartAt: { type: 'string', example: '2024-01-15T10:25:00Z' },
        windowEndAt: { type: 'string', example: '2024-01-15T10:40:00Z' },
        blockedUntil: { type: 'string', nullable: true },
        resetAt: { type: 'string', example: '2024-01-15T10:40:00Z' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IP频率限制记录不存在',
  })
  async getRateLimitStatus(
    @Param('ipAddress') ipAddress: string,
    @Query('action') action: string = 'login',
  ): Promise<IPRateLimitStatus | null> {
    try {
      return await this.rateLimiterService.getRateLimitStatus(
        ipAddress,
        action,
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`查询频率限制状态失败: ${errorMessage}`);
    }
  }

  /**
   * 手动封禁IP
   *
   * @param ipAddress IP地址
   * @param blockDto 封禁请求
   * @returns 封禁结果
   */
  @Post('admin/rate-limit/:ipAddress/block')
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '手动封禁IP',
    description: '手动对IP地址进行频率限制封禁',
  })
  @ApiParam({
    name: 'ipAddress',
    description: '要封禁的IP地址',
    example: '192.168.1.100',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '封禁成功',
    type: IPSecurityActionResponseDto,
  })
  async blockIP(
    @Param('ipAddress') ipAddress: string,
    @Body() blockDto: ManualBlockIPDto,
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const success = await this.rateLimiterService.blockIP(
        ipAddress,
        'login',
        blockDto.duration,
      );

      if (!success) {
        throw new InternalServerErrorException('封禁操作失败');
      }

      return {
        success: true,
        message: `IP ${ipAddress} 已被手动封禁 ${blockDto.duration} 分钟`,
        ipAddress,
        action: 'manual_block',
        operatedAt: new Date().toISOString(),
        details: {
          duration: blockDto.duration,
          reason: blockDto.reason,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`手动封禁IP失败: ${errorMessage}`);
    }
  }

  /**
   * 解除IP封禁
   *
   * @param ipAddress IP地址
   * @returns 解封结果
   */
  @Post('admin/rate-limit/:ipAddress/unblock')
  @Admin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '解除IP封禁',
    description: '解除IP地址的频率限制封禁',
  })
  @ApiParam({
    name: 'ipAddress',
    description: '要解封的IP地址',
    example: '192.168.1.100',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '解封成功',
    type: IPSecurityActionResponseDto,
  })
  async unblockIP(
    @Param('ipAddress') ipAddress: string,
  ): Promise<IPSecurityActionResponseDto> {
    try {
      const success = await this.rateLimiterService.unblockIP(
        ipAddress,
        'login',
      );

      if (!success) {
        throw new NotFoundException(`IP ${ipAddress} 未被封禁`);
      }

      return {
        success: true,
        message: `IP ${ipAddress} 已解除封禁`,
        ipAddress,
        action: 'manual_unblock',
        operatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`解除IP封禁失败: ${errorMessage}`);
    }
  }

  // ========== IP安全统计端点 ==========

  /**
   * 获取IP安全统计信息
   *
   * @returns IP安全统计信息
   */
  @Get('admin/statistics')
  @Admin()
  @ApiOperation({
    summary: '获取IP安全统计信息',
    description:
      '获取IP安全相关的统计数据，包括黑名单、白名单、频率限制等统计信息',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '查询成功',
    type: IPSecurityStatisticsDto,
  })
  async getSecurityStatistics(): Promise<IPSecurityStatisticsDto> {
    try {
      const [blacklistStats, whitelistStats, rateLimitStats] =
        await Promise.all([
          this.blacklistService.getStatistics(),
          this.whitelistService.getStatistics(),
          this.rateLimiterService.getStatistics(),
        ]);

      return {
        blacklist: {
          total: blacklistStats.total,
          active: blacklistStats.active,
          bySeverity: blacklistStats.bySeverity,
          byType: blacklistStats.byType,
        },
        whitelist: {
          total: whitelistStats.total,
          active: whitelistStats.active,
          byType: whitelistStats.byType,
        },
        rateLimit: {
          total: rateLimitStats.total,
          blocked: rateLimitStats.blocked,
          byAction: rateLimitStats.byAction,
        },
        todayStats: {
          totalRequests: 0, // TODO: 实现今日统计
          blockedRequests: 0,
          highRiskIPs: 0,
          newBlacklistedIPs: 0,
        },
        updatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`获取安全统计失败: ${errorMessage}`);
    }
  }
}
