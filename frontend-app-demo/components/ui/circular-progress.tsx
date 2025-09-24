'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
  color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  className,
  showValue = true,
  color = 'var(--color-primary-500)',
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));

  // 适用于PieChart的数据格式
  const chartData = [
    { name: 'progress', value: normalizedValue, fill: color },
    { name: 'remaining', value: 100 - normalizedValue, fill: 'var(--bg-secondary)' }
  ];

  const chartConfig: ChartConfig = {
    progress: {
      label: '进度',
      color: color,
    },
    remaining: {
      label: '剩余',
      color: 'var(--bg-secondary)',
    },
  };

  const sizeConfig = {
    sm: { container: 'w-16 h-16', text: 'text-sm', innerRadius: 25, outerRadius: 30 },
    md: { container: 'w-20 h-20', text: 'text-base', innerRadius: 30, outerRadius: 38 },
    lg: { container: 'w-24 h-24', text: 'text-2xl', innerRadius: 35, outerRadius: 45 },
  };

  const config = sizeConfig[size];

  return (
    <div className={cn('relative flex items-center justify-center', config.container, className)}>
      <ChartContainer config={chartConfig} className="w-full h-full aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={config.innerRadius}
              outerRadius={config.outerRadius}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-[var(--text-primary)]', config.text)}>
            {normalizedValue}%
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;