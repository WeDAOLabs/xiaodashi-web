import { ApiProperty } from '@nestjs/swagger';
import type {
  IPBlacklistEntry,
  IPWhitelistEntry,
  IPRiskReport,
  IPRateLimitStatus,
  BulkIPOperationResponse,
  IPAccessLogEntry,
} from '@xiaodashi/shared';

/**
 * IP黑名单查询响应DTO
 */
export class IPBlacklistQueryResponseDto {
  @ApiProperty({
    description: '黑名单条目列表',
    isArray: true,
  })
  items: IPBlacklistEntry[];

  @ApiProperty({
    description: '总记录数',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 20,
  })
  pageSize: number;

  @ApiProperty({
    description: '总页数',
    example: 5,
  })
  totalPages: number;
}

/**
 * IP白名单查询响应DTO
 */
export class IPWhitelistQueryResponseDto {
  @ApiProperty({
    description: '白名单条目列表',
    isArray: true,
  })
  items: IPWhitelistEntry[];

  @ApiProperty({
    description: '总记录数',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 20,
  })
  pageSize: number;

  @ApiProperty({
    description: '总页数',
    example: 3,
  })
  totalPages: number;
}

/**
 * IP安全统计信息DTO
 */
export class IPSecurityStatisticsDto {
  @ApiProperty({
    description: '黑名单统计',
    example: {
      total: 150,
      active: 120,
      bySeverity: { low: 30, medium: 60, high: 25, critical: 5 },
      byType: { single: 120, range: 30 },
    },
  })
  blacklist: {
    total: number;
    active: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
  };

  @ApiProperty({
    description: '白名单统计',
    example: {
      total: 25,
      active: 23,
      byType: { single: 20, range: 5 },
    },
  })
  whitelist: {
    total: number;
    active: number;
    byType: Record<string, number>;
  };

  @ApiProperty({
    description: '频率限制统计',
    example: {
      total: 500,
      blocked: 50,
      byAction: {
        login: { total: 200, blocked: 30 },
        api: { total: 300, blocked: 20 },
      },
    },
  })
  rateLimit: {
    total: number;
    blocked: number;
    byAction: Record<string, { total: number; blocked: number }>;
  };

  @ApiProperty({
    description: '今日访问统计',
    example: {
      totalRequests: 10000,
      blockedRequests: 500,
      highRiskIPs: 25,
      newBlacklistedIPs: 3,
    },
  })
  todayStats: {
    totalRequests: number;
    blockedRequests: number;
    highRiskIPs: number;
    newBlacklistedIPs: number;
  };

