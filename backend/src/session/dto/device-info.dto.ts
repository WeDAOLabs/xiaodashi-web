import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { DeviceType } from '@xiaodashi/shared';

/**
 * 设备信息DTO
 * 用于创建会话时传递设备信息
 */
export class DeviceInfoDto {
  @ApiProperty({
    description: '设备唯一标识（前端生成并持久化）',
    example: 'device_abc123xyz',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({
    description: '设备名称',
    example: 'iPhone 15 Pro',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceName?: string;

  @ApiProperty({
    description: '设备类型',
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    example: 'mobile',
  })
  @IsEnum(['mobile', 'tablet', 'desktop', 'unknown'], {
    message: 'deviceType must be one of: mobile, tablet, desktop, unknown',
  })
  deviceType!: DeviceType;

  @ApiProperty({
    description: '操作系统',
    example: 'iOS 17.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiProperty({
    description: '浏览器',
    example: 'Safari 17.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiProperty({
    description: '地理位置',
    example: '北京市 朝阳区',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;
}
