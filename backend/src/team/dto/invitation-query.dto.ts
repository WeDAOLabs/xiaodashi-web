import { IsOptional, IsInt, Max, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvitationStatus } from '@xiaodashi/shared';

/**
 * 邀请查询参数DTO
 */
export class InvitationQueryDto {
  @ApiProperty({
    description: '页码，从1开始',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  page?: number = 1;

  @ApiProperty({
    description: '每页数量，最大100',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小为1' })
  @Max(100, { message: '每页数量最大为100' })
  limit?: number = 20;

  @ApiProperty({
    description: '邀请状态筛选',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
  })
  @IsOptional()
  @Type(() => String)
  status?: InvitationStatus;

  @ApiProperty({
    description: '按邮箱筛选',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString({ message: '邮箱必须是字符串' })
  email?: string;
}
