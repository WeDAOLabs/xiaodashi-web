'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TimeFilterProps {
  onTimeRangeChange?: (range: 'day' | 'week' | 'month' | 'quarter') => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ onTimeRangeChange }) => {
  const [activeRange, setActiveRange] = useState<'day' | 'week' | 'month' | 'quarter'>('month');

  const timeRanges = [
    { key: 'day' as const, label: '日' },
    { key: 'week' as const, label: '周' },
    { key: 'month' as const, label: '月' },
    { key: 'quarter' as const, label: '季' },
  ];

  const handleRangeChange = (range: 'day' | 'week' | 'month' | 'quarter') => {
    setActiveRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {timeRanges.map(({ key, label }) => (
        <Button
          key={key}
          variant={activeRange === key ? 'default' : 'outline'}
          size="sm"
          className={`
            px-4 py-1.5 text-sm font-medium rounded-md transition-colors
            ${
              activeRange === key
                ? 'bg-[var(--primary-color)] text-white shadow-sm'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }
          `}
          onClick={() => handleRangeChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default TimeFilter;