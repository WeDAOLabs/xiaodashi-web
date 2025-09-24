'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface DimensionData {
  id: string;
  label: string;
  isSelected: boolean;
}

interface ComparisonWorkbenchProps {
  dimensions: DimensionData[];
  onDimensionChange: (dimensionId: string, selected: boolean) => void;
  children: React.ReactNode;
}

const ComparisonWorkbench: React.FC<ComparisonWorkbenchProps> = ({
  dimensions,
  onDimensionChange,
  children
}) => {
  const handleDimensionChange = (dimensionId: string, checked: boolean) => {
    onDimensionChange(dimensionId, checked);
  };

  return (
    <Card className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">多维度竞品对比工作台</h2>
          <p className="text-sm text-[var(--text-secondary)]">选择多个竞品和维度，进行交叉对比分析。</p>
        </div>

        {/* 对比维度选择 */}
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <h3 className="font-semibold text-[var(--text-primary)] mb-3">对比维度选择</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {dimensions.map((dimension) => (
              <div key={dimension.id} className="flex items-center">
                <Checkbox
                  id={`dim-${dimension.id}`}
                  checked={dimension.isSelected}
                  onCheckedChange={(checked) =>
                    handleDimensionChange(dimension.id, checked as boolean)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                />
                <label
                  htmlFor={`dim-${dimension.id}`}
                  className="ml-2 block text-sm text-[var(--text-secondary)] cursor-pointer"
                >
                  {dimension.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* AI洞察区域 */}
        <div className="p-4 border border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 rounded-lg flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-[var(--accent-color)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--accent-color)]">AI 洞察</h3>
            <p className="text-sm text-[var(--text-primary)]">
              竞品C近期在小红书的种草内容效果显著，主要通过KOC合作，建议我司加强相关布局。
            </p>
          </div>
        </div>

        {/* 图表内容区域 */}
        <div className="space-y-8">
          {children}
        </div>

        {/* 底部操作按钮 */}
        <div className="pt-6 border-t border-[var(--border-secondary)] flex justify-end space-x-3">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            生成竞品对比报告
          </Button>
          <Button className="flex items-center justify-center gap-2">
            AI生成竞争策略建议
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonWorkbench;