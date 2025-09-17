'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import MiniTrendChart from '@/components/charts/MiniTrendChart';
import ConversationTypePieChart from '@/components/charts/ConversationTypePieChart';
import HourlyConversationChart from '@/components/charts/HourlyConversationChart';
import {
  Calendar,
  Download,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  Upload,
  FileText,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

// 统计卡片组件的类型定义
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  chartData: Array<{ x: number; y: number }>;
  chartColor: string;
}

// 统计卡片组件
const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, chartData, chartColor }) => {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="relative group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <span className="text-sm text-[var(--text-secondary)] font-medium">{title}</span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-[var(--primary-color)]" />
          </button>
        </div>
        <p className="text-3xl font-bold mt-2 text-[var(--text-primary)]">{value}</p>
        <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <TrendIcon className="w-4 h-4 mr-1" />
          <span>{change} 较上月</span>
        </div>

        {/* 迷你趋势图 */}
        <div className="mt-2">
          <MiniTrendChart data={chartData} color={chartColor} />
        </div>
      </CardContent>
    </Card>
  );
};

// 示例数据
const statCardsData = [
  {
    title: '总接待人数',
    value: '12,845',
    change: '12.5%',
    isPositive: true,
    chartData: [
      { x: 0, y: 20 }, { x: 1, y: 15 }, { x: 2, y: 25 }, { x: 3, y: 18 },
      { x: 4, y: 22 }, { x: 5, y: 12 }, { x: 6, y: 18 }, { x: 7, y: 15 }
    ],
    chartColor: '#3b82f6'
  },
  {
    title: '总对话量',
    value: '45,218',
    change: '8.3%',
    isPositive: true,
    chartData: [
      { x: 0, y: 30 }, { x: 1, y: 25 }, { x: 2, y: 28 }, { x: 3, y: 22 },
      { x: 4, y: 26 }, { x: 5, y: 18 }, { x: 6, y: 22 }, { x: 7, y: 18 }
    ],
    chartColor: '#8b5cf6'
  },
  {
    title: '平均对话时长',
    value: '4m 23s',
    change: '2.1%',
    isPositive: false,
    chartData: [
      { x: 0, y: 15 }, { x: 1, y: 20 }, { x: 2, y: 14 }, { x: 3, y: 18 },
      { x: 4, y: 12 }, { x: 5, y: 16 }, { x: 6, y: 10 }, { x: 7, y: 14 }
    ],
    chartColor: '#10b981'
  },
  {
    title: '客户满意度',
    value: '92.7%',
    change: '3.2%',
    isPositive: true,
    chartData: [
      { x: 0, y: 25 }, { x: 1, y: 20 }, { x: 2, y: 22 }, { x: 3, y: 15 },
      { x: 4, y: 18 }, { x: 5, y: 12 }, { x: 6, y: 16 }, { x: 7, y: 13 }
    ],
    chartColor: '#f59e0b'
  },
  {
    title: '对话转接成功率',
    value: '87.3%',
    change: '5.8%',
    isPositive: true,
    chartData: [
      { x: 0, y: 18 }, { x: 1, y: 22 }, { x: 2, y: 16 }, { x: 3, y: 20 },
      { x: 4, y: 14 }, { x: 5, y: 18 }, { x: 6, y: 12 }, { x: 7, y: 16 }
    ],
    chartColor: '#3b82f6'
  },
  {
    title: '总体转化率',
    value: '18.4%',
    change: '1.2%',
    isPositive: true,
    chartData: [
      { x: 0, y: 28 }, { x: 1, y: 22 }, { x: 2, y: 25 }, { x: 3, y: 18 },
      { x: 4, y: 22 }, { x: 5, y: 16 }, { x: 6, y: 20 }, { x: 7, y: 15 }
    ],
    chartColor: '#ef4444'
  }
];

// 客户满意度趋势数据
const satisfactionTrendData = [
  { month: '1月', satisfaction: 89 },
  { month: '2月', satisfaction: 94 },
  { month: '3月', satisfaction: 91 },
  { month: '4月', satisfaction: 87 },
  { month: '5月', satisfaction: 90 },
  { month: '6月', satisfaction: 93 }
];

