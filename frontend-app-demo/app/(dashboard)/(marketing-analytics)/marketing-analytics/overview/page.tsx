'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import ActionButtons from './_components/ActionButtons';
import AIInsightsSection from './_components/AIInsightsSection';
import TrendAnalysisSection from './_components/TrendAnalysisSection';

// 静态数据
const metricsData = [
  {
    title: '总GMV',
    value: '¥5,800,000',
    change: '12%',
    isPositive: true
  },
  {
    title: '总营销投入',
    value: '¥1,500,000'
  },
  {
    title: 'ROI',
    value: '1:3.8',
    change: '0.2',
    isPositive: true
  },
  {
    title: '新增用户数',
    value: '8,500',
    change: '10%',
    isPositive: true,
    subtitle: '周环比'
  },
  {
    title: '整体转化率',
    value: '3.2%'
  },
  {
    title: '平均用户LTV',
    value: '¥350'
  }
];

const aiInsightsData = [
  {
    type: 'warning' as const,
    title: '异常预警',
    content: 'AI检测到"社群运营渠道"近3天活跃度下降20%，请关注。',
    actions: [
      {
        label: '跳转至多渠道效果对比',
        isPrimary: true,
        href: '#'
      },
      {
        label: '详细查看',
        isPrimary: false,
        onClick: () => console.log('详细查看')
      }
    ]
  },
  {
    type: 'info' as const,
    title: '高价值机会',
    content: 'AI识别出"夏季新品推广活动"在特定城市表现突出，建议增加预算。',
    actions: [
      {
        label: '跳转至营销策略优化',
        isPrimary: true,
        href: '#'
      },
      {
        label: '详细查看',
        isPrimary: false,
        onClick: () => console.log('详细查看')
      }
    ]
  },
  {
    type: 'suggestion' as const,
    title: 'AI行动建议',
    content: '某类商品广告点击率低于预期，建议通过「智能内容创作」优化广告文案。',
    actions: [
      {
        label: '优化广告文案',
        isPrimary: true,
        href: '#'
      },
      {
        label: '详细查看',
        isPrimary: false,
        onClick: () => console.log('详细查看')
      }
    ]
  }
];

const trendsData = [
  {
    title: '整体GMV趋势 (近6个月)',
    chartType: 'bar' as const,
    data: [
      { month: '1月', value: 3500000 },
      { month: '2月', value: 3800000 },
      { month: '3月', value: 4500000 },
      { month: '4月', value: 4800000 },
      { month: '5月', value: 5200000 },
      { month: '6月', value: 5800000 }
    ],
    primaryColor: 'var(--primary-color)',
    formatValue: (value: number) => `¥${(value / 1000000).toFixed(1)}M`,
    iconType: 'bar' as const
  },
  {
    title: 'ROI变化曲线 (周)',
    chartType: 'line' as const,
    data: [
      { month: 'W1', value: 3.2 },
      { month: 'W2', value: 3.4 },
      { month: 'W3', value: 3.1 },
      { month: 'W4', value: 3.6 },
      { month: 'W5', value: 3.7 },
      { month: 'W6', value: 3.8 }
    ],
    primaryColor: 'var(--color-chart-1)',
    formatValue: (value: number) => `1:${value}`,
    iconType: 'trend' as const
  },
  {
    title: '用户增长与流失趋势 (月)',
    chartType: 'mixed' as const,
    data: [
      { month: '1月', value: 6500, secondaryValue: 1200 },
      { month: '2月', value: 7200, secondaryValue: 1100 },
      { month: '3月', value: 6800, secondaryValue: 1300 },
      { month: '4月', value: 8200, secondaryValue: 900 },
      { month: '5月', value: 8500, secondaryValue: 800 },
      { month: '6月', value: 9200, secondaryValue: 700 }
    ],
    primaryColor: 'var(--color-chart-1)',
    secondaryColor: 'var(--color-chart-5)',
    formatValue: (value: number) => value.toLocaleString(),
    iconType: 'users' as const
  }
];

const metricsActionButtons = [
  {
    label: '查看完整报告',
    variant: 'outline' as const
  },
  {
    label: '设置营销目标',
    variant: 'default' as const
  }
];

