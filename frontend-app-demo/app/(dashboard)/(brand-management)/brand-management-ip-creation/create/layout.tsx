'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { IPCreationProvider } from './_components/IPCreationContext';
import StepNavigation from './_components/StepNavigation';
import BottomActionBar from './_components/BottomActionBar';

interface CreateIPLayoutProps {
  children: React.ReactNode;
}

export default function CreateIPLayout({ children }: CreateIPLayoutProps) {
  return (
    <IPCreationProvider>
      <ToolPageLayout
        title="IP单体打造"
        description="通过AI驱动的IP项目管理，从概念设计到商业化孵化的全流程智能支持"
        breadcrumbs={[
          { label: '智能品牌与IP资产管理', href: '#' },
          { label: 'IP打造与定位', href: '/brand-management-ip-creation' },
          { label: '我的新IP', href: '/brand-management-ip-creation/create', current: true }
        ]}
      >
        <main className="flex flex-col lg:flex-row gap-8">
          {/* 左侧步骤导航 */}
          <aside className="lg:w-1/4">
            <StepNavigation />
          </aside>

          {/* 右侧内容区域 */}
          <div className="flex-1">
            <div className="bg-[var(--bg-primary)] p-8 rounded-[var(--radius)] shadow-sm">
              {children}
            </div>
          </div>
        </main>

        {/* 底部操作栏 */}
        <BottomActionBar />
      </ToolPageLayout>
    </IPCreationProvider>
  );
}