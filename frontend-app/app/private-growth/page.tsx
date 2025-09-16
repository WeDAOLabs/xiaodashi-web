'use client';

import React from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis } from 'recharts';
import {
  Eye,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  MessageCircle,
  Mail,
  Phone,
  ChevronLeft,
  Users,
  FileDown
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle?: string;
  chart?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, subtitle, chart }) => (
  <Card className="relative group">
    <CardContent className="p-5">
      <button
        className="absolute top-4 right-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`查看${title}详情`}
      >
        <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </button>
      <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
      <div className="flex justify-between items-baseline mt-2">
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
        {subtitle && <p className="text-xs text-[var(--text-tertiary)]">{subtitle}</p>}
      </div>
      <div className="flex items-center text-sm mt-1">
        <div className={`flex items-center font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
        <p className="text-[var(--text-secondary)] ml-1.5">月环比</p>
      </div>
      {chart && (
        <div className="h-20 w-full mt-3 -mb-2">
          {chart}
        </div>
      )}
    </CardContent>
  </Card>
);

interface TrendChartProps {
  data: Array<{ month: string; value: number }>;
  color: string;
  dataKey: string;
  label: string;
  formatValue?: (value: number) => string;
}

const TrendChart: React.FC<TrendChartProps> = React.memo(({ data, color, dataKey, label, formatValue }) => {
  const chartConfig = React.useMemo(() => ({
    [dataKey]: {
      label: label,
      color: color,
    },
  }), [dataKey, label, color]);

  const tooltipFormatter = React.useCallback(
    (value: unknown) => [
      formatValue && typeof value === 'number' ? formatValue(value) : typeof value === 'number' ? value.toLocaleString() : String(value),
      label
    ] as [React.ReactNode, string],
    [formatValue, label]
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RechartsLineChart data={[...data]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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

// 示例数据 - 移到组件外部避免重复创建
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

const REPURCHASE_DATA = [
  { month: 'Jan', value: 33 },
  { month: 'Feb', value: 34 },
  { month: 'Mar', value: 35 },
];

const BarChart: React.FC = () => (
  <div className="flex items-end justify-around h-full">
    <div className="text-center">
      <div className="h-full flex items-end">
        <div className="w-8 bg-blue-500 rounded-t-sm h-[75%]" />
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-1">微信活码</p>
      <p className="text-xs font-semibold text-[var(--text-primary)]">45%</p>
    </div>
    <div className="text-center">
      <div className="h-full flex items-end">
        <div className="w-8 bg-purple-500 rounded-t-sm h-[50%]" />
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-1">扫码领券</p>
      <p className="text-xs font-semibold text-[var(--text-primary)]">30%</p>
    </div>
    <div className="text-center">
      <div className="h-full flex items-end">
        <div className="w-8 bg-green-500 rounded-t-sm h-[41.6%]" />
      </div>
      <p className="text-xs text-[var(--text-secondary)] mt-1">社群裂变</p>
      <p className="text-xs font-semibold text-[var(--text-primary)]">25%</p>
    </div>
  </div>
);

interface FeedbackItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ icon, text }) => (
  <li className="flex items-start gap-3">
    {icon}
    <span>{text}</span>
  </li>
);

interface CustomerCardProps {
  avatar: string;
  name: string;
  tag: string;
  tagColor: string;
  lastPurchase: string;
  avgOrderValue: string;
  frequency: string;
  aiRecommendation: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  avatar,
  name,
  tag,
  tagColor,
  lastPurchase,
  avgOrderValue,
  frequency,
  aiRecommendation
}) => (
  <div className="border-b border-[var(--border-primary)] last:border-b-0 py-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Image
          src={avatar}
          alt={name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== '/images/customers/default-avatar.png') {
              target.src = '/images/customers/default-avatar.png';
            }
          }}
        />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-[var(--text-primary)]">{name}</h4>
            <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor}`}>
              {tag}
            </Badge>
          </div>
          <div className="flex items-center gap-5 text-xs text-[var(--text-secondary)] mt-2">
            <div className="flex items-center gap-1.5">
              <span>最近购买: {lastPurchase}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>历史客单价: {avgOrderValue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>购买频次: {frequency}</span>
            </div>
          </div>
          <div className="mt-3 text-sm bg-[var(--color-primary-50)] text-[var(--color-primary-500)] p-3 rounded-md max-w-2xl">
            <span className="font-semibold">AI推荐: </span>
            <span>{aiRecommendation}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]"
          aria-label={`发送消息给${name}`}
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]"
          aria-label={`发送邮件给${name}`}
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]"
          aria-label={`拨打电话给${name}`}
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
);

