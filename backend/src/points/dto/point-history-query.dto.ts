import { ApiPropertyOptional } from '@nestjs/swagger';
import { PointTransactionType } from '@xiaodashi/shared';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * 积分历史查询参数DTO
 */
export class PointHistoryQueryDto {
  @ApiPropertyOptional({
    description: '页码，从1开始',
    example: 1,
    minimum: 1,
    maximum: 1000,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码不能小于1' })
  @Max(1000, { message: '页码不能大于1000' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量不能小于1' })
  @Max(100, { message: '每页数量不能大于100' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '交易类型筛选',
    enum: PointTransactionType,
    example: PointTransactionType.CONSUMPTION,
  })
  @IsOptional()
  @IsEnum(PointTransactionType, { message: '交易类型无效' })
  type?: PointTransactionType;

  @ApiPropertyOptional({
    description: '开始日期，ISO 8601 格式',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsString({ message: '开始日期格式错误' })
  startDate?: string;

  @ApiPropertyOptional({
    description: '结束日期，ISO 8601 格式',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsString({ message: '结束日期格式错误' })
  endDate?: string;

  @ApiPropertyOptional({
    description: '业务类型筛选',
    example: 'payment',
  })
  @IsOptional()
  @IsString({ message: '业务类型必须是字符串' })
  businessType?: string;
}
