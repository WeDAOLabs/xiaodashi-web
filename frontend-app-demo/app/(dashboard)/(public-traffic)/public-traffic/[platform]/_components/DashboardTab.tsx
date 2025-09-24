import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis } from 'recharts';
import KPICard from './shared/KPICard';
import AIAlert from './shared/AIAlert';
import TrendChart from './shared/TrendChart';
import AdPerformanceChart, { TimePeriodSelect } from './shared/AdPerformanceChart';
import { BaseTabProps } from './types';

// 示例数据
const SALES_TREND_DATA = [
  { month: 'Jan', value: 650000 },
  { month: 'Feb', value: 720000 },
  { month: 'Mar', value: 800000 },
];

const PRICE_DATA = [
  { month: 'Jan', value: 165 },
  { month: 'Feb', value: 175 },
  { month: 'Mar', value: 180 },
];

const CONVERSION_DATA = [
  { month: 'Jan', value: 33 },
  { month: 'Feb', value: 34 },
  { month: 'Mar', value: 35 },
];

const ROI_TREND_DATA = [
  { month: 'Jan', roi: 3.2, spend: 528000 },
  { month: 'Feb', roi: 3.4, spend: 537200 },
  { month: 'Mar', roi: 3.1, spend: 533200 },
  { month: 'Apr', roi: 3.6, spend: 532800 },
  { month: 'May', roi: 3.3, spend: 534600 },
  { month: 'Jun', roi: 3.45, spend: 534750 },
];

const DashboardTab: React.FC<BaseTabProps> = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const kpiData = [
    {
      title: '总花费',
      value: '¥12,000',
      change: '25%',
      isPositive: false,
      chart: (
        <TrendChart
          data={SALES_TREND_DATA}
          color="#10b981"
          dataKey="value"
          label="花费"
          formatValue={(value) => `¥${(value / 1000).toFixed(0)}K`}
        />
      )
    },
    {
      title: '转化数',
      value: '200',
      change: '8%',
      isPositive: true,
      chart: (
        <TrendChart
          data={PRICE_DATA}
          color="#3b82f6"
          dataKey="value"
          label="转化数"
        />
      )
    },
    {
      title: '曝光量',
      value: '800K',
      change: '2%',
      isPositive: true,
      chart: (
        <TrendChart
          data={CONVERSION_DATA}
          color="#8b5cf6"
          dataKey="value"
          label="曝光量"
          formatValue={(value) => `${value}K`}
        />
      )
    }
  ];

  const aiAlerts = [
    {
      type: 'warning' as const,
      message: '转化成本上升：明星同款系列计划过去3天CPA环比上升15%，建议检查定向或创意素材。',
      timestamp: '2分钟前',
      actions: ['查看详情', '一键优化']
    },
    {
      type: 'info' as const,
      message: '优化建议：发现高潜计划-新品推广CTR高于行业均值20%，建议适当增加预算以获取更多曝光。',
      timestamp: '15分钟前',
      actions: ['查看详情', '应用建议']
    }
  ];

  const chartConfig = {
    roi: {
      label: 'ROI',
      color: 'var(--primary-color)',
    },
    spend: {
      label: '花费',
      color: '#10b981',
    },
  };

  return (
    <div className="space-y-6">
      {/* 核心指标概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="bg-[var(--bg-primary)] rounded-xl shadow-sm p-6 col-span-1 lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">核心指标概览</h3>
            <div className="flex items-center space-x-2">
              <TimePeriodSelect
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
              />
              <Button variant="ghost" size="sm">
                自定义Dashboard
              </Button>
            </div>
          </div>

          {/* 投放数据图表 */}
          <AdPerformanceChart
            showHeader={false}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        <div className="bg-[var(--bg-primary)] rounded-xl shadow-sm p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI 智能诊断报告</h3>
          <div className="space-y-4">
            {aiAlerts.map((alert, index) => (
              <AIAlert key={index} {...alert} />
            ))}
            <div className="flex space-x-3 mt-4">
              <Button className="flex items-center gap-2">
                一键优化
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                查看全部报告
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* 关键趋势图 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">关键趋势图</h3>
        <div className="h-72">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <RechartsLineChart
              data={ROI_TREND_DATA}
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="roi"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(1)}`}
              />
              <YAxis
                yAxisId="spend"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
              <Line
                yAxisId="roi"
                type="monotone"
                dataKey="roi"
                stroke="var(--primary-color)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                name="ROI"
              />
              <ChartTooltip
                content={<ChartTooltipContent
                  formatter={(value, name) => [
                    name === 'ROI' ? `${value}` : `¥${(value as number).toLocaleString()}`,
                    name
                  ]}
                />}
              />
            </RechartsLineChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardTab;