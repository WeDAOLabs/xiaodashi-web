'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import ToolCard from './ToolCard';
import type { ToolGridProps } from './types';

/**
 * 工具网格组件
 * 以响应式网格布局展示工具卡片，支持渐进式动画效果
 */
const ToolGrid: React.FC<ToolGridProps> = memo(({
  tools,
  onActionClick,
  onToggleFavorite,
  className
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
        className
      )}
    >
      {tools.map((tool, index) => (
        <div
          key={tool.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <ToolCard
            tool={tool}
            onActionClick={onActionClick}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
});

ToolGrid.displayName = 'ToolGrid';

export default ToolGrid;