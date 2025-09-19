'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface PricingData {
  month: string;
  our: number;
  competitorA: number;
  competitorB: number;
}

interface PricingStrategyChartProps {
  data: PricingData[];
  className?: string;
}

const chartConfig = {
  our: {
    label: "我方",
    color: "var(--primary-color)",
  },
  competitorA: {
    label: "竞品A",
    color: "#0077ed",
  },
  competitorB: {
    label: "竞品B",
    color: "#d97706",
  },
} satisfies ChartConfig;

const PricingStrategyChart: React.FC<PricingStrategyChartProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 text-center">定价策略对比</h3>
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
            label={{ value: '价格 (元)', angle: -90, position: 'insideLeft' }}
          />
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="our"
            type="monotone"
            stroke="var(--color-our)"
            strokeWidth={2}
            dot={{ fill: "var(--color-our)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            dataKey="competitorA"
            type="monotone"
            stroke="var(--color-competitorA)"
            strokeWidth={2}
            dot={{ fill: "var(--color-competitorA)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            dataKey="competitorB"
            type="monotone"
            stroke="var(--color-competitorB)"
            strokeWidth={2}
            dot={{ fill: "var(--color-competitorB)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default PricingStrategyChart;