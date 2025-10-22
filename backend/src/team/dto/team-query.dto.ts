import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TeamTier } from '@xiaodashi/shared';
import { PaginationDto } from './pagination.dto';

/**
 * 团队查询参数DTO
 */
export class TeamQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: '团队名称搜索关键词',
    example: '开发',
  })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  @MaxLength(100, { message: '搜索关键词不能超过100个字符' })
  search?: string;

  @ApiPropertyOptional({
    description: '按团队等级筛选',
    enum: TeamTier,
    example: TeamTier.PRO,
  })
  @IsOptional()
  @IsEnum(TeamTier, { message: '团队等级必须是有效的枚举值' })
  tier?: TeamTier;

  @ApiPropertyOptional({
    description: '按所有者筛选',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString({ message: '所有者ID必须是字符串' })
  ownerId?: string;
}
