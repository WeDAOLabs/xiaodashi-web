'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import FilterControls from './_components/FilterControls';
import ComparisonChart from './_components/ComparisonChart';
import AttributionAnalysis from './_components/AttributionAnalysis';
import UserConversionPath from './_components/UserConversionPath';

interface FilterState {
  dimension: string;
  period: string;
  metrics: string[];
}

const ChannelComparisonPage: React.FC = () => {
  const handleFiltersChange = (newFilters: FilterState): void => {
    // 这里可以根据筛选条件更新数据
    console.log('Filter changed:', newFilters);
  };

  return (
    <ToolPageLayout
      title="多渠道效果对比与归因分析"
      description="深入分析各渠道的营销效果，精准归因转化路径，为营销策略优化提供数据支撑"
      breadcrumbs={[
        { label: '智能营销效果评估与数据分析', href: '#' },
        { label: '多渠道效果对比与归因分析', href: '/marketing-analytics/channel-comparison', current: true }
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 主要内容区域 (2/3 width) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* 筛选器 */}
          <FilterControls onFiltersChange={handleFiltersChange} />

          {/* 渠道效果对比图表和表格 */}
          <ComparisonChart />
        </div>

        {/* 右侧边栏区域 (1/3 width) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* 转化归因分析 */}
          <AttributionAnalysis />

          {/* 典型用户转化路径 */}
          <UserConversionPath />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default ChannelComparisonPage;