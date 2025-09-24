'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import {
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  Calendar,
  Database,
  Upload,
  Bell,
  Eye,
  Download
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  badge?: {
    text: string;
    color: string;
  };
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, badge, subtitle }) => (
  <Card className="relative group">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
        {badge && (
          <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.text}
          </Badge>
        )}
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{value}</p>
      {subtitle && (
        <p className="text-xs text-[var(--text-tertiary)] mt-1">{subtitle}</p>
      )}
      <div className="flex items-center text-sm mt-1">
        <div className={`flex items-center font-semibold ${isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="ml-1">{change}</span>
        </div>
        <span className="text-[var(--text-tertiary)] ml-2">vs last period</span>
      </div>
    </CardContent>
  </Card>
);

interface TrendChartProps {
  className?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ className }) => (
  <div className={className}>
    <ChartContainer config={trendChartConfig} className="h-64 w-full">
      <AreaChart
        accessibilityLayer
        data={trendChartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="value"
          type="natural"
          fill="var(--color-value)"
          fillOpacity={0.4}
          stroke="var(--color-value)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  </div>
);

interface RiskRadarChartProps {
  className?: string;
}

const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ className }) => (
  <div className={className}>
    <ChartContainer config={riskChartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadarChart data={riskChartData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
        />
        <PolarGrid gridType="polygon" />
        <Radar
          dataKey="value"
          fill="var(--color-value)"
          fillOpacity={0.6}
          stroke="var(--color-value)"
          strokeWidth={1}
        />
      </RadarChart>
    </ChartContainer>
  </div>
);

interface TimelineItemProps {
  title: string;
  date: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, date, description }) => (
  <div className="mb-6 ml-6 relative">
    <span className="absolute -left-[33px] top-1 flex items-center justify-center w-6 h-6 bg-[var(--color-primary-50)] rounded-full ring-4 ring-white">
      <Calendar className="w-3 h-3 text-[var(--primary-color)]" />
    </span>
    <h4 className="font-semibold text-sm text-[var(--text-primary)]">{title}</h4>
    <time className="text-xs text-[var(--text-tertiary)] mb-1 block">{date}</time>
    <p className="text-sm text-[var(--text-secondary)]">{description}</p>
  </div>
);

interface ReportItemProps {
  title: string;
  onView?: () => void;
  onExport?: () => void;
}

const ReportItem: React.FC<ReportItemProps> = ({ title, onView, onExport }) => (
  <div className="flex justify-between items-center p-3 bg-white hover:bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-secondary)]">
    <p className="text-sm text-[var(--text-secondary)]">{title}</p>
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onView}
        className="text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
      >
        查看
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onExport}
        className="text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
      >
        导出
      </Button>
    </div>
  </div>
);

// 图表数据
const trendChartData = [
  { month: "1月", value: 1200 },
  { month: "2月", value: 1100 },
  { month: "3月", value: 1000 },
  { month: "4月", value: 800 },
  { month: "5月", value: 900 },
  { month: "6月", value: 1000 },
  { month: "7月", value: 1200 },
];

const riskChartData = [
  { category: "技术", value: 85 },
  { category: "经济", value: 65 },
  { category: "环境", value: 70 },
  { category: "社会", value: 50 },
  { category: "政治", value: 45 },
  { category: "法律", value: 30 },
];

// 图表配置
const trendChartConfig = {
  value: {
    label: "趋势值",
    color: "var(--primary-color)",
  },
} satisfies ChartConfig;

const riskChartConfig = {
  value: {
    label: "风险值",
    color: "var(--primary-color)",
  },
} satisfies ChartConfig;

const MacroMonitoringPage: React.FC = () => {
  const handleViewReport = React.useCallback((reportTitle: string) => {
    console.log('查看报告:', reportTitle);
    // TODO: 实现查看报告逻辑
  }, []);

  const handleExportReport = React.useCallback((reportTitle: string) => {
    console.log('导出报告:', reportTitle);
    // TODO: 实现导出报告逻辑
  }, []);

  return (
    <ToolPageLayout
      title="宏观环境监测"
      description="智能监测宏观环境变化，及时识别市场机会与风险"
      breadcrumbs={[
        { label: '智能市场洞察与竞品分析', href: '#' },
        { label: '宏观环境监测', href: '/market-intelligence-macro-monitoring', current: true }
      ]}
    >
      <div className="space-y-6">
        {/* Overview Dashboard */}
        <Card>
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-primary)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">宏观环境概览仪表盘</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                刷新数据
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                查看全部宏观报告
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="市场热度指标"
                value="8,210"
                change="5.4%"
                isPositive={true}
              />
              <StatCard
                title="政策风险指数"
                value="2.3"
                change="0.2%"
                isPositive={false}
                badge={{ text: '低风险', color: 'bg-[var(--color-success-50)] text-[var(--color-success-800)]' }}
              />
              <StatCard
                title="最新技术突破"
                value="12项"
                change="3%"
                isPositive={true}
                badge={{ text: '本周', color: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]' }}
              />
              <StatCard
                title="数字经济增长率"
                value="15.6%"
                change="1.2"
                isPositive={true}
                badge={{ text: 'Q2', color: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]' }}
              />
            </div>
            <div>
              <h3 className="text-md font-semibold text-[var(--text-primary)] mb-4">行业趋势热度图</h3>
              <TrendChart />
            </div>
          </CardContent>
        </Card>

        {/* AI Trend Analysis */}
        <Card>
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-primary)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI智能趋势分析</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                生成详细分析报告
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                探讨 (飞书会议)
              </Button>
            </div>
          </div>
          <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">AI洞察：最新趋势解读</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-info-50)]">
                    <Lightbulb className="w-5 h-5 text-[var(--color-info-600)] flex-shrink-0 mt-1" />
                    <p className="text-sm text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">【预测】</strong>
                      未来一年C端消费品市场将进一步细分，垂直小众品牌崛起。
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-warning-50)]">
                    <AlertTriangle className="w-5 h-5 text-[var(--color-warning-600)] flex-shrink-0 mt-1" />
                    <p className="text-sm text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">【预警】</strong>
                      碳中和政策趋严，传统制造业面临转型压力，绿色供应链成新契机。
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">AI推荐：关注领域</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    <ThumbsUp className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)]">元宇宙技术在营销领域的应用前景</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    <ThumbsUp className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)]">Z世代社交消费新模式</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">趋势时间轴</h3>
                <div className="relative border-l-2 border-[var(--primary-color)] ml-2 py-4">
                  <TimelineItem
                    title="新消费品牌融资法规发布"
                    date="2024-07-15"
                    description="对早期消费品公司的融资渠道产生重要影响。"
                  />
                  <TimelineItem
                    title="AIGC 3.0 技术突破"
                    date="2024-06-28"
                    description="内容生成效率提升50%，营销行业迎来变革。"
                  />
                  <TimelineItem
                    title="东南亚电商关税调整"
                    date="2024-05-10"
                    description="跨境电商物流成本上升，考验供应链管理能力。"
                  />
                  <TimelineItem
                    title="全国碳排放交易体系更新"
                    date="2024-04-22"
                    description="新能源及传统制造行业面临新的合规要求。"
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">风险雷达图</h3>
              <RiskRadarChart className="h-96" />
            </div>
          </CardContent>
        </Card>

        {/* Data Source Management */}
        <Card>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">数据源与报告管理</h2>
          </div>
          <CardContent className="p-6 border-t border-[var(--border-primary)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">数据来源</h3>
                <p className="text-sm text-[var(--text-secondary)] p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  国家统计局、XX研究院、全球科技新闻聚合
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    管理数据源
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    上传内部报告
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    订阅最新报告
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">我的宏观环境报告</h3>
                <div className="space-y-2">
                  <ReportItem
                    title="2025年Q3宏观经济影响分析报告"
                    onView={() => handleViewReport('2025年Q3宏观经济影响分析报告')}
                    onExport={() => handleExportReport('2025年Q3宏观经济影响分析报告')}
                  />
                  <ReportItem
                    title="AI技术发展对广告行业的影响评估"
                    onView={() => handleViewReport('AI技术发展对广告行业的影响评估')}
                    onExport={() => handleExportReport('AI技术发展对广告行业的影响评估')}
                  />
                  <ReportItem
                    title="新能源汽车市场政策解读与机遇分析"
                    onView={() => handleViewReport('新能源汽车市场政策解读与机遇分析')}
                    onExport={() => handleExportReport('新能源汽车市场政策解读与机遇分析')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default MacroMonitoringPage;