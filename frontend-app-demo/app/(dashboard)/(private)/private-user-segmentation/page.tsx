'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { BreadcrumbItem } from '@/components/layout/types';
import TopStatsCards from '@/app/(dashboard)/(user-segmentation)/_components/user-segmentation/TopStatsCards';
import RepurchaseUserTable from '@/app/(dashboard)/(user-segmentation)/_components/user-segmentation/RepurchaseUserTable';
import UserLifecycleChart from '@/app/(dashboard)/(user-segmentation)/_components/user-segmentation/UserLifecycleChart';
import GMVRankingCard from '@/app/(dashboard)/(user-segmentation)/_components/user-segmentation/GMVRankingCard';
import AITagManagement from '@/app/(dashboard)/(user-segmentation)/_components/user-segmentation/AITagManagement';
import UserProfileFilter from '@/app/(dashboard)/(user-segmentation)/_components/user-segmentation/UserProfileFilter';

const UserSegmentationPage: React.FC = () => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '增长与运营执行', href: '#' },
    { label: '智能私域增长与运营', href: '#' },
    { label: '用户分层与自动化标签中心', href: '/private-user-segmentation', current: true }
  ];

  return (
    <ToolPageLayout
      title="用户分层与自动化标签中心"
      description="AI驱动的用户标签管理与价值分析平台, 赋能精细化私域运营"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* 顶部统计卡片 */}
        <TopStatsCards />

        {/* 中间部分：复购用户表格 + 用户生命周期图 */}
        <div className="flex flex-col lg:flex-row gap-6">
          <RepurchaseUserTable />
          <UserLifecycleChart />
        </div>

        {/* GMV贡献排行榜 */}
        <GMVRankingCard />

        {/* AI自动化标签管理 */}
        <AITagManagement />

        {/* 用户画像筛选器 */}
        <UserProfileFilter />
      </div>
    </ToolPageLayout>
  );
};

export default UserSegmentationPage;