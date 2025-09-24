'use client';

import React from 'react';
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';

interface PriorityMatrixChartProps {
  className?: string;
}

const chartData = [
  { name: '快速充电', importance: 8, satisfaction: 9, priority: 'high' },
  { name: '电池续航', importance: 9, satisfaction: 4, priority: 'high' },
  { name: '界面简洁', importance: 6, satisfaction: 7, priority: 'medium' },
  { name: '价格优惠', importance: 7, satisfaction: 5, priority: 'medium' },
  { name: '多语言支持', importance: 3, satisfaction: 8, priority: 'low' },
  { name: '个性化设置', importance: 5, satisfaction: 6, priority: 'medium' },
  { name: '云端同步', importance: 4, satisfaction: 3, priority: 'low' },
  { name: '离线模式', importance: 6, satisfaction: 2, priority: 'medium' },
];

const chartConfig = {
  high: {
    label: '高优先级',
    color: 'var(--chart-1)',
  },
  medium: {
    label: '中优先级',
    color: 'var(--chart-2)',
  },
  low: {
    label: '低优先级',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

const getColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'var(--color-high)';
    case 'medium':
      return 'var(--color-medium)';
    case 'low':
      return 'var(--color-low)';
    default:
      return 'var(--chart-1)';
  }
};

const PriorityMatrixChart: React.FC<PriorityMatrixChartProps> = ({ className }) => {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <ScatterChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="importance"
            name="重要性"
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            type="number"
            dataKey="satisfaction"
            name="满意度"
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                    <div className="font-medium text-foreground">{data.name}</div>
                    <div className="text-muted-foreground">
                      重要性: {data.importance}, 满意度: {data.satisfaction}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter dataKey="satisfaction" fill="var(--chart-1)">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.priority)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    </div>
  );
};

export default PriorityMatrixChart;