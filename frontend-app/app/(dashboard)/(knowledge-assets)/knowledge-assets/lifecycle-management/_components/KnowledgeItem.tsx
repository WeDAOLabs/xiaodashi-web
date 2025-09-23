'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { KnowledgeItem } from './types';

interface KnowledgeItemProps {
  item: KnowledgeItem;
  isSelected?: boolean;
  onClick?: () => void;
}

const KnowledgeItem: React.FC<KnowledgeItemProps> = ({ item, isSelected = false, onClick }) => {
  const getStatusColor = (color: string) => {
    const colorMap = {
      green: 'bg-[var(--color-success-500)]',
      yellow: 'bg-[var(--color-warning-500)]',
      red: 'bg-[var(--color-danger-500)]'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-[var(--text-tertiary)]';
  };

  return (
    <Button
      variant="ghost"
      className={`w-full text-left p-3 rounded-md mb-1.5 transition-colors hover:bg-[var(--bg-secondary)] ${
        isSelected ? 'bg-[var(--primary-color-focus-ring)]' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-full">
        <div className="flex justify-between items-start">
          <p className={`font-medium text-sm ${
            isSelected ? 'text-[var(--primary-color)]' : 'text-[var(--text-primary)]'
          }`}>
            {item.title}
          </p>
          <div
            className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(item.status.color)}`}
            title={item.status.label}
          />
        </div>
        <div className="mt-1 text-xs text-[var(--text-secondary)] flex flex-wrap gap-x-3 gap-y-1">
          <span>版本: {item.version}</span>
          <span>引用: {item.references}</span>
          <span>更新: {item.lastUpdated}</span>
          {item.isHighFrequency && (
            <span className="font-semibold text-[var(--color-danger-500)]">被销售引用</span>
          )}
        </div>
      </div>
    </Button>
  );
};

export default KnowledgeItem;