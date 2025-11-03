import { ApiProperty } from '@nestjs/swagger';
import { PointStatus } from '@xiaodashi/shared';

/**
 * 查询团队积分余额响应 DTO
 */
export class GetTeamPointsResponseDto {
  @ApiProperty({
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  teamId: string;

  @ApiProperty({
    description: '当前积分余额',
    example: 1000.5,
  })
  balance: number;

  @ApiProperty({
    description: '积分状态',
    enum: PointStatus,
    example: PointStatus.ACTIVE,
  })
  status: PointStatus;

  @ApiProperty({
    description: '积分过期时间',
    required: false,
    nullable: true,
    example: '2024-12-31T23:59:59Z',
  })
  expiresAt?: string;

  @ApiProperty({
    description: '最后交易时间',
    required: false,
    nullable: true,
    example: '2024-01-15T10:30:00Z',
  })
  lastTransactionAt?: string;
}
