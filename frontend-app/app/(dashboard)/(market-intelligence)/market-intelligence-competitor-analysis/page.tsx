'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, FileText, Plus } from 'lucide-react';
import React, { useState } from 'react';

// 导入所有子组件
import ComparisonWorkbench from '@/components/competitor-analysis/ComparisonWorkbench';
import CompetitorRadarChart from '@/components/competitor-analysis/CompetitorRadarChart';
import CompetitorSelector from '@/components/competitor-analysis/CompetitorSelector';
import PricingStrategyChart from '@/components/competitor-analysis/PricingStrategyChart';
import ProductComparisonTable from '@/components/competitor-analysis/ProductComparisonTable';
import UserSentimentComparison from '@/components/competitor-analysis/UserSentimentComparison';

// 静态数据定义
const initialCompetitors = [
  {
    id: 'comp-a',
    name: '竞品A',
    avatar: '/images/competitors/competitor-a.jpg',
    marketShare: '25%',
    trend: '1.2%',
    isPositive: true,
    isSelected: true,
  },
  {
    id: 'comp-b',
    name: '竞品B',
    avatar: '/images/competitors/competitor-b.jpg',
    marketShare: '18%',
    trend: '0.5%',
    isPositive: false,
    isSelected: true,
  },
  {
    id: 'comp-c',
    name: '竞品C',
    avatar: '/images/competitors/competitor-c.jpg',
    marketShare: '15%',
    trend: '0.8%',
    isPositive: true,
    isSelected: false,
  },
  {
    id: 'comp-d',
    name: '竞品D',
    avatar: '/images/competitors/competitor-d.jpg',
    marketShare: '12%',
    trend: '0.1%',
    isPositive: false,
    isSelected: false,
  },
];

const initialDimensions = [
  { id: 'product', label: '产品功能', isSelected: true },
  { id: 'pricing', label: '定价策略', isSelected: true },
  { id: 'marketing', label: '营销活动', isSelected: false },
  { id: 'social', label: '社交媒体', isSelected: false },
  { id: 'sentiment', label: '用户评价', isSelected: true },
  { id: 'sales', label: '销售数据', isSelected: false },
];

const radarData = [
  { category: '产品', our: 85, competitorA: 90, competitorB: 75 },
  { category: '价格', our: 70, competitorA: 65, competitorB: 80 },
  { category: '营销', our: 80, competitorA: 75, competitorB: 60 },
  { category: '口碑', our: 75, competitorA: 85, competitorB: 70 },
  { category: '渠道', our: 90, competitorA: 80, competitorB: 85 },
];

const productFeatures = [
  {
    feature: '核心功能 A',
    our: { status: 'available' as const, description: '✅ 性能稳定' },
    competitorA: { status: 'available' as const, description: '✅ 体验略差' },
    competitorB: { status: 'unavailable' as const, description: '❌ 未实现' },
  },
  {
    feature: '核心功能 B',
    our: { status: 'available' as const, description: '✅ 基础版本' },
    competitorA: { status: 'available' as const, description: '✅ 高级版本' },
    competitorB: { status: 'available' as const, description: '✅ 基础版本' },
  },
  {
    feature: '增值服务 X',
    our: { status: 'developing' as const, description: '❌ 开发中' },
    competitorA: { status: 'available' as const, description: '✅ 已上线' },
    competitorB: { status: 'unavailable' as const, description: '❌ 无计划' },
  },
  {
    feature: '增值服务 Y',
    our: { status: 'available' as const, description: '✅ 体验流畅' },
    competitorA: { status: 'available' as const, description: '✅ 偶尔卡顿' },
    competitorB: { status: 'available' as const, description: '✅ 功能不全' },
  },
];

const pricingData = [
  { month: 'Jan', our: 100, competitorA: 105, competitorB: 88 },
  { month: 'Feb', our: 100, competitorA: 105, competitorB: 92 },
  { month: 'Mar', our: 95, competitorA: 98, competitorB: 85 },
  { month: 'Apr', our: 95, competitorA: 98, competitorB: 85 },
  { month: 'May', our: 105, competitorA: 110, competitorB: 95 },
  { month: 'Jun', our: 105, competitorA: 110, competitorB: 95 },
];

const sentimentData = [
  {
    name: '竞品A',
    data: [
      { sentiment: '正面', value: 65, fill: '#16a34a' },
      { sentiment: '负面', value: 15, fill: '#dc2626' },
      { sentiment: '中性', value: 20, fill: '#6b7280' },
    ],
    keywords: ['性价比', '好用', '推荐', '售后', '有点贵'],
  },
  {
    name: '竞品B',
    data: [
      { sentiment: '正面', value: 55, fill: '#16a34a' },
      { sentiment: '负面', value: 25, fill: '#dc2626' },
      { sentiment: '中性', value: 20, fill: '#6b7280' },
    ],
    keywords: ['便宜', '入门级', 'bug多', '客服', '不推荐'],
  },
];

const CompetitorAnalysisPage: React.FC = () => {
  const [competitors, setCompetitors] = useState(initialCompetitors);
  const [dimensions, setDimensions] = useState(initialDimensions);

  const handleCompetitorSelection = (competitorId: string, selected: boolean) => {
    setCompetitors(prev =>
      prev.map(comp =>
        comp.id === competitorId ? { ...comp, isSelected: selected } : comp
      )
    );
  };

  const handleDimensionChange = (dimensionId: string, selected: boolean) => {
    setDimensions(prev =>
      prev.map(dim =>
        dim.id === dimensionId ? { ...dim, isSelected: selected } : dim
      )
    );
  };

  const monitoringCount = competitors.length;
  const todayUpdates = 12;

  return (
    <ToolPageLayout
      title="竞品深度分析"
      description="通过AI深度挖掘竞品数据，驱动产品优化与营销策略制定"
      breadcrumbs={[
        { label: '智能市场洞察与竞品分析', href: '#' },
        { label: '竞品深度分析', href: '/market-intelligence-competitor-analysis', current: true }
      ]}
    >
      <div className="space-y-6">
        {/* 概览卡片 */}
        <div>
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center space-x-2">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新增竞品
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                定制化竞品报告
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <p className="text-sm text-[var(--text-secondary)]">正在监测竞品</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {monitoringCount}
                  <span className="text-lg font-medium ml-1">家</span>
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <p className="text-sm text-[var(--text-secondary)]">今日新增动态</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {todayUpdates}
                  <span className="text-lg font-medium ml-1">条</span>
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[var(--color-warning-50)] border-[var(--color-warning-100)] rounded-lg shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-warning-600)]">AI预警</p>
                    <p className="text-sm text-[var(--text-primary)] mt-1">
                      &ldquo;竞品A今日发布新品，或将挑战我司市场份额&rdquo;
                    </p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-[var(--color-warning-600)] flex-shrink-0" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-transparent text-[var(--color-warning-600)] hover:bg-[var(--color-warning-600)]/10 px-3 py-1.5 text-xs mt-2 -ml-2"
                >
                  查看全部预警 →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧竞品选择器 */}
          <div className="lg:col-span-3">
            <CompetitorSelector
              competitors={competitors}
              onSelectionChange={handleCompetitorSelection}
            />
          </div>

          {/* 右侧对比工作台 */}
          <div className="lg:col-span-9">
            <ComparisonWorkbench
              dimensions={dimensions}
              onDimensionChange={handleDimensionChange}
            >
              {/* 雷达图 */}
              <CompetitorRadarChart data={radarData} />

              {/* 产品功能对比表 */}
              <ProductComparisonTable features={productFeatures} />

              {/* 定价策略对比 */}
              <PricingStrategyChart data={pricingData} />

              {/* 用户评价对比 */}
              <UserSentimentComparison competitors={sentimentData} />
            </ComparisonWorkbench>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default CompetitorAnalysisPage;