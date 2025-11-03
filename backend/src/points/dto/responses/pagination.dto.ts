import { ApiProperty } from '@nestjs/swagger';

/**
 * 分页信息 DTO
 */
export class PaginationDto {
  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: '总记录数',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: '总页数',
    example: 5,
  })
  totalPages: number;
}
