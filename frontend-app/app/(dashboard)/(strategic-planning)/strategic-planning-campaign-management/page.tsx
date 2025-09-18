'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// 类型定义
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

type CampaignStatus = 'progress' | 'pending' | 'completed' | 'draft';
type CampaignType = '品牌宣传' | '新品推广' | '促销活动' | '会员活动';

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  manager: {
    name: string;
    avatar: string;
  };
  budget: {
    planned: number;
    actual: number;
  };
  startDate: string;
  endDate: string;
  roi: number;
  gmv: number;
  userGrowth: number;
}


interface CampaignRankingProps {
  campaigns: Campaign[];
}

interface CampaignTableProps {
  campaigns: Campaign[];
}

// 统计卡片组件
const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, subtitle }) => (
  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{value}</p>
      {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
));
StatCard.displayName = 'StatCard';

// 状态标签组件
const StatusBadge: React.FC<{ status: CampaignStatus }> = React.memo(({ status }) => {
  const statusConfig = {
    progress: { label: '进行中', className: 'bg-[var(--color-info-100)] text-[var(--color-info-600)]' },
    pending: { label: '待开始', className: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)]' },
    completed: { label: '已结束', className: 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' },
    draft: { label: '草稿', className: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]' },
  };

  const config = statusConfig[status];
  return (
    <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.className}`}>
      {config.label}
    </Badge>
  );
});
StatusBadge.displayName = 'StatusBadge';

// 活动状态分布饼图
const CampaignStatusChart: React.FC = React.memo(() => {
  const data = [
    { name: '进行中', value: 2, fill: 'var(--color-info-600)' },
    { name: '待开始', value: 1, fill: 'var(--color-warning-600)' },
    { name: '已结束', value: 1, fill: 'var(--color-success-600)' },
    { name: '草稿', value: 1, fill: 'var(--text-secondary)' }
  ];

  const chartConfig = {
    value: {
      label: "活动数量"
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">活动状态分布</h3>
        <div className="h-40 flex items-center justify-center">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-[var(--text-secondary)]">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
CampaignStatusChart.displayName = 'CampaignStatusChart';

// 活动效果榜单组件
const CampaignRanking: React.FC<CampaignRankingProps> = React.memo(({ campaigns }) => {
  const topCampaigns = campaigns
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">活动效果榜单 (按ROI)</h3>
        <ul className="space-y-4">
          {topCampaigns.map((campaign) => (
            <li key={campaign.id} className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/strategic-planning-campaign-management/${campaign.id}`}
                    className="font-semibold text-[var(--color-primary-500)] cursor-pointer hover:underline"
                  >
                    {campaign.name}
                  </Link>
                  <p className="text-xs text-[var(--text-secondary)]">{campaign.manager.name}</p>
                </div>
                <StatusBadge status={campaign.status} />
              </div>
              <div className="mt-3 flex justify-between items-center text-sm">
                <div className="text-center">
                  <p className="text-[var(--text-secondary)] text-xs">ROI</p>
                  <p className="font-bold text-[var(--color-success-600)] text-base">{campaign.roi}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[var(--text-secondary)] text-xs">GMV</p>
                  <p className="font-bold text-[var(--text-primary)]">¥{(campaign.gmv / 10000).toFixed(1)}万</p>
                </div>
                <div className="text-center">
                  <p className="text-[var(--text-secondary)] text-xs">用户增长</p>
                  <p className="font-bold text-[var(--text-primary)]">{campaign.userGrowth.toLocaleString()}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});
CampaignRanking.displayName = 'CampaignRanking';

