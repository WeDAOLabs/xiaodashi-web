'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  AlertTriangle,
  Download,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';
import React from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import BrandHealthRadarChart from '../_components/BrandHealthRadarChart';
import EmotionWordCloud from '../_components/EmotionWordCloud';

interface BrandMetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle?: string;
  linkText?: string;
}

const BrandMetricCard = React.memo<BrandMetricCardProps>(({
  title,
  value,
  change,
  isPositive,
  subtitle,
  linkText
}) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
        {subtitle && <span className="text-sm text-[var(--text-secondary)]">{subtitle}</span>}
      </div>
      {change && (
        <div className="flex items-center text-sm mt-1">
          <span className={`font-semibold flex items-center gap-1 ${isPositive ? 'text-[var(--success-color)]' : 'text-[var(--color-danger-600)]'}`}>
            <TrendingUp className="w-4 h-4" />
            {change}
          </span>
        </div>
      )}
    </div>
    {linkText && (
      <button className="text-xs font-semibold text-[var(--primary-color)] hover:underline">
        {linkText}
      </button>
    )}
  </div>
));

BrandMetricCard.displayName = 'BrandMetricCard';

const BrandHealthMonitoringPage: React.FC = () => {
  // 使用useMemo优化静态数据
  const brandHealthData = React.useMemo(() => [
    { category: '品牌认知', current: 88, industry: 75, fullMark: 100 },
    { category: '品牌形象', current: 87, industry: 80, fullMark: 100 },
    { category: '品牌联想', current: 82, industry: 74, fullMark: 100 },
    { category: '品牌忠诚', current: 79, industry: 72, fullMark: 100 },
    { category: '品牌资产', current: 90, industry: 78, fullMark: 100 },
  ], []);

  const reputationTrendData = React.useMemo(() => [
    { month: '1月', value: 87 },
    { month: '2月', value: 89 },
    { month: '3月', value: 85 },
    { month: '4月', value: 92 },
    { month: '5月', value: 94 },
    { month: '6月', value: 92 },
  ], []);

  const assetCompositionData = React.useMemo(() => [
    { name: '品牌知名度', value: 30 },
    { name: '感知质量', value: 25 },
    { name: '品牌联想', value: 20 },
    { name: '品牌忠诚度', value: 15 },
    { name: '其他资产', value: 10 },
  ], []);

  const emotionWords = React.useMemo(() => [
    { text: '创新', weight: 100, sentiment: 'positive' as const },
    { text: '推荐', weight: 95, sentiment: 'positive' as const },
    { text: '服务好', weight: 85, sentiment: 'positive' as const },
    { text: '可靠', weight: 80, sentiment: 'positive' as const },
    { text: '环保', weight: 75, sentiment: 'positive' as const },
    { text: '时尚', weight: 70, sentiment: 'neutral' as const },
    { text: '新潮', weight: 60, sentiment: 'positive' as const },
    { text: '昂贵', weight: 45, sentiment: 'negative' as const },
    { text: '问题', weight: 35, sentiment: 'negative' as const },
  ], []);

  const healthTrendData = React.useMemo(() => [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 78 },
    { month: 'May', value: 82 },
    { month: 'Jun', value: 85 },
  ], []);
  return (
    <ToolPageLayout
      title="品牌健康度持续监测与提升"
      description="基于AI算法实时监测品牌健康状况，提供智能化品牌管理洞察与建议"
      breadcrumbs={[
        { label: '智能品牌与IP资产管理', href: '#' },
        { label: '品牌健康度持续监测与提升', href: '/brand-management-health-monitoring', current: true }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧概览面板 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 品牌监测概览卡片 */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  正在监测品牌：<span className="font-bold text-[var(--text-primary)]">15个</span>
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  平均品牌健康度：<span className="font-bold text-lg text-green-600">85分 (良好 ↑)</span>
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  历史最低健康度：<span className="font-bold text-[var(--text-primary)]">60分</span>
                </p>
              </div>

              <div className="bg-[var(--info-bg)] border border-[var(--info-border)] rounded-lg p-3 flex items-start space-x-2">
                <Lightbulb className="h-4 w-4 text-[var(--info-color)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[var(--info-color)] mb-1">最新AI洞察</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    消费者对品牌X的环保理念关注度显著提升。
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">健康度总分趋势</h4>
                <div className="h-24">
                  <ChartContainer config={{ value: { label: '健康度', color: 'var(--primary-color)' } }} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary-color)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 2, strokeWidth: 0 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">情感词云图</h4>
                <div role="img" aria-label="品牌情感词云图，展示消费者对品牌的情感反馈词汇">
                  <EmotionWordCloud words={emotionWords} className="w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="w-full">
                  + 添加监测品牌
                </Button>
                <Button variant="outline" className="w-full">
                  查看全部品牌洞察
                </Button>
                <Button variant="outline" className="w-full">
                  定制化品牌报告
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 关键指标与AI预警 */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">关键指标与AI预警</h3>
              <div className="space-y-3">
                <BrandMetricCard
                  title="品牌声量"
                  value="1.2M"
                  change="↑ 5.2%"
                  isPositive={true}
                  linkText="查看详情"
                />
                <BrandMetricCard
                  title="品牌美誉度"
                  value="92%"
                  change=""
                  isPositive={true}
                  subtitle="(良好)"
                  linkText="查看详情"
                />
              </div>

              <div className="bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded-lg p-3 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-[var(--warning-color)] flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-[var(--warning-color)] mb-1">AI预警</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      品牌Y近期在社交媒体出现负面评论爆发，需关注。
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[var(--warning-color)] hover:bg-[var(--warning-color)]/90 text-white"
                  >
                    处理预警
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧主面板 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 数据可视化图表网格 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* 品牌健康度雷达图 */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">品牌健康度雷达图</h3>
                <div className="h-64" role="img" aria-label="品牌健康度雷达图，显示当前品牌与行业均值在五个维度的对比情况">
                  <BrandHealthRadarChart data={brandHealthData} className="h-full" />
                </div>
              </CardContent>
            </Card>

            {/* 品牌美誉度趋势 */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">品牌美誉度趋势</h3>
                <div className="h-64">
                  <ChartContainer config={{ value: { label: '美誉度', color: 'var(--primary-color)' } }} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reputationTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                          domain={[80, 100]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary-color)"
                          strokeWidth={2}
                          dot={{ fill: 'var(--primary-color)', strokeWidth: 0, r: 3 }}
                          activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* 品牌资产构成分析 */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">品牌资产构成分析</h3>
                <div className="h-64">
                  <ChartContainer config={{ value: { label: '占比', color: 'var(--primary-color)' } }} className="h-full w-full">
                    <BarChart
                      accessibilityLayer
                      data={assetCompositionData}
                      layout="vertical"
                      margin={{
                        left: -20,
                      }}
                      barCategoryGap="20%"
                    >
                      <XAxis type="number" dataKey="value" domain={[0, 35]} hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--color-value)"
                        radius={3}
                        barSize={10}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent formatter={(value) => [`${value}%`, '占比']} />}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI智能分析建议 */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">AI智能分析建议</h3>
                <div className="bg-[var(--success-bg)] border-l-4 border-l-[var(--success-color)] rounded-lg p-4 h-full">
                  <div>
                    <p className="font-semibold text-sm text-[var(--success-color)] mb-2">AI 建议</p>
                    <p className="text-[var(--text-secondary)]">
                      品牌X在年轻用户群体中的认知度不足，建议通过B站/小红书平台进行品宣活动，提升品牌在新媒体的曝光度。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 底部操作区域 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  准备好获取完整的品牌健康度洞察了吗？
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm">
                    设定监测周期
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    邀请团队成员
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    生成品牌健康度报告
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 页面底部刷新按钮 */}
      <div className="flex justify-end mt-6">
        <button
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
          aria-label="刷新页面数据"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          刷新数据
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default BrandHealthMonitoringPage;