  @ApiProperty({
    description: '统计更新时间',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: string;
}

/**
 * IP检查结果DTO
 */
export class IPCheckResultDto {
  @ApiProperty({
    description: 'IP地址',
    example: '192.168.1.100',
  })
  ipAddress: string;

  @ApiProperty({
    description: '是否允许访问',
    example: false,
  })
  allowed: boolean;

  @ApiProperty({
    description: '拒绝原因',
    example: 'IP在黑名单中',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: '风险评分',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  riskScore: number;

  @ApiProperty({
    description: '是否在黑名单中',
    example: true,
  })
  isBlacklisted: boolean;

  @ApiProperty({
    description: '是否在白名单中',
    example: false,
  })
  isWhitelisted: boolean;

  @ApiProperty({
    description: '是否被频率限制',
    example: true,
  })
  isRateLimited: boolean;

  @ApiProperty({
    description: '频率限制状态',
    required: false,
  })
  rateLimitStatus?: IPRateLimitStatus;

  @ApiProperty({
    description: '是否需要验证码',
    example: true,
  })
  requiresCaptcha: boolean;

  @ApiProperty({
    description: 'IP风险报告',
    required: false,
  })
  riskReport?: IPRiskReport;
}

/**
 * 批量IP检查响应DTO
 */
export class BatchIPCheckResponseDto {
  @ApiProperty({
    description: '检查结果列表',
    type: [IPCheckResultDto],
  })
  results: IPCheckResultDto[];

  @ApiProperty({
    description: '总计IP数量',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: '允许访问的IP数量',
    example: 3,
  })
  allowedCount: number;

  @ApiProperty({
    description: '被阻止的IP数量',
    example: 2,
  })
  blockedCount: number;

  @ApiProperty({
    description: '高风险IP数量',
    example: 1,
  })
  highRiskCount: number;

  @ApiProperty({
    description: '检查耗时（毫秒）',
    example: 150,
  })
  processingTimeMs: number;

  @ApiProperty({
    description: '检查时间',
    example: '2024-01-15T10:30:00Z',
  })
  checkedAt: string;
}

/**
 * IP安全操作响应DTO
 */
export class IPSecurityActionResponseDto {
  @ApiProperty({
    description: '操作是否成功',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '操作结果消息',
    example: 'IP 192.168.1.100 已成功添加到黑名单',
  })
  message: string;

  @ApiProperty({
    description: '操作的IP地址',
    example: '192.168.1.100',
  })
  ipAddress: string;

  @ApiProperty({
    description: '操作类型',
    example: 'add_blacklist',
  })
  action: string;

  @ApiProperty({
    description: '操作时间',
    example: '2024-01-15T10:30:00Z',
  })
  operatedAt: string;

  @ApiProperty({
    description: '操作结果详情',
    required: false,
  })
  details?: {
    id?: string;
    type?: string;
    severity?: string;
    expiresAt?: string;
    [key: string]: unknown;
  };
}

/**
 * IP批量操作响应DTO
 */
export class IPBatchOperationResponseDto implements BulkIPOperationResponse {
  @ApiProperty({
    description: '操作是否成功',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '操作结果消息',
    example: '批量操作完成',
  })
  message: string;

  @ApiProperty({
    description: '成功操作的IP数量',
    example: 8,
  })
  successCount: number;

  @ApiProperty({
    description: '失败操作的IP数量',
    example: 2,
  })
  failedCount: number;

  @ApiProperty({
    description: '失败的IP列表',
    type: [Object],
    required: false,
  })
  errors?: Array<{
    ipAddress: string;
    error: string;
  }>;

  @ApiProperty({
    description: '操作耗时（毫秒）',
    example: 200,
  })
  processingTimeMs: number;

  @ApiProperty({
    description: '操作时间',
    example: '2024-01-15T10:30:00Z',
  })
  operatedAt: string;
}

/**
 * IP访问日志查询响应DTO
 */
export class IPAccessLogQueryResponseDto {
  @ApiProperty({
    description: '访问日志列表',
    isArray: true,
  })
  logs: IPAccessLogEntry[];

  @ApiProperty({
    description: '总记录数',
    example: 1000,
  })
  total: number;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 20,
  })
  pageSize: number;

  @ApiProperty({
    description: '总页数',
    example: 50,
  })
  totalPages: number;
}

/**
 * IP安全配置DTO
 */
export class IPSecurityConfigDto {
  @ApiProperty({
    description: '黑名单配置',
    example: {
      enabled: true,
      autoBlock: true,
      autoBlockThreshold: 80,
      defaultBlockDuration: 1440,
    },
  })
  blacklist: {
    enabled: boolean;
    autoBlock: boolean;
    autoBlockThreshold: number;
    defaultBlockDuration: number;
  };

  @ApiProperty({
    description: '白名单配置',
    example: {
      enabled: true,
      priorityOverBlacklist: false,
    },
  })
  whitelist: {
    enabled: boolean;
    priorityOverBlacklist: boolean;
  };

  @ApiProperty({
    description: '频率限制配置',
    example: {
      login: { windowMs: 15, maxRequests: 5 },
      register: { windowMs: 60, maxRequests: 3 },
      api: { windowMs: 1, maxRequests: 100 },
    },
  })
  rateLimit: {
    login: { windowMs: number; maxRequests: number };
    register: { windowMs: number; maxRequests: number };
    api: { windowMs: number; maxRequests: number };
  };

  @ApiProperty({
    description: '风险评估配置',
    example: {
      enabled: true,
      riskThresholds: {
        low: 20,
        medium: 40,
        high: 60,
        critical: 80,
      },
      geoLocationCheck: true,
      deviceFingerprintCheck: true,
    },
  })
  riskAssessment: {
    enabled: boolean;
    riskThresholds: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    geoLocationCheck: boolean;
    deviceFingerprintCheck: boolean;
  };

  @ApiProperty({
    description: '配置更新时间',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: string;
}

/**
 * IP安全事件DTO
 */
export class IPSecurityEventDto {
  @ApiProperty({
    description: '事件ID',
    example: 'evt_123456789',
  })
  id: string;

  @ApiProperty({
    description: '事件类型',
    enum: [
      'ip_blocked',
      'ip_unblocked',
      'high_risk_detected',
      'rate_limit_exceeded',
    ],
    example: 'ip_blocked',
  })
  type:
    | 'ip_blocked'
    | 'ip_unblocked'
    | 'high_risk_detected'
    | 'rate_limit_exceeded';

  @ApiProperty({
    description: 'IP地址',
    example: '192.168.1.100',
  })
  ipAddress: string;

  @ApiProperty({
    description: '事件描述',
    example: 'IP因暴力破解攻击被自动封禁',
  })
  description: string;

  @ApiProperty({
    description: '事件严重程度',
    enum: ['low', 'medium', 'high', 'critical'],
    example: 'high',
  })
  severity: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({
    description: '事件数据',
    example: { source: 'auto_detection', riskScore: 95 },
  })
  data: Record<string, unknown>;

  @ApiProperty({
    description: '是否已处理',
    example: false,
  })
  isResolved: boolean;

  @ApiProperty({
    description: '事件发生时间',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '事件更新时间',
    example: '2024-01-15T10:35:00Z',
  })
  updatedAt: string;
}
