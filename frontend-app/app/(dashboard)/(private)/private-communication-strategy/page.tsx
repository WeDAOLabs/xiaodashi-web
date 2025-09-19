'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { BreadcrumbItem } from '@/components/layout/types';
import AdoptionRateCard from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/AdoptionRateCard';
import TopConversionCard from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/TopConversionCard';
import ActivationFunnelCard from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ActivationFunnelCard';
import AIScriptGenerator from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/AIScriptGenerator';
import ABTestConfig from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ABTestConfig';
import ABTestMonitor from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ABTestMonitor';
import ActivationFunnelTable from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ActivationFunnelTable';
import ScriptLibraryStats from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ScriptLibraryStats';
import ScriptCategories from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ScriptCategories';
import ScriptLibraryList from '@/app/(dashboard)/(communication-strategy)/_components/communication-strategy/ScriptLibraryList';

const CommunicationStrategyPage: React.FC = () => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '增长与运营执行', href: '#' },
    { label: '智能私域增长与运营', href: '#' },
    { label: '智能沟通话术与策略中心', href: '/private-communication-strategy', current: true }
  ];

  return (
    <ToolPageLayout
      title="智能沟通话术与策略中心"
      description="AI驱动的个性化沟通助手, 提升私域对话转化效率"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* 顶部指标卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <AdoptionRateCard />
          </div>
          <div className="lg:col-span-2">
            <TopConversionCard />
          </div>
          <div className="lg:col-span-1">
            <ActivationFunnelCard />
          </div>
        </div>

        {/* AI个性化话术生成与A/B测试 */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">AI个性化话术生成与A/B测试</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 mt-4">
            <div>
              <AIScriptGenerator />
            </div>
            <div className="mt-6 lg:mt-0">
              <ABTestConfig />
              <ABTestMonitor />
            </div>
          </div>
        </div>

        {/* 老用户激活漏斗管理 */}
        <ActivationFunnelTable />

        {/* 智能话术库与学习中心 */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">智能话术库与学习中心</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2">
              <ScriptLibraryStats />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold text-[var(--text-primary)]">AI学习与优化</h3>
                <div className="mt-3 space-y-2">
                  <div className="bg-[var(--bg-secondary)] p-3 rounded-md">
                    <p className="font-medium text-[var(--text-primary)]">话术库更新</p>
                    <p className="text-xs text-[var(--text-secondary)]">本周新增12条高转化话术模板</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] p-3 rounded-md">
                    <p className="font-medium text-[var(--text-primary)]">AI模型优化</p>
                    <p className="text-xs text-[var(--text-secondary)]">基于最新对话数据完成模型迭代</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] p-3 rounded-md">
                    <p className="font-medium text-[var(--text-primary)]">最佳实践</p>
                    <p className="text-xs text-[var(--text-secondary)]">查看最新话术使用指南与案例</p>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--border-primary)] transition-colors">
                  上传成功对话数据
                </button>
              </div>
            </div>
          </div>

          {/* 话术库主体内容 */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ScriptCategories />
            </div>
            <div className="lg:col-span-3">
              <ScriptLibraryList />
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default CommunicationStrategyPage;