const PrivateGrowthPage: React.FC = () => {
  return (
    <DashboardLayout
      title="AI私域客户洞察中心"
      breadcrumbs={[
        { label: '增长与运营执行', href: '#' },
        { label: '智能私域增长与运营', href: '#' },
        { label: 'AI私域客户洞察中心', href: '/private-growth', current: true }
      ]}
    >
      <div className="p-6 lg:p-8 flex-1">
        <div className="mb-6">
          <p className="text-[var(--text-secondary)]">通过AI深度挖掘私域客户数据，驱动产品优化与销售增长</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="私域销售额趋势"
            value="¥800,000"
            change="25%"
            isPositive={true}
            subtitle="占总销售额 35%"
            chart={
              <TrendChart
                data={SALES_TREND_DATA}
                color="#10b981"
                dataKey="value"
                label="销售额"
                formatValue={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
            }
          />
          <StatCard
            title="平均客单价趋势"
            value="¥180"
            change="8%"
            isPositive={true}
            chart={
              <TrendChart
                data={PRICE_DATA}
                color="#3b82f6"
                dataKey="value"
                label="客单价"
                formatValue={(value) => `¥${value}`}
              />
            }
          />
          <StatCard
            title="复购率趋势"
            value="35%"
            change="2%"
            isPositive={true}
            chart={
              <TrendChart
                data={REPURCHASE_DATA}
                color="#8b5cf6"
                dataKey="value"
                label="复购率"
                formatValue={(value) => `${value}%`}
              />
            }
          />
          <Card className="relative group">
            <CardContent className="p-5">
              <button className="absolute top-4 right-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4" />
              </button>
              <p className="text-sm text-[var(--text-secondary)] font-medium">新增私域客户数</p>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">1,200</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">本周新增私域活码客户</p>
              <div className="flex items-center text-sm mt-1">
                <div className="flex items-center text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-semibold text-xs">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  <span>18%</span>
                </div>
              </div>
              <div className="h-20 w-full mt-3 -mb-2">
                <BarChart />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
            aria-label="刷新仪表板数据"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            刷新数据
          </button>
        </div>

        {/* AI Analysis & Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI用户调研分析</h2>
            <div className="mt-4">
              <h3 className="font-semibold">用户需求洞察报告</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">基于近30天私域聊天记录与购买行为分析</p>
              <p className="mt-3 text-sm text-[var(--text-primary)] leading-relaxed">
                AI识别: 用户对 <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">低糖</span>、
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">新鲜水果</span>
                蛋糕的需求在夏季增长<span className="font-bold text-[var(--primary-color)]">20%</span>,
                同时对<span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">儿童生日蛋糕卡通造型</span>
                的提及度上升<span className="font-bold text-[var(--primary-color)]">15%</span>。
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mt-4 text-sm text-yellow-800">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">季节性趋势洞察</h4>
                    <p className="mt-1">随着夏季来临, 「冰淇淋蛋糕」相关咨询量环比增长35%, 建议增加冷藏配送包装方案</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Button className="flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  查看完整调研报告
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  下载调研报告
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">热门话题与关键词</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">基于近30天私域聊天记录分析</p>
            <div className="mt-4 h-48 bg-[var(--color-primary-50)] rounded-md flex items-center justify-center text-[var(--color-primary-500)]">
              <p>关键词云图</p>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] text-right mt-4">数据更新时间: 2025-09-15 08:30</p>
          </div>
        </div>

        {/* Pain Points & Suggestions */}
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm mt-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">产品痛点/建议提炼</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">基于AI语义分析近90天客户反馈与评价</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              查看全部客户反馈
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
            <div>
              <h3 className="font-semibold mb-3">产品相关</h3>
              <ul className="space-y-2.5 text-sm">
                <FeedbackItem
                  icon={<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                  text="部分客户反馈「芝士蛋糕口感偏甜」，尤其30-40岁女性客户提及率高"
                />
                <FeedbackItem
                  icon={<CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
                  text="希望增加「无麸质」和「低糖」选项, 健康意识客户群体增长15%"
                />
                <FeedbackItem
                  icon={<AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  text="「6寸蛋糕适合2-3人」的场景需求明确, 但当前最小尺寸为8寸"
                />
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">服务相关</h3>
              <ul className="space-y-2.5 text-sm">
                <FeedbackItem
                  icon={<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                  text="「配送时效不稳定」问题反馈增加, 周末高峰期延迟率达12%"
                />
                <FeedbackItem
                  icon={<AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  text="期望「客服响应速度更快」, 当前平均响应时间为45秒, 行业标杆为20秒"
                />
                <FeedbackItem
                  icon={<CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
                  text="高端定制蛋糕客户希望提供「一对一设计咨询」服务, 愿为此支付溢价"
                />
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Lists */}
        <div className="mt-8 space-y-8">
          {/* High Value Customers */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">高价值活跃客户</h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  全部客户
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  导出客户清单
                </Button>
              </div>
            </div>
            <div className="mt-3 px-4 py-2 rounded-md text-sm bg-blue-50 text-blue-700">
              筛选条件: 近3个月购买≥3次, 累计GMV≥500元
            </div>
            <Card className="mt-1">
              <CardContent className="px-6">
                <CustomerCard
                  avatar="/images/customers/customer-1.jpg"
                  name="小蛋糕爱好者"
                  tag="VIP客户"
                  tagColor="bg-purple-100 text-purple-800"
                  lastPurchase="2025-08-30"
                  avgOrderValue="¥250"
                  frequency="月均2.3次"
                  aiRecommendation="该客户偏爱巧克力系列，对新品尝鲜度高，建议推荐【新品黑森林蛋糕】。"
                />
                <CustomerCard
                  avatar="/images/customers/customer-2.jpg"
                  name="节日定制达人"
                  tag="高潜力"
                  tagColor="bg-green-100 text-green-800"
                  lastPurchase="2025-09-01"
                  avgOrderValue="¥380"
                  frequency="月均1.2次"
                  aiRecommendation="该客户常定制生日/节日蛋糕，建议在其生日或重要节日前发送【定制优惠券】。"
                />
                <CustomerCard
                  avatar="/images/customers/customer-3.jpg"
                  name="下午茶爱好者"
                  tag="批量采购"
                  tagColor="bg-blue-100 text-blue-800"
                  lastPurchase="2025-08-25"
                  avgOrderValue="¥220"
                  frequency="周均1次"
                  aiRecommendation="该客户每周四固定采购下午茶套餐，建议推出「企业下午茶周卡」提升复购。"
                />
              </CardContent>
            </Card>
            <div className="flex justify-between items-center mt-4 px-2">
              <p className="text-sm text-[var(--text-secondary)]">显示 1 到 3 条, 共 24 条</p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[var(--primary-color)] text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Churn Risk Customers */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">高价值流失预警客户</h2>
            </div>
            <div className="mt-3 px-4 py-2 rounded-md text-sm bg-orange-50 text-orange-700">
              筛选条件: 近2个月无购买, 历史客单价≥150元
            </div>
            <Card className="mt-1">
              <CardContent className="px-6">
                <CustomerCard
                  avatar="/images/customers/customer-5.jpg"
                  name="甜品探险家"
                  tag="流失预警"
                  tagColor="bg-orange-100 text-orange-800"
                  lastPurchase="2025-06-15"
                  avgOrderValue="¥150"
                  frequency="季均1次"
                  aiRecommendation="该客户近2月无复购，历史偏爱水果挞，建议通过短信发送【水果挞7折券】召回。"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="py-4"></div>
      </div>
    </DashboardLayout>
  );
};

export default PrivateGrowthPage;