'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  gmv: number;
}

const ContentGMVLineChart: React.FC = () => {
  const chartData: ChartDataPoint[] = [
    { date: '07-01', gmv: 4000 },
    { date: '07-02', gmv: 3200 },
    { date: '07-03', gmv: 3800 },
    { date: '07-04', gmv: 7800 },
    { date: '07-05', gmv: 7400 },
    { date: '07-06', gmv: 8900 },
    { date: '07-07', gmv: 8200 }
  ];

  const chartConfig = {
    gmv: {
      label: 'GMV',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  const tooltipFormatter = (value: unknown) => [
    typeof value === 'number' ? `¥${(value / 1000).toFixed(1)}K` : String(value),
    'GMV'
  ];

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--primary-color)]" />
          内容与GMV关联图
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border-secondary)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
              <Line
                dataKey="gmv"
                type="monotone"
                stroke="var(--color-gmv)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-gmv)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-gmv)', strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentGMVLineChart;