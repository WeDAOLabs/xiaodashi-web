'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface InterestData {
  category: string;
  value: number;
  fullMark: number;
}

interface InterestRadarChartProps {
  title: string;
  data: InterestData[];
}

const InterestRadarChart: React.FC<InterestRadarChartProps> = ({ title, data }) => {
  const chartConfig = {
    value: {
      label: '兴趣度',
      color: 'var(--color-primary-500)',
    },
  };

  return (
    <Card className="border border-[var(--border-primary)] shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        <div className="h-64">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                <PolarGrid
                  stroke="var(--border-secondary)"
                  gridType="polygon"
                />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  className="text-xs"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                  tickCount={6}
                  axisLine={false}
                />
                <Radar
                  name="兴趣度"
                  dataKey="value"
                  stroke="var(--color-primary-500)"
                  fill="var(--color-primary-500)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary-500)', strokeWidth: 0, r: 3 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestRadarChart;