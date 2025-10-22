import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './team.service';
import { Team } from '../database/entities/team/team.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';

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
    // 注册 Team 和 TeamMember 实体以供 TeamService 使用
    TypeOrmModule.forFeature([Team, TeamMember]),
  ],
  providers: [
    // 团队服务 - 提供核心的团队管理功能
    TeamService,
  ],
  exports: [
    // 导出团队服务供其他模块使用
    TeamService,
  ],
})
export class TeamModule {}
