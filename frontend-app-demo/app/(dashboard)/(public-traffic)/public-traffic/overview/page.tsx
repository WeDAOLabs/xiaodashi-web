'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, Legend } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Plus,
  Settings,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

// 类型定义
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface AIAlertProps {
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  actions: string[];
}

interface PlatformCardProps {
  name: string;
  status: 'connected' | 'error' | 'pending';
  todaySpend: string;
  roi: string;
  icon: React.ReactNode;
  platformKey: string;
}

// KPI统计卡片组件
const KPICard: React.FC<KPICardProps> = ({ title, value, change, isPositive }) => (
  <Card className="relative group cursor-pointer hover:shadow-md transition-all duration-300">
    <CardContent className="p-4">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-2">{value}</p>
      <div className="flex items-center text-sm">
        <span className={`flex items-center mr-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </span>
        <span className="text-[var(--text-tertiary)]">vs 上期</span>
      </div>
    </CardContent>
  </Card>
);

// AI预警卡片组件
const AIAlertCard: React.FC<AIAlertProps> = ({ type, message, timestamp, actions }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-[var(--color-warning-50)] border-[var(--color-warning-100)]';
      case 'info':
        return 'bg-[var(--color-info-50)] border-[var(--color-info-100)]';
      case 'success':
        return 'bg-[var(--color-success-50)] border-[var(--color-success-100)]';
      default:
        return 'bg-[var(--bg-secondary)] border-[var(--border-primary)]';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-[var(--color-warning-600)]';
      case 'info':
        return 'text-[var(--color-info-600)]';
      case 'success':
        return 'text-[var(--color-success-600)]';
      default:
        return 'text-[var(--text-secondary)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6" />;
      case 'info':
        return <Lightbulb className="w-6 h-6" />;
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  return (
    <Card className={`p-4 border flex flex-col justify-between ${getAlertStyles()}`}>
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className={`p-2 rounded-full ${getIconColor()}`}>
            {getIcon()}
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">{timestamp}</span>
        </div>
        <p className="text-[var(--text-primary)] font-medium mb-4">{message}</p>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={index === actions.length - 1 ? "default" : "ghost"}
            size="sm"
            className="text-sm"
          >
            {action}
          </Button>
        ))}
      </div>
    </Card>
  );
};

// 平台连接卡片组件
const PlatformCard: React.FC<PlatformCardProps> = ({ name, status, todaySpend, roi, icon, platformKey }) => {
  const router = useRouter();

  const handleEnterPlatform = () => {
    if (status === 'connected') {
      router.push(`/public-traffic/${platformKey}`);
    }
  };
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)]">
            <CheckCircle className="w-4 h-4 mr-1" />
            已连接
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-50 text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            连接异常
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-gray-100 text-gray-500">
            <Settings className="w-4 h-4 mr-1" />
            待连接
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <CardContent className="p-4 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 text-[var(--primary-color)]">{icon}</div>
            <h3 className="font-bold text-lg text-[var(--text-primary)]">{name}</h3>
          </div>
          {getStatusBadge()}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 text-center mb-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">今日花费</p>
            <p className="font-semibold text-[var(--text-primary)]">{todaySpend}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">ROI</p>
            <p className="font-semibold text-[var(--text-primary)]">{roi}</p>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-2 mt-auto">
          <Button variant="ghost" size="sm" className="flex-1">
            管理连接
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleEnterPlatform}
            disabled={status !== 'connected'}
          >
            进入平台
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ROI趋势图表组件
const ROITrendChart: React.FC = () => {
  const data = [
    { month: 'Jan', roi: 3.2, revenue: 528000 },
    { month: 'Feb', roi: 3.4, revenue: 537200 },
    { month: 'Mar', roi: 3.1, revenue: 533200 },
    { month: 'Apr', roi: 3.6, revenue: 532800 },
    { month: 'May', roi: 3.3, revenue: 534600 },
    { month: 'Jun', roi: 3.45, revenue: 534750 },
  ];

  const chartConfig = {
    revenue: {
      label: '收入',
      color: '#10b981',
    },
    roi: {
      label: 'ROI',
      color: 'var(--primary-color)',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        {/* 左Y轴 - 收入 */}
        <YAxis
          yAxisId="revenue"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
        />
        {/* 右Y轴 - ROI */}
        <YAxis
          yAxisId="roi"
          orientation="right"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value.toFixed(1)}`}
        />
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="收入"
        />
        <Line
          yAxisId="roi"
          type="monotone"
          dataKey="roi"
          stroke="var(--primary-color)"
          strokeWidth={2.5}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="ROI"
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="line"
          wrapperStyle={{ paddingBottom: '20px' }}
        />
        <ChartTooltip
          content={<ChartTooltipContent
            formatter={(value, name) => [
              name === '收入' ? `¥${(value as number).toLocaleString()}` : `${value}`,
              name
            ]}
          />}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
};

const PublicTrafficOverviewPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('近30天');

  // 时间筛选选项
  const timeRangeOptions = ['今天', '昨天', '近7天', '近30天', '本月', '上月'];

  // KPI数据
  const kpiData = [
    { title: '总ROI', value: '3.45', change: '5.2%', isPositive: true },
    { title: '总曝光量', value: '12.8M', change: '12.1%', isPositive: true },
    { title: '总点击量', value: '256.4K', change: '8.5%', isPositive: true },
    { title: '总转化数', value: '8,921', change: '3.1%', isPositive: false },
    { title: '总投放成本', value: '¥185,900', change: '2.5%', isPositive: true },
    { title: '平均线索成本', value: '¥20.84', change: '1.8%', isPositive: true },
  ];

  // AI预警数据
  const aiAlerts = [
    {
      type: 'warning' as const,
      message: '【预警】抖音平台预算即将耗尽，剩余20%',
      timestamp: '2分钟前',
      actions: ['忽略', '查看详情']
    },
    {
      type: 'warning' as const,
      message: '【预警】微信广告ROI近3小时下降15%，请关注',
      timestamp: '15分钟前',
      actions: ['忽略', '查看详情']
    },
    {
      type: 'info' as const,
      message: '【建议】某活动可尝试提升预算10%以获取更多转化',
      timestamp: '1小时前',
      actions: ['忽略', '查看详情', '一键采纳']
    }
  ];

  // 平台图标SVG组件
  const PlatformIcons = {
    douyin: (
      <svg viewBox="0 0 1024 1024" className="w-full h-full">
        <path fill="currentColor" d="M512 32a480 480 0 100 960 480 480 0 000-960zm0 896a416 416 0 110-832 416 416 0 010 832z"/>
        <circle cx="512" cy="350" r="80" fill="currentColor"/>
        <circle cx="512" cy="650" r="120" fill="currentColor"/>
      </svg>
    ),
    wechat: (
      <svg viewBox="0 0 1024 1024" className="w-full h-full">
        <path fill="#2DC25B" d="M864 160H160C98.2 160 48 210.2 48 272v416c0 61.8 50.2 112 112 112h512l192 128V272c0-61.8-50.2-112-112-112zM432 544a48 48 0 110-96 48 48 0 010 96zm160 0a48 48 0 110-96 48 48 0 010 96z"/>
      </svg>
    ),
    baidu: (
      <svg viewBox="0 0 1024 1024" className="w-full h-full">
        <path fill="#2962FF" d="M512 0C229.216 0 0 229.216 0 512s229.216 512 512 512 512-229.216 512-512S794.784 0 512 0zm201.728 584.704c-32.768-3.072-51.2-18.432-51.2-48.128 0-25.6 15.36-42.016 43.008-42.016 28.672 0 43.008 16.384 43.008 42.016 0 29.696-20.48 45.056-54.272 48.128l19.456 19.456z"/>
      </svg>
    ),
    xiaohongshu: (
      <svg viewBox="0 0 1024 1024" className="w-full h-full">
        <path fill="#FF2442" d="M947.2 403.2c-12.8-115.2-108.8-204.8-224-217.6-64-6.4-128-6.4-192 0-115.2 12.8-211.2 102.4-224 217.6-6.4 64-6.4 128 0 192 12.8 115.2 108.8 204.8 224 217.6 64 6.4 128 6.4 192 0 115.2-12.8 211.2-102.4 224-217.6 6.4-64 6.4-128 0-192zM512 665.6c-83.2 0-153.6-64-153.6-153.6s64-153.6 153.6-153.6S665.6 422.4 665.6 512 595.2 665.6 512 665.6z"/>
      </svg>
    )
  };

  // 平台数据
  const platformData = [
    {
      name: '抖音广告',
      status: 'connected' as const,
      todaySpend: '¥12,500',
      roi: '3.8',
      icon: PlatformIcons.douyin,
      platformKey: 'douyin'
    },
    {
      name: '微信广告',
      status: 'connected' as const,
      todaySpend: '¥8,200',
      roi: '4.1',
      icon: PlatformIcons.wechat,
      platformKey: 'wechat'
    },
    {
      name: '百度信息流',
      status: 'error' as const,
      todaySpend: '¥5,600',
      roi: '2.5',
      icon: PlatformIcons.baidu,
      platformKey: 'baidu'
    },
    {
      name: '小红书',
      status: 'pending' as const,
      todaySpend: '-',
      roi: '-',
      icon: PlatformIcons.xiaohongshu,
      platformKey: 'xiaohongshu'
    }
  ];

  return (
    <ToolPageLayout
      title="投放平台数据概览"
      description="统一管理和监控各大平台投放数据，通过AI智能分析优化投放效果"
      breadcrumbs={[
        { label: '增长与运营执行', href: '#' },
        { label: '智能公域流量投放与优化', href: '#' },
        { label: '投放平台数据概览', href: '/public-traffic/overview', current: true }
      ]}
    >
      <div className="space-y-6 lg:space-y-8">
        {/* KPI仪表板 */}
        <Card className="p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {timeRangeOptions.map((option) => (
                <Button
                  key={option}
                  variant={selectedTimeRange === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeRange(option)}
                  className="whitespace-nowrap"
                >
                  {option}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="flex items-center">
                自定义日期
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                自定义指标
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出报告
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              核心指标趋势：总ROI
            </h3>
            <ROITrendChart />
          </div>
        </Card>

        {/* AI智能预警与优化建议 */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            AI智能预警与优化建议
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAlerts.map((alert, index) => (
              <AIAlertCard key={index} {...alert} />
            ))}
          </div>
        </div>

        {/* 平台连接与状态管理 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              平台连接与状态管理
            </h2>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加新平台
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformData.map((platform, index) => (
              <PlatformCard key={index} {...platform} />
            ))}
          </div>
        </div>

      </div>
    </ToolPageLayout>
  );
};

export default PublicTrafficOverviewPage;