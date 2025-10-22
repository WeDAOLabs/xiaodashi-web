import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 加入团队请求DTO
 */
export class JoinTeamDto {
  @ApiProperty({
    description: '邀请令牌',
    example: 'abc123def456...',
  })
  @IsString({ message: '邀请令牌必须是字符串' })
  @IsNotEmpty({ message: '邀请令牌不能为空' })
  token: string;
}
