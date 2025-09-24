import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Package,
  Sparkles,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { OverviewStats as OverviewStatsType } from '../types';

interface OverviewStatsProps {
  stats: OverviewStatsType;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 已入库IP */}
      <Card className="border border-[var(--border-primary)]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">已入库IP</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalAssets}个</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 孵化中项目 */}
      <Card className="border border-[var(--border-primary)]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">孵化中项目</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.incubatingProjects}个</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成功授权IP */}
      <Card className="border border-[var(--border-primary)]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">成功授权IP</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.authorizedIPs}个</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI洞察 */}
      <Card className="bg-[var(--info-bg)] border border-[var(--info-border)] md:col-span-2 lg:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-[var(--info-color)] mt-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[var(--info-color)] mb-2">AI洞察</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {stats.aiInsight}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewStats;