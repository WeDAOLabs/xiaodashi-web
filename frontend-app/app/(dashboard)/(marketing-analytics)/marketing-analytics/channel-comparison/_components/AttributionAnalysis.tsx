'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AttributionModel {
  id: string;
  label: string;
}

interface AttributionData {
  name: string;
  value: number;
  color: string;
}

interface AttributionAnalysisProps {
  title?: string;
}

const attributionModels: AttributionModel[] = [
  { id: 'first-touch', label: '首次触点' },
  { id: 'last-touch', label: '末次触点' },
  { id: 'linear', label: '线性' },
  { id: 'time-decay', label: '时间衰减' },
  { id: 'u-shaped', label: 'U型' }
];

const chartData: AttributionData[] = [
  { name: '广告曝光', value: 35, color: 'var(--color-chart-1)' },
  { name: '首次点击', value: 25, color: 'var(--color-chart-2)' },
  { name: '浏览商品', value: 20, color: 'var(--color-chart-3)' },
  { name: '加购', value: 12, color: 'var(--color-chart-4)' },
  { name: '支付', value: 8, color: 'var(--color-chart-5)' }
];

const chartConfig = {
  value: {
    label: '占比',
  },
};

const AttributionAnalysis: React.FC<AttributionAnalysisProps> = ({
  title = '转化归因分析'
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('first-touch');

  const handleModelChange = (modelId: string): void => {
    setSelectedModel(modelId);
  };


  return (
    <div className="bg-[var(--bg-primary)] p-5 lg:p-6 rounded-lg shadow-sm border border-[var(--border-secondary)]">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h2>

      {/* 归因模型选择 */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-lg mb-4">
        {attributionModels.map((model) => (
          <button
            key={model.id}
            onClick={() => handleModelChange(model.id)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors font-semibold ${
              selectedModel === model.id
                ? 'bg-[var(--color-primary-500)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-secondary)]'
            }`}
          >
            {model.label}
          </button>
        ))}
      </div>

      {/* 饼图展示 */}
      <div className="h-64 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* 图例 */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[var(--text-secondary)]">{item.name}</span>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button variant="outline" className="flex-1 text-sm font-semibold">
          配置模型
        </Button>
        <Button className="flex-1 text-sm font-semibold bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
          生成报告
        </Button>
      </div>
    </div>
  );
};

export default AttributionAnalysis;