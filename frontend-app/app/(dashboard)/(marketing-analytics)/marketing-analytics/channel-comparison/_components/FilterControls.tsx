'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterControlsProps {
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  dimension: string;
  period: string;
  metrics: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    dimension: '渠道',
    period: '近30天',
    metrics: ['GMV', 'ROI']
  });

  const dimensionOptions: FilterOption[] = [
    { id: '渠道', label: '渠道' },
    { id: '活动', label: '活动' },
    { id: '内容', label: '内容' }
  ];

  const periodOptions: FilterOption[] = [
    { id: '近7天', label: '近7天' },
    { id: '近30天', label: '近30天' },
    { id: '自定义', label: '自定义' }
  ];

  const metricOptions: FilterOption[] = [
    { id: 'GMV', label: 'GMV' },
    { id: 'ROI', label: 'ROI' },
    { id: '转化率', label: '转化率' },
    { id: '新增用户', label: '新增用户' }
  ];

  const handleDimensionChange = (dimension: string): void => {
    const newFilters = { ...filters, dimension };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handlePeriodChange = (period: string): void => {
    const newFilters = { ...filters, period };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleMetricChange = (metricId: string, checked: boolean): void => {
    const newMetrics = checked
      ? [...filters.metrics, metricId]
      : filters.metrics.filter(m => m !== metricId);

    const newFilters = { ...filters, metrics: newMetrics };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = (): void => {
    const resetFilters = {
      dimension: '渠道',
      period: '近30天',
      metrics: ['GMV', 'ROI']
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const handleApply = (): void => {
    onFiltersChange?.(filters);
  };

  return (
    <div className="bg-[var(--bg-primary)] p-5 lg:p-6 rounded-lg shadow-sm border border-[var(--border-secondary)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {/* 对比维度 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">对比维度</label>
          <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-lg">
            {dimensionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDimensionChange(option.id)}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors font-semibold ${
                  filters.dimension === option.id
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-secondary)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 时间周期 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">时间周期</label>
          <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-lg">
            {periodOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handlePeriodChange(option.id)}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors font-semibold ${
                  filters.period === option.id
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-secondary)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 核心指标 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">核心指标</label>
          <div className="flex items-center gap-4 pt-2">
            {metricOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                <Checkbox
                  checked={filters.metrics.includes(option.id)}
                  onCheckedChange={(checked) => handleMetricChange(option.id, !!checked)}
                  className="w-4 h-4 rounded text-[var(--color-primary-500)] bg-[var(--bg-secondary)] border-[var(--border-primary)]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-end gap-2 justify-self-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-sm font-semibold"
          >
            重置
          </Button>
          <Button
            onClick={handleApply}
            className="text-sm font-semibold bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]"
          >
            应用筛选
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;