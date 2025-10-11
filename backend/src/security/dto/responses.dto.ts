import { ApiProperty } from '@nestjs/swagger';
import {
  AccountLockoutStatus,
  LockStatusResponse,
  UnlockAccountResponse,
} from '@xiaodashi/shared';

/**
 * 账户锁定状态响应DTO
 */
export class AccountLockoutStatusDto implements AccountLockoutStatus {
  @ApiProperty({
    description: '账户是否被锁定',
    example: true,
  })
  isLocked!: boolean;

  @ApiProperty({
    description: '锁定截止时间（ISO字符串）',
    example: '2025-01-15T10:30:00Z',
    required: false,
  })
  lockedUntil?: string;

  @ApiProperty({
    description: '剩余尝试次数',
    example: 2,
  })
  remainingAttempts!: number;

  @ApiProperty({
    description: '当前失败次数',
    example: 3,
  })
  currentAttempts!: number;

  @ApiProperty({
    description: '锁定时长（分钟）',
    example: 15,
    required: false,
  })
  lockoutDuration?: number;

  @ApiProperty({
    description: '锁定原因',
    example: '登录失败次数过多',
    required: false,
  })
  lockReason?: string;

  @ApiProperty({
    description: '下次锁定阈值，null表示已达到最高惩罚等级',
    example: 5,
    required: false,
  })
  nextLockThreshold?: number | null;

  @ApiProperty({
    description: '下次锁定时长（分钟）',
    example: 15,
    required: false,
  })
  nextLockDuration?: number;
}

/**
 * 用户锁定状态查询响应DTO
 */
export class LockStatusResponseDto implements LockStatusResponse {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId!: string;

  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: '锁定状态详情',
    type: AccountLockoutStatusDto,
  })
  status!: AccountLockoutStatusDto;
}

/**
 * 解锁账户响应DTO
 */
export class UnlockAccountResponseDto implements UnlockAccountResponse {
  @ApiProperty({
    description: '解锁是否成功',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: '操作结果消息',
    example: '用户 user@example.com 已成功解锁',
  })
  message!: string;

  @ApiProperty({
    description: '解锁时间（ISO字符串）',
    example: '2025-01-15T10:30:00Z',
  })
  unlockedAt!: string;
}
