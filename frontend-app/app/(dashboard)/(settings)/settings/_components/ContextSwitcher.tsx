'use client';

import { useAuth } from '@/components/layout/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamService } from '@/lib/api/team';
import type { TeamListItem } from '@xiaodashi/shared';
import { Briefcase, Building2, ChevronsUpDown, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ContextSwitcherProps {
  className?: string;
}

const ContextSwitcher: React.FC<ContextSwitcherProps> = ({ className }) => {
  const { isAuthenticated } = useAuth();
  const [teams, setTeams] = useState<TeamListItem[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 加载用户团队列表
  useEffect(() => {
    const fetchTeams = async () => {
      if (!isAuthenticated) {
        setTeams([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await teamService.getTeams();
        setTeams(response.teams);
        console.log('API Response:', response);

        // 设置默认选中团队（选择第一个或从存储中获取）
        const storedTeamId = localStorage.getItem('currentTeamId');
        const teamToSelect = storedTeamId && response.teams && response.teams.some(t => t.id === storedTeamId)
          ? storedTeamId
          : response.teams && response.teams.length > 0 ? response.teams[0].id : '';
        
        setCurrentTeamId(teamToSelect);
      } catch (error) {
        console.error('获取团队列表失败:', error);
        toast.error('获取团队列表失败');
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [isAuthenticated]);

  /**
   * 处理团队切换
   */
  const handleTeamChange = (teamId: string) => {
    if (teamId === currentTeamId) return;

    try {
      if (!teams || teams.length === 0) {
        console.warn('没有可切换的团队');
        toast.warning('没有可切换的团队');
        return;
      }

      setCurrentTeamId(teamId);
      localStorage.setItem('currentTeamId', teamId);

      const selectedTeam = teams.find(t => t.id === teamId);
      if (selectedTeam) {
        toast.success(`已切换到团队: ${selectedTeam.name}`);

        // 触发页面重新加载以更新相关数据
        // 在实际项目中，这里可能需要更新全局状态或重新获取数据
        window.location.reload();
      }
    } catch (error) {
      console.error('切换团队失败:', error);
      toast.error('切换团队失败');
    }
  };

  /**
   * 获取当前选中的团队信息
   */
  const getCurrentTeam = (): TeamListItem | null => {
    if (!teams || teams.length === 0) return null;
    return teams.find(t => t.id === currentTeamId) || null;
  };

  if (!isAuthenticated) {
    return <div className="text-[var(--text-secondary)]">请先登录</div>;
  }

  const currentTeam = getCurrentTeam();

  return (
    <div className={`bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm border border-[var(--border-secondary)] flex flex-col md:flex-row items-center gap-4 ${className || ''}`}>
      {/* 团队选择器 */}
      <div className="relative w-full md:w-64">
        <Select
          value={currentTeamId}
          onValueChange={handleTeamChange}
          disabled={isLoading || !teams || teams.length === 0}
        >
          <SelectTrigger className="w-full flex items-center justify-between bg-[var(--bg-primary)] px-4 py-3.5 border border-[var(--border-primary)] rounded-lg shadow-sm text-left transition-colors hover:bg-[var(--bg-secondary)] h-auto min-h-[60px] [&>svg:last-child]:hidden">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[var(--color-primary-500)]" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">当前团队</p>
                <SelectValue placeholder={isLoading ? '加载中...' : (!teams || teams.length === 0) ? '无团队' : '选择团队'}>
                  {currentTeam ? currentTeam.name : (isLoading ? '加载中...' : '选择团队')}
                </SelectValue>
              </div>
            </div>
            <ChevronsUpDown className="w-5 h-5 text-[var(--text-tertiary)]" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      {team.memberCount} 成员 • {team.ownerName}
                    </div>
                  </div>
                  {team.userRole && (
                    <div className="ml-auto">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {team.userRole === 'owner' ? '所有者' : team.userRole === 'admin' ? '管理员' : '成员'}
                      </span>
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}

            {/* 创建新团队选项 */}
            <SelectItem value="create-new" className="text-blue-600 hover:bg-blue-50">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>创建新团队</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 项目选择器（暂时保留，后续可扩展） */}
      <div className="relative w-full md:w-64">
        <Select defaultValue="ai-marketing">
          <SelectTrigger className="w-full flex items-center justify-between bg-[var(--bg-primary)] px-4 py-3.5 border border-[var(--border-primary)] rounded-lg shadow-sm text-left transition-colors hover:bg-[var(--bg-secondary)] h-auto min-h-[60px] [&>svg:last-child]:hidden">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-[var(--color-primary-500)]" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">当前项目</p>
                <SelectValue />
              </div>
            </div>
            <ChevronsUpDown className="w-5 h-5 text-[var(--text-tertiary)]" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai-marketing">AI全域营销大师</SelectItem>
            <SelectItem value="other-project">其他项目</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContextSwitcher;