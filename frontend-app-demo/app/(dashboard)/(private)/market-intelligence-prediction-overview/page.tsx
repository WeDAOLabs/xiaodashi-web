'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Download,
  History,
  Lightbulb,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  TrendingUp,
  Upload
} from 'lucide-react';
import React from 'react';
import { Area, AreaChart, Line, LineChart as RechartsLineChart, XAxis, YAxis } from 'recharts';

// 数据类型定义
interface MarketDataPoint {
  month: string;
  value: number;
}

interface RiskAlert {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  isSelected?: boolean;
}

// 数据验证函数
const validateChartData = (data: MarketDataPoint[]): MarketDataPoint[] => {
  return data.filter(item =>
    item &&
    typeof item.month === 'string' &&
    typeof item.value === 'number' &&
    !isNaN(item.value)
  );
};

// 模拟数据
const MARKET_TREND_DATA: MarketDataPoint[] = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 120 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 140 },
  { month: 'May', value: 160 },
  { month: 'Jun', value: 180 },
  { month: 'Jul', value: 200 },
];

const GROWTH_PREDICTION_DATA: MarketDataPoint[] = [
  { month: 'Q1\'24', value: 100 },
  { month: 'Q2\'24', value: 150 },
  { month: 'Q3\'24', value: 140 },
  { month: 'Q4\'24', value: 200 },
  { month: 'Q1\'25', value: 250 },
  { month: 'Q2\'25', value: 280 },
];

const RISK_ALERTS: RiskAlert[] = [
  {
    id: '1',
    level: 'high',
    title: '舆情危机',
    description: '品牌相关负面新闻爆发，关注度迅速上升。',
    time: '今天 10:30',
    isSelected: true,
  },
  {
    id: '2',
    level: 'medium',
    title: '竞品动态',
    description: '竞品X推出优惠力度空前，或影响我司销量。',
    time: '昨天 15:00',
  },
  {
    id: '3',
    level: 'low',
    title: '行业报告',
    description: '某报告预测行业整体增速放缓。',
    time: '前天 09:00',
  },
  {
    id: '4',
    level: 'medium',
    title: '供应链风险',
    description: '主要原材料供应商宣布减产20%。',
    time: '2024-07-28',
  },
  {
    id: '5',
    level: 'low',
    title: '政策法规',
    description: '新的电商广告法规即将出台。',
    time: '2024-07-27',
  },
];

// 组件定义
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  variant?: 'default' | 'ai-insight';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  chart,
  variant = 'default'
}) => {
  if (variant === 'ai-insight') {
    return (
      <Alert className="border-[var(--color-info-200)] bg-[var(--color-info-50)]">
        <Lightbulb className="w-5 h-5 text-[var(--color-info-600)]" />
        <AlertDescription className="text-[var(--color-info-800)]">
          <h3 className="font-semibold text-[var(--color-info-900)]">{title}</h3>
          <p className="mt-1 text-sm">{value}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="relative group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
              {trend && (
                <div className={`flex items-center text-sm font-semibold ${
                  trend.isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[var(--text-tertiary)] mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {chart && (
          <div className="h-20 w-full mt-3 -mb-2">
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TrendChartProps {
  data: MarketDataPoint[];
  color: string;
  dataKey: string;
  label: string;
  formatValue?: (value: number) => string;
}

const TrendChart: React.FC<TrendChartProps> = React.memo(({
  data,
  color,
  dataKey,
  label,
  formatValue
}) => {
  const chartConfig = React.useMemo(() => ({
    [dataKey]: {
      label: label,
      color: color,
    },
  }), [dataKey, label, color]);

  const tooltipFormatter = React.useCallback(
    (value: unknown): [React.ReactNode, string] => {
      if (value == null || (typeof value !== 'number' && typeof value !== 'string')) {
        return ['--', label];
      }
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numValue)) return ['--', label];

      return [
        formatValue ? formatValue(numValue) : numValue.toLocaleString(),
        label
      ];
    },
    [formatValue, label]
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RechartsLineChart data={validateChartData(data)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10 }}
          hide
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10 }}
          hide
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={tooltipFormatter} />}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
});

TrendChart.displayName = 'TrendChart';

interface RiskAlertItemProps {
  alert: RiskAlert;
  onClick: (alert: RiskAlert) => void;
}

const RiskAlertItem: React.FC<RiskAlertItemProps> = ({ alert, onClick }) => {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-[var(--destructive)] text-white border-[var(--destructive)]';
      case 'medium':
        return 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-600)]';
      case 'low':
        return 'bg-[var(--color-info-50)] text-[var(--color-info-600)] border-[var(--color-info-600)]';
      default:
        return 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-secondary)]';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high': return '高危';
      case 'medium': return '中等';
      case 'low': return '低级';
      default: return level;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${
        alert.isSelected
          ? 'bg-[var(--color-primary-50)] border-[var(--primary-color)] shadow-md'
          : 'border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)]'
      }`}
      onClick={() => onClick(alert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(alert);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={alert.isSelected}
      aria-label={`${getLevelText(alert.level)}级预警：${alert.title}`}
    >
      <div className="flex justify-between items-start">
        <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getBadgeVariant(alert.level)}`}>
          {getLevelText(alert.level)}
        </Badge>
        <span className="text-xs text-[var(--text-tertiary)]">{alert.time}</span>
      </div>
      <p className="font-semibold text-[var(--text-primary)] mt-2">{alert.title}</p>
      <p className="text-sm text-[var(--text-secondary)] mt-1">{alert.description}</p>
      {alert.isSelected && (
        <div className="flex items-center space-x-2 mt-3 border-t border-[var(--border-secondary)] pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            标记已处理
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
          >
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            发起危机应对
          </Button>
        </div>
      )}
    </div>
  );
};

const PredictionOverviewPage: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = React.useState<RiskAlert | null>(RISK_ALERTS[0]);

  const handleAlertClick = React.useCallback((alert: RiskAlert) => {
    setSelectedAlert(alert);
  }, []);

  const updatedAlerts = React.useMemo(() =>
    RISK_ALERTS.map(alert => ({
      ...alert,
      isSelected: alert.id === selectedAlert?.id
    })), [selectedAlert?.id]
  );

  // 图表配置缓存
  const chartConfigs = React.useMemo(() => ({
    marketTrend: {
      value: {
        label: "市场指标",
        color: "var(--primary-color)",
      },
    },
    growthPrediction: {
      value: {
        label: "销售额",
        color: "var(--primary-color)",
      },
    }
  }), []);

  return (
    <ToolPageLayout
      title="预测与预警概览"
      description="智能市场洞察与竞品分析 > 市场趋势预测与风险预警"
      breadcrumbs={[
        { label: '智能市场洞察与竞品分析', href: '#' },
        { label: '预测与预警概览', href: '/market-intelligence-prediction-overview', current: true }
      ]}
      actions={
        <div className="flex items-center space-x-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            设置自定义预警
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            查看所有历史预警
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            请求AI深度预测
          </Button>
        </div>
      }
    >
      {/* 概览统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="活跃预警"
          value="12"
          subtitle="条"
        />
        <StatCard
          title="市场增长预测 (未来6个月)"
          value="8.5%"
          trend={{ value: '↑', isPositive: true }}
          chart={
            <TrendChart
              data={MARKET_TREND_DATA}
              color="var(--color-success-500)"
              dataKey="value"
              label="增长率"
              formatValue={(value) => `${value}%`}
            />
          }
        />
        <StatCard
          title="AI 洞察"
          value="某新兴技术可能在未来12个月内成为行业颠覆者。"
          variant="ai-insight"
        />
      </div>

      {/* 关键市场指标预测曲线 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">关键市场指标预测曲线</h3>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
            >
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </Button>
          </div>

          <div
            className="h-48 w-full"
            role="img"
            aria-label="关键市场指标预测曲线图表，显示从1月到7月的市场趋势变化"
          >
            <ChartContainer
              config={chartConfigs.marketTrend}
              className="h-full w-full"
            >
              <AreaChart data={validateChartData(MARKET_TREND_DATA)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary-color)"
                  fill="var(--primary-color)"
                  fillOpacity={0.1}
                  strokeWidth={2.5}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧内容区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI智能市场趋势预测 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">AI智能市场趋势预测</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 市场增长预测图表 */}
                <div className="border border-[var(--border-secondary)] rounded-lg p-4 flex flex-col">
                  <div className="flex-shrink-0">
                    <h3 className="font-semibold text-[var(--text-primary)]">市场增长预测</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      产品X未来12个月销售额预测: <span className="font-bold text-[var(--color-success-600)]">2.3亿元 (+15%)</span>
                    </p>
                  </div>

                  <div
                    className="flex-1 w-full mt-4 min-h-[300px]"
                    role="img"
                    aria-label="市场增长预测图表，显示产品X未来季度销售额预测趋势"
                  >
                    <ChartContainer
                      config={chartConfigs.growthPrediction}
                      className="h-full w-full"
                    >
                      <AreaChart data={validateChartData(GROWTH_PREDICTION_DATA)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary-color)"
                          fill="var(--primary-color)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent formatter={(value) => [`${value}m`, "销售额"]} />}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>

                {/* 用户需求演变和词云 */}
                <div className="border border-[var(--border-secondary)] rounded-lg p-4 flex flex-col">
                  <h3 className="font-semibold text-[var(--text-primary)]">用户需求演变</h3>
                  <div className="space-y-3 mt-2 text-sm">
                    <div className="border border-[var(--color-info-200)] bg-[var(--color-info-50)] rounded-lg p-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[var(--color-info-600)] flex-shrink-0" />
                      <div className="flex items-center gap-1 text-sm text-[var(--color-info-800)]">
                        <Badge variant="secondary" className="text-[var(--primary-color)] bg-[var(--color-primary-100)] border-[var(--primary-color)] font-semibold">AI预测</Badge>
                        <span>消费者对<span className="font-bold">个性化定制</span>需求将持续增长<span className="font-bold text-[var(--color-success-600)]">20%</span>。</span>
                      </div>
                    </div>
                    <div className="border border-[var(--color-info-200)] bg-[var(--color-info-50)] rounded-lg p-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[var(--color-info-600)] flex-shrink-0" />
                      <div className="flex items-center gap-1 text-sm text-[var(--color-info-800)]">
                        <Badge variant="secondary" className="text-[var(--primary-color)] bg-[var(--color-primary-100)] border-[var(--primary-color)] font-semibold">AI洞察</Badge>
                        <span><span className="font-bold">可持续消费</span>理念渗透率将在明年达到<span className="font-bold">35%</span>。</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-[var(--text-primary)] mt-4">热点趋势词云</h4>
                  <div className="flex-grow flex items-center justify-center bg-[var(--bg-secondary)] rounded-md mt-2">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 p-4 min-h-[120px]">
                      <span className="text-2xl text-[var(--primary-color)] font-bold">个性化定制</span>
                      <span className="text-xl text-[var(--color-success-600)] font-bold">可持续消费</span>
                      <span className="text-lg text-[var(--color-info-500)] font-bold">AI驱动</span>
                      <span className="text-base text-[var(--text-secondary)] font-bold">体验经济</span>
                      <span className="text-xl text-[var(--color-danger-500)] font-bold">国潮文化</span>
                      <span className="text-base text-[var(--color-warning-500)] font-bold">私域流量</span>
                      <span className="text-lg text-[var(--primary-color)] font-bold">健康生活</span>
                      <span className="text-base text-[var(--text-tertiary)] font-bold">智能家居</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <Separator className="my-6" />
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  调整预测参数
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  生成预测报告
                </Button>
                <Button className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  采纳预测结果
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 预警规则与通知设置 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">预警规则与通知设置</h2>
                <div className="flex items-center space-x-2">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    新建预警规则
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    修改通知设置
                  </Button>
                </div>
              </div>

              <Separator className="mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">预警规则管理</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">当前已配置 5 条规则，监控 12 个关键指标。</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">通知方式</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                      飞书消息
                    </Badge>
                    <Badge className="text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                      邮件
                    </Badge>
                    <Badge className="text-sm text-[var(--text-tertiary)] bg-gray-100 px-3 py-1 rounded-full">
                      短信 (未启用)
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  className="flex items-center text-[var(--text-secondary)] hover:text-red-600"
                >
                  <BellOff className="w-4 h-4 mr-1.5" />
                  静音所有预警
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧预警列表 */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">实时风险预警列表</h2>
              <ScrollArea className="h-[calc(100vh-400px)] max-h-[600px] pr-2">
                <div className="space-y-3">
                  {updatedAlerts.map((alert) => (
                    <RiskAlertItem
                      key={alert.id}
                      alert={alert}
                      onClick={handleAlertClick}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default PredictionOverviewPage;