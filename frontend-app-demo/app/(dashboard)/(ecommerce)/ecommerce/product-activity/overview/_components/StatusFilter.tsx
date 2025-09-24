'use client';

import React, { useState } from 'react';

interface StatusFilterProps {
  onFilterChange?: (status: TaskStatus) => void;
}

export type TaskStatus = 'all' | 'draft' | 'pending' | 'published' | 'failed';

const statusOptions = [
  { key: 'all', label: '所有任务' },
  { key: 'draft', label: '草稿' },
  { key: 'pending', label: '待发布' },
  { key: 'published', label: '已发布' },
  { key: 'failed', label: '发布失败' },
] as const;

const StatusFilter: React.FC<StatusFilterProps> = ({ onFilterChange }) => {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>('all');

  const handleStatusChange = (status: TaskStatus) => {
    setActiveStatus(status);
    onFilterChange?.(status);
  };

  return (
    <div className="flex items-center border border-[var(--border-primary)] rounded-lg p-1 space-x-1 bg-[var(--bg-secondary)]">
      {statusOptions.map((option) => (
        <button
          key={option.key}
          onClick={() => handleStatusChange(option.key as TaskStatus)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            activeStatus === option.key
              ? 'bg-[var(--bg-primary)] text-[var(--primary-color)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]\/50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;