import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeamRoleType } from '@xiaodashi/shared';

/**
 * 创建团队邀请请求DTO
 */
export class CreateInvitationDto {
  @ApiProperty({
    description: '被邀请者邮箱地址',
    example: 'john@example.com',
  })
  @IsString({ message: '邮箱地址必须是字符串' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(320, { message: '邮箱地址不能超过320个字符' })
  email: string;

  @ApiPropertyOptional({
    description: '被邀请者加入后的角色',
    enum: TeamRoleType,
    example: TeamRoleType.MEMBER,
    default: TeamRoleType.MEMBER,
  })
  @IsOptional()
  @IsEnum(TeamRoleType, { message: '角色必须是有效的枚举值' })
  role?: TeamRoleType = TeamRoleType.MEMBER;
}
