'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';

interface FilterState {
  listType: 'activity' | 'channel' | 'content' | 'product';
  metric: 'roi' | 'gmv' | 'conversion' | 'interaction';
  period: 'week' | 'month' | 'quarter';
}

interface CompetitorComparisonProps {
  filters: FilterState;
}

interface CompetitorData {
  name: string;
  value: number;
  displayValue: string;
  color: string;
}

const CompetitorComparison: React.FC<CompetitorComparisonProps> = ({ filters }) => {
  const getTitle = () => {
    const metricMap = {
      roi: 'ROI',
      gmv: 'GMV',
      conversion: '转化率',
      interaction: '互动率'
    };

    return `竞品效果对比 (${metricMap[filters.metric]})`;
  };

  const competitorData: CompetitorData[] = React.useMemo(() => {
    if (filters.metric === 'roi') {
      return [
        { name: '我方', value: 3.8, displayValue: '1:3.8', color: 'var(--color-chart-2)' },
        { name: '竞品A', value: 3.0, displayValue: '1:3.0', color: 'var(--color-chart-5)' },
        { name: '竞品B', value: 4.2, displayValue: '1:4.2', color: 'var(--color-chart-3)' },
      ];
    } else if (filters.metric === 'gmv') {
      return [
        { name: '我方', value: 800, displayValue: '¥800W', color: 'var(--color-chart-2)' },
        { name: '竞品A', value: 650, displayValue: '¥650W', color: 'var(--color-chart-5)' },
        { name: '竞品B', value: 720, displayValue: '¥720W', color: 'var(--color-chart-3)' },
      ];
    } else {
      return [
        { name: '我方', value: 3.2, displayValue: '3.2%', color: 'var(--color-chart-2)' },
        { name: '竞品A', value: 2.8, displayValue: '2.8%', color: 'var(--color-chart-5)' },
        { name: '竞品B', value: 3.6, displayValue: '3.6%', color: 'var(--color-chart-3)' },
      ];
    }
  }, [filters.metric]);


  const chartConfig = React.useMemo(() => ({
    value: {
      label: filters.metric === 'gmv' ? 'GMV' : filters.metric === 'roi' ? 'ROI' : '转化率',
      color: 'var(--color-chart-2)',
    },
  }), [filters.metric]);

  const tooltipFormatter = React.useCallback(
    (value: unknown, name: unknown, props: { payload?: { name?: string } }) => {
      const item = competitorData.find(d => d.name === props.payload?.name);
      return [item?.displayValue || String(value), String(name)] as [React.ReactNode, string];
    },
    [competitorData]
  );

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{getTitle()}</h3>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <Users className="w-3.5 h-3.5" />
            管理竞品列表
          </Button>
        </div>

        <div className="flex-1 min-h-[200px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={competitorData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <YAxis hide />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                >
                  {competitorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <ChartTooltip
                  content={<ChartTooltipContent formatter={tooltipFormatter} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* 数据标签 */}
        <div className="flex justify-around mt-4">
          {competitorData.map((item, index) => (
            <div key={index} className="text-center">
              <div
                className="w-3 h-3 rounded-sm mx-auto mb-1"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-xs text-[var(--text-secondary)]">{item.name}</p>
              <p className="text-xs font-semibold text-[var(--text-primary)]">{item.displayValue}</p>
            </div>
          ))}
        </div>

        {/* 竞争分析 */}
        <div className="mt-4 p-3 bg-[var(--bg-tertiary)] rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-chart-2)] mt-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-[var(--text-primary)] mb-1">竞争优势</p>
              <p className="text-[var(--text-secondary)]">
                {competitorData[0].value > competitorData[1].value
                  ? `领先竞品A约${((competitorData[0].value / competitorData[1].value - 1) * 100).toFixed(0)}%`
                  : `落后竞品A约${((competitorData[1].value / competitorData[0].value - 1) * 100).toFixed(0)}%`
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorComparison;