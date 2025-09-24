'use client';

import React from 'react';
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';

interface InnovationOpportunityChartProps {
  className?: string;
}

const chartData = [
  { name: 'AI语音识别', marketPotential: 8.5, technicalFeasibility: 9, quadrant: 'star' },
  { name: '无线充电', marketPotential: 7, technicalFeasibility: 8, quadrant: 'star' },
  { name: '全息显示', marketPotential: 9, technicalFeasibility: 3, quadrant: 'question' },
  { name: '超长续航', marketPotential: 9.5, technicalFeasibility: 4, quadrant: 'question' },
  { name: '价格降低', marketPotential: 3, technicalFeasibility: 8, quadrant: 'cash' },
  { name: '材料升级', marketPotential: 4, technicalFeasibility: 7, quadrant: 'cash' },
  { name: '旧功能维护', marketPotential: 2, technicalFeasibility: 2, quadrant: 'dog' },
  { name: '兼容性', marketPotential: 3, technicalFeasibility: 3, quadrant: 'dog' },
];

const chartConfig = {
  star: {
    label: '明星产品',
    color: 'var(--chart-1)',
  },
  question: {
    label: '问题产品',
    color: 'var(--chart-2)',
  },
  cash: {
    label: '现金牛',
    color: 'var(--chart-3)',
  },
  dog: {
    label: '瘦狗产品',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const getColor = (quadrant: string) => {
  switch (quadrant) {
    case 'star':
      return 'var(--color-star)';
    case 'question':
      return 'var(--color-question)';
    case 'cash':
      return 'var(--color-cash)';
    case 'dog':
      return 'var(--color-dog)';
    default:
      return 'var(--chart-1)';
  }
};

const InnovationOpportunityChart: React.FC<InnovationOpportunityChartProps> = ({ className }) => {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
            dataKey="marketPotential"
            name="市场潜力"
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            type="number"
            dataKey="technicalFeasibility"
            name="技术可行性"
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ReferenceLine x={5} strokeDasharray="2 2" />
          <ReferenceLine y={5} strokeDasharray="2 2" />
          <ChartTooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                    <div className="font-medium text-foreground">{data.name}</div>
                    <div className="text-muted-foreground">
                      市场潜力: {data.marketPotential}
                    </div>
                    <div className="text-muted-foreground">
                      技术可行性: {data.technicalFeasibility}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter dataKey="technicalFeasibility" fill="var(--chart-1)">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.quadrant)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>

      {/* 象限说明 - 优化布局 */}
      <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--chart-1)]"></div>
            <span className="font-medium text-[var(--text-primary)]">明星</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--chart-2)]"></div>
            <span className="font-medium text-[var(--text-primary)]">问题</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--chart-3)]"></div>
            <span className="font-medium text-[var(--text-primary)]">现金牛</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--chart-4)]"></div>
            <span className="font-medium text-[var(--text-primary)]">瘦狗</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationOpportunityChart;