import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  IsNotEmpty,
  Min,
  Max,
  Matches,
  ArrayNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IPType,
  ThreatSeverity,
  IPBlacklistQueryParams,
  IPWhitelistQueryParams,
} from '@xiaodashi/shared';

/**
 * IP黑名单查询参数DTO
 */
export class IPBlacklistQueryDto implements IPBlacklistQueryParams {
  @ApiPropertyOptional({
    description: 'IP地址或CIDR',
    example: '192.168.1.0/24',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/,
    {
      message: 'IP地址格式不正确，支持IPv4和CIDR格式',
    },
  )
  ipAddress?: string;

  @ApiPropertyOptional({
    description: '威胁严重程度',
    enum: ThreatSeverity,
    example: ThreatSeverity.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ThreatSeverity, { message: '威胁严重程度必须是有效的枚举值' })
  severity?: ThreatSeverity;

  @ApiPropertyOptional({
    description: '是否生效',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive必须是布尔值' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page必须是数字' })
  @Min(1, { message: 'page必须大于0' })
  page?: number;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'pageSize必须是数字' })
  @Min(1, { message: 'pageSize必须大于0' })
  @Max(100, { message: 'pageSize不能超过100' })
  pageSize?: number;

  @ApiPropertyOptional({
    description: '排序字段',
    example: 'blockedAt',
    default: 'blockedAt',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['blockedAt', 'severity', 'expiresAt'], {
    message: 'sortBy字段必须是有效的值',
  })
  sortBy?: 'blockedAt' | 'severity' | 'expiresAt';

  @ApiPropertyOptional({
    description: '排序方向',
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'], { message: 'sortOrder必须是ASC或DESC' })
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * 添加IP黑名单请求DTO
 */
export class AddIPBlacklistDto {
  @ApiProperty({
    description: 'IP地址或CIDR格式的IP段',
    example: '192.168.1.0/24',
  })
  @IsString({ message: 'IP地址不能为空' })
  @IsNotEmpty({ message: 'IP地址不能为空' })
  @Matches(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/,
    {
      message: 'IP地址格式不正确，支持IPv4和CIDR格式',
    },
  )
  ipAddress: string;

  @ApiProperty({
    description: 'IP类型',
    enum: IPType,
    example: IPType.RANGE,
  })
  @IsEnum(IPType, { message: 'IP类型必须是有效的枚举值' })
  type: IPType;

  @ApiProperty({
    description: '封禁原因',
    example: '暴力破解攻击',
  })
  @IsString({ message: '封禁原因不能为空' })
  @IsNotEmpty({ message: '封禁原因不能为空' })
  @MinLength(2, { message: '封禁原因至少2个字符' })
  @MaxLength(200, { message: '封禁原因不能超过200个字符' })
  reason: string;

  @ApiProperty({
    description: '威胁严重程度',
    enum: ThreatSeverity,
    example: ThreatSeverity.HIGH,
  })
  @IsEnum(ThreatSeverity, { message: '威胁严重程度必须是有效的枚举值' })
  severity: ThreatSeverity;

  @ApiPropertyOptional({
    description: '封禁时长（分钟），不提供则永久封禁',
    example: 1440,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '封禁时长必须是数字' })
  @Min(1, { message: '封禁时长必须大于0' })
  @Max(525600, { message: '封禁时长不能超过525600分钟（365天）' })
  duration?: number;

  @ApiPropertyOptional({
    description: '额外元数据',
    example: { source: 'auto_detection', threatLevel: 'critical' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

/**
 * 更新IP黑名单请求DTO
 */
export class UpdateIPBlacklistDto {
  @ApiPropertyOptional({
    description: '封禁原因',
    example: '更新后的封禁原因',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '封禁原因至少2个字符' })
  @MaxLength(200, { message: '封禁原因不能超过200个字符' })
  reason?: string;

  @ApiPropertyOptional({
    description: '威胁严重程度',
    enum: ThreatSeverity,
    example: ThreatSeverity.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ThreatSeverity, { message: '威胁严重程度必须是有效的枚举值' })
  severity?: ThreatSeverity;

  @ApiPropertyOptional({
    description: '是否生效',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive必须是布尔值' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '封禁时长（分钟），不提供则永久封禁',
    example: 2880,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '封禁时长必须是数字' })
  @Min(1, { message: '封禁时长必须大于0' })
  @Max(525600, { message: '封禁时长不能超过525600分钟（365天）' })
  duration?: number;
}

/**
 * IP白名单查询参数DTO
 */
export class IPWhitelistQueryDto implements IPWhitelistQueryParams {
  @ApiPropertyOptional({
    description: 'IP地址或CIDR',
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/,
    {
      message: 'IP地址格式不正确，支持IPv4和CIDR格式',
    },
  )
  ipAddress?: string;

  @ApiPropertyOptional({
    description: '是否生效',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive必须是布尔值' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '页码',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page必须是数字' })
  @Min(1, { message: 'page必须大于0' })
  page?: number;

  @ApiPropertyOptional({
    description: '每页数量',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'pageSize必须是数字' })
  @Min(1, { message: 'pageSize必须大于0' })
  @Max(100, { message: 'pageSize不能超过100' })
  pageSize?: number;
}

/**
 * 添加IP白名单请求DTO
 */
export class AddIPWhitelistDto {
  @ApiProperty({
    description: 'IP地址或CIDR格式的IP段',
    example: '192.168.1.100',
  })
  @IsString({ message: 'IP地址不能为空' })
  @IsNotEmpty({ message: 'IP地址不能为空' })
  @Matches(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/,
    {
      message: 'IP地址格式不正确，支持IPv4和CIDR格式',
    },
  )
  ipAddress: string;

  @ApiProperty({
    description: 'IP类型',
    enum: IPType,
    example: IPType.SINGLE,
  })
  @IsEnum(IPType, { message: 'IP类型必须是有效的枚举值' })
  type: IPType;

  @ApiProperty({
    description: '描述信息',
    example: '公司办公网络',
  })
  @IsString({ message: '描述信息不能为空' })
  @IsNotEmpty({ message: '描述信息不能为空' })
  @MinLength(2, { message: '描述信息至少2个字符' })
  @MaxLength(200, { message: '描述信息不能超过200个字符' })
  description: string;
}

/**
 * 更新IP白名单请求DTO
 */
export class UpdateIPWhitelistDto {
  @ApiPropertyOptional({
    description: '描述信息',
    example: '更新后的描述信息',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '描述信息至少2个字符' })
  @MaxLength(200, { message: '描述信息不能超过200个字符' })
  description?: string;

  @ApiPropertyOptional({
    description: '是否生效',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive必须是布尔值' })
  isActive?: boolean;
}

/**
 * 批量IP检查请求DTO
 */
export class BatchIPCheckDto {
  @ApiProperty({
    description: 'IP地址列表',
    example: ['192.168.1.100', '10.0.0.1', '172.16.0.1'],
    minItems: 1,
    maxItems: 50,
  })
  @IsArray({ message: 'IP地址列表必须是数组' })
  @ArrayNotEmpty({ message: 'IP地址列表不能为空' })
  @IsString({ each: true, message: '每个IP地址必须是字符串' })
  @Matches(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    {
      each: true,
      message: 'IP地址格式不正确',
    },
  )
  ipAddresses: string[];
}

/**
 * 手动封禁IP请求DTO
 */
export class ManualBlockIPDto {
  @ApiProperty({
    description: '封禁时长（分钟）',
    example: 60,
  })
  @IsNumber({}, { message: '封禁时长必须是数字' })
  @Min(1, { message: '封禁时长必须大于0' })
  @Max(525600, { message: '封禁时长不能超过525600分钟（365天）' })
  duration: number;

  @ApiPropertyOptional({
    description: '封禁原因',
    example: '管理员手动封禁',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '封禁原因至少2个字符' })
  @MaxLength(200, { message: '封禁原因不能超过200个字符' })
  reason?: string;
}

/**
 * 操作动作类型DTO
 */
export class IPOperationActionDto {
  @ApiProperty({
    description: '操作动作',
    enum: ['block', 'unblock', 'whitelist', 'remove_whitelist'],
    example: 'block',
  })
  @IsEnum(['block', 'unblock', 'whitelist', 'remove_whitelist'], {
    message: '操作动作必须是有效的枚举值',
  })
  action: 'block' | 'unblock' | 'whitelist' | 'remove_whitelist';

  @ApiPropertyOptional({
    description: '操作原因',
    example: '恶意攻击',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '操作原因至少2个字符' })
  @MaxLength(200, { message: '操作原因不能超过200个字符' })
  reason?: string;

  @ApiPropertyOptional({
    description: '威胁严重程度（仅用于block操作）',
    enum: ThreatSeverity,
    example: ThreatSeverity.HIGH,
  })
  @IsOptional()
  @IsEnum(ThreatSeverity, { message: '威胁严重程度必须是有效的枚举值' })
  severity?: ThreatSeverity;
}
