import { ApiProperty } from '@nestjs/swagger';
import { PointTransactionType } from '@xiaodashi/shared';

/**
 * 积分交易记录 DTO
 */
export class PointTransactionDto {
  @ApiProperty({
    description: '交易记录ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  id: string;

  @ApiProperty({
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  teamId: string;

  @ApiProperty({
    description: '操作用户ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  userId: string;

  @ApiProperty({
    description: '交易类型',
    enum: PointTransactionType,
    example: PointTransactionType.CONSUMPTION,
  })
  type: PointTransactionType;

  @ApiProperty({
    description: '交易金额，负数为消耗',
    example: -10.5,
  })
  amount: number;

  @ApiProperty({
    description: '交易后余额',
    example: 990.0,
  })
  balanceAfter: number;

  @ApiProperty({
    description: '交易描述',
    example: '使用AI工具消耗积分',
  })
  description: string;

  @ApiProperty({
    description: '关联业务ID',
    required: false,
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  businessId?: string;

  @ApiProperty({
    description: '业务类型',
    required: false,
    nullable: true,
    example: 'tool_usage',
  })
  businessType?: string;

  @ApiProperty({
    description: '交易时间',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: string;
}
