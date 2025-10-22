import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRoleType, AuthenticatedUser } from '@xiaodashi/shared';
import { Repository } from 'typeorm';
import { TeamMember } from '../../database/entities/team/team-member.entity';

// 扩展 Request 接口以包含认证用户信息
interface RequestWithUser {
  user: AuthenticatedUser;
  params: {
    teamId?: string;
  };
}

/**
 * 团队角色权限守卫
 *
 * 用于保护需要特定团队角色权限的API端点
 * 支持多种权限检查模式：
 * - 检查用户是否为团队成员
 * - 检查用户是否具有特定角色
 * - 检查用户是否具有多个角色中的任意一个
 */
@Injectable()
export class TeamRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}

  /**
   * 判断是否可以激活路由
   *
   * @param context - 执行上下文
   * @returns Promise<boolean> - 是否允许访问
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从装饰器获取所需的团队角色要求
    const requiredRoles = this.reflector.getAllAndOverride<TeamRoleType[]>(
      'teamRoles',
      [context.getHandler(), context.getClass()],
    );

    // 如果没有指定角色要求，只检查是否为团队成员
    const requireMembership = this.reflector.getAllAndOverride<boolean>(
      'requireTeamMembership',
      [context.getHandler(), context.getClass()],
    );

    // 如果没有角色要求也不需要成员身份，直接通过
    if (!requiredRoles && !requireMembership) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user: AuthenticatedUser = request.user; // 从JWT守卫获取的用户信息
    const teamId: string = request.params.teamId!; // 从路径参数获取团队ID

    // 验证必需参数
    if (!user?.id) {
      throw new ForbiddenException('用户认证信息缺失');
    }

    if (!teamId) {
      throw new ForbiddenException('团队ID缺失');
    }

    // 查询用户的团队成员信息
    const teamMember = await this.teamMemberRepository.findOne({
      where: { teamId, userId: user.id },
    });

    // 检查是否为团队成员
    if (!teamMember) {
      throw new ForbiddenException('您不是该团队的成员');
    }

    // 如果指定了角色要求，检查用户角色
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.includes(teamMember.role);
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          `您的角色权限不足，需要以下角色之一: ${requiredRoles.join(', ')}`,
        );
      }
    }

    return true;
  }
}

/**
 * 团队角色装饰器
 *
 * 用于指定访问特定路由所需的团队角色
 *
 * @param roles - 允许访问的团队角色列表
 *
 * @example
 * ```typescript
 * @TeamRoles(TeamRoleType.OWNER)
 * @Patch(':teamId')
 * updateTeam() {
 *   // 只有团队所有者可以访问
 * }
 *
 * @TeamRoles(TeamRoleType.OWNER, TeamRoleType.ADMIN)
 * @Post(':teamId/invitations')
 * createInvitation() {
 *   // 团队所有者和管理员都可以访问
 * }
 * ```
 */

export const TEAM_ROLES_KEY = 'teamRoles';
export const TeamRoles = (...roles: TeamRoleType[]) =>
  SetMetadata(TEAM_ROLES_KEY, roles);

/**
 * 团队成员身份装饰器
 *
 * 用于指定访问特定路由需要是团队成员（不限制具体角色）
 *
 * @example
 * ```typescript
 * @RequireTeamMembership()
 * @Get(':teamId')
 * getTeam() {
 *   // 只有团队成员可以访问
 * }
 * ```
 */
export const TEAM_MEMBERSHIP_KEY = 'requireTeamMembership';
export const RequireTeamMembership = () =>
  SetMetadata(TEAM_MEMBERSHIP_KEY, true);
