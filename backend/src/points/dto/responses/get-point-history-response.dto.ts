import { ApiProperty } from '@nestjs/swagger';
import { PointTransactionDto } from './point-transaction.dto';
import { PaginationDto } from './pagination.dto';

/**
 * 查询积分交易历史响应 DTO
 */
export class GetPointHistoryResponseDto {
  @ApiProperty({
    description: '交易记录列表',
    type: [PointTransactionDto],
  })
  transactions: PointTransactionDto[];

  @ApiProperty({
    description: '分页信息',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
