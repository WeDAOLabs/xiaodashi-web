'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface EmotionTrendChartProps {
  className?: string;
}

const chartData = [
  { month: '一月', positive: 120, neutral: 180, negative: 200 },
  { month: '二月', positive: 150, neutral: 190, negative: 180 },
  { month: '三月', positive: 180, neutral: 200, negative: 160 },
  { month: '四月', positive: 100, neutral: 150, negative: 220 },
  { month: '五月', positive: 80, neutral: 120, negative: 250 },
  { month: '六月', positive: 70, neutral: 110, negative: 280 },
];

const chartConfig = {
  positive: {
    label: '积极',
    color: 'var(--chart-1)',
  },
  neutral: {
    label: '中性',
    color: 'var(--chart-2)',
  },
  negative: {
    label: '消极',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ className }) => {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 2)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="negative"
            type="natural"
            fill="var(--color-negative)"
            fillOpacity={0.4}
            stroke="var(--color-negative)"
            stackId="a"
          />
          <Area
            dataKey="neutral"
            type="natural"
            fill="var(--color-neutral)"
            fillOpacity={0.4}
            stroke="var(--color-neutral)"
            stackId="a"
          />
          <Area
            dataKey="positive"
            type="natural"
            fill="var(--color-positive)"
            fillOpacity={0.4}
            stroke="var(--color-positive)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default EmotionTrendChart;