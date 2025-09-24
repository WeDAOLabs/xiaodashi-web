'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Lightbulb,
  ClipboardList,
  Edit3,
  Zap,
  Users,
  Shield,
  TrendingUp,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

interface TaskData {
  pending: number;
  toOptimize: number;
  toReview: number;
  published: number;
  todayNew: number;
}

interface TemplateData {
  title: string;
  scenario: string;
  content: string;
  status: 'approved' | 'pending' | 'needs-review';
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 模拟数据
const TASK_DATA: TaskData = {
  pending: 12,
  toOptimize: 5,
  toReview: 3,
  published: 128,
  todayNew: 8
};

const TEMPLATE_DATA: TemplateData[] = [
  {
    title: "新品上市推文",
    scenario: "社交媒体",
    content: "✨重磅登场！[产品名]今日正式发售，开启您的[核心价值]新体验...",
    status: "approved"
  },
  {
    title: "节假日朋友圈",
    scenario: "朋友圈营销",
    content: "🏮[节日]快乐！[品牌]为您送上最真挚的祝福，更有惊喜好礼等你...",
    status: "approved"
  },
  {
    title: "产品介绍详情页",
    scenario: "电商/官网",
    content: "深度解析[产品名]的魅力所在，探索[功能点1]、[功能点2]的革新...",
    status: "needs-review"
  }
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: "AI推文生成", icon: Edit3 },
  { label: "标题优化", icon: Zap },
  { label: "朋友圈定制", icon: Users },
  { label: "文案润色", icon: Shield },
  { label: "播客脚本", icon: TrendingUp },
  { label: "更多功能", icon: MoreHorizontal }
];

// 趋势图表数据
const TREND_DATA = [
  { day: '周一', clickRate: 4.2, conversionRate: 2.1 },
  { day: '周二', clickRate: 3.8, conversionRate: 1.9 },
  { day: '周三', clickRate: 5.1, conversionRate: 2.8 },
  { day: '周四', clickRate: 4.7, conversionRate: 2.4 },
  { day: '周五', clickRate: 6.2, conversionRate: 3.2 },
  { day: '周六', clickRate: 7.1, conversionRate: 3.8 },
  { day: '周日', clickRate: 6.8, conversionRate: 3.5 }
];

// 合规风险数据
const COMPLIANCE_RISK_DATA = [
  { name: '敏感词', value: 45, fill: 'var(--color-chart-5)' },
  { name: '虚假宣传', value: 25, fill: 'var(--color-chart-4)' },
  { name: '错别字', value: 18, fill: 'var(--color-warning-500)' },
  { name: '其他', value: 12, fill: 'var(--color-chart-1)' }
];

const ContentCreationCopywritingPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="营销文案智能创作与优化"
      description="基于AI技术的营销文案创作平台，提供智能文案生成、优化建议和效果分析"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '营销文案智能创作与优化', href: '/content-creation-copywriting', current: true }
      ]}
    >
      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧区域 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 上排卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 文案创意灵感推荐 */}
            <Card className="flex flex-col h-full">
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <div className="mr-3 text-[var(--color-primary-500)]">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    文案创意灵感推荐
                  </h3>
                </div>
                <div className="flex-grow">
                  <p className="text-[var(--text-secondary)] mb-6">
                    根据 <span className="text-[var(--color-primary-500)] font-medium">[IP人设]</span> 和{' '}
                    <span className="text-[var(--color-primary-500)] font-medium">[市场热点]</span>，为您推荐最新文案创意。
                  </p>
                </div>
                <div className="flex flex-col space-y-3 mt-auto">
                  <Button variant="outline" className="w-full">
                    查看更多灵感
                  </Button>
                  <Button className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
                    生成此主题文案
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 文案任务与项目概览 */}
            <Card className="flex flex-col h-full">
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <div className="mr-3 text-[var(--color-primary-500)]">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    文案任务与项目概览
                  </h3>
                </div>
                <div className="flex-grow">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <p>待创作文案: <span className="font-bold text-[var(--text-primary)]">{TASK_DATA.pending} 条</span></p>
                      <p>待优化文案: <span className="font-bold text-[var(--text-primary)]">{TASK_DATA.toOptimize} 条</span></p>
                    </div>
                    <div className="bg-[var(--color-warning-50)] border-l-4 border-[var(--color-warning-600)] p-3 rounded">
                      <p className="text-[var(--color-warning-800)] font-semibold">
                        待合规审核文案: <span className="text-2xl">{TASK_DATA.toReview}</span> 条
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>已发布文案: <span className="font-bold text-[var(--text-primary)]">{TASK_DATA.published} 篇</span></p>
                      <p>今日新增: <span className="font-bold text-[var(--color-success-600)]">+{TASK_DATA.todayNew} 篇</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 mt-auto">
                  <Button className="w-full bg-[var(--color-warning-600)] hover:bg-[var(--color-warning-700)]">
                    前往合规审核
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      查看所有任务
                    </Button>
                    <Button className="flex-1 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
                      快速新建文案
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 精选文案模板 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  精选文案模板，助您高效创作
                </h3>
                <Button variant="link" className="text-sm p-0 h-auto text-[var(--color-primary-500)]">
                  查看更多模板
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATE_DATA.map((template, index) => (
                  <div
                    key={index}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 flex flex-col transition-shadow hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[var(--text-primary)]">{template.title}</h4>
                      <Badge
                        className={`text-xs font-medium ${
                          template.status === 'approved'
                            ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]'
                            : template.status === 'pending'
                            ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]'
                            : 'bg-[var(--color-warning-100)] text-[var(--color-warning-800)]'
                        }`}
                      >
                        <span className={`w-2 h-2 mr-1.5 rounded-full ${
                          template.status === 'approved'
                            ? 'bg-[var(--color-success-500)]'
                            : template.status === 'pending'
                            ? 'bg-[var(--color-info-500)]'
                            : 'bg-[var(--color-warning-500)]'
                        }`}></span>
                        {template.status === 'approved' ? '已合规' :
                         template.status === 'pending' ? '审核中' : '需校验'}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      适用场景: {template.scenario}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] p-3 rounded-md flex-grow">
                      {template.content}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full text-sm border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)]"
                    >
                      使用此模板
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 智能生成快捷入口 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  智能生成快捷入口
                </h3>
              </div>
              <p className="text-[var(--text-secondary)] mb-6 -mt-2">
                快速开始您的AI文案创作。
              </p>
              <div className="flex flex-wrap gap-4">
                {QUICK_ACTIONS.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className="flex-1 flex flex-col items-center justify-center p-4 bg-[var(--color-primary-50)] rounded-lg text-[var(--color-primary-500)] hover:bg-[var(--color-primary-100)] transition-colors duration-200 text-center min-w-[120px]"
                    >
                      <div className="mb-2">
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="text-sm font-semibold">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧区域 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* 文案效果趋势预测 */}
          <Card className="flex flex-col h-full">
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex items-center mb-4">
                <div className="mr-3 text-[var(--color-primary-500)]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  文案效果趋势预测
                </h3>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-[var(--text-secondary)] mb-4 -mt-2">
                  基于历史数据及内容特征
                </p>
                <div className="w-full h-[250px]">
                  <ChartContainer
                    config={{
                      clickRate: {
                        label: "点击率 (%)",
                        color: "var(--color-chart-2)",
                      },
                      conversionRate: {
                        label: "转化率 (%)",
                        color: "var(--color-chart-1)",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <RechartsLineChart data={TREND_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="clickRate"
                        stroke="var(--color-clickRate)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="conversionRate"
                        stroke="var(--color-conversionRate)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsLineChart>
                  </ChartContainer>
                </div>
                <div className="flex justify-center items-center mt-3 text-sm space-x-4">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[var(--color-chart-2)] mr-2"></span>
                    点击率 (%)
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[var(--color-chart-1)] mr-2"></span>
                    转化率 (%)
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                查看详细报告
              </Button>
            </CardContent>
          </Card>

          {/* 合规风险速览 */}
          <Card className="flex flex-col h-full">
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex items-center mb-4">
                <div className="mr-3 text-[var(--color-primary-500)]">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  合规风险速览
                </h3>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-[var(--text-secondary)] mb-4 -mt-2">
                  当前文案库合规风险概览
                </p>
                <div className="space-y-2 text-sm mb-4">
                  <p>待处理合规风险: <span className="font-bold text-[var(--color-danger-600)]">8 条</span></p>
                  <p>高风险文案: <span className="font-bold text-[var(--color-warning-600)]">2 篇</span></p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={COMPLIANCE_RISK_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COMPLIANCE_RISK_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[var(--color-chart-5)] mr-2"></span>
                    敏感词
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[var(--color-chart-4)] mr-2"></span>
                    虚假宣传
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[var(--color-warning-500)] mr-2"></span>
                    错别字
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-[var(--color-chart-1)] mr-2"></span>
                    其他
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3 mt-auto pt-4">
                <Button variant="destructive" className="w-full">
                  查看全部风险
                </Button>
                <Button variant="outline" className="w-full">
                  配置合规规则
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default ContentCreationCopywritingPage;