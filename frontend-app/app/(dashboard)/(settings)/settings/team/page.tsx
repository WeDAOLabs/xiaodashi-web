'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeamSettingsForm from './_components/TeamSettingsForm';
import { useAuth } from '@/components/layout/AuthContext';
import { teamService } from '@/lib/api/team';
import type { TeamDetail } from '@xiaodashi/shared';
import { toast } from 'sonner';

const TeamSettingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // TODO: 获取当前团队ID，这里先用默认值
  // 实际应该从AuthContext或路由参数获取
  const currentTeamId = 'default-team-id';

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!isAuthenticated || !currentTeamId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await teamService.getTeam(currentTeamId);
        setTeam(response.team);
      } catch (error) {
        console.error('获取团队信息失败:', error);
        toast.error('获取团队信息失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [isAuthenticated, currentTeamId]);

  /**
   * 检查用户是否有编辑权限
   * 只有团队所有者或管理员可以编辑
   */
  const canEditTeam = (): boolean => {
    if (!user || !team) return false;

    // 如果是团队所有者
    if (team.owner.id === user.id) return true;

    // TODO: 检查是否是管理员
    // 需要从团队成员列表中查找当前用户的角色
    // return team.members.some(member => member.userId === user.id && member.role === 'admin');

    return false;
  };

  /**
   * 处理团队信息更新
   */
  const handleTeamUpdate = async (updateData: { name: string }) => {
    if (!team || !currentTeamId) return;

    try {
      setIsSaving(true);
      const response = await teamService.updateTeam(currentTeamId, updateData);
      setTeam(response.team);
      toast.success('团队信息更新成功');
    } catch (error) {
      console.error('更新团队信息失败:', error);
      toast.error('更新团队信息失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title="团队设置"
        breadcrumbs={[
          { label: '设置', href: '/settings' },
          { label: '团队设置', href: '/settings/team', current: true }
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-500)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">加载团队信息中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!team) {
    return (
      <DashboardLayout
        title="团队设置"
        breadcrumbs={[
          { label: '设置', href: '/settings' },
          { label: '团队设置', href: '/settings/team', current: true }
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-[var(--text-secondary)] mb-4">未找到团队信息</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="团队设置"
      breadcrumbs={[
        { label: '设置', href: '/settings' },
        { label: '团队设置', href: '/settings/team', current: true }
      ]}
    >
      <section className="px-4 mb-8">
        <p className="text-[var(--text-secondary)] mb-6">管理您的团队信息和设置。</p>

        {/* 团队设置表单 */}
        <TeamSettingsForm
          team={team}
          canEdit={canEditTeam()}
          onUpdate={handleTeamUpdate}
          isSaving={isSaving}
        />
      </section>
    </DashboardLayout>
  );
};

export default TeamSettingsPage;