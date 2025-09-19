'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

interface RadarChartData {
  category: string;
  our: number;
  competitorA: number;
  competitorB: number;
}

interface CompetitorRadarChartProps {
  data: RadarChartData[];
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

const CompetitorRadarChart: React.FC<CompetitorRadarChartProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 text-center">综合表现雷达图</h3>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
        <RadarChart data={data}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
          />
          <PolarGrid gridType="polygon" />
          <Radar
            dataKey="our"
            fill="var(--color-our)"
            fillOpacity={0.6}
            stroke="var(--color-our)"
            strokeWidth={2}
          />
          <Radar
            dataKey="competitorA"
            fill="var(--color-competitorA)"
            fillOpacity={0.6}
            stroke="var(--color-competitorA)"
            strokeWidth={2}
          />
          <Radar
            dataKey="competitorB"
            fill="var(--color-competitorB)"
            fillOpacity={0.6}
            stroke="var(--color-competitorB)"
            strokeWidth={2}
          />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};

export default CompetitorRadarChart;