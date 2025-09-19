'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Alert } from '@/components/ui/alert';
import {
  Plus,
  FolderOpen,
  MoreVertical,
  Lightbulb
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => (
  <Card className="border border-[var(--border-primary)]">
    <CardContent className="py-4 px-6">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--text-tertiary)]">{subtitle}</p>
    </CardContent>
  </Card>
);

interface ProjectCardProps {
  title: string;
  status: string;
  statusColor: string;
  statusBadgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  owner: {
    name: string;
    avatar: string;
  };
  competitors: number;
  personas: number;
  lastUpdate: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  status,
  statusColor,
  statusBadgeVariant,
  owner,
  competitors,
  personas,
  lastUpdate
}) => (
  <Card
    className="border border-[var(--border-primary)] shadow-sm hover:shadow-lg hover:border-[var(--primary-color)] transition-all duration-300 flex flex-col cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] py-0"
    role="button"
    tabIndex={0}
    aria-label={`项目: ${title}, 状态: ${status}`}
  >
    <CardContent className="flex-grow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-[var(--text-primary)] pr-2">{title}</h3>
        <button
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          aria-label="项目操作菜单"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <span className={`h-2 w-2 rounded-full ${statusColor}`}></span>
        <Badge variant={statusBadgeVariant} className="text-xs font-medium">
          {status}
        </Badge>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <Image
            src={owner.avatar}
            alt={owner.name}
            width={32}
            height={32}
            className="rounded-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== '/images/customers/default-avatar.png') {
                target.src = '/images/customers/default-avatar.png';
              }
            }}
          />
        </Avatar>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{owner.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">负责人</p>
        </div>
      </div>
      <div className="mt-6 flex justify-between text-sm text-[var(--text-secondary)]">
        <div className="text-center">
          <p className="font-semibold text-[var(--text-primary)]">{competitors}家</p>
          <p className="text-xs">监测竞品</p>
        </div>
        <div className="border-l border-[var(--border-primary)] h-8"></div>
        <div className="text-center">
          <p className="font-semibold text-[var(--text-primary)]">{personas}个</p>
          <p className="text-xs">用户画像</p>
        </div>
      </div>
    </CardContent>
    <CardFooter className="border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)] pb-6 rounded-b-xl">
      <p className="text-xs text-[var(--text-tertiary)]">上次更新: {lastUpdate}</p>
    </CardFooter>
  </Card>
);

const MarketIntelligenceProjectManagementPage: React.FC = () => {
  const projectsData = [
    {
      title: 'A品牌年度市场洞察',
      status: '进行中',
      statusColor: 'bg-[var(--color-success-600)]',
      statusBadgeVariant: 'default' as const,
      owner: {
        name: '张三',
        avatar: '/images/avatars/zhangsan.jpg'
      },
      competitors: 5,
      personas: 3,
      lastUpdate: '2025-09-11'
    },
    {
      title: '新品上市竞品分析',
      status: '进行中',
      statusColor: 'bg-[var(--color-success-600)]',
      statusBadgeVariant: 'default' as const,
      owner: {
        name: '李四',
        avatar: '/images/avatars/lisi.jpg'
      },
      competitors: 8,
      personas: 2,
      lastUpdate: '2025-09-10'
    },
    {
      title: 'Q3用户满意度调研',
      status: '已完成',
      statusColor: 'bg-[var(--color-info-600)]',
      statusBadgeVariant: 'secondary' as const,
      owner: {
        name: '王五',
        avatar: '/images/avatars/wangwu.jpg'
      },
      competitors: 3,
      personas: 4,
      lastUpdate: '2025-08-25'
    },
    {
      title: 'Z世代消费趋势研究',
      status: '已归档',
      statusColor: 'bg-[var(--text-tertiary)]',
      statusBadgeVariant: 'secondary' as const,
      owner: {
        name: '赵六',
        avatar: '/images/avatars/zhaoliu.jpg'
      },
      competitors: 10,
      personas: 5,
      lastUpdate: '2025-07-15'
    }
  ];

  return (
    <ToolPageLayout
      title="市场与竞品洞察项目管理"
      description="管理和监控市场洞察与竞品分析项目的进展、资源和成果"
      breadcrumbs={[
        { label: '战略与决策中枢', href: '#' },
        { label: '智能市场洞察与竞品分析', href: '#' },
        { label: '市场与竞品洞察项目管理', href: '/market-intelligence-project-management', current: true }
      ]}
    >
      {/* Project Overview Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard
                title="项目总数"
                value="4个"
                subtitle="所有已创建的项目"
              />
              <StatCard
                title="活跃项目"
                value="2个"
                subtitle="当前正在进行中的项目"
              />
              <StatCard
                title="待办任务"
                value="3项"
                subtitle="需要您关注的任务"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Button className="w-full flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" />
              新建洞察项目
            </Button>
            <Button variant="outline" className="w-full">
              <FolderOpen className="h-5 w-5 mr-2" />
              查看所有项目
            </Button>
          </div>
        </div>

        {/* AI Recommendation */}
        <Alert className="mt-6 bg-[var(--color-info-50)] border-[var(--color-info-100)]">
          <Lightbulb className="h-6 w-6 text-[var(--color-info-600)]" />
          <div className="ml-3">
            <p className="text-sm text-[var(--color-info-600)]">
              <span className="font-semibold">AI推荐：</span>
              当前项目&lsquo;新品上市洞察&rsquo;已接近完成，建议生成结项报告。
            </p>
          </div>
        </Alert>
      </div>

      {/* Project List Section */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">洞察项目列表</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              status={project.status}
              statusColor={project.statusColor}
              statusBadgeVariant={project.statusBadgeVariant}
              owner={project.owner}
              competitors={project.competitors}
              personas={project.personas}
              lastUpdate={project.lastUpdate}
            />
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default MarketIntelligenceProjectManagementPage;