'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import React from 'react';
import IntegrationCenter from './_components/IntegrationCenter';
import PlatformOverview from './_components/PlatformOverview';
import StoreManagementTable from './_components/StoreManagementTable';

const PlatformManagementPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="多平台多店铺管理"
      description="统一管理多个电商平台的店铺数据，实现跨平台的高效运营和数据洞察"
      breadcrumbs={[
        { label: '智能电商运营与转化', href: '/ecommerce' },
        { label: '多平台多店铺管理', href: '/ecommerce/platform-management', current: true }
      ]}
    >
      <div className="space-y-6">
        {/* 平台总览区域 */}
        <PlatformOverview />

        {/* 店铺详情管理 */}
        <StoreManagementTable />

        {/* 授权与集成区 */}
        <IntegrationCenter />
      </div>
    </ToolPageLayout>
  );
};

export default PlatformManagementPage;