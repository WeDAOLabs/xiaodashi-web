'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import FilterControlBar from './_components/FilterControlBar';
import RoiRankingTable from './_components/RoiRankingTable';
import HistoryComparisonChart from './_components/HistoryComparisonChart';
import BenchmarkComparison from './_components/BenchmarkComparison';
import CompetitorComparison from './_components/CompetitorComparison';
import AchievementWall from './_components/AchievementWall';

interface FilterState {
  listType: 'activity' | 'channel' | 'content' | 'product';
  metric: 'roi' | 'gmv' | 'conversion' | 'interaction';
  period: 'week' | 'month' | 'quarter';
}

const RankingBenchmarkPage: React.FC = () => {
  const [filters, setFilters] = React.useState<FilterState>({
    listType: 'activity',
    metric: 'roi',
    period: 'month'
  });

  const handleFilterChange = React.useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <ToolPageLayout
      title="榜单排行与基准对比"
      description="通过数据对比发现优势与差距，激励团队持续提升营销效果"
      breadcrumbs={[
        { label: '智能营销效果评估与数据分析', href: '/marketing-analytics/overview' },
        { label: '榜单排行与基准对比', href: '/marketing-analytics/ranking-benchmark', current: true }
      ]}
    >
      <div className="space-y-6">
        {/* 筛选控制栏 */}
        <FilterControlBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* 上层卡片组 - 确保高度对齐 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 内部营销活动 ROI 榜 */}
          <div className="xl:col-span-2 flex">
            <div className="w-full">
              <RoiRankingTable filters={filters} />
            </div>
          </div>

          {/* 行业基准对比 */}
          <div className="xl:col-span-1 flex">
            <div className="w-full">
              <BenchmarkComparison filters={filters} />
            </div>
          </div>
        </div>

        {/* 下层卡片组 - 确保高度对齐 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 关键指标历史对比 */}
          <div className="xl:col-span-2 flex">
            <div className="w-full">
              <HistoryComparisonChart filters={filters} />
            </div>
          </div>

          {/* 竞品效果对比 */}
          <div className="xl:col-span-1 flex">
            <div className="w-full">
              <CompetitorComparison filters={filters} />
            </div>
          </div>
        </div>

        {/* 成就墙 */}
        <AchievementWall />
      </div>
    </ToolPageLayout>
  );
};

export default RankingBenchmarkPage;