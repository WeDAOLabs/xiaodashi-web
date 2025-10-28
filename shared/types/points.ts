/**
 * 积分相关类型定义
 * 定义积分系统核心实体类型和API接口类型
 */

// 积分交易类型枚举
export enum PointTransactionType {
  CONSUMPTION = 'consumption',       // 积分消耗
  RECHARGE = 'recharge',            // 积分充值
  INITIAL_GRANT = 'initial_grant',  // 初始积分发放
  ADJUSTMENT = 'adjustment'         // 积分调整（管理员操作）
}

// 积分状态枚举
export enum PointStatus {
  ACTIVE = 'active',       // 激活状态
  FROZEN = 'frozen',       // 冻结状态
  EXPIRED = 'expired'      // 过期状态
}

// 团队积分基础信息接口
export interface TeamPoint {
  id: string;
  teamId: string;
  balance: number;             // 积分余额，使用 decimal(19,4) 类型
  status: PointStatus;         // 积分状态
  createdAt: string;           // ISO 8601 格式
  updatedAt?: string;          // ISO 8601 格式，可选
  expiresAt?: string;          // 积分过期时间，ISO 8601 格式，可选
}

// 积分交易记录接口
export interface PointTransaction {
  id: string;
  teamId: string;
  userId: string;
  type: PointTransactionType;
  amount: number;              // 交易积分数量，decimal(19,4)，负数为消耗
  balanceAfter: number;        // 交易后积分余额，decimal(19,4)
  description: string;         // 交易描述和备注信息
  businessId?: string;         // 关联业务ID（如订单ID、任务ID等），可选
  businessType?: string;       // 业务类型，可选
  createdAt: string;           // 交易发生时间，ISO 8601 格式
}

// === API 请求/响应类型 ===

// 创建积分交易请求（用于消耗和充值）
export interface CreateTransactionRequest {
  teamId: string;
  userId: string;
  type: PointTransactionType;
  amount: number;              // 交易金额，正数为充值，负数为消耗
  description: string;
  businessId?: string;         // 关联业务ID
  businessType?: string;       // 业务类型
}

// 积分充值请求（支付回调专用）
export interface RechargePointsRequest {
  teamId: string;
  userId: string;
  amount: number;              // 充值金额，必须为正数
  description: string;
  businessId?: string;         // 支付订单ID
  businessType: string;        // 业务类型，如 'payment', 'recharge' 等
}

// 积分消耗请求
export interface ConsumePointsRequest {
  teamId: string;
  userId: string;
  amount: number;              // 消耗金额，必须为正数
  description: string;
  businessId?: string;         // 关联业务ID
  businessType?: string;       // 业务类型
}

// 积分调整请求（管理员专用）
export interface AdjustPointsRequest {
  teamId: string;
  userId: string;              // 操作管理员ID
  amount: number;              // 调整金额，可为正负数
  description: string;
  reason?: string;             // 调整原因
}

// 查询团队积分余额响应
export interface GetTeamPointsResponse {
  teamId: string;
  balance: number;             // 当前积分余额
  status: PointStatus;         // 积分状态
  expiresAt?: string;          // 过期时间
  lastTransactionAt?: string;  // 最后交易时间
}

// 积分交易记录列表项
export interface PointTransactionItem {
  id: string;
  teamId: string;
  userId: string;
  userName?: string;           // 用户姓名（关联查询）
  type: PointTransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  businessId?: string;
  businessType?: string;
  createdAt: string;
}

// 查询积分流水历史响应
export interface GetPointHistoryResponse {
  transactions: PointTransactionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 创建积分交易响应
export interface CreateTransactionResponse {
  transaction: PointTransaction;
  newBalance: number;          // 交易后的新余额
}

// 积分余额变化通知（用于WebSocket或事件系统）
export interface PointsBalanceChangedEvent {
  teamId: string;
  userId: string;
  oldBalance: number;
  newBalance: number;
  changeAmount: number;
  transactionId: string;
  transactionType: PointTransactionType;
}

// === 查询参数类型 ===

// 积分历史查询参数
export interface PointHistoryQueryParams {
  page?: number;
  limit?: number;
  teamId?: string;             // 按团队筛选
  userId?: string;             // 按用户筛选
  type?: PointTransactionType; // 按交易类型筛选
  startDate?: string;          // 开始日期，ISO 8601 格式
  endDate?: string;            // 结束日期，ISO 8601 格式
  businessType?: string;       // 按业务类型筛选
}

// 团队积分查询参数
export interface TeamPointsQueryParams {
  teamId?: string;             // 团队ID（单个查询）
  teamIds?: string[];          // 多个团队ID批量查询
  status?: PointStatus;        // 按状态筛选
  includeExpired?: boolean;    // 是否包含已过期积分
}

// === 统计类型 ===

// 积分统计信息
export interface PointsStatistics {
  teamId: string;
  totalEarned: number;         // 累计获得积分
  totalConsumed: number;       // 累计消耗积分
  currentBalance: number;      // 当前余额
  transactionCount: number;    // 交易次数
  lastTransactionAt?: string;  // 最后交易时间
  averageTransactionAmount?: number; // 平均交易金额
}

// 团队积分排行项
export interface PointsRankingItem {
  teamId: string;
  teamName: string;
  balance: number;
  rank: number;
  change?: number;             // 排名变化（正数上升，负数下降）
}

// 积分排行响应
export interface GetPointsRankingResponse {
  rankings: PointsRankingItem[];
  totalTeams: number;
  currentTeamRank?: number;    // 当前请求团队的排名
}

// === 工具类型 ===

// 积分数量验证工具类型
export type ValidPointsAmount = number & { __brand: 'ValidPointsAmount' };

// 积分交易描述最大长度
export const POINTS_DESCRIPTION_MAX_LENGTH = 500;

// 积分余额最小值（不能为负数）
export const MIN_POINTS_BALANCE = 0;

// 单次交易最大积分数量
export const MAX_SINGLE_TRANSACTION_AMOUNT = 9999999999.9999; // 最大支持10位整数4位小数