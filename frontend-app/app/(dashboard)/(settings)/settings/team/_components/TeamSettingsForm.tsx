'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamDetail, TeamTier } from '@xiaodashi/shared';
import { Building2, Users, Calendar, Shield } from 'lucide-react';

interface TeamSettingsFormProps {
  team: TeamDetail;
  canEdit: boolean;
  onUpdate: (data: { name: string }) => Promise<void>;
  isSaving: boolean;
}

const TeamSettingsForm: React.FC<TeamSettingsFormProps> = ({
  team,
  canEdit,
  onUpdate,
  isSaving,
}) => {
  const [teamName, setTeamName] = useState<string>(team.name);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  /**
   * 获取团队等级显示文本
   */
  const getTierDisplayText = (tier: TeamTier): string => {
    switch (tier) {
      case TeamTier.FREE:
        return '免费版';
      case TeamTier.PRO:
        return '专业版';
      case TeamTier.PLUS:
        return '增强版';
      case TeamTier.ULTRA:
        return '旗舰版';
      default:
        return '未知';
    }
  };

  /**
   * 获取团队等级颜色
   */
  const getTierColor = (tier: TeamTier): string => {
    switch (tier) {
      case TeamTier.FREE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case TeamTier.PRO:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case TeamTier.PLUS:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case TeamTier.ULTRA:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canEdit || !hasChanges) return;

    try {
      await onUpdate({ name: teamName });
      setHasChanges(false);
    } catch (error) {
      console.error('更新团队信息失败:', error);
    }
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    setTeamName(team.name);
    setHasChanges(false);
  };

  /**
   * 监听团队名称变化
   */
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
    setHasChanges(e.target.value !== team.name);
  };

  return (
    <div className="space-y-8">
      {/* 团队基本信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[var(--color-primary-500)]" />
            团队基本信息
          </CardTitle>
          <CardDescription>
            {canEdit ? '编辑您的团队信息' : '查看您的团队信息'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 团队名称 */}
          <div className="space-y-2">
            <Label htmlFor="team-name">团队名称</Label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={handleTeamNameChange}
                  disabled={!canEdit || isSaving}
                  placeholder="请输入团队名称"
                  className="max-w-md"
                  maxLength={50}
                />
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  {teamName.length}/50 字符
                </p>
              </div>

              {/* 操作按钮 */}
              {hasChanges && canEdit && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isSaving}
                  >
                    重置
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSaving || !teamName.trim()}
                  >
                    {isSaving ? '保存中...' : '保存'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 团队等级 */}
          <div className="space-y-2">
            <Label>团队等级</Label>
            <div className="flex items-center gap-3">
              <Badge className={getTierColor(team.tier)}>
                {getTierDisplayText(team.tier)}
              </Badge>
              <span className="text-sm text-[var(--text-secondary)]">
                {team.tier === TeamTier.FREE && '免费版本，功能有限'}
                {team.tier === TeamTier.PRO && '专业版本，包含更多高级功能'}
                {team.tier === TeamTier.PLUS && '增强版本，包含所有功能'}
                {team.tier === TeamTier.ULTRA && '旗舰版本，包含最高级功能和优先支持'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 团队统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 成员数量 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {team.memberCount}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">团队成员</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 创建时间 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {new Date(team.createdAt).toLocaleDateString('zh-CN')}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">创建时间</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 团队所有者 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {team.owner.name}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">团队所有者</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 权限提示 */}
      {!canEdit && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  只有团队所有者或管理员可以编辑团队信息
                </p>
                <p className="text-sm text-yellow-600">
                  如需编辑团队信息，请联系团队所有者
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamSettingsForm;