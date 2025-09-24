'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import CreateTaskTabs from './_components/CreateTaskTabs';

export type TaskType = 'activity' | 'product';

const CreateTaskPage: React.FC = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<TaskType>('activity');

  const handleGoBack = () => {
    router.push('/ecommerce/product-activity/overview');
  };

  const handleSaveDraft = () => {
    // TODO: 实现保存草稿功能
    console.log('保存草稿');
  };

  const handleSaveAndContinue = () => {
    // TODO: 实现保存并继续配置功能
    console.log('保存并继续配置');
  };

  return (
    <ToolPageLayout
      title="新建发布任务"
      description="统一配置商品或活动信息，实现跨平台智能发布"
      breadcrumbs={[
        { label: '智能电商运营与转化', href: '#' },
        { label: '商品与活动聚合发布', href: '/ecommerce/product-activity/overview' },
        { label: '新建发布任务', href: '/ecommerce/product-activity/create', current: true }
      ]}
    >
      <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm">
        {/* 页面头部 */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] mb-2 p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回任务列表
            </Button>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">新建发布任务</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-semibold"
            >
              保存草稿
            </Button>
            <Button
              onClick={handleSaveAndContinue}
              className="px-4 py-2 text-sm font-semibold"
            >
              保存并继续配置
            </Button>
          </div>
        </div>

        {/* Tab切换和内容区域 */}
        <CreateTaskTabs
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>
    </ToolPageLayout>
  );
};

export default CreateTaskPage;