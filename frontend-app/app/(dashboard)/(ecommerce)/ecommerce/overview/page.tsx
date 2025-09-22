'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { useCallback } from 'react';
import AISuggestionsCard from './_components/AISuggestionsCard';
import AlertsTasksCard from './_components/AlertsTasksCard';
import AttributionChart from './_components/AttributionChart';
import LeaderboardCard from './_components/LeaderboardCard';
import MetricsCards from './_components/MetricsCards';
import TimeFilter from './_components/TimeFilter';
import TrendChart from './_components/TrendChart';

const EcommerceOverviewPage: React.FC = () => {
  const handleTimeRangeChange = useCallback((range: 'day' | 'week' | 'month' | 'quarter') => {
    console.log('时间范围改变:', range);
    // 这里可以添加时间范围改变的处理逻辑
    // 例如：更新数据源、发起API请求等
  }, []);

  return (
    <ToolPageLayout
      title="电商运营总览"
      description="智能电商运营与转化数据概览，掌握全局运营状况"
      breadcrumbs={[
        { label: '智能电商运营与转化', href: '#' },
        { label: '电商运营总览', href: '/ecommerce/overview', current: true },
      ]}
    >
      <div className="space-y-6">
        {/* 时间过滤器 */}
        <TimeFilter onTimeRangeChange={handleTimeRangeChange} />

        {/* 核心数据指标 */}
        <MetricsCards />

        {/* 趋势图表和绩效榜单 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TrendChart />
          <LeaderboardCard />
        </div>

        {/* 任务预警和AI建议 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsTasksCard />
          <AISuggestionsCard />
        </div>

        {/* 营销效果归因 */}
        <AttributionChart />
      </div>
    </ToolPageLayout>
  );
};

export default EcommerceOverviewPage;