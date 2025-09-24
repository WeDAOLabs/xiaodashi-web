'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Monitor } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface ChannelROIData {
  channel: string;
  roi: number;
  fullName: string;
}

const ChannelROIBarChart: React.FC = () => {
  const chartData: ChannelROIData[] = [
    { channel: '抖音信息流', roi: 3.78, fullName: '抖音信息流' },
    { channel: '小红书种草', roi: 3.15, fullName: '小红书种草' },
    { channel: '京东快车', roi: 2.25, fullName: '京东快车' },
    { channel: '淘宝直通车', roi: 1.89, fullName: '淘宝直通车' }
  ];

  const chartConfig = {
    roi: {
      label: 'ROI',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  const tooltipFormatter = (value: unknown) => [
    typeof value === 'number' ? `${value.toFixed(2)}` : String(value),
    'ROI'
  ];

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Monitor className="w-5 h-5 text-[var(--primary-color)]" />
          各渠道ROI分析
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="var(--border-secondary)"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                domain={[0, 4]}
              />
              <YAxis
                dataKey="channel"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                width={80}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
              <Bar
                dataKey="roi"
                fill="var(--chart-2)"
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelROIBarChart;