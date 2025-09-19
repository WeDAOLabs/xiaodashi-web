import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { AnalysisData } from '../types';

interface IPAnalysisChartsProps {
  analysisData: AnalysisData;
}

const radarChartConfig = {
  value: {
    label: '评分',
    color: 'hsl(var(--color-primary-500))',
  },
} satisfies ChartConfig;

const barChartConfig = {
  percentage: {
    label: '占比',
    color: 'hsl(var(--color-primary-500))',
  },
} satisfies ChartConfig;

const IPAnalysisCharts: React.FC<IPAnalysisChartsProps> = ({ analysisData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* IP评分雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">IP评分分析</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={radarChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <RadarChart data={analysisData.radarData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <PolarAngleAxis
                dataKey="dimension"
                className="text-xs fill-[var(--text-secondary)]"
              />
              <PolarGrid
                className="stroke-[var(--border-secondary)]"
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                className="text-xs fill-[var(--text-tertiary)]"
                tickCount={6}
              />
              <Radar
                dataKey="value"
                stroke="var(--color-primary-500)"
                fill="var(--color-primary-500)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
          <div className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            多维度评估IP综合表现
          </div>
        </CardContent>
      </Card>

      {/* 粉丝画像柱状图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">粉丝年龄分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={barChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <BarChart data={analysisData.fanDemographics}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-[var(--border-secondary)]"
              />
              <XAxis
                dataKey="ageGroup"
                className="text-xs fill-[var(--text-secondary)]"
              />
              <YAxis
                className="text-xs fill-[var(--text-secondary)]"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="percentage"
                fill="var(--color-primary-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            了解目标粉丝群体构成
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPAnalysisCharts;