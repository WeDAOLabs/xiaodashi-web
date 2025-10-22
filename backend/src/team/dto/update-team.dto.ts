import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 更新团队信息请求DTO
 */
export class UpdateTeamDto {
  @ApiPropertyOptional({
    description: '团队名称',
    maxLength: 100,
    example: '开发团队',
  })
  @IsOptional()
  @IsString({ message: '团队名称必须是字符串' })
  @MaxLength(100, { message: '团队名称不能超过100个字符' })
  name?: string;
}
