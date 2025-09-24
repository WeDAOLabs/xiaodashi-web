'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface BrandHealthData {
  category: string;
  current: number;
  industry: number;
  fullMark: number;
}

interface BrandHealthRadarChartProps {
  data: BrandHealthData[];
  className?: string;
}

const chartConfig = {
  current: {
    label: "当前品牌",
    color: "var(--primary-color)",
  },
  industry: {
    label: "行业均值",
    color: "var(--accent-color)",
  },
} satisfies ChartConfig;

const BrandHealthRadarChart = React.memo<BrandHealthRadarChartProps>(({ data, className }) => {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            />
            <PolarGrid gridType="polygon" stroke="var(--border-secondary)" />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name="当前品牌"
              dataKey="current"
              stroke="var(--primary-color)"
              fill="var(--primary-color)"
              fillOpacity={0.6}
              strokeWidth={2}
              dot={{ fill: 'var(--primary-color)', strokeWidth: 0, r: 3 }}
            />
            <Radar
              name="行业均值"
              dataKey="industry"
              stroke="var(--accent-color)"
              fill="var(--accent-color)"
              fillOpacity={0.4}
              strokeWidth={2}
              dot={{ fill: 'var(--accent-color)', strokeWidth: 0, r: 3 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 图例 */}
      <div className="flex justify-center items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--primary-color)', opacity: 0.6 }}></div>
          <span className="text-[var(--text-secondary)]">当前品牌</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--accent-color)', opacity: 0.4 }}></div>
          <span className="text-[var(--text-secondary)]">行业均值</span>
        </div>
      </div>
    </div>
  );
});

BrandHealthRadarChart.displayName = 'BrandHealthRadarChart';

export default BrandHealthRadarChart;