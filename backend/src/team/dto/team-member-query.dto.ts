import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TeamRoleType } from '@xiaodashi/shared';
import { PaginationDto } from './pagination.dto';

/**
 * 团队成员查询参数DTO
 */
export class TeamMemberQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: '按角色筛选',
    enum: TeamRoleType,
    example: TeamRoleType.MEMBER,
  })
  @IsOptional()
  @IsEnum(TeamRoleType, { message: '角色必须是有效的枚举值' })
  role?: TeamRoleType;

  @ApiPropertyOptional({
    description: '按显示名称或邮箱搜索',
    example: '张三',
  })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  @MaxLength(100, { message: '搜索关键词不能超过100个字符' })
  search?: string;
}
