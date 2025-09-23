'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

import StatCard from './_components/StatCard';
import KnowledgeLibraryTab from './_components/KnowledgeLibraryTab';

const KnowledgeAssetsOverviewPage: React.FC = () => {
  // 统计数据
  const statsData = [
    {
      title: '总知识空间',
      value: '100 GB',
      change: '+5%',
      isPositive: true,
      icon: 'database',
      hasAction: false
    },
    {
      title: '剩余空间',
      value: '75.4 GB',
      change: '-2%',
      isPositive: false,
      icon: 'database',
      hasAction: false
    },
    {
      title: '预计可导入文档',
      value: '250,000+',
      change: '',
      isPositive: true,
      icon: 'file-text',
      hasAction: false
    },
    {
      title: '总知识条目',
      value: '1,230,489',
      change: '+10k',
      isPositive: true,
      icon: 'book',
      hasAction: false
    },
    {
      title: '待处理导入任务',
      value: '5',
      change: '',
      isPositive: true,
      icon: 'alert-triangle',
      hasAction: true,
      actionText: '查看所有导入历史'
    },
    {
      title: 'AI识别知识冲突',
      value: '12',
      change: '',
      isPositive: true,
      icon: 'cpu',
      hasAction: true,
      actionText: '一键处理AI建议'
    },
    {
      title: 'AI反哺洞察',
      value: '3条高价值建议',
      change: '',
      isPositive: true,
      icon: 'zap',
      hasAction: true,
      actionText: '处理反哺建议'
    },
    {
      title: 'AI推荐优化',
      value: '7个可优化项',
      change: '',
      isPositive: true,
      icon: 'sparkles',
      hasAction: true,
      actionText: '立即优化'
    }
  ];

  return (
    <ToolPageLayout
      title="全部知识资产"
      description="通过AI智能整合与结构化管理，构建企业知识资产体系"
      breadcrumbs={[
        { label: '赋能与效率提升', href: '#' },
        { label: '智能知识库', href: '#' },
        { label: '全部知识资产', href: '/knowledge-assets/overview', current: true }
      ]}
    >
      <div className="space-y-6 lg:space-y-8">
        {/* 顶部操作栏 */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">知识资产整合与结构化</h1>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建导入任务
          </Button>
        </div>

        {/* 统计概览区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* 主内容区域 */}
        <Card className="p-2 shadow-sm">
          <Tabs defaultValue="knowledge-library" className="w-full">
            <div className="flex items-center gap-2 border-b border-[var(--border-secondary)] px-4">
              <TabsList className="bg-transparent border-none p-0 h-auto">
                <TabsTrigger
                  value="knowledge-library"
                  className="px-3 py-3 text-sm font-semibold transition-colors data-[state=active]:text-[var(--color-primary-600)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:bg-transparent data-[state=inactive]:text-[var(--text-secondary)] data-[state=inactive]:hover:text-[var(--text-primary)] bg-transparent border-b-2 border-transparent"
                >
                  我的知识库
                </TabsTrigger>
                <TabsTrigger
                  value="data-source"
                  className="px-3 py-3 text-sm font-semibold transition-colors data-[state=active]:text-[var(--color-primary-600)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:bg-transparent data-[state=inactive]:text-[var(--text-secondary)] data-[state=inactive]:hover:text-[var(--text-primary)] bg-transparent border-b-2 border-transparent"
                >
                  数据源管理
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="knowledge-library" className="mt-0">
                <KnowledgeLibraryTab />
              </TabsContent>
              <TabsContent value="data-source" className="mt-0">
                <div className="text-center py-12">
                  <p className="text-[var(--text-secondary)]">数据源管理功能即将推出</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default KnowledgeAssetsOverviewPage;