const trendsActionButtons = [
  {
    label: '自定义数据周期',
    variant: 'outline' as const
  },
  {
    label: '导出图表数据',
    variant: 'outline' as const
  }
];

const highPerformanceActivities = [
  {
    name: '七夕限定礼盒活动',
    metric: 'ROI',
    value: '1:5.2',
    isPositive: true
  },
  {
    name: '夏季新品推广',
    metric: '转化率',
    value: '8.5%',
    isPositive: true
  },
  {
    name: '会员专享优惠',
    metric: 'CTR',
    value: '12.8%',
    isPositive: true
  }
];

const underPerformingActivities = [
  {
    name: '新客首购满减',
    metric: '转化率',
    value: '1.5%',
    isPositive: false
  },
  {
    name: '社群运营活动',
    metric: '参与度',
    value: '2.3%',
    isPositive: false
  },
  {
    name: '品牌联名推广',
    metric: 'ROI',
    value: '1:0.8',
    isPositive: false
  }
];

const MarketingAnalyticsOverviewPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="智能营销效果总览"
      description="通过AI驱动的数据分析，全面洞察营销效果表现与趋势，支持精准决策制定"
      breadcrumbs={[
        { label: '智能营销效果评估与数据分析', href: '#' },
        { label: '智能营销效果总览', href: '/marketing-analytics/overview', current: true }
      ]}
    >
      <div className="space-y-8">
        {/* 核心指标区域 - 4:4 布局 */}
        <div>
          {/* 第一行：总GMV + 总营销投入 + ROI + 高表现活动 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* 前3个指标卡片 */}
            {metricsData.slice(0, 3).map((metric, index) => (
              <div key={`metric-top-${metric.title}-${index}`} className="bg-[var(--bg-secondary)] p-5 rounded-lg shadow-sm flex flex-col justify-between h-full">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] truncate">{metric.title}</h3>
                <p className="text-3xl font-bold text-[var(--text-primary)] my-2">{metric.value}</p>
                {metric.change && (
                  <p className={`text-sm font-medium ${metric.isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'}`}>
                    {metric.isPositive ? '↑' : '↓'}{metric.change} {metric.subtitle || '环比'}
                  </p>
                )}
              </div>
            ))}
            {/* 高表现活动卡片 */}
            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[var(--color-success-600)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">高表现活动</h3>
              </div>
              <ul className="space-y-3">
                {highPerformanceActivities.slice(0, 1).map((activity, index) => (
                  <li key={`high-top-${activity.name}-${index}`} className="group">
                    <button className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors w-full text-left">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{activity.name}</p>
                        <p className="text-xs font-medium text-[var(--color-success-600)]">{activity.metric}: {activity.value}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 第二行：新增用户数 + 整体转化率 + 平均用户LTV + 待优化活动 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* 后3个指标卡片 */}
            {metricsData.slice(3, 6).map((metric, index) => (
              <div key={`metric-bottom-${metric.title}-${index}`} className="bg-[var(--bg-secondary)] p-5 rounded-lg shadow-sm flex flex-col justify-between h-full">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] truncate">{metric.title}</h3>
                <p className="text-3xl font-bold text-[var(--text-primary)] my-2">{metric.value}</p>
                {metric.change && (
                  <p className={`text-sm font-medium ${metric.isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'}`}>
                    {metric.isPositive ? '↑' : '↓'}{metric.change} {metric.subtitle || '环比'}
                  </p>
                )}
              </div>
            ))}
            {/* 待优化活动卡片 */}
            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-[var(--color-danger-600)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">待优化活动</h3>
              </div>
              <ul className="space-y-3">
                {underPerformingActivities.slice(0, 1).map((activity, index) => (
                  <li key={`low-bottom-${activity.name}-${index}`} className="group">
                    <button className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors w-full text-left">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{activity.name}</p>
                        <p className="text-xs font-medium text-[var(--color-danger-600)]">{activity.metric}: {activity.value}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <ActionButtons buttons={metricsActionButtons} />
          </div>
        </div>

        {/* AI洞察与预警 */}
        <AIInsightsSection insights={aiInsightsData} />

        {/* 趋势分析 */}
        <div>
          <TrendAnalysisSection charts={trendsData} />
          <div className="mt-6">
            <ActionButtons buttons={trendsActionButtons} />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default MarketingAnalyticsOverviewPage;