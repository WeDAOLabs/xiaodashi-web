'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Settings } from 'lucide-react';

interface FilterState {
  listType: 'activity' | 'channel' | 'content' | 'product';
  metric: 'roi' | 'gmv' | 'conversion' | 'interaction';
  period: 'week' | 'month' | 'quarter';
}

interface FilterControlBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

interface ToggleGroupProps {
  title: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ title, options, selectedValue, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-[var(--text-secondary)]">{title}:</span>
      <div className="flex items-center bg-[var(--bg-secondary)] p-1 rounded-lg">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedValue === option.value
                ? 'bg-[var(--color-primary-500)] text-white'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const FilterControlBar: React.FC<FilterControlBarProps> = ({ filters, onFilterChange }) => {
  const listTypeOptions = [
    { value: 'activity', label: '活动' },
    { value: 'channel', label: '渠道' },
    { value: 'content', label: '内容' },
    { value: 'product', label: '商品' }
  ];

  const metricOptions = [
    { value: 'roi', label: 'ROI' },
    { value: 'gmv', label: 'GMV' },
    { value: 'conversion', label: '转化率' },
    { value: 'interaction', label: '用户互动' }
  ];

  const periodOptions = [
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <ToggleGroup
              title="榜单类型"
              options={listTypeOptions}
              selectedValue={filters.listType}
              onChange={(value) => handleFilterChange('listType', value)}
            />
            <ToggleGroup
              title="排名指标"
              options={metricOptions}
              selectedValue={filters.metric}
              onChange={(value) => handleFilterChange('metric', value)}
            />
            <ToggleGroup
              title="时间周期"
              options={periodOptions}
              selectedValue={filters.period}
              onChange={(value) => handleFilterChange('period', value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              配置竞品
            </Button>
            <Button className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              生成榜单
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControlBar;