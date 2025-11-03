import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransaction } from '../database/entities/points/point-transaction.entity';
import { TeamPoint } from '../database/entities/points/team-point.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';
import { TeamRoleGuard } from '../team/guards/team-role.guard';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

/**
 * 积分模块
 *
 * 提供积分管理的完整功能模块，包含：
 * - 积分余额查询和管理
 * - 积分交易记录查询
 * - 积分消耗和充值（事务保证）
 * - 初始积分发放
 *
 * 该模块可被其他模块（如支付模块、工具服务模块）导入使用
 */
@Module({
  imports: [
    // 注册积分相关实体以供 PointsService 使用
    TypeOrmModule.forFeature([TeamPoint, PointTransaction, TeamMember]),
  ],
  providers: [
    // 积分服务 - 提供核心的积分管理功能
    PointsService,
    // 注册 TeamRoleGuard 以供 PointsController 使用
    TeamRoleGuard,
  ],
  controllers: [
    // 积分控制器 - 提供积分管理API端点
    PointsController,
  ],
  exports: [
    // 导出积分服务供其他模块使用（如支付回调、工具计费等）
    PointsService,
  ],
})
export class PointsModule {}
