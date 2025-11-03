import { ApiProperty } from '@nestjs/swagger';
import { PointTransactionDto } from './point-transaction.dto';

/**
 * 创建交易（充值）响应 DTO
 */
export class CreateTransactionResponseDto {
  @ApiProperty({
    description: '交易记录',
    type: PointTransactionDto,
  })
  transaction: PointTransactionDto;

  @ApiProperty({
    description: '交易后新余额',
    example: 1100.5,
  })
  newBalance: number;
}
