/**
 * 团队相关类型定义
 * 定义团队实体、成员关系、邀请和角色等核心类型
 */

// 团队等级枚举 - 支持未来商业化功能
export enum TeamTier {
  FREE = 'free',     // 免费版
  PRO = 'pro',       // 专业版
  PLUS = 'plus',     // 增强版
  ULTRA = 'ultra'    // 旗舰版
}

// 团队成员角色枚举
export enum TeamRoleType {
  OWNER = 'owner',     // 团队所有者
  ADMIN = 'admin',     // 管理员
  MEMBER = 'member'    // 普通成员
}

// 邀请状态枚举
export enum InvitationStatus {
  PENDING = 'pending',     // 待处理
  ACCEPTED = 'accepted',   // 已接受
  EXPIRED = 'expired',     // 已过期
  CANCELLED = 'cancelled'  // 已取消
}

// 团队基础信息接口
export interface Team {
  id: string;
  name: string;
  ownerId: string;
  tier: TeamTier;
  createdAt: string;       // ISO 8601 格式
  updatedAt: string;       // ISO 8601 格式
}

// 团队成员关系接口
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRoleType;
  displayName: string;
  createdAt: string;       // ISO 8601 格式
  updatedAt: string;       // ISO 8601 格式
}

// 团队邀请记录接口
export interface TeamInvitation {
  id: string;
  teamId: string;
  inviterId: string;
  email: string;
  token: string;
  expiresAt: string;       // ISO 8601 格式
  status: InvitationStatus;
  createdAt: string;       // ISO 8601 格式
  updatedAt: string;       // ISO 8601 格式
}

// 团队角色定义接口（为未来扩展预留）
export interface TeamRole {
  id: string;
  name: string;
  permissions: Record<string, boolean>;  // JSONB 格式的权限配置
  createdAt: string;       // ISO 8601 格式
  updatedAt: string;       // ISO 8601 格式
}

// === API 请求/响应类型 ===

// 创建团队请求
export interface CreateTeamRequest {
  name: string;
  tier?: TeamTier;         // 可选，默认为 free
}

// 更新团队请求
export interface UpdateTeamRequest {
  name?: string;
  tier?: TeamTier;
}

// 添加团队成员请求
export interface AddTeamMemberRequest {
  userId: string;
  role: TeamRoleType;
  displayName: string;
}

// 更新团队成员请求
export interface UpdateTeamMemberRequest {
  role?: TeamRoleType;
  displayName?: string;
}

// 创建团队邀请请求
export interface CreateTeamInvitationRequest {
  email: string;
  role?: TeamRoleType;     // 被邀请者加入后的角色，默认为 member
}

// 团队成员详细信息（包含用户信息）
export interface TeamMemberDetail extends TeamMember {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

// 团队详细信息（包含成员数量等统计）
export interface TeamDetail extends Team {
  memberCount: number;
  owner: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  pendingInvitations: number;
}

// 团队列表项（用于列表展示）
export interface TeamListItem {
  id: string;
  name: string;
  tier: TeamTier;
  memberCount: number;
  ownerName: string;
  createdAt: string;
  userRole?: TeamRoleType;  // 当前用户在此团队中的角色
}

// 用户团队信息（用于用户视角）
export interface UserTeamInfo {
  team: TeamListItem;
  member: TeamMember;
}

// === API 响应类型 ===

// 获取用户所属团队列表响应
export interface GetTeamsResponse {
  teams: TeamListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 获取单个团队详情响应
export interface GetTeamResponse {
  team: TeamDetail;
}

// 获取团队成员列表响应
export interface GetTeamMembersResponse {
  members: TeamMemberDetail[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 创建团队响应
export interface CreateTeamResponse {
  team: TeamDetail;
}

// 更新团队响应
export interface UpdateTeamResponse {
  team: TeamDetail;
}

// 添加团队成员响应
export interface AddTeamMemberResponse {
  member: TeamMemberDetail;
}

// 更新团队成员响应
export interface UpdateTeamMemberResponse {
  member: TeamMemberDetail;
}

// 创建团队邀请响应
export interface CreateTeamInvitationResponse {
  invitation: TeamInvitation;
}

// 获取团队邀请列表响应
export interface GetTeamInvitationsResponse {
  invitations: TeamInvitation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 移除团队成员响应
export interface RemoveTeamMemberResponse {
  message: string;        // 操作结果消息
  removedUserId: string;  // 被移除的用户ID
}

// 取消团队邀请响应
export interface CancelTeamInvitationResponse {
  message: string;        // 操作结果消息
  cancelledInvitationId: string;  // 被取消的邀请ID
}

// === 查询参数类型 ===

// 团队查询参数
export interface TeamQueryParams {
  page?: number;
  limit?: number;
  search?: string;         // 团队名称搜索
  tier?: TeamTier;         // 按等级筛选
  ownerId?: string;        // 按所有者筛选
}

// 团队成员查询参数
export interface TeamMemberQueryParams {
  page?: number;
  limit?: number;
  role?: TeamRoleType;     // 按角色筛选
  search?: string;         // 按显示名称或邮箱搜索
}

// 团队邀请查询参数
export interface TeamInvitationQueryParams {
  page?: number;
  limit?: number;
  status?: InvitationStatus;  // 按状态筛选
  email?: string;         // 按邮箱筛选
}