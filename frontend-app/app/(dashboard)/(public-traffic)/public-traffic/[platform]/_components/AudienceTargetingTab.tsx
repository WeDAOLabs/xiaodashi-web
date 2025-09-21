import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { BaseTabProps, AudienceData, UserPortraitData } from './types';

const AudienceTargetingTab: React.FC<BaseTabProps> = () => {
  // 示例受众数据
  const audienceData: AudienceData[] = [
    {
      id: 'audience-1',
      name: '高价值用户-Lookalike',
      status: 'high-potential',
      userCount: 1500000,
      createdAt: '2023-05-20',
      usageCount: 5
    },
    {
      id: 'audience-2',
      name: '近期活跃用户',
      status: 'stable',
      userCount: 800000,
      createdAt: '2023-05-15',
      usageCount: 12
    },
    {
      id: 'audience-3',
      name: '护肤品兴趣人群',
      status: 'needs-optimization',
      userCount: 2200000,
      createdAt: '2023-04-30',
      usageCount: 8
    }
  ];

  // AI用户画像数据
  const userPortrait: UserPortraitData = {
    ageGroup: '25-34岁',
    interests: ['美妆', '时尚', '旅行'],
    activeTime: '20:00 - 23:00',
    location: ['一线城市', '新一线城市']
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'high-potential':
        return (
          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)]">
            高潜力
          </Badge>
        );
      case 'stable':
        return (
          <Badge className="bg-[var(--color-info-50)] text-[var(--color-info-600)]">
            稳定
          </Badge>
        );
      case 'needs-optimization':
        return (
          <Badge className="bg-[var(--color-warning-50)] text-[var(--color-warning-600)]">
            需优化
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatUserCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：受众列表 */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">受众列表</h3>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建受众包
            </Button>
          </div>

          <ul className="divide-y divide-[var(--border-secondary)]">
            {audienceData.map((audience) => (
              <li key={audience.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[var(--text-primary)]">{audience.name}</p>
                    {getStatusBadge(audience.status)}
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    人数: {formatUserCount(audience.userCount)} |
                    创建于: {audience.createdAt} |
                    使用次数: {audience.usageCount}
                  </p>
                </div>
                <Button variant="ghost" className="text-[var(--primary-color)] hover:bg-[var(--primary-light)]">
                  应用到计划
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 右侧：AI洞察 */}
      <div className="space-y-6">
        {/* AI 高转化用户画像 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI 高转化用户画像</h3>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>
              <strong>主要年龄段:</strong> {userPortrait.ageGroup}
            </p>
            <p>
              <strong>兴趣偏好:</strong> {userPortrait.interests.join('、')}
            </p>
            <p>
              <strong>活跃时段:</strong> {userPortrait.activeTime}
            </p>
            <p>
              <strong>地域分布:</strong> {userPortrait.location.join('、')}
            </p>
          </div>
        </Card>

        {/* AI 潜力受众发现 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI 潜力受众发现</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            基于Lookalike算法拓展相似用户，预估可触达 500,000+ 新用户。
          </p>
          <Button className="w-full">
            AI推荐受众
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AudienceTargetingTab;