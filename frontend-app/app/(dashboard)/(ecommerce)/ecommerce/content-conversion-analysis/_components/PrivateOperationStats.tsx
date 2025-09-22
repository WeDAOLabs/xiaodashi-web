'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  color: string;
}

const PrivateOperationStats: React.FC = () => {
  const statsData: StatItem[] = [
    {
      label: '私域引流成交额',
      value: '1.2M元',
      color: 'var(--primary-color)'
    },
    {
      label: '用户复购率',
      value: '45%',
      color: 'var(--primary-color)'
    },
    {
      label: '客单价',
      value: '320元',
      color: 'var(--primary-color)'
    }
  ];

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--primary-color)]" />
          私域运营转化贡献
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {stat.label}
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* 额外的洞察信息 */}
        <div className="mt-6 p-4 bg-[var(--color-info-50)] border border-[var(--color-info-100)] rounded-lg">
          <h4 className="font-semibold text-[var(--color-info-600)] mb-2">关键洞察</h4>
          <p className="text-sm text-[var(--text-secondary)]">
            私域客户转化率比公域高出 <span className="font-bold text-[var(--primary-color)]">2.3倍</span>，
            平均客单价提升 <span className="font-bold text-[var(--primary-color)]">78%</span>。
            建议加大私域流量运营投入。
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivateOperationStats;