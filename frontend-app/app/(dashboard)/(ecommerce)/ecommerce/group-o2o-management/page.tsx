'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import React from 'react';
import GroupProductManagement from './_components/GroupProductManagement';
import O2OConfiguration from './_components/O2OConfiguration';
import VerificationTracking from './_components/VerificationTracking';

const GroupO2OManagementPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="团购与O2O管理"
      description="统一管理团购产品、核销履约追踪和O2O联动配置，实现线上线下一体化运营"
      breadcrumbs={[
        { label: '智能电商运营与转化', href: '#' },
        { label: '团购与O2O管理', href: '/ecommerce/group-o2o-management', current: true }
      ]}
    >
      <div className="space-y-8">
        <GroupProductManagement />
        <VerificationTracking />
        <O2OConfiguration />
      </div>
    </ToolPageLayout>
  );
};

export default GroupO2OManagementPage;