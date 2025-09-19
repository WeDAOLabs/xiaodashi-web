import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FlavorPreferenceChartProps {}

// 口味偏好数据
const flavorData = [
  { name: 'fruit', label: '果味', value: 30, fill: 'var(--color-fruit)' },
  { name: 'chocolate', label: '巧克力', value: 22, fill: 'var(--color-chocolate)' },
  { name: 'cheese', label: '乳酪', value: 15, fill: 'var(--color-cheese)' },
  { name: 'lowsugar', label: '低糖', value: 40, fill: 'var(--color-lowsugar)' }
];

// 图表配置
const chartConfig: ChartConfig = {
  fruit: {
    label: '果味',
    color: '#4F46E5'
  },
  chocolate: {
    label: '巧克力',
    color: '#9333EA'
  },
  cheese: {
    label: '乳酪',
    color: '#F59E0B'
  },
  lowsugar: {
    label: '低糖',
    color: '#10B981'
  }
};

const FlavorPreferenceChart: React.FC<FlavorPreferenceChartProps> = () => {
  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">产品口味偏好趋势</h2>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
        &ldquo;清爽果味&rdquo;偏好增长15%, &ldquo;重乳酪&rdquo;口味保持稳健; &ldquo;低糖&rdquo;需求占比40%
      </p>

      <div className="h-48 relative mt-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={flavorData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {flavorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-sm font-semibold text-[var(--text-primary)]">口味偏好</div>
            <div className="text-xs text-[var(--text-secondary)]">占比分布</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm mt-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4F46E5' }}></span>
          <span>果味 (30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#9333EA' }}></span>
          <span>巧克力 (22%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }}></span>
          <span>乳酪 (15%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }}></span>
          <span>低糖 (40%)</span>
        </div>
      </div>
    </div>
  );
};

export default FlavorPreferenceChart;