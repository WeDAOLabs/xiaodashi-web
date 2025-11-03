import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 积分充值请求DTO
 */
export class RechargePointsDto {
  @ApiProperty({
    description: '团队ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: '团队ID不能为空' })
  @IsUUID('4', { message: '团队ID格式错误' })
  teamId: string;

  @ApiProperty({
    description: '操作用户ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsUUID('4', { message: '用户ID格式错误' })
  userId: string;

  @ApiProperty({
    description: '充值金额，必须为正数',
    example: 100.5,
    minimum: 0.0001,
  })
  @IsNotEmpty({ message: '充值金额不能为空' })
  @IsNumber(
    { maxDecimalPlaces: 4 },
    { message: '充值金额必须是数字，最多支持4位小数' },
  )
  @IsPositive({ message: '充值金额必须大于0' })
  amount: number;

  @ApiProperty({
    description: '交易描述',
    example: '通过支付订单充值积分',
  })
  @IsNotEmpty({ message: '交易描述不能为空' })
  @IsString({ message: '交易描述必须是字符串' })
  description: string;

  @ApiPropertyOptional({
    description: '关联业务ID（如订单ID）',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @IsUUID('4', { message: '业务ID格式错误' })
  businessId?: string;

  @ApiPropertyOptional({
    description: '业务类型',
    example: 'payment',
  })
  @IsOptional()
  @IsString({ message: '业务类型必须是字符串' })
  businessType?: string;
}
