'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// 示例数据 - 重新组织数据结构以适配BarChart
const efficiencyData = [
  { category: '餐饮', reservationRate: 90, arrivalRate: 85 },
  { category: '丽人', reservationRate: 95, arrivalRate: 92 },
  { category: '休娱', reservationRate: 75, arrivalRate: 65 },
  { category: '生活', reservationRate: 88, arrivalRate: 80 }
];

const chartConfig = {
  reservationRate: {
    label: '预约率',
    color: 'var(--primary-color)',
  },
  arrivalRate: {
    label: '到店率',
    color: 'var(--color-chart-2)',
  },
} satisfies import('@/components/ui/chart').ChartConfig;

const EfficiencyChart: React.FC = () => {
  const tooltipFormatter = React.useCallback(
    (value: unknown, name: unknown) => [
      `${value}%`,
      name === 'reservationRate' ? '预约率' : '到店率'
    ] as [React.ReactNode, string],
    []
  );

  return (
    <div className="w-full h-64">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={efficiencyData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="reservationRate"
              fill="var(--color-reservationRate)"
              radius={[4, 4, 0, 0]}
              maxBarSize={25}
            />
            <Bar
              dataKey="arrivalRate"
              fill="var(--color-arrivalRate)"
              radius={[4, 4, 0, 0]}
              maxBarSize={25}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={tooltipFormatter} />}
              cursor={false}
            />
            <ChartLegend
              content={<ChartLegendContent />}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default EfficiencyChart;