'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface FilterState {
  listType: 'activity' | 'channel' | 'content' | 'product';
  metric: 'roi' | 'gmv' | 'conversion' | 'interaction';
  period: 'week' | 'month' | 'quarter';
}

interface BenchmarkComparisonProps {
  filters: FilterState;
}

interface BenchmarkData {
  label: string;
  value: number;
  percentage: string;
  color: string;
  maxValue: number;
}

const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ filters }) => {
  const getTitle = () => {
    const metricMap = {
      roi: 'ROI',
      gmv: 'GMV转化率',
      conversion: '转化率',
      interaction: '互动率'
    };

    return `行业基准对比 (${metricMap[filters.metric]})`;
  };

  const benchmarkData: BenchmarkData[] = React.useMemo(() => {
    if (filters.metric === 'gmv') {
      return [
        { label: '我方转化率', value: 3.2, percentage: '3.2%', color: 'var(--color-chart-2)', maxValue: 4.0 },
        { label: '行业平均', value: 2.5, percentage: '2.5%', color: 'var(--color-chart-4)', maxValue: 4.0 },
        { label: '行业领先', value: 4.0, percentage: '4.0%', color: 'var(--color-chart-1)', maxValue: 4.0 },
      ];
    } else {
      return [
        { label: '我方表现', value: 3.8, percentage: '1:3.8', color: 'var(--color-chart-2)', maxValue: 5.0 },
        { label: '行业平均', value: 3.0, percentage: '1:3.0', color: 'var(--color-chart-4)', maxValue: 5.0 },
        { label: '行业领先', value: 4.8, percentage: '1:4.8', color: 'var(--color-chart-1)', maxValue: 5.0 },
      ];
    }
  }, [filters.metric]);

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{getTitle()}</h3>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <Settings className="w-3.5 h-3.5" />
            配置数据源
          </Button>
        </div>

        <div className="flex-1 space-y-6">
          {benchmarkData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{item.percentage}</span>
              </div>
              <div className="relative">
                <div className="w-full bg-[var(--bg-secondary)] rounded-sm h-5">
                  <div
                    className="h-full rounded-sm transition-all duration-300"
                    style={{
                      width: `${(item.value / item.maxValue) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 性能分析 */}
        <div className="mt-6 p-4 bg-[var(--bg-tertiary)] rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-chart-1)] mt-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-[var(--text-primary)] mb-1">性能分析</p>
              <p className="text-[var(--text-secondary)]">
                {filters.metric === 'gmv'
                  ? '当前转化率高于行业平均28%，距离行业领先水平还有25%提升空间。'
                  : '当前ROI表现优于行业平均27%，可通过优化投放策略进一步提升。'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenchmarkComparison;