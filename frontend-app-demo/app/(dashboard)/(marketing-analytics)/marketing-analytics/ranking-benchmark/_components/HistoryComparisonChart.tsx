'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface FilterState {
  listType: 'activity' | 'channel' | 'content' | 'product';
  metric: 'roi' | 'gmv' | 'conversion' | 'interaction';
  period: 'week' | 'month' | 'quarter';
}

interface HistoryComparisonChartProps {
  filters: FilterState;
}

// 模拟历史数据
const gmvHistoryData = [
  { month: '5月', value: 250 },
  { month: '6月', value: 275 },
  { month: '7月', value: 340 },
  { month: '8月', value: 320 },
  { month: '9月', value: 380 },
  { month: '10月', value: 420 },
];

const HistoryComparisonChart: React.FC<HistoryComparisonChartProps> = ({ filters }) => {
  const getTitle = () => {
    const metricMap = {
      roi: 'ROI',
      gmv: 'GMV 增长率',
      conversion: '转化率',
      interaction: '互动率'
    };

    return `关键指标历史对比：${metricMap[filters.metric]}`;
  };

  const chartConfig = React.useMemo(() => ({
    value: {
      label: filters.metric === 'gmv' ? 'GMV(万)' : '数值',
      color: 'var(--color-chart-2)',
    },
  }), [filters.metric]);

  const tooltipFormatter = React.useCallback(
    (value: unknown) => [
      typeof value === 'number' ? value.toLocaleString() : String(value),
      chartConfig.value.label
    ] as [React.ReactNode, string],
    [chartConfig.value.label]
  );

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{getTitle()}</h3>

        <div className="flex-1 min-h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={gmvHistoryData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartConfig.value.color}
                  strokeWidth={2.5}
                  dot={{
                    fill: chartConfig.value.color,
                    strokeWidth: 0,
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: chartConfig.value.color
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={tooltipFormatter} />}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* 图例 */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartConfig.value.color }}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              {chartConfig.value.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryComparisonChart;