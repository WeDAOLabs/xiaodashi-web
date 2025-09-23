'use client';

import React, { useCallback, memo } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ToolCardProps } from './types';

/**
 * 工具卡片组件
 * 可复用的工具展示卡片，包含图标、标题、痛点说明、用户价值、特点列表和操作按钮
 */
const ToolCard: React.FC<ToolCardProps> = memo(({
  tool,
  onActionClick,
  onToggleFavorite,
  className
}) => {
  const Icon = tool.icon;

  const handleFavoriteClick = useCallback(() => {
    onToggleFavorite?.(tool.id, !tool.isFavorite);
  }, [tool.id, tool.isFavorite, onToggleFavorite]);

  const handleActionClick = useCallback(() => {
    onActionClick?.(tool);
  }, [tool, onActionClick]);

  return (
    <Card
      className={cn(
        "h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col p-0 gap-0",
        className
      )}
    >
      {/* 头部：图标、标题和收藏按钮 */}
      <CardHeader className="py-5 min-h-[80px] flex items-center">
        <div className="flex items-center gap-4 w-full">
          <Icon className="w-10 h-10 text-[var(--primary-color)]" />
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            {tool.title}
          </CardTitle>
        </div>
        <CardAction>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "transition-colors hover:text-yellow-500",
              tool.isFavorite ? "text-yellow-500" : "text-gray-400"
            )}
            aria-label={tool.isFavorite ? "取消收藏" : "收藏工具"}
          >
            <Star
              className={cn(
                "w-5 h-5",
                tool.isFavorite ? "fill-current" : ""
              )}
            />
          </button>
        </CardAction>
      </CardHeader>

      {/* 主要内容区域 */}
      <CardContent className="flex-grow">
        {/* 解决痛点区域 */}
        <div className="p-4 bg-[var(--bg-tertiary)] border-l-4 border-[var(--primary-color)] rounded-r-md">
          <p className="font-semibold text-[var(--primary-color)]">解决痛点:</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {tool.painPoint}
          </p>
        </div>

        {/* 用户价值 */}
        <div className="mt-4">
          <p className="font-semibold text-[var(--text-primary)]">用户价值:</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {tool.userValue}
          </p>
        </div>

        {/* 功能特点 */}
        <div className="mt-5 space-y-2">
          {tool.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
            >
              <span className="text-green-600">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      {/* 底部操作区域 */}
      <CardFooter className="py-5 min-h-[70px] bg-[var(--bg-tertiary)] rounded-b-[var(--radius)] border-t border-[var(--border-secondary)] flex items-center justify-end">
        <Button
          onClick={handleActionClick}
          className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] shadow-sm"
        >
          立即使用
        </Button>
      </CardFooter>
    </Card>
  );
});

ToolCard.displayName = 'ToolCard';

export default ToolCard;