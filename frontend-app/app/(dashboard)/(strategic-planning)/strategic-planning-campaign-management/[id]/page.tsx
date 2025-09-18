'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DetailLayout from '@/app/(dashboard)/(strategic-planning)/_components/DetailLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Edit,
  Copy,
  XCircle,
  Lightbulb,
  Calendar,
  Send,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, ResponsiveContainer, CartesianGrid } from 'recharts';

// 类型定义
interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
}

interface ChartData {
  name: string;
  budget: number;
  gmv: number;
}


// 任务项组件
const TaskItem: React.FC<{ task: TaskItem }> = React.memo(({ task }) => (
  <li className="p-3 bg-[var(--bg-tertiary)] rounded-md text-sm">
    <p className="font-medium text-[var(--text-primary)]">{task.title}</p>
    <div className="flex justify-between items-center mt-1 text-xs text-[var(--text-secondary)]">
      <span>{task.assignee}</span>
      <span className="flex items-center">
        <Calendar className="w-3 h-3 mr-1" />
        {task.dueDate}
      </span>
    </div>
  </li>
));
TaskItem.displayName = 'TaskItem';

// 渠道分发策略图表 - 横向柱状图
const ChannelChart: React.FC = React.memo(() => {
  const data: ChartData[] = [
    { name: '抖音', budget: 40, gmv: 30 },
    { name: '小红书', budget: 30, gmv: 25 },
    { name: '微信私域', budget: 20, gmv: 35 },
    { name: '微博', budget: 28, gmv: 20 }
  ];

  const chartConfig = {
    budget: {
      label: '预算',
      color: '#8884d8',
    },
    gmv: {
      label: 'GMV',
      color: '#82ca9d',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={80}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="budget" fill="var(--color-budget)" radius={2} />
        <Bar dataKey="gmv" fill="var(--color-gmv)" radius={2} />
      </BarChart>
    </ChartContainer>
  );
});
ChannelChart.displayName = 'ChannelChart';

// 实时效果追踪图表
const PerformanceChart: React.FC = React.memo(() => {
  const data = [
    { day: 'Day 1', exposure: 3500, conversion: 1200 },
    { day: 'Day 2', exposure: 4200, conversion: 1400 },
    { day: 'Day 3', exposure: 3800, conversion: 900 },
    { day: 'Day 4', exposure: 4800, conversion: 1800 },
    { day: 'Day 5', exposure: 4500, conversion: 1600 },
    { day: 'Day 6', exposure: 5200, conversion: 2100 },
    { day: 'Day 7', exposure: 4900, conversion: 1900 }
  ];

  const chartConfig = {
    exposure: {
      label: '曝光量',
      color: '#8884d8',
    },
    conversion: {
      label: '转化量',
      color: '#82ca9d',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="exposure"
            stroke="var(--color-exposure)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="conversion"
            stroke="var(--color-conversion)"
            strokeWidth={2}
            dot={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
});
PerformanceChart.displayName = 'PerformanceChart';

// 模拟数据
const mockCampaign = {
  id: '1',
  name: '夏季新品"冰爽系列"上市推广',
  status: 'progress' as const,
  manager: {
    name: '王伟',
    avatar: '/images/campaigns/avatar-1.jpg'
  },
  budget: {
    planned: 100000,
    actual: 85000
  },
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  riskAssessment: '低风险 (成功率 85%)',
  createDate: '2024-05-15',
  progress: 75
};

const mockTasks: TaskItem[] = [
  {
    id: '1',
    title: '设计"冰爽系列"主视觉海报',
    assignee: '张敏',
    dueDate: '2024-07-25'
  },
  {
    id: '2',
    title: '联系KOL进行内容排期',
    assignee: '李娜',
    dueDate: '2024-07-28'
  },
  {
    id: '3',
    title: '快闪店物料制作',
    assignee: '刘洋',
    dueDate: '2024-08-05'
  }
];

const CampaignDetailPage: React.FC = () => {
  const params = useParams();
  const campaignId = params.id as string;

  // 状态标签配置
  const statusConfig = {
    progress: { label: '进行中', className: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]' },
    pending: { label: '待开始', className: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]' },
    completed: { label: '已结束', className: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' },
    draft: { label: '草稿', className: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]' },
  };

  const statusBadge = statusConfig[mockCampaign.status];

  return (
    <DetailLayout
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '营销活动规划与管理', href: '/strategic-planning-campaign-management' },
        { label: mockCampaign.name, href: `/strategic-planning-campaign-management/${campaignId}`, current: true }
      ]}
      backButtonText="返回营销活动管理"
      backUrl="/strategic-planning-campaign-management"
    >
      {/* 活动基本信息头部 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{mockCampaign.name}</h1>
            <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge.className}`}>
              {statusBadge.label}
            </Badge>
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src={mockCampaign.manager.avatar} alt={mockCampaign.manager.name} />
                <AvatarFallback>{mockCampaign.manager.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-[var(--text-primary)]">{mockCampaign.manager.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
          >
            <Edit className="w-4 h-4" />
            编辑
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
          >
            <XCircle className="w-4 h-4" />
            结束活动
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
          >
            <Copy className="w-4 h-4" />
            复制
          </Button>
        </div>
      </div>

      {/* 活动基本信息卡片 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">活动基本信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">预算 (计划/实际)</p>
              <div className="mt-1 text-base text-[var(--text-primary)] font-medium">
                ¥{(mockCampaign.budget.planned / 10000).toFixed(1)}万 /
                <span className="text-[var(--text-secondary)]"> ¥{(mockCampaign.budget.actual / 10000).toFixed(1)}万</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">活动时间</p>
              <div className="mt-1 text-base text-[var(--text-primary)] font-medium">
                {mockCampaign.startDate} ~ {mockCampaign.endDate}
              </div>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">AI风险评估</p>
              <div className="mt-1 text-base font-medium">
                <span className="font-bold text-[var(--color-success-600)]">{mockCampaign.riskAssessment}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">创建日期</p>
              <div className="mt-1 text-base text-[var(--text-primary)] font-medium">{mockCampaign.createDate}</div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-[var(--text-secondary)] mb-2">活动时间线</p>
            <Progress value={mockCampaign.progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 活动方案与推广规划 - 左侧2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 活动方案与内容 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center">
                活动方案与内容
              </h3>
              <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-[var(--text-primary)]">活动背景</dt>
                    <dd className="mt-1">随着夏季来临，消费者对清凉解暑产品的需求激增。公司研发了全新的&ldquo;冰爽系列&rdquo;产品，旨在抢占夏季市场份额。</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--text-primary)]">目标人群</dt>
                    <dd className="mt-1">18-30岁的年轻人群，注重生活品质，活跃于社交媒体。</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--text-primary)]">活动主题</dt>
                    <dd className="mt-1">冰爽一夏，活力无限</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--text-primary)]">活动内容</dt>
                    <dd className="mt-1">通过线上社交媒体挑战赛、线下快闪店体验、KOL合作推广等多种形式，全面展示新品特性。</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--text-primary)]">执行计划</dt>
                    <dd className="mt-1">第一周：预热宣传；第二至八周：集中推广和销售；第九至十二周：效果评估和复盘。</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--text-primary)]">预期效果</dt>
                    <dd className="mt-1">实现GMV 50万，新增用户1万，品牌知名度提升20%。</dd>
                  </div>
                </dl>
              </div>
              <Button className="mt-4 flex items-center gap-2 bg-[var(--color-primary-100)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-200)]">
                <Sparkles className="w-5 h-5" />
                获取AI优化建议
              </Button>
            </CardContent>
          </Card>

          {/* 宣传推广规划 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">宣传推广规划</h3>
              <div className="space-y-6">
                {/* AI文案创意 */}
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    文案创意指导 (AI生成)
                  </h4>
                  <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg text-sm text-[var(--text-secondary)] space-y-2">
                    <p><strong>海报文案:</strong> &ldquo;一口冰爽，唤醒整个夏天！#冰爽系列# 全新上市，清凉来袭。&rdquo;</p>
                    <p><strong>推文内容:</strong> &ldquo;夏日续命神器来了！@智赢 全新冰爽系列，从舌尖到心底的透心凉。转发+评论，抽10位幸运儿送全套新品体验装！&rdquo;</p>
                  </div>
                </div>

                {/* 渠道分发策略 */}
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">渠道分发策略</h4>
                  <ChannelChart />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧1/3 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 飞书项目协同区 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">飞书项目协同区</h3>
              <ul className="space-y-3">
                {mockTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-4 w-full text-center bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                查看所有任务
              </Button>
            </CardContent>
          </Card>

          {/* 实时效果追踪 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">实时效果追踪</h3>
              <PerformanceChart />
              <Button className="mt-4 w-full flex items-center justify-center bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]">
                <Send className="w-5 h-5 mr-2" />
                生成优化任务
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DetailLayout>
  );
};

export default CampaignDetailPage;