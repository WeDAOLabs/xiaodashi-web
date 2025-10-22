import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRoleType, TeamTier } from '@xiaodashi/shared';
import type { QueryRunner, Repository } from 'typeorm';
import { Team } from '../database/entities/team/team.entity';
import { TeamMember } from '../database/entities/team/team-member.entity';

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
}
