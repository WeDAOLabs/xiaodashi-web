import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { CaptchaType } from '@xiaodashi/shared';

/**
 * 验证码生成请求DTO
 */
export class CaptchaGenerateDto {
  @ApiProperty({
    description: '验证码类型',
    enum: CaptchaType,
    enumName: 'CaptchaType',
    example: CaptchaType.IMAGE,
    required: false,
  })
  @IsOptional()
  @IsEnum(CaptchaType, { message: '验证码类型必须是 image 或 slider' })
  type?: CaptchaType;

  @ApiProperty({
    description: '验证码复杂度 (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '复杂度必须是数字' })
  @Min(1, { message: '复杂度最小为1' })
  @Max(5, { message: '复杂度最大为5' })
  complexity?: number;
}

/**
 * 验证码生成响应DTO
 */
export class CaptchaGenerateResponseDto {
  @ApiProperty({
    description: '会话ID，用于验证时提交',
    example: 'captcha_1k2j3h4g5f6d7s8a9b0c',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'Base64编码的验证码图片（图形验证码）',
    example:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
    required: false,
  })
  @IsOptional()
  captchaImage?: string;

  @ApiProperty({
    description: '滑动验证数据（滑动验证码）',
    required: false,
    example: {
      backgroundImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      puzzlePiece:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      xPosition: 150,
      tolerance: 5,
    },
  })
  @IsOptional()
  sliderData?: {
    backgroundImage: string;
    puzzlePiece: string;
    xPosition: number;
    tolerance: number;
  };

  @ApiProperty({
    description: '过期时间（ISO 8601格式）',
    example: '2025-01-15T10:30:00Z',
  })
  expiresAt!: string;
}

/**
 * 验证码验证请求DTO
 */
export class CaptchaVerifyDto {
  @ApiProperty({
    description: '会话ID',
    example: 'captcha_1k2j3h4g5f6d7s8a9b0c',
  })
  @IsString({ message: '会话ID必须是字符串' })
  @Matches(/^captcha_[a-z0-9]+_[a-z0-9]+$/, { message: '会话ID格式不正确' })
  sessionId!: string;

  @ApiProperty({
    description: '用户输入的验证码或滑动位置',
    example: '1234',
  })
  @IsString({ message: '验证码必须是字符串' })
  code!: string;
}

/**
 * 验证码验证响应DTO
 */
export class CaptchaVerifyResponseDto {
  @ApiProperty({
    description: '验证是否成功',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: '响应消息',
    example: '验证码验证成功',
  })
  message!: string;

  @ApiProperty({
    description: '剩余尝试次数',
    example: 3,
    required: false,
  })
  @IsOptional()
  attemptsRemaining?: number;
}

/**
 * 验证码必需检查响应DTO
 */
export class CaptchaRequiredResponseDto {
  @ApiProperty({
    description: '是否需要验证码',
    example: true,
  })
  required!: boolean;

  @ApiProperty({
    description: '需要验证码的原因',
    enum: ['failed_attempts', 'suspicious_ip', 'high_risk_location'],
    enumName: 'CaptchaReason',
    example: 'failed_attempts',
    required: false,
  })
  @IsOptional()
  reason?: 'failed_attempts' | 'suspicious_ip' | 'high_risk_location';

  @ApiProperty({
    description: '预生成的会话ID',
    example: 'captcha_1k2j3h4g5f6d7s8a9b0c',
    required: false,
  })
  @IsOptional()
  sessionId?: string;

  @ApiProperty({
    description: '要求的验证码类型',
    enum: CaptchaType,
    enumName: 'CaptchaType',
    example: CaptchaType.IMAGE,
    required: false,
  })
  @IsOptional()
  requiredType?: CaptchaType;
}

/**
 * 验证码统计信息DTO
 */
export class CaptchaStatisticsDto {
  @ApiProperty({
    description: '总会话数',
    example: 1000,
  })
  totalSessions!: number;

  @ApiProperty({
    description: '活跃会话数',
    example: 150,
  })
  activeSessions!: number;

  @ApiProperty({
    description: '过期会话数',
    example: 800,
  })
  expiredSessions!: number;

  @ApiProperty({
    description: '已使用会话数',
    example: 120,
  })
  usedSessions!: number;

  @ApiProperty({
    description: '已验证会话数',
    example: 100,
  })
  verifiedSessions!: number;
}
