'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
// import { TrendingUp } from 'lucide-react';
import type { StatCardData } from './types';

interface DashboardStatsProps {
  className?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ className }) => {
  const statsData: StatCardData[] = [
    {
      title: '知识更新率',
      value: '85%',
      change: '+2%',
      isPositive: true,
      subtitle: '周环比'
    },
    {
      title: '平均查询命中率',
      value: '92%'
    },
    {
      title: '低质量知识',
      value: '18 条',
      subtitle: 'AI建议清理'
    },
    {
      title: '高频引用知识',
      value: '120 条'
    }
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 ${className || ''}`}>
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-[var(--bg-primary)] shadow-sm border border-[var(--border-primary)]">
          <CardContent className="p-4">
            <h4 className="text-sm text-[var(--text-secondary)]">{stat.title}</h4>
            <div className="text-2xl font-bold mt-1">{stat.value}</div>
            {stat.change && (
              <div className={`text-xs mt-1 ${stat.isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'}`}>
                {stat.change} {stat.subtitle}
              </div>
            )}
            {stat.subtitle && !stat.change && (
              <div className="text-xs mt-1 text-[var(--text-tertiary)]">{stat.subtitle}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;