// 对话量趋势数据
const conversationTrendData = [
  { day: '周一', ai: 3200, human: 1800, transfer: 1200 },
  { day: '周二', ai: 3600, human: 1600, transfer: 1400 },
  { day: '周三', ai: 2800, human: 1200, transfer: 1000 },
  { day: '周四', ai: 4200, human: 2200, transfer: 1600 },
  { day: '周五', ai: 4600, human: 2400, transfer: 1800 },
  { day: '周六', ai: 4800, human: 2600, transfer: 2000 },
  { day: '周日', ai: 4900, human: 2800, transfer: 2200 }
];

const SalesOperationAnalyticsPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="销售运营数据与分析"
      description="全面监控智能销售与人工团队的绩效表现，驱动销售策略优化"
      breadcrumbs={[
        { label: '智能销售赋能', href: '#' },
        { label: '销售运营数据与分析', href: '/sales-intelligent-operation-analytics', current: true }
      ]}
    >
      {/* 时间筛选器 */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center space-x-1 lg:space-x-2 bg-white p-1 rounded-md border border-gray-200 text-sm overflow-x-auto">
          <button className="px-2 lg:px-3 py-1 rounded whitespace-nowrap">今日</button>
          <button className="px-2 lg:px-3 py-1 rounded whitespace-nowrap">本周</button>
          <button className="px-2 lg:px-3 py-1 rounded bg-[var(--primary-color)] text-white shadow whitespace-nowrap">本月</button>
          <button className="px-2 lg:px-3 py-1 rounded flex items-center whitespace-nowrap">
            自定义 <Calendar className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
        {statCardsData.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* 趋势图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 客户满意度趋势 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">客户满意度趋势</h3>
              <div className="flex items-center space-x-3 text-gray-400">
                <RefreshCw className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
                <Download className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
                <ExternalLink className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={satisfactionTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6e6e73' }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6e6e73' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', stroke: 'white', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 对话量趋势 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">对话量趋势</h3>
              <div className="flex items-center space-x-3 text-gray-400">
                <RefreshCw className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
                <Download className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
                <ExternalLink className="w-5 h-5 cursor-pointer hover:text-[var(--primary-color)]" />
              </div>
            </div>
            <div className="flex justify-end items-center mb-2 text-sm space-x-4">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span>AI对话
              </div>
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>人工对话
              </div>
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full mr-2"></span>转接对话
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={conversationTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6e6e73' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6e6e73' }}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Line
                    type="monotone"
                    dataKey="ai"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="human"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transfer"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 团队绩效与排名 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI团队绩效 */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">人工智能团队绩效</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">团队绩效概览</h4>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-y-6 mt-4">
                <div>
                  <span className="text-sm text-[var(--text-secondary)]">平均响应时间</span>
                  <p className="text-2xl font-bold mt-1 text-[var(--text-primary)]">1m 12s</p>
                  <div className="flex items-center text-sm mt-1 text-red-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span>8.7%</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-[var(--text-secondary)]">问题解决率</span>
                  <p className="text-2xl font-bold mt-1 text-[var(--text-primary)]">94.2%</p>
                  <div className="flex items-center text-sm mt-1 text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>3.5%</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-[var(--text-secondary)]">客户满意度</span>
                  <p className="text-2xl font-bold mt-1 text-[var(--text-primary)]">96.8%</p>
                  <div className="flex items-center text-sm mt-1 text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>2.1%</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-[var(--text-secondary)]">转化率</span>
                  <p className="text-2xl font-bold mt-1 text-[var(--text-primary)]">23.5%</p>
                  <div className="flex items-center text-sm mt-1 text-red-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span>1.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 销售代表排名 */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">销售代表排名</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <button className="px-2 py-1 text-gray-500 rounded">本季度</button>
                </div>
              </div>
              <div className="space-y-3">
                {/* 排名列表 */}
                {[
                  { rank: 1, name: '张明', avatar: '/images/avatars/sales-rep-1.jpg', sales: '¥385,000', increase: '+24%', bgColor: 'bg-blue-50' },
                  { rank: 2, name: '李华', avatar: '/images/avatars/sales-rep-2.jpg', sales: '¥342,000', increase: '+18%', bgColor: 'bg-green-50' },
                  { rank: 3, name: '王芳', avatar: '/images/avatars/sales-rep-3.jpg', sales: '¥298,000', increase: '+15%', bgColor: 'bg-yellow-50' },
                  { rank: 4, name: '赵强', avatar: '/images/avatars/sales-rep-4.jpg', sales: '¥276,000', increase: '+12%', bgColor: 'bg-gray-50' },
                  { rank: 5, name: '孙丽', avatar: '/images/avatars/sales-rep-5.jpg', sales: '¥245,000', increase: '+8%', bgColor: 'bg-gray-50' }
                ].map((rep) => (
                  <div key={rep.rank} className={`flex items-center p-3 rounded-lg ${rep.bgColor}`}>
                    <div className="flex items-center w-2/5">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                        rep.rank === 1 ? 'bg-blue-500 text-white' :
                        rep.rank === 2 ? 'bg-green-500 text-white' :
                        rep.rank === 3 ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {rep.rank}
                      </span>
                      <Image
                        src={rep.avatar}
                        alt={rep.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full ml-4"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-[var(--text-primary)]">{rep.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">销售顾问</p>
                      </div>
                    </div>
                    <div className="w-1/5 text-center">
                      <p className="font-bold text-[var(--text-primary)]">{rep.sales}</p>
                    </div>
                    <div className="w-1/5 text-center">
                      <span className="text-green-600 font-semibold">{rep.increase}</span>
                    </div>
                    <div className="w-1/5 text-right">
                      <Badge variant="secondary" className="text-xs">详情</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 客户行为分析 */}
      <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">客户行为分析</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 客户旅程地图 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">客户旅程地图</h3>
                <ExternalLink className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[var(--primary-color)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-2">
                <div className="text-center p-2 sm:p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">认知</p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">12,548</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--border-primary)] mx-auto hidden sm:block" />
                <div className="text-center p-2 sm:p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">兴趣</p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">8,745</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--border-primary)] mx-auto hidden sm:block" />
                <div className="text-center p-2 sm:p-3 rounded-lg border bg-blue-50 border-blue-200">
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">决策</p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">5,214</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--border-primary)] mx-auto hidden sm:block" />
                <div className="text-center p-2 sm:p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">购买</p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">3,876</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--border-primary)] mx-auto hidden sm:block" />
                <div className="text-center p-2 sm:p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <p className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">复购</p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">1,542</p>
                </div>
              </div>
            </div>

            {/* 热门行为路径 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">热门行为路径</h3>
                <ExternalLink className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[var(--primary-color)]" />
              </div>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 font-semibold text-[var(--text-primary)]">
                      <span>首页</span>
                      <ArrowRight className="w-4 h-4 text-[var(--border-primary)]" />
                      <span>产品列表</span>
                      <ArrowRight className="w-4 h-4 text-[var(--border-primary)]" />
                      <span>详情页</span>
                      <ArrowRight className="w-4 h-4 text-[var(--border-primary)]" />
                      <span>购买</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-600 text-xs font-semibold">转化率 28.7%</Badge>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">访问量:4,521 平均停留:8m 42s 跳出率:32.5%</p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 font-semibold text-[var(--text-primary)]">
                      <span>首页</span>
                      <ArrowRight className="w-4 h-4 text-[var(--border-primary)]" />
                      <span>优惠活动</span>
                      <ArrowRight className="w-4 h-4 text-[var(--border-primary)]" />
                      <span>详情页</span>
                      <ArrowRight className="w-4 h-4 text-[var(--border-primary)]" />
                      <span>购买</span>
                    </div>
                    <Badge className="bg-teal-100 text-teal-600 text-xs font-semibold">转化率 35.2%</Badge>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">访问量:3,245 平均停留:6m 18s 跳出率:28.3%</p>
                </div>

                {/* 行为洞察 */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800 mb-1">行为洞察</p>
                      <p className="text-yellow-700">包含咨询环节的路径转化率显著高于其他路径，平均高出15.3个百分点。建议在关键决策节点增加咨询入口。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 自定义上传内容分析 */}
      <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">自定义上传内容分析</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 文件上传区域 */}
            <div>
              <h3 className="font-semibold text-lg mb-2">上传数据文件</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">支持CSV、Excel格式，最大20MB</p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-4 text-[var(--text-primary)] font-semibold">拖放文件到此处或点击上传</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">支持 .csv, .xlsx, .xls 格式文件</p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  选择文件
                </button>
              </div>

              {/* 最近上传文件 */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">最近上传</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-green-500" />
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">销售数据_202306.xlsx</p>
                        <p className="text-xs text-[var(--text-secondary)]">2023/06/15 • 2.4MB</p>
                      </div>
                    </div>
                    <X className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">客户调研数据.csv</p>
                        <p className="text-xs text-[var(--text-secondary)]">2023/06/10 • 1.8MB</p>
                      </div>
                    </div>
                    <X className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* 分析结果 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">分析结果</h3>
                <Badge className="bg-green-100 text-green-700 text-sm font-semibold">分析完成</Badge>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-green-500 mr-2" />
                  <span>销售数据_202306.xlsx</span>
                </div>
                <button className="text-blue-600 font-semibold hover:underline">更换</button>
              </div>

              {/* 数据统计 */}
              <div className="grid grid-cols-3 gap-4 text-center mt-4">
                <div>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">15,842</p>
                  <p className="text-sm text-[var(--text-secondary)]">数据总量</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">96.7%</p>
                  <p className="text-sm text-[var(--text-secondary)]">数据有效率</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-500">521</p>
                  <p className="text-sm text-[var(--text-secondary)]">异常值</p>
                </div>
              </div>

              {/* 数据分布图表 */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">数据分布</h4>
                <div className="h-48">
                  <svg width="100%" height="100%" viewBox="0 0 400 150">
                    <g className="bars" fill="#3b82f6">
                      <rect x="20" y="70" width="40" height="60" rx="4"></rect>
                      <rect x="80" y="60" width="40" height="70" rx="4"></rect>
                      <rect x="140" y="40" width="40" height="90" rx="4"></rect>
                      <rect x="200" y="90" width="40" height="40" rx="4"></rect>
                      <rect x="260" y="75" width="40" height="55" rx="4"></rect>
                      <rect x="320" y="100" width="40" height="30" rx="4"></rect>
                    </g>
                    <g className="labels" fill="#6e6e73" fontSize="12" textAnchor="middle">
                      <text x="40" y="145">华东</text>
                      <text x="100" y="145">华南</text>
                      <text x="160" y="145">华北</text>
                      <text x="220" y="145">西部</text>
                      <text x="280" y="145">中部</text>
                      <text x="340" y="145">海外</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* 异常数据警告 */}
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">发现异常数据模式</p>
                  <p className="text-yellow-700">西部区域6月销售额较历史平均水平低32.7%，且退货率高出行业平均15.2个百分点，建议进一步核查。</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 自定义报告生成 */}
      <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">自定义报告生成</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* 报告模板选择 */}
                <div>
                  <h3 className="font-semibold mb-3">报告模板</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 rounded-lg border text-sm bg-blue-50 border-blue-500 font-semibold">
                      销售周报模板
                      <p className="text-xs text-[var(--text-secondary)] font-normal mt-1">包含销售数据、趋势分析和预测</p>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">
                      客户分析报告
                      <p className="text-xs text-[var(--text-secondary)] font-normal mt-1">包含客户画像、行为分析和分群</p>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">
                      绩效评估报告
                      <p className="text-xs text-[var(--text-secondary)] font-normal mt-1">包含团队和个人绩效分析</p>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-dashed border-gray-300 text-sm text-[var(--text-secondary)] hover:bg-gray-50 transition-colors">
                      + 创建自定义模板
                    </button>
                  </div>
                </div>

                {/* 报告参数设置 */}
                <div>
                  <h3 className="font-semibold mb-3">报告参数</h3>
                  <div className="space-y-4">
                    {/* 时间范围 */}
                    <div>
                      <label className="text-sm font-medium mb-1 block">时间范围</label>
                      <Select defaultValue="month">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择时间范围" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">今日</SelectItem>
                          <SelectItem value="week">本周</SelectItem>
                          <SelectItem value="month">本月</SelectItem>
                          <SelectItem value="quarter">本季度</SelectItem>
                          <SelectItem value="custom">自定义</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 数据维度 */}
                    <div>
                      <p className="text-sm font-medium mb-2">数据维度</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="region" defaultChecked />
                          <label htmlFor="region" className="text-sm text-[var(--text-primary)]">区域维度</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="product" defaultChecked />
                          <label htmlFor="product" className="text-sm text-[var(--text-primary)]">产品线维度</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sales-rep" defaultChecked />
                          <label htmlFor="sales-rep" className="text-sm text-[var(--text-primary)]">销售代表维度</label>
                        </div>
                      </div>
                    </div>

                    {/* 包含内容 */}
                    <div>
                      <p className="text-sm font-medium mb-2">包含内容</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="overview" defaultChecked />
                          <label htmlFor="overview" className="text-sm text-[var(--text-primary)]">数据概览</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="trend" defaultChecked />
                          <label htmlFor="trend" className="text-sm text-[var(--text-primary)]">趋势分析</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="alert" defaultChecked />
                          <label htmlFor="alert" className="text-sm text-[var(--text-primary)]">异常预警</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="forecast" defaultChecked />
                          <label htmlFor="forecast" className="text-sm text-[var(--text-primary)]">预测分析</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="suggestions" defaultChecked />
                          <label htmlFor="suggestions" className="text-sm text-[var(--text-primary)]">建议措施</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 输出设置 */}
                <div>
                  <h3 className="font-semibold mb-3">输出设置</h3>
                  <div className="space-y-4">
                    {/* 输出格式 */}
                    <div>
                      <p className="text-sm font-medium mb-2">输出格式</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 rounded-lg border text-sm bg-blue-50 border-blue-500 font-semibold transition-colors">PDF</button>
                        <button className="py-2 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">Excel</button>
                        <button className="py-2 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">PPT</button>
                        <button className="py-2 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">Word</button>
                      </div>
                    </div>

                    {/* 报告样式 */}
                    <div>
                      <p className="text-sm font-medium mb-2">报告样式</p>
                      <div className="space-y-2">
                        <button className="w-full text-center py-2 rounded-lg border text-sm bg-blue-50 border-blue-500 font-semibold transition-colors">正式风格</button>
                        <button className="w-full text-center py-2 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">简洁风格</button>
                        <button className="w-full text-center py-2 rounded-lg border text-sm border-gray-200 hover:bg-gray-50 transition-colors">数据密集型</button>
                      </div>
                    </div>

                    {/* 自动发送开关 */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium">自动发送</span>
                      <div className="w-10 h-5 bg-gray-300 rounded-full flex items-center p-0.5 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 生成按钮区域 */}
            <div className="md:col-span-1 flex flex-col justify-end">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                生成报告
              </button>
              <p className="text-xs text-center text-[var(--text-secondary)] mt-2">预计生成时间: 15-30秒</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 智能销售员绩效 */}
      <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">智能销售员绩效</h2>
            <button className="text-sm text-[var(--primary-color)] hover:underline">查看全部智能销售员</button>
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧分析图表区 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 对话类型分析饼图 */}
              <div className="p-4 border border-[var(--border-primary)] rounded-lg">
                <ConversationTypePieChart />
              </div>

              {/* 关键词词云 */}
              <div className="p-4 border border-[var(--border-primary)] rounded-lg">
                <h3 className="font-semibold text-center mb-4">核心关键词词云</h3>
                <div className="text-center p-4 leading-relaxed">
                  <span className="font-semibold text-purple-600 text-2xl mx-1">使用教程</span>
                  <span className="font-semibold text-red-500 text-xl mx-1">优惠活动</span>
                  <span className="font-semibold text-blue-600 text-lg mx-1">售后服务</span>
                  <span className="font-semibold text-green-600 text-lg mx-1">技术支持</span>
                  <span className="font-semibold text-gray-500 text-md mx-1">安装指南</span>
                  <span className="font-semibold text-orange-500 text-xl mx-1">退款政策</span>
                  <span className="font-semibold text-indigo-500 text-lg mx-1">会员权益</span>
                </div>
              </div>
            </div>

            {/* 右侧详细分析区 */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI表现总结 */}
              <div className="p-4 border border-[var(--border-primary)] rounded-lg">
                <h3 className="font-semibold">AI数字顾问表现总结</h3>
                <div className="flex items-center mt-2">
                  <span className="text-sm">本月表现评分: <span className="font-bold text-lg text-green-600">94.5/100</span></span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{width: '94.5%'}}></div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">核心优势</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <span className="w-4 h-4 rounded bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs font-bold">✓</span>
                      客户问题解决率高达92.3%，超出目标值7.3%
                    </p>
                    <p className="flex items-center">
                      <span className="w-4 h-4 rounded bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs font-bold">✓</span>
                      平均响应时间0.8秒，远低于行业平均水平
                    </p>
                    <p className="flex items-center">
                      <span className="w-4 h-4 rounded bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs font-bold">✓</span>
                      工作时间覆盖率100%，无间断服务客户
                    </p>
                  </div>
                </div>
                <p className="text-sm bg-gray-50 p-3 rounded-md mt-4 text-[var(--text-secondary)]">
                  &ldquo;AI数字顾问成功处理了87.6%的客户咨询，为人工销售节省了约320小时的工作时间，相当于40个工作日。&rdquo;
                </p>
              </div>

              {/* 时间点对话人数分析 */}
              <div className="p-4 border border-[var(--border-primary)] rounded-lg">
                <HourlyConversationChart />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 对话记录 */}
      <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">对话记录</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Filter className="w-4 h-4 mr-1" />
                筛选
              </button>
              <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-1" />
                导出
              </button>
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">状态</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="transferred">已转接</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">类型</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="ai">AI对话</SelectItem>
                  <SelectItem value="human">人工对话</SelectItem>
                  <SelectItem value="transfer">转接对话</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-sm font-medium mb-1 block">搜索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="搜索客户姓名、ID或智能销售员..."
                />
              </div>
            </div>
          </div>

          {/* 对话记录表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">对话ID</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">客户</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">智能销售员</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">类型</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">开始时间</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">时长</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">满意度</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">状态</th>
                  <th className="text-left p-3 text-sm font-semibold text-[var(--text-primary)]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: 'C20240615001', customer: '李明', agent: 'AI-小智', type: 'AI对话', time: '2024-06-15 09:15', duration: '8m 23s', rating: '5.0', status: '已完成' },
                  { id: 'C20240615002', customer: '王芳', agent: 'AI-助手', type: 'AI对话', time: '2024-06-15 10:32', duration: '12m 45s', rating: '4.8', status: '已完成' },
                  { id: 'C20240615003', customer: '张强', agent: '人工-小丽', type: '转接对话', time: '2024-06-15 11:28', duration: '25m 12s', rating: '4.9', status: '已完成' },
                  { id: 'C20240615004', customer: '刘华', agent: 'AI-顾问', type: 'AI对话', time: '2024-06-15 14:05', duration: '6m 18s', rating: '4.7', status: '已完成' },
                  { id: 'C20240615005', customer: '陈丽', agent: 'AI-小智', type: 'AI对话', time: '2024-06-15 15:22', duration: '正在进行', rating: '-', status: '进行中' },
                  { id: 'C20240615006', customer: '赵伟', agent: '人工-小明', type: '人工对话', time: '2024-06-15 16:10', duration: '18m 35s', rating: '5.0', status: '已完成' }
                ].map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-[var(--text-primary)] font-mono">{record.id}</td>
                    <td className="p-3 text-sm text-[var(--text-primary)]">{record.customer}</td>
                    <td className="p-3 text-sm text-[var(--text-primary)]">{record.agent}</td>
                    <td className="p-3 text-sm">
                      <Badge className={`text-xs ${
                        record.type === 'AI对话' ? 'bg-blue-100 text-blue-600' :
                        record.type === '人工对话' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {record.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-[var(--text-secondary)]">{record.time}</td>
                    <td className="p-3 text-sm text-[var(--text-primary)]">{record.duration}</td>
                    <td className="p-3 text-sm">
                      {record.rating !== '-' ? (
                        <div className="flex items-center">
                          <span className="font-semibold text-yellow-600">{record.rating}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      <Badge className={`text-xs ${
                        record.status === '已完成' ? 'bg-green-100 text-green-600' :
                        record.status === '进行中' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页组件 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
            <p className="text-sm text-[var(--text-secondary)] text-center sm:text-left">显示 1-6 条，共 156 条记录</p>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <button className="p-2 rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-2 sm:px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">1</button>
              <button className="px-2 sm:px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm">2</button>
              <button className="px-2 sm:px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm">3</button>
              <span className="px-1 sm:px-2 text-sm text-[var(--text-secondary)]">...</span>
              <button className="px-2 sm:px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm">26</button>
              <button className="p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolPageLayout>
  );
};

export default SalesOperationAnalyticsPage;