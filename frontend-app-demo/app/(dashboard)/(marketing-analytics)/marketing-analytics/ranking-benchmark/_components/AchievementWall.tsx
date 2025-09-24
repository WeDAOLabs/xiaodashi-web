'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Share2, Award, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: '最佳ROI贡献奖',
    subtitle: '张三',
    icon: Trophy,
    iconColor: 'text-[var(--color-warning-500)]'
  },
  {
    id: '2',
    title: '新增用户王',
    subtitle: '李四',
    icon: TrendingUp,
    iconColor: 'text-[var(--color-info-500)]'
  },
  {
    id: '3',
    title: '内容互动冠军',
    subtitle: '王五',
    icon: Award,
    iconColor: 'text-[var(--color-primary-500)]'
  },
  {
    id: '4',
    title: '渠道转化能手',
    subtitle: '赵六',
    icon: Trophy,
    iconColor: 'text-teal-500'
  }
];

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const IconComponent = achievement.icon;

  return (
    <div className="bg-gradient-to-br from-white to-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-secondary)] flex items-center gap-4">
      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
        <IconComponent className={`w-6 h-6 ${achievement.iconColor}`} />
      </div>
      <div>
        <p className="font-semibold text-[var(--text-primary)]">{achievement.title}</p>
        <p className="text-sm text-[var(--text-secondary)]">{achievement.subtitle}</p>
      </div>
    </div>
  );
};

const AchievementWall: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">成就墙与激励</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              庆祝每一个里程碑，激励团队不断前行。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              查看荣誉榜
            </Button>
            <Button className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              分享成就
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 主要成就展示 */}
          <div className="md:col-span-1 bg-[var(--color-success-50)] p-5 rounded-lg border border-dashed border-[var(--color-success-100)] flex flex-col justify-center items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--color-success-600)] flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-[var(--color-success-600)] mb-2">
              恭喜小组成员，本月私域GMV超越行业平均30%！
            </p>
            <Badge
              variant="outline"
              className="text-xs mt-2 text-[var(--color-success-600)] border-[var(--color-success-200)] bg-[var(--color-success-50)]"
            >
              再接再厉，创造新高！
            </Badge>
          </div>

          {/* 团队成就列表 */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </div>
        </div>

        {/* 月度目标进展 */}
        <div className="mt-6 p-4 bg-[var(--bg-tertiary)] rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[var(--text-primary)]">月度目标进展</h4>
            <span className="text-sm text-[var(--text-secondary)]">85% 完成</span>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
            <div
              className="bg-[var(--color-primary-500)] h-2 rounded-full transition-all duration-300"
              style={{ width: '85%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
            <span>目标: ¥1000W GMV</span>
            <span>当前: ¥850W</span>
          </div>
        </div>

        {/* 团队贡献排行 */}
        <div className="mt-6">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3">本月团队贡献 TOP 3</h4>
          <div className="space-y-2">
            {[
              { rank: 1, name: '张三', contribution: 'ROI优化', value: '+15%', color: 'text-[var(--color-warning-600)]' },
              { rank: 2, name: '李四', contribution: '新客获取', value: '+200人', color: 'text-[var(--text-secondary)]' },
              { rank: 3, name: '王五', contribution: '内容创作', value: '+8个', color: 'text-[var(--color-warning-700)]' },
            ].map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.rank === 1 ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]' :
                    item.rank === 2 ? 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]' :
                    'bg-[var(--color-warning-50)] text-[var(--color-warning-700)]'
                  }`}>
                    {item.rank}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.contribution}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementWall;