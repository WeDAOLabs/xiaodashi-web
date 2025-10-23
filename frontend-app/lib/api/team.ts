/**
 * 团队API服务层
 *
 * 封装所有团队相关的API调用，基于现有ApiClient模式
 * 使用@xiaodashi/shared中的类型定义确保类型安全
 */

'use client';

import { apiClient } from '@/lib/auth/apiClient';
import type {
  AddTeamMemberResponse,
  CancelTeamInvitationResponse,
  CreateTeamInvitationRequest,
  CreateTeamInvitationResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  GetMyInvitationsResponse,
  GetTeamInvitationsResponse,
  GetTeamMembersResponse,
  GetTeamResponse,
  GetTeamsResponse,
  JoinTeamResponse,
  RemoveTeamMemberResponse,
  TeamInvitationQueryParams,
  TeamMemberQueryParams,
  TeamQueryParams,
  UpdateTeamMemberResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
} from '@xiaodashi/shared';

/**
 * 团队服务类
 * 封装所有团队相关的API操作
 */
export class TeamService {
  /**
   * 获取用户所属的团队列表
   * @param params 查询参数（分页、搜索等）
   * @returns Promise<GetTeamsResponse>
   */
  async getTeams(params?: TeamQueryParams): Promise<GetTeamsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.tier) queryParams.append('tier', params.tier);
      if (params.ownerId) queryParams.append('ownerId', params.ownerId);
    }

    const endpoint = `/teams${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<GetTeamsResponse>(endpoint);
  }

  /**
   * 获取单个团队详情
   * @param teamId 团队ID
   * @returns Promise<GetTeamResponse>
   */
  async getTeam(teamId: string): Promise<GetTeamResponse> {
    return apiClient.get<GetTeamResponse>(`/teams/${teamId}`);
  }

  /**
   * 创建新团队
   * @param data 创建团队请求数据
   * @returns Promise<CreateTeamResponse>
   */
  async createTeam(data: CreateTeamRequest): Promise<CreateTeamResponse> {
    return apiClient.post<CreateTeamResponse>('/teams', data);
  }

  /**
   * 更新团队信息
   * @param teamId 团队ID
   * @param data 更新团队请求数据
   * @returns Promise<UpdateTeamResponse>
   */
  async updateTeam(teamId: string, data: UpdateTeamRequest): Promise<UpdateTeamResponse> {
    return apiClient.put<UpdateTeamResponse>(`/teams/${teamId}`, data);
  }

  /**
   * 删除团队
   * @param teamId 团队ID
   * @returns Promise<{ message: string }>
   */
  async deleteTeam(teamId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/teams/${teamId}`);
  }

  /**
   * 获取团队成员列表
   * @param teamId 团队ID
   * @param params 查询参数
   * @returns Promise<GetTeamMembersResponse>
   */
  async getTeamMembers(teamId: string, params?: TeamMemberQueryParams): Promise<GetTeamMembersResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.role) queryParams.append('role', params.role);
      if (params.search) queryParams.append('search', params.search);
    }

    const endpoint = `/teams/${teamId}/members${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<GetTeamMembersResponse>(endpoint);
  }

  /**
   * 添加团队成员
   * @param teamId 团队ID
   * @param data 添加成员请求数据
   * @returns Promise<AddTeamMemberResponse>
   */
  async addTeamMember(teamId: string, data: { userId: string; role: string; displayName: string }): Promise<AddTeamMemberResponse> {
    return apiClient.post(`/teams/${teamId}/members`, data);
  }

  /**
   * 更新团队成员信息
   * @param teamId 团队ID
   * @param memberId 成员ID
   * @param data 更新请求数据
   * @returns Promise<UpdateTeamMemberResponse>
   */
  async updateTeamMember(teamId: string, memberId: string, data: { role?: string; displayName?: string }): Promise<UpdateTeamMemberResponse> {
    return apiClient.put(`/teams/${teamId}/members/${memberId}`, data);
  }

  /**
   * 移除团队成员
   * @param teamId 团队ID
   * @param memberId 成员ID
   * @returns Promise<RemoveTeamMemberResponse>
   */
  async removeTeamMember(teamId: string, memberId: string): Promise<RemoveTeamMemberResponse> {
    return apiClient.delete<RemoveTeamMemberResponse>(`/teams/${teamId}/members/${memberId}`);
  }

  /**
   * 创建团队邀请
   * @param teamId 团队ID
   * @param data 邀请请求数据
   * @returns Promise<CreateTeamInvitationResponse>
   */
  async createTeamInvitation(teamId: string, data: CreateTeamInvitationRequest): Promise<CreateTeamInvitationResponse> {
    return apiClient.post<CreateTeamInvitationResponse>(`/teams/${teamId}/invitations`, data);
  }

  /**
   * 获取团队邀请列表
   * @param teamId 团队ID
   * @param params 查询参数
   * @returns Promise<GetTeamInvitationsResponse>
   */
  async getTeamInvitations(teamId: string, params?: TeamInvitationQueryParams): Promise<GetTeamInvitationsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.email) queryParams.append('email', params.email);
    }

    const endpoint = `/teams/${teamId}/invitations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(endpoint);
  }

  /**
   * 取消团队邀请
   * @param teamId 团队ID
   * @param invitationId 邀请ID
   * @returns Promise<CancelTeamInvitationResponse>
   */
  async cancelTeamInvitation(teamId: string, invitationId: string): Promise<CancelTeamInvitationResponse> {
    return apiClient.delete(`/teams/${teamId}/invitations/${invitationId}`);
  }

  /**
   * 通过token加入团队
   * @param token 邀请token
   * @returns Promise<JoinTeamResponse>
   */
  async joinTeam(token: string): Promise<JoinTeamResponse> {
    return apiClient.post('/teams/join', { token });
  }

  /**
   * 获取我的邀请列表
   * @param params 查询参数
   * @returns Promise<GetMyInvitationsResponse>
   */
  async getMyInvitations(params?: { page?: number; limit?: number }): Promise<GetMyInvitationsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
    }

    const endpoint = `/teams/invitations/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(endpoint);
  }
}

// 导出单例实例
export const teamService = new TeamService();