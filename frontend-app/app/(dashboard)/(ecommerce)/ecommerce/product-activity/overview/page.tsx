'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import StatusFilter, { TaskStatus } from './_components/StatusFilter';
import TaskTable from './_components/TaskTable';

const ProductActivityOverviewPage: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<TaskStatus>('all');

  const handleFilterChange = (status: TaskStatus) => {
    setCurrentFilter(status);
  };

  const handleCreateTask = () => {
    // TODO: 导航到创建任务页面
    console.log('导航到创建任务页面');
    // 未来实现: router.push('/ecommerce/product-activity/create');
  };

  return (
    <ToolPageLayout
      title="商品与活动聚合发布"
      description="统一管理商品和活动发布任务，实现跨平台快速发布和状态监控"
      breadcrumbs={[
        { label: '增长与运营执行', href: '#' },
        { label: '智能电商运营与转化', href: '#' },
        { label: '商品与活动聚合发布', href: '/ecommerce/product-activity/overview', current: true }
      ]}
    >
      <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm">
        {/* 状态过滤和新建按钮 */}
        <div className="flex justify-between items-center mb-6">
          <StatusFilter onFilterChange={handleFilterChange} />
          <Button
            onClick={handleCreateTask}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新建发布任务
          </Button>
        </div>

        {/* 任务列表表格 */}
        <TaskTable filter={currentFilter} />
      </div>
    </ToolPageLayout>
  );
};

export default ProductActivityOverviewPage;