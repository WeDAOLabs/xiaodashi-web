import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * 锁定状态查询DTO
 */
export class LockStatusQueryDto {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;
}

/**
 * 管理员解锁账户请求DTO
 */
export class UnlockAccountDto {
  @ApiProperty({
    description: '要解锁的用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: '解锁原因',
    example: '用户已确认身份，申请解锁',
    minLength: 1,
    maxLength: 500,
  })
  reason: string;
}
