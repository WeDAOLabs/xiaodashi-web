'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContextSwitcher from './_components/ContextSwitcher';
import SettingsTabs from './_components/SettingsTabs';

const SettingsPage: React.FC = () => {
  return (
    <DashboardLayout
      title="设置"
      breadcrumbs={[
        { label: '设置', href: '/settings', current: true }
      ]}
    >
      <section className="px-4 mb-8">
        <p className="text-[var(--text-secondary)] mb-6">管理您的账户信息、工作区和集成。</p>
        <div className="space-y-8">
          {/* 上下文切换器 */}
          <ContextSwitcher />

          {/* 设置标签页 */}
          <SettingsTabs />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default SettingsPage;