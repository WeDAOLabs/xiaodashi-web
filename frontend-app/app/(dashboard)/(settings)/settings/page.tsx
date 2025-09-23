'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import ContextSwitcher from './_components/ContextSwitcher';
import SettingsTabs from './_components/SettingsTabs';

const SettingsPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="设置"
      description="管理您的账户信息、工作区和集成。"
      breadcrumbs={[
        { label: '设置', href: '/settings', current: true }
      ]}
    >
      <div className="space-y-8">
        {/* 上下文切换器 */}
        <ContextSwitcher />

        {/* 设置标签页 */}
        <SettingsTabs />
      </div>
    </ToolPageLayout>
  );
};

export default SettingsPage;