// 我的活动列表表格组件
const CampaignTable: React.FC<CampaignTableProps> = React.memo(({ campaigns }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">我的活动列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table" aria-label="营销活动列表">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
                <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">活动名称</th>
                <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">状态</th>
                <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">负责人</th>
                <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">时间</th>
                <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">预算/花费</th>
                <th className="p-3 text-sm font-semibold text-[var(--text-secondary)]">操作</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="p-3">
                    <Link
                      href={`/strategic-planning-campaign-management/${campaign.id}`}
                      className="font-semibold text-[var(--color-primary-500)] cursor-pointer hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <p className="text-xs text-[var(--text-secondary)]">{campaign.type}</p>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarImage src={campaign.manager.avatar} alt={campaign.manager.name} />
                        <AvatarFallback>{campaign.manager.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{campaign.manager.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-[var(--text-primary)]">
                    {campaign.startDate} /<br/>{campaign.endDate}
                  </td>
                  <td className="p-3 text-sm text-[var(--text-primary)]">
                    ¥{(campaign.budget.planned / 10000).toFixed(1)}万 / <br/>
                    <span className="text-[var(--text-secondary)]">¥{(campaign.budget.actual / 10000).toFixed(1)}万</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                      <button
                        className="p-1 hover:text-[var(--color-primary-500)]"
                        aria-label={`查看${campaign.name}详情`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1 hover:text-[var(--color-primary-500)]"
                        aria-label={`编辑${campaign.name}`}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1 hover:text-[var(--color-primary-500)]"
                        aria-label={`复制${campaign.name}`}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1 hover:text-[var(--color-danger-500)]"
                        aria-label={`删除${campaign.name}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
});
CampaignTable.displayName = 'CampaignTable';

// 示例数据
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: '夏季新品"冰爽系列"上市推广',
    type: '新品推广',
    status: 'progress',
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
    roi: 150,
    gmv: 500000,
    userGrowth: 12000
  },
  {
    id: '2',
    name: '618年中大促狂欢节',
    type: '促销活动',
    status: 'completed',
    manager: {
      name: '李娜',
      avatar: '/images/campaigns/avatar-2.jpg'
    },
    budget: {
      planned: 200000,
      actual: 180000
    },
    startDate: '2024-05-20',
    endDate: '2024-06-20',
    roi: 220,
    gmv: 1200000,
    userGrowth: 35000
  },
  {
    id: '3',
    name: 'VIP会员年度答谢会',
    type: '会员活动',
    status: 'progress',
    manager: {
      name: '刘洋',
      avatar: '/images/campaigns/avatar-3.jpg'
    },
    budget: {
      planned: 50000,
      actual: 30000
    },
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    roi: 180,
    gmv: 80000,
    userGrowth: 500
  }
];

const CampaignManagementPage: React.FC = () => {
  const [error] = React.useState<string | null>(null);

  if (error) {
    return (
      <ToolPageLayout
        title="营销活动规划与管理"
        description="通过AI深度挖掘私域客户数据，驱动产品优化与销售增长"
        breadcrumbs={[
          { label: '智能业务与营销战略规划', href: '#' },
          { label: '营销活动规划与管理', href: '/strategic-planning-campaign-management', current: true }
        ]}
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-lg text-[var(--text-secondary)]">加载失败</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-2">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]"
            >
              重试
            </Button>
          </div>
        </div>
      </ToolPageLayout>
    );
  }

  return (
    <ToolPageLayout
      title="营销活动规划与管理"
      description="通过AI深度挖掘私域客户数据，驱动产品优化与销售增长"
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '营销活动规划与管理', href: '/strategic-planning-campaign-management', current: true }
      ]}
      actions={
        <Button className="flex items-center gap-2 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
          <Plus className="w-5 h-5" />
          创建活动
        </Button>
      }
    >
      {/* 筛选器区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative col-span-1 lg:col-span-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <Input
            type="text"
            placeholder="搜索活动名称"
            className="pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary-100)] focus:border-[var(--color-primary-500)] transition"
          />
        </div>
        <select
          className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:border-[var(--color-primary-500)] transition"
          aria-label="筛选活动状态"
        >
          <option value="all">所有状态</option>
          <option value="progress">进行中</option>
          <option value="pending">待开始</option>
          <option value="completed">已结束</option>
          <option value="draft">草稿</option>
        </select>
        <select
          className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:border-[var(--color-primary-500)] transition"
          aria-label="筛选活动类型"
        >
          <option value="all">所有类型</option>
          <option value="品牌宣传">品牌宣传</option>
          <option value="新品推广">新品推广</option>
          <option value="促销活动">促销活动</option>
          <option value="会员活动">会员活动</option>
        </select>
        <select
          className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:border-[var(--color-primary-500)] transition"
          aria-label="筛选负责人"
        >
          <option value="all">所有负责人</option>
          <option value="王伟">王伟</option>
          <option value="李娜">李娜</option>
          <option value="张敏">张敏</option>
          <option value="刘洋">刘洋</option>
        </select>
      </div>

      {/* 统计概览 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="总活动数量" value="5" />
          <StatCard title="平均活动ROI" value="188%" />
          <StatCard title="本月总GMV贡献" value="¥188.0万" />
          <StatCard title="新增用户总数" value="48,500" />
        </div>
        <CampaignStatusChart />
      </section>

      {/* 活动榜单和列表 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <CampaignRanking campaigns={mockCampaigns} />
        </div>
        <div className="xl:col-span-2">
          <CampaignTable campaigns={mockCampaigns} />
        </div>
      </section>

      {/* 分页 */}
      <div className="flex justify-between items-center mt-6 px-2">
        <p className="text-sm text-[var(--text-secondary)]">显示 1 到 3 条, 共 24 条</p>
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled
            aria-label="上一页"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[var(--color-primary-500)] text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">
            4
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-primary-50)] transition-colors"
            aria-label="下一页"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default CampaignManagementPage;