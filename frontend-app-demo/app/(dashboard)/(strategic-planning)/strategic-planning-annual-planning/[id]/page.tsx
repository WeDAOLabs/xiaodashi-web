'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import DetailLayout from '../../_components/DetailLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  CheckCircle,
  Play,
  Clock,
  XCircle
} from 'lucide-react';


interface ActivityData {
  id: string;
  name: string;
  theme: string;
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string;
  manager: string;
  budget: string;
  roi: string;
  gmv: string;
  userGrowth: string;
  conversionRate: string;
  tasks: {
    name: string;
    manager: string;
    status: string;
  }[];
}

const mockActivityData: Record<string, ActivityData> = {
  '1': {
    id: '1',
    name: '春节礼遇季',
    theme: '新春好礼，美颜迎春',
    status: 'completed',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    manager: '张三',
    budget: '¥ 120,000',
    roi: '195%',
    gmv: '¥ 234,000',
    userGrowth: '+6,800',
    conversionRate: '7.2%',
    tasks: [
      { name: '设计春节活动主视觉', manager: '李设计师', status: '已完成' },
      { name: '上线活动预热页面', manager: '王工程师', status: '已完成' }
    ]
  },
  '2': {
    id: '2',
    name: '情人节挚爱献礼',
    theme: '挚爱献礼，美颜升级',
    status: 'completed',
    startDate: '2024-02-12',
    endDate: '2024-02-16',
    manager: '李四',
    budget: '¥ 80,000',
    roi: '210%',
    gmv: '¥ 168,000',
    userGrowth: '+8,200',
    conversionRate: '8.1%',
    tasks: [
      { name: '设计情人节活动主视觉', manager: '李设计师', status: '已完成' },
      { name: '上线活动预热页面', manager: '王工程师', status: '已完成' }
    ]
  },
  '3': {
    id: '3',
    name: '女王节宠爱自己',
    theme: '女王节专享，宠爱自己',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-03-10',
    manager: '王五',
    budget: '¥ 150,000',
    roi: '185%',
    gmv: '¥ 277,500',
    userGrowth: '+12,500',
    conversionRate: '9.3%',
    tasks: [
      { name: '设计女王节活动主视觉', manager: '李设计师', status: '进行中' },
      { name: '上线活动预热页面', manager: '王工程师', status: '待开始' }
    ]
  }
};


const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case '已完成': return CheckCircle;
    case '进行中': return Play;
    case '待开始': return Clock;
    case '已取消': return XCircle;
    default: return Clock;
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case '已完成': return 'var(--color-success-600)';
    case '进行中': return 'var(--color-info-600)';
    case '待开始': return 'var(--text-tertiary)';
    case '已取消': return 'var(--color-danger-600)';
    default: return 'var(--text-tertiary)';
  }
};

const StrategicPlanningAnnualPlanningDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;

  const activity = mockActivityData[activityId];

  if (!activity) {
    return (
      <DetailLayout
        breadcrumbs={[
          { label: '智能业务与营销战略规划', href: '#' },
          { label: '年度营销规划', href: '/strategic-planning-annual-planning' },
          { label: '活动详情', href: '#', current: true }
        ]}
        showBackButton={false}
      >
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)]">未找到该营销活动</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/strategic-planning-annual-planning')}
          >
            返回营销规划
          </Button>
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '年度营销规划', href: '/strategic-planning-annual-planning' },
        { label: activity.name, href: '#', current: true }
      ]}
    >

      <Card>
        <CardContent className="p-6 sm:p-8">
          {/* 主要信息网格 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 左侧列 */}
            <div className="md:col-span-2 space-y-8">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">基本信息</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="text-[var(--text-secondary)]">活动主题</div>
                  <div className="text-[var(--text-primary)] font-medium">{activity.theme}</div>

                  <div className="text-[var(--text-secondary)]">活动周期</div>
                  <div className="text-[var(--text-primary)] font-medium">
                    {activity.startDate} ~ {activity.endDate}
                  </div>

                  <div className="text-[var(--text-secondary)]">负责人</div>
                  <div className="text-[var(--text-primary)] font-medium">{activity.manager}</div>

                  <div className="text-[var(--text-secondary)]">总预算</div>
                  <div className="text-[var(--text-primary)] font-medium">{activity.budget}</div>
                </div>
              </div>

              {/* 团队任务协同 */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">团队任务协同</h3>
                <div className="space-y-2 text-sm">
                  {activity.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-md"
                    >
                      <span>{task.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                          负责人: {task.manager}
                        </span>
                        <div className="flex items-center gap-1">
                          {React.createElement(getTaskStatusIcon(task.status), {
                            className: "w-3 h-3",
                            style: { color: getTaskStatusColor(task.status) }
                          })}
                          <Badge
                            variant="secondary"
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              task.status === '已完成'
                                ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]'
                                : task.status === '进行中'
                                ? 'bg-[var(--color-info-100)] text-[var(--color-info-600)]'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                            }`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧列 */}
            <div className="space-y-8">
              {/* 效果数据总览 */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">效果数据总览</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[var(--text-secondary)]">ROI (投入产出比)</span>
                    <span className="text-lg font-bold text-[var(--primary-color)]">{activity.roi}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[var(--text-secondary)]">GMV (商品交易总额)</span>
                    <span className="text-lg font-bold text-[var(--primary-color)]">{activity.gmv}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[var(--text-secondary)]">用户增长</span>
                    <span className="text-lg font-bold text-[var(--primary-color)]">{activity.userGrowth}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[var(--text-secondary)]">转化率</span>
                    <span className="text-lg font-bold text-[var(--primary-color)]">{activity.conversionRate}</span>
                  </div>
                </div>
              </div>

              {/* 合规性检测 */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">合规性检测</h3>
                <div className="text-sm border border-green-200 rounded-lg p-3 flex items-center gap-3 bg-green-50">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">全部合规</p>
                    <p className="text-green-700 text-xs">文案及素材已通过检测。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DetailLayout>
  );
};

export default StrategicPlanningAnnualPlanningDetailPage;