'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  DollarSign,
  Folder,
  Lightbulb,
  Plus,
  Search,
  Users
} from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';

// Tab组件导入（稍后实现）
import AudienceTargetingTab from './_components/AudienceTargetingTab';
import BudgetStrategyTab from './_components/BudgetStrategyTab';
import CampaignManagementTab from './_components/CampaignManagementTab';
import CreativeCenterTab from './_components/CreativeCenterTab';
import DashboardTab from './_components/DashboardTab';

// 平台配置映射
const PLATFORM_CONFIG = {
  douyin: {
    name: '抖音广告投放',
    description: '抖音广告平台投放管理与数据分析'
  },
  wechat: {
    name: '微信广告投放',
    description: '微信广告平台投放管理与数据分析'
  },
  baidu: {
    name: '百度信息流投放',
    description: '百度信息流广告投放管理与数据分析'
  },
  xiaohongshu: {
    name: '小红书投放',
    description: '小红书广告投放管理与数据分析'
  }
} as const;

// Tab配置
const TAB_CONFIG = [
  {
    id: 'dashboard',
    label: '数据Dashboard',
    icon: BarChart,
    component: DashboardTab
  },
  {
    id: 'campaigns',
    label: '投放计划管理',
    icon: Folder,
    component: CampaignManagementTab
  },
  {
    id: 'creatives',
    label: '创意素材中心',
    icon: Lightbulb,
    component: CreativeCenterTab
  },
  {
    id: 'audience',
    label: '受众定向与优化',
    icon: Users,
    component: AudienceTargetingTab
  },
  {
    id: 'budget',
    label: '预算与出价策略',
    icon: DollarSign,
    component: BudgetStrategyTab
  }
];

type PlatformKey = keyof typeof PLATFORM_CONFIG;

const PublicTrafficPlatformPage: React.FC = () => {
  const params = useParams();
  const platform = params.platform as PlatformKey;
  const [activeTab, setActiveTab] = useState('dashboard');

  // 获取平台配置
  const platformConfig = PLATFORM_CONFIG[platform];

  if (!platformConfig) {
    return (
      <ToolPageLayout
        title="未知平台"
        description="平台参数无效"
        breadcrumbs={[
          { label: '增长与运营执行', href: '#' },
          { label: '智能公域流量投放与优化', href: '#' },
          { label: '投放平台数据概览', href: '/public-traffic/overview' },
          { label: '未知平台', href: '#', current: true }
        ]}
      >
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">无效的平台参数</p>
        </div>
      </ToolPageLayout>
    );
  }

  // 获取当前Tab组件
  const currentTabConfig = TAB_CONFIG.find(tab => tab.id === activeTab);
  const TabComponent = currentTabConfig?.component;

  return (
    <ToolPageLayout
      title={platformConfig.name}
      description={platformConfig.description}
      breadcrumbs={[
        { label: '增长与运营执行', href: '#' },
        { label: '智能公域流量投放与优化', href: '#' },
        { label: '投放平台数据概览', href: '/public-traffic/overview' },
        { label: platformConfig.name, href: '#', current: true }
      ]}
    >
      {/* 页面头部操作区域 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center text-sm text-[var(--text-secondary)] mt-1">
            <span>项目: 默认项目</span>
            <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="搜索计划、广告组..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-focus-ring)]"
            />
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/public-traffic/campaign/create">
              <Plus className="w-4 h-4" />
              新建投放计划
            </Link>
          </Button>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="border-b border-[var(--border-primary)] mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  isActive
                    ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab内容区域 */}
      <div className="tab-content">
        {TabComponent && <TabComponent platform={platform} />}
      </div>
    </ToolPageLayout>
  );
};

export default PublicTrafficPlatformPage;