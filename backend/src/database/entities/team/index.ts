/**
 * 团队域实体导出
 * 包含团队相关的所有数据库实体
 */

// 导入团队域实体
import { Team } from './team.entity';
import { TeamMember } from './team-member.entity';
import { TeamInvitation } from './team-invitation.entity';
import { TeamRole } from './team-role.entity';

// 导出实体
export { Team } from './team.entity';
export { TeamMember } from './team-member.entity';
export { TeamInvitation } from './team-invitation.entity';
export { TeamRole } from './team-role.entity';

// 团队域实体数组，用于 TypeORM 配置
export const teamEntities = [Team, TeamMember, TeamInvitation, TeamRole];
