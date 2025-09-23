'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import TrendPredictionCards from './_components/TrendPredictionCards';
import AISuggestionList from './_components/AISuggestionCard';
import StrategySimulator from './_components/StrategySimulator';
import OptimizationTable from './_components/OptimizationTable';

const StrategyOptimizationPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="营销策略优化与预测"
      description="基于AI算法预测营销趋势，提供智能优化建议，助力制定高效营销策略"
      breadcrumbs={[
        { label: '智能营销效果评估与数据分析', href: '#' },
        { label: '营销策略优化与预测', href: '/marketing-analytics/strategy-optimization', current: true }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* 左侧主内容区域 (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          {/* 营销趋势预测 */}
          <TrendPredictionCards />

          {/* AI营销优化建议 */}
          <AISuggestionList />
        </div>

        {/* 右侧边栏 (1/3 width) */}
        <div className="lg:col-span-1">
          <StrategySimulator />
        </div>
      </div>

      {/* 底部全宽表格 */}
      <div className="mt-6 lg:mt-8">
        <OptimizationTable />
      </div>
    </ToolPageLayout>
  );
};

export default StrategyOptimizationPage;