'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings } from 'lucide-react';

// IP项目数据类型定义
interface IPProject {
  id: string;
  name: string;
  stage: 'concept' | 'visual' | 'narrative' | 'incubating';
  tags: string[];
  aiScore: number;
  potentialLevel: 'high' | 'medium-high' | 'medium' | 'pending';
  createdAt: string;
  creator: {
    name: string;
    avatar: string;
  };
}

// 阶段标签配置
const stageConfig = {
  concept: { label: '概念阶段', color: 'bg-blue-100 text-blue-800' },
  visual: { label: '视觉设计阶段', color: 'bg-purple-100 text-purple-800' },
  narrative: { label: '内容叙事阶段', color: 'bg-orange-100 text-orange-800' },
  incubating: { label: '孵化中', color: 'bg-green-100 text-green-800' }
};

// AI潜力等级配置
const potentialConfig = {
  high: { label: '高潜力', color: 'text-green-600' },
  'medium-high': { label: '中高潜力', color: 'text-lime-600' },
  medium: { label: '中等潜力', color: 'text-yellow-600' },
  pending: { label: '潜力待定', color: 'text-gray-500' }
};

// IP项目卡片组件
interface IPProjectCardProps {
  project: IPProject;
  onClick: () => void;
}

const IPProjectCard: React.FC<IPProjectCardProps> = ({ project, onClick }) => {
  const stageStyle = stageConfig[project.stage];
  const potentialStyle = potentialConfig[project.potentialLevel];

  return (
    <Card
      className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col h-full space-y-4">
        {/* 标题和状态 */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{project.name}</h2>
          <Badge className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stageStyle.color}`}>
            {stageStyle.label}
          </Badge>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* AI评分 */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
          <div className="text-sm text-[var(--text-secondary)]">AI 潜力评分</div>
          <div className="flex items-baseline mt-1">
            <span className={`text-2xl font-bold ${potentialStyle.color}`}>{project.aiScore}</span>
            <span className="text-[var(--text-secondary)] font-medium ml-1">分</span>
            <span className={`text-sm font-semibold ml-2 ${potentialStyle.color}`}>
              ({potentialStyle.label})
            </span>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-[var(--border-primary)] !mt-auto pt-4 flex justify-between items-center text-sm">
          <div className="text-[var(--text-secondary)]">
            <span className="font-medium">创建于:</span> {project.createdAt}
          </div>
          <div className="flex items-center">
            <Image
              src={project.creator.avatar}
              alt={project.creator.name}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover mr-2 ring-1 ring-[var(--border-primary)]"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== '/images/customers/default-avatar.png') {
                  target.src = '/images/customers/default-avatar.png';
                }
              }}
            />
            <span className="text-[var(--text-primary)] font-medium">{project.creator.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 示例数据
const mockIPProjects: IPProject[] = [
  {
    id: '1',
    name: '星尘漫游者',
    stage: 'visual',
    tags: ['二次元', '科技', '冒险'],
    aiScore: 92,
    potentialLevel: 'high',
    createdAt: '2023年10月26日',
    creator: { name: '王丽', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '2',
    name: '山海灵境',
    stage: 'incubating',
    tags: ['国风', '神话', '情感治愈'],
    aiScore: 88,
    potentialLevel: 'medium-high',
    createdAt: '2023年8月15日',
    creator: { name: '李伟', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '3',
    name: '都市夜影',
    stage: 'narrative',
    tags: ['赛博朋克', '悬疑', '都市'],
    aiScore: 75,
    potentialLevel: 'medium',
    createdAt: '2023年11月1日',
    creator: { name: '张敏', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '4',
    name: '萌宠治愈社',
    stage: 'concept',
    tags: ['可爱', '情感治愈', '日常'],
    aiScore: 95,
    potentialLevel: 'high',
    createdAt: '2024年1月20日',
    creator: { name: '刘洋', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '5',
    name: '风语奇旅',
    stage: 'incubating',
    tags: ['奇幻', '冒险', '自然'],
    aiScore: 85,
    potentialLevel: 'medium-high',
    createdAt: '2023年5月12日',
    creator: { name: '陈静', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '6',
    name: '代码回响',
    stage: 'visual',
    tags: ['科技', '未来', 'AI'],
    aiScore: 81,
    potentialLevel: 'medium-high',
    createdAt: '2023年9月30日',
    creator: { name: '赵强', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '7',
    name: '竹林墨客',
    stage: 'narrative',
    tags: ['国风', '武侠', '水墨'],
    aiScore: 68,
    potentialLevel: 'pending',
    createdAt: '2023年12月18日',
    creator: { name: '孙悦', avatar: '/images/customers/default-avatar.png' }
  },
  {
    id: '8',
    name: '食梦貘物语',
    stage: 'concept',
    tags: ['奇幻', '治愈', '梦境'],
    aiScore: 91,
    potentialLevel: 'high',
    createdAt: '2024年2月5日',
    creator: { name: '周芳', avatar: '/images/customers/default-avatar.png' }
  }
];

const BrandManagementIPCreationPage: React.FC = () => {
  const router = useRouter();

  const handleCardClick = (project: IPProject) => {
    console.log(`查看 '${project.name}' 的详情`);
    // TODO: 跳转到IP详情页面
  };

  const handleCreateNew = () => {
    router.push('/brand-management-ip-creation/create');
  };

  const handleManageProjects = () => {
    console.log('管理IP项目');
    // TODO: 跳转到IP管理页面
  };

  return (
    <ToolPageLayout
      title="IP打造与定位"
      description="通过AI驱动的IP项目管理，从概念设计到商业化孵化的全流程智能支持"
      breadcrumbs={[
        { label: '智能品牌与IP资产管理', href: '#' },
        { label: 'IP打造与定位', href: '/brand-management-ip-creation', current: true }
      ]}
      actions={
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleManageProjects}
            className="flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            管理IP项目
          </Button>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新建IP项目
          </Button>
        </div>
      }
    >
      {/* IP项目网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockIPProjects.map((project) => (
          <IPProjectCard
            key={project.id}
            project={project}
            onClick={() => handleCardClick(project)}
          />
        ))}
      </div>
    </ToolPageLayout>
  );
};

export default BrandManagementIPCreationPage;