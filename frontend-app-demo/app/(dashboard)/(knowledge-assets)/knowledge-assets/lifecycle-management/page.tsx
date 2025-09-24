'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import React, { useState } from 'react';

// 导入自定义组件
import AIInsightPanel from './_components/AIInsightPanel';
import DashboardStats from './_components/DashboardStats';
import KnowledgeDetail from './_components/KnowledgeDetail';
import KnowledgeList from './_components/KnowledgeList';
import KnowledgeStorageChart from './_components/KnowledgeStorageChart';

import type { KnowledgeDetail as KnowledgeDetailType, KnowledgeItem } from './_components/types';

const KnowledgeLifecycleManagementPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  // 处理知识条目选择
  const handleItemSelect = (item: KnowledgeItem) => {
    setSelectedItem(item);
  };

  // 将 KnowledgeItem 转换为 KnowledgeDetail 格式
  const getKnowledgeDetail = (item: KnowledgeItem | null): KnowledgeDetailType | null => {
    if (!item) return null;

    return {
      id: item.id,
      title: item.title,
      version: item.version,
      status: item.status.label,
      content: '',
      tags: [
        { id: '1', label: '目标客户', removable: true },
        { id: '2', label: '产品卖点', removable: true },
        { id: '3', label: '营销活动', removable: true },
        { id: '4', label: '竞品对比', removable: true }
      ]
    };
  };

  return (
    <ToolPageLayout
      title="知识生命周期管理与质量保障"
      description="通过AI深度挖掘知识资产价值，实现智能质量监控与生命周期优化"
      breadcrumbs={[
        { label: '智能知识库', href: '#' },
        { label: '知识生命周期管理与质量保障', href: '/knowledge-assets/lifecycle-management', current: true }
      ]}
    >
      <div className="space-y-6 h-full flex flex-col">
        {/* Region I: Dashboard 统计区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* 基础统计卡片 */}
          <DashboardStats className="xl:col-span-4" />

          {/* 知识储备度图表 */}
          <KnowledgeStorageChart className="lg:col-span-1 xl:col-span-2" />

          {/* AI质量洞察面板 */}
          <AIInsightPanel className="lg:col-span-1 xl:col-span-2" />
        </div>

        {/* Main Content Layout: 知识管理区域 */}
        <div className="flex-grow flex gap-6 overflow-hidden">
          {/* Region II: 知识分类与管理 */}
          <KnowledgeList
            selectedId={selectedItem?.id}
            onItemSelect={handleItemSelect}
            className="w-1/3 max-w-sm flex-shrink-0"
          />

          {/* Region III: 知识详情面板 */}
          <KnowledgeDetail
            selectedItem={getKnowledgeDetail(selectedItem)}
            className="flex-grow"
          />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default KnowledgeLifecycleManagementPage;