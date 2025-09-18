'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle,
  Play,
  Clock,
  XCircle
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface MarketingActivity {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string;
  manager: string;
}

const mockActivities: MarketingActivity[] = [
  {
    id: '1',
    name: '春节礼遇季',
    status: 'completed',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    manager: '张三'
  },
  {
    id: '2',
    name: '情人节挚爱献礼',
    status: 'completed',
    startDate: '2024-02-12',
    endDate: '2024-02-16',
    manager: '李四'
  },
  {
    id: '3',
    name: '女王节宠爱自己',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-03-10',
    manager: '王五'
  }
];

const getStatusColor = (status: MarketingActivity['status']) => {
  switch (status) {
    case 'completed': return 'var(--status-completed)';
    case 'active': return 'var(--status-active)';
    case 'pending': return 'var(--status-pending)';
    case 'cancelled': return 'var(--status-cancelled)';
    default: return 'var(--status-draft)';
  }
};

const getStatusText = (status: MarketingActivity['status']) => {
  switch (status) {
    case 'completed': return '已完成';
    case 'active': return '进行中';
    case 'pending': return '待开始';
    case 'cancelled': return '已取消';
    default: return '草稿';
  }
};

const getStatusIcon = (status: MarketingActivity['status']) => {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'active': return Play;
    case 'pending': return Clock;
    case 'cancelled': return XCircle;
    default: return Clock;
  }
};

// 日历组件
const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // 定义特殊日期（节假日）
  const holidays = [
    { date: new Date(2024, 8, 10), name: '教师节' }, // 9月10日
    { date: new Date(2024, 8, 17), name: '中秋节' }, // 9月17日
  ];

  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">2024年 9月</h2>
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border border-[var(--border-secondary)]"
            modifiers={{
              holiday: holidays.map(h => h.date),
            }}
            modifiersClassNames={{
              holiday: "bg-[var(--color-primary-50)] text-[var(--primary-color)] font-semibold",
            }}
          />
        </div>

        {/* 节假日图例 */}
        <div className="mt-4 flex justify-center gap-4">
          {holidays.map((holiday, index) => (
            <div key={index} className="flex items-center text-xs text-[var(--text-secondary)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary-50)] mr-1"></div>
              <span>{holiday.date.getDate()}日 {holiday.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// AI建议组件
const AISuggestions: React.FC = () => {
  const suggestions = [
    {
      title: '金秋"肌"遇，焕新礼遇',
      category: '产品促销',
      description: '针对换季护肤需求，推出"金秋焕新"护肤套装限时折扣，并搭配线上KOL直播讲解秋季护肤要点。'
    },
    {
      title: '"师"恩难忘，好礼相赠',
      category: '线上互动',
      description: '教师节期间，在社交媒体发起#我的老师最美#话题，鼓励用户分享与老师的故事，并赠送美妆礼品作为答谢。'
    }
  ];

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-[var(--primary-color)] mr-2" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">AI 营销策略建议</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          基于行业特性和客户群分析，为您的<span className="font-semibold text-[var(--primary-color)]">9月</span>营销活动提供灵感。
        </p>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border border-[var(--border-secondary)] rounded-lg p-4 transition-shadow hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{suggestion.title}</h3>
                  <Badge variant="secondary" className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] my-1">
                    {suggestion.category}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="bg-[var(--color-primary-50)] text-[var(--primary-color)] hover:bg-[var(--color-primary-100)] whitespace-nowrap"
                >
                  采纳建议
                </Button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StrategicPlanningAnnualPlanningPage: React.FC = () => {
  const router = useRouter();

  return (
    <ToolPageLayout
      title="全年营销规划"
      description="通过AI智能分析制定全年营销策略，优化活动规划与执行效果"
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '年度营销规划', href: '/strategic-planning-annual-planning', current: true }
      ]}
    >
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">全年营销规划</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-[120px] bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024年</SelectItem>
              <SelectItem value="2023">2023年</SelectItem>
              <SelectItem value="2022">2022年</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全年</SelectItem>
              <SelectItem value="q1">第一季度</SelectItem>
              <SelectItem value="q2">第二季度</SelectItem>
              <SelectItem value="q3">第三季度</SelectItem>
              <SelectItem value="q4">第四季度</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>自定义日期</span>
          </Button>
          <Button className="flex items-center gap-1.5">
            <Plus className="w-5 h-5" />
            <span>新建营销活动</span>
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 日历视图 */}
        <CalendarView />

        {/* AI建议 */}
        <AISuggestions />
      </div>

      {/* 活动列表 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">营销活动计划列表</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]">
                  <TableHead className="text-xs text-[var(--text-tertiary)] uppercase font-medium">活动名称</TableHead>
                  <TableHead className="text-xs text-[var(--text-tertiary)] uppercase font-medium">状态</TableHead>
                  <TableHead className="text-xs text-[var(--text-tertiary)] uppercase font-medium">活动周期</TableHead>
                  <TableHead className="text-xs text-[var(--text-tertiary)] uppercase font-medium">负责人</TableHead>
                  <TableHead className="text-xs text-[var(--text-tertiary)] uppercase font-medium">
                    <span className="sr-only">操作</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockActivities.map((activity) => (
                  <TableRow
                    key={activity.id}
                    className="bg-white hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <TableCell className="font-medium text-[var(--text-primary)]">
                      {activity.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {React.createElement(getStatusIcon(activity.status), {
                          className: "w-4 h-4 mr-1.5 flex-shrink-0",
                          style: { color: getStatusColor(activity.status) }
                        })}
                        <span className="text-sm text-[var(--text-secondary)]">
                          {getStatusText(activity.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-secondary)]">
                      {activity.startDate} ~ {activity.endDate}
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-secondary)]">
                      {activity.manager}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)] hover:underline p-0 h-auto"
                        onClick={() => {
                          router.push(`/strategic-planning-annual-planning/${activity.id}`);
                        }}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default StrategicPlanningAnnualPlanningPage;