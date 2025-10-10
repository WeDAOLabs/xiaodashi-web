import { IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type {
  RevokeSessionRequest,
  RevokeAllSessionsRequest,
} from '@xiaodashi/shared';

/**
 * 撤销会话DTO
 */
export class RevokeSessionDto implements RevokeSessionRequest {
  @ApiProperty({
    description: '会话ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  sessionId!: string;
}

/**
 * 撤销所有会话DTO
 */
export class RevokeAllSessionsDto implements RevokeAllSessionsRequest {
  @ApiProperty({
    description: '是否保留当前会话',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  exceptCurrentSession?: boolean;
}
