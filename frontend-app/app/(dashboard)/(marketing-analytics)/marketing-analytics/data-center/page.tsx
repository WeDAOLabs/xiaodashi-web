'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import DataSourceManager from './_components/DataSourceManager';
import DataCleaningPanel from './_components/DataCleaningPanel';
import ReportCustomizer from './_components/ReportCustomizer';
import PermissionManager from './_components/PermissionManager';
import EventTrackerManager from './_components/EventTrackerManager';

const DataCenterPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="数据中心与配置"
      description="集中管理数据源、清洗规则、报告模板和权限配置，构建稳定可靠的数据基础"
      breadcrumbs={[
        { label: '智能营销效果评估与数据分析', href: '/marketing-analytics/overview' },
        { label: '数据中心与配置', href: '/marketing-analytics/data-center', current: true }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 数据源连接与管理 */}
        <div className="lg:col-span-4">
          <DataSourceManager />
        </div>

        {/* 数据清洗与转换 */}
        <div className="lg:col-span-1">
          <DataCleaningPanel />
        </div>

        {/* 报告自定义与生成 */}
        <div className="lg:col-span-2">
          <ReportCustomizer />
        </div>

        {/* 权限与用户管理 */}
        <div className="lg:col-span-1">
          <PermissionManager />
        </div>

        {/* 营销事件埋点管理 */}
        <div className="lg:col-span-4">
          <EventTrackerManager />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default DataCenterPage;