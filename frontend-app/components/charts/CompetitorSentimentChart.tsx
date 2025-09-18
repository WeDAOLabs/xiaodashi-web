'use client';

import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';

interface CompetitorSentimentChartProps {
  className?: string;
}

const chartData = [
  {
    product: '我司产品',
    positive: 65,
    negative: 35,
    positiveValue: 65,
    negativeValue: -35
  },
  {
    product: '竞品Z',
    positive: 75,
    negative: 25,
    positiveValue: 75,
    negativeValue: -25
  },
];

const chartConfig = {
  positive: {
    label: '积极口碑',
    color: 'var(--chart-1)',
  },
  negative: {
    label: '消极口碑',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const CompetitorSentimentChart: React.FC<CompetitorSentimentChartProps> = ({ className }) => {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="h-[180px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="horizontal"
          margin={{
            left: 80,
            right: 20,
            top: 20,
            bottom: 20,
          }}
        >
          <XAxis
            type="number"
            domain={[-100, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Math.abs(value)}%`}
          />
          <YAxis
            type="category"
            dataKey="product"
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                    <div className="font-medium text-foreground">{label}</div>
                    <div className="text-muted-foreground">
                      积极口碑: {data.positive}%
                    </div>
                    <div className="text-muted-foreground">
                      消极口碑: {data.negative}%
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="negativeValue"
            fill="var(--color-negative)"
            stackId="sentiment"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="positiveValue"
            fill="var(--color-positive)"
            stackId="sentiment"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default CompetitorSentimentChart;