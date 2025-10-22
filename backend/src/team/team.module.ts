import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamRoleGuard } from './guards/team-role.guard';
import { Team } from '../database/entities/team/team.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';
import { TeamInvitation } from '../database/entities/team/team-invitation.entity';
import { User } from '../database/entities/user/user.entity';

/**
 * 团队模块
 *
 * 提供团队管理的完整功能模块，包含：
 * - 团队创建和管理服务
 * - 团队成员关系管理
 * - 支持事务化操作
 *
 * 该模块可被其他模块（如 AuthModule）导入使用
 */
@Module({
  imports: [
    // 注册团队相关实体以供 TeamService 使用
    TypeOrmModule.forFeature([Team, TeamMember, TeamInvitation, User]),
  ],
  controllers: [
    // 团队控制器 - 提供团队管理API端点
    TeamController,
  ],
  providers: [
    // 团队服务 - 提供核心的团队管理功能
    TeamService,
    // 团队角色权限守卫
    TeamRoleGuard,
  ],
  exports: [
    // 导出团队服务供其他模块使用
    TeamService,
  ],
})
export class TeamModule {}
