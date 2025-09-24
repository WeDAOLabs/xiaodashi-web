'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Users } from 'lucide-react';
import React, { useState } from 'react';
import AICommercializationAssessment from './components/AICommercializationAssessment';
import CurrentIPCard from './components/CurrentIPCard';
import IPAnalysisCharts from './components/IPAnalysisCharts';
import IPLicensingTable from './components/IPLicensingTable';
import IPSelectionSheet from './components/IPSelectionSheet';
import OverviewStats from './components/OverviewStats';
import { AnalysisData, IPAsset, OverviewStats as OverviewStatsType, PageState } from './types';

// 模拟IP资产数据
const mockIPAssets: IPAsset[] = [
  {
    id: '1',
    name: '萌宠阿柴',
    category: '动漫形象',
    avatar: '/images/ip/achai.jpg',
    rating: 88,
    status: 'incubating',
    description: '可爱的柴犬IP形象，深受年轻用户喜爱'
  },
  {
    id: '2',
    name: '机甲纪元',
    category: '游戏角色',
    avatar: '/images/ip/mecha.jpg',
    rating: 92,
    status: 'authorized',
    description: '科幻机甲角色IP，具有强烈的视觉冲击力'
  },
  {
    id: '3',
    name: '食神小当家',
    category: '动漫形象',
    avatar: '/images/ip/food.jpg',
    rating: 85,
    status: 'pending',
    description: '美食主题动漫IP，适合餐饮行业合作'
  }
];

// 模拟统计数据
const mockStats: OverviewStatsType = {
  totalAssets: 128,
  incubatingProjects: 16,
  authorizedIPs: 42,
  aiInsight: '"国风潮流"IP在Z世代市场仍有巨大潜力，建议结合数字藏品模式进行孵化。'
};

// 模拟分析数据
const mockAnalysisData: AnalysisData = {
  radarData: [
    { dimension: '影响力', value: 90 },
    { dimension: '粉丝量', value: 84 },
    { dimension: '内容丰富度', value: 74 },
    { dimension: '商业价值', value: 69 },
    { dimension: '美誉度', value: 81 }
  ],
  fanDemographics: [
    { ageGroup: '18-24岁', percentage: 45 },
    { ageGroup: '25-30岁', percentage: 30 },
    { ageGroup: '31-35岁', percentage: 15 },
    { ageGroup: '其他', percentage: 10 }
  ],
  commercializationPotentials: [
    { category: '潮玩周边授权', level: 'high', description: '潮玩周边授权具有高商业化潜力' },
    { category: '游戏联名合作', level: 'medium', description: '游戏联名合作具有中等潜力' }
  ],
  recommendedPaths: [
    { step: 1, title: '内容共创+商品授权', description: '如联名款服装、文具' },
    { step: 2, title: '数字藏品发行+线上活动运营', description: '结合元宇宙概念提升IP价值' }
  ],
  licensingProjects: [
    { projectName: '潮流T恤联名', duration: '2023-2024', revenue: '¥500,000' }
  ],
  riskWarning: '该IP在部分区域存在竞品类IP，授权需谨慎。'
};

const IPEvaluationPage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>({
    selectedIP: mockIPAssets[0], // 默认选中第一个IP
    isSelectionSheetOpen: false,
    searchKeyword: '',
    stats: mockStats,
    analysisData: mockAnalysisData,
    loading: false
  });

  const handleOpenIPSelection = () => {
    setPageState(prev => ({ ...prev, isSelectionSheetOpen: true }));
  };

  const handleCloseIPSelection = () => {
    setPageState(prev => ({ ...prev, isSelectionSheetOpen: false }));
  };

  const handleSelectIP = (ip: IPAsset) => {
    setPageState(prev => ({
      ...prev,
      selectedIP: ip,
      analysisData: mockAnalysisData // 在实际项目中应该基于选中的IP获取对应的分析数据
    }));
  };

  const handleSearchChange = (keyword: string) => {
    setPageState(prev => ({ ...prev, searchKeyword: keyword }));
  };

  return (
    <ToolPageLayout
      title="IP资产智能评估与商业化孵化"
      description="通过AI深度挖掘IP资产价值，驱动商业化决策"
      breadcrumbs={[
        { label: '智能品牌与IP资产管理', href: '#' },
        { label: 'IP资产智能评估与商业化孵化', href: '/brand-management-ip-evaluation', current: true }
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleOpenIPSelection} className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            选择IP资产
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新增IP资产
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI生成商业化策略初稿
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 当前选中IP展示卡片 */}
        <CurrentIPCard
          ipAsset={pageState.selectedIP}
          onEdit={() => console.log('编辑IP信息')}
          onGeneratePlan={() => console.log('生成IP商业计划书')}
          onInitiateLicensing={() => console.log('发起IP授权谈判')}
          onLegalSupport={() => console.log('请求法律支持')}
          onContentCreation={() => console.log('联动内容创作')}
          onMoreActions={() => console.log('更多操作')}
        />

        {/* 统计概览区 */}
        <OverviewStats stats={pageState.stats} />

        {/* IP分析内容区 */}
        {pageState.analysisData && (
          <div className="space-y-6">
            {/* IP评分分析和粉丝画像 */}
            <IPAnalysisCharts analysisData={pageState.analysisData} />

            {/* AI商业化评估和推荐路径 */}
            <AICommercializationAssessment analysisData={pageState.analysisData} />

            {/* IP授权管理表格 */}
            <IPLicensingTable analysisData={pageState.analysisData} />
          </div>
        )}

        {/* IP选择抽屉 */}
        <IPSelectionSheet
          isOpen={pageState.isSelectionSheetOpen}
          onClose={handleCloseIPSelection}
          ipAssets={mockIPAssets}
          selectedIP={pageState.selectedIP}
          onSelectIP={handleSelectIP}
          searchKeyword={pageState.searchKeyword}
          onSearchChange={handleSearchChange}
        />
      </div>
    </ToolPageLayout>
  );
};

export default IPEvaluationPage;