'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import React, { useState } from 'react';
import ToolGrid from './_components/ToolGrid';
import { toolsData } from './_components/data';
import type { ToolItem } from './_components/types';

/**
 * 工具聚合页面
 * 展示企业效率提升相关的AI工具集合
 */
const ToolAggregationPage: React.FC = () => {
  const [tools, setTools] = useState<ToolItem[]>(toolsData);

  /**
   * 处理工具操作点击事件
   */
  const handleActionClick = (tool: ToolItem) => {
    // TODO: 实现工具跳转逻辑
    console.log('使用工具:', tool.title);

    // 如果有 actionUrl，则进行跳转
    if (tool.actionUrl && tool.actionUrl !== '#') {
      try {
        window.open(tool.actionUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('打开工具链接失败:', error);
        // TODO: 可以添加用户友好的错误提示 toast
      }
    }
  };

  /**
   * 处理收藏状态切换
   */
  const handleToggleFavorite = (toolId: string, isFavorite: boolean) => {
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === toolId
          ? { ...tool, isFavorite }
          : tool
      )
    );
  };

  return (
    <ToolPageLayout
      title="工具聚合"
      description="企业效率提升模块 - 集成多种AI工具，提升工作效率和质量"
      breadcrumbs={[
        { label: '企业效率提升', href: '/efficiency-improvement' },
        { label: '工具聚合', href: '/efficiency-improvement/tool-aggregation', current: true }
      ]}
    >
      <div className="space-y-6">
        {/* 工具网格展示区域 */}
        <ToolGrid
          tools={tools}
          onActionClick={handleActionClick}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </ToolPageLayout>
  );
};

export default ToolAggregationPage;