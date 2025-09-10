import BriefingCard from '@/components/dashboard/BriefingCard';
import ToolCard from '@/components/dashboard/ToolCard';
import TrendCard from '@/components/dashboard/TrendCard';
import FileTextIcon from '@/components/icons/FileTextIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import VideoIcon from '@/components/icons/VideoIcon';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import React from 'react';

const competitorPosts = [
    { imageUrl: '/images/dashboard/competitor-post-1.png', title: '夏日清新妆容教程', author: '化妆师安娜', stats: '1.2万浏览 | 500点赞' },
    { imageUrl: '/images/dashboard/competitor-post-2.png', title: '夏日清新妆容教程', author: '化妆师安娜', stats: '1.2万浏览 | 500点赞' },
    { imageUrl: '/images/dashboard/competitor-post-3.png', title: '夏日清新妆容教程', author: '化妆师安娜', stats: '1.2万浏览 | 500点赞' },
    { imageUrl: '/images/dashboard/competitor-post-4.png', title: '夏日清新妆容教程', author: '化妆师安娜', stats: '1.2万浏览 | 500点赞' },
];

const trends = [
    { imageUrl: '/images/dashboard/trend-1.png', title: '智能家居市场快速增长', description: '智能家居产品需求激增，新兴品牌崛起。' },
    { imageUrl: '/images/dashboard/trend-2.png', title: '消费电子行业趋势向好', description: '消费电子行业整体趋势向好，智能家居产品需求激增，新兴品牌崛起。' },
    { imageUrl: '/images/dashboard/trend-3.png', title: '竞争对手"TechGenius"推出新款智能手表', description: '竞争对手"TechGenius"推出新款智能手表，主打健康监测功能，市场反响热烈。' },
];

const copywritingTools = [
    { icon: FileTextIcon, title: '智能营销文案创作' },
    { icon: FileTextIcon, title: '社交媒体文案优化' },
    { icon: FileTextIcon, title: '广告语快速生成' },
];

const imageTools = [
    { icon: ImageIcon, title: 'AI图像生成器（文生图/图生图）' },
    { icon: ImageIcon, title: '智能编辑工具（抠图/背景替换）' },
    { icon: ImageIcon, title: '多尺寸海报生成' },
];

const videoTools = [
    { icon: VideoIcon, title: 'AI短视频脚本生成' },
    { icon: VideoIcon, title: '智能剪辑建议' },
    { icon: VideoIcon, title: '创意素材联想与推荐' },
];

const DashboardPage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '#' },
    { label: '文案', href: '#', current: true }
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <h2 className="dashboard-section-title">今日简报</h2>
      <h3 className="dashboard-subsection-title">核心竞争对手分析</h3>
      
      <Tabs defaultValue="xiaohongshu" className="w-full pb-3">
        <TabsList className="dashboard-tabs-list">
          <TabsTrigger 
            value="xiaohongshu" 
            className="dashboard-tab-trigger"
          >
            小红书
          </TabsTrigger>
          <TabsTrigger 
            value="douyin" 
            className="dashboard-tab-trigger"
          >
            抖音
          </TabsTrigger>
        </TabsList>
        <TabsContent value="xiaohongshu">
          <div className="card-grid">
            {competitorPosts.map((post, index) => (
              <BriefingCard key={index} {...post} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="douyin">
          <div className="card-grid">
            {competitorPosts.map((post, index) => (
              <BriefingCard key={index} {...post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <h3 className="dashboard-subsection-title">行业趋势速览</h3>
      {trends.map((trend, index) => (
          <TrendCard key={index} {...trend} />
      ))}

      <h2 className="dashboard-section-title">科学营销知识图谱与功能导航</h2>
      <div className="flex w-full grow bg-white @container py-3">
          <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] flex">
              <div className="relative w-full aspect-auto rounded-none flex-1">
                  <Image
                      src="/images/dashboard/knowledge-graph.png"
                      alt="科学营销知识图谱与功能导航"
                      fill
                      className="object-cover"
                  />
              </div>
          </div>
      </div>

      <h2 className="dashboard-section-title">常用工具集</h2>
      
      <h3 className="dashboard-subsection-title">文案</h3>
      <div className="card-grid">
          {copywritingTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
          ))}
      </div>

      <h3 className="dashboard-subsection-title">生图</h3>
      <div className="card-grid">
          {imageTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
          ))}
      </div>

      <h3 className="dashboard-subsection-title">生视频</h3>
      <div className="card-grid">
          {videoTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
          ))}
      </div>

      <div className="flex justify-end overflow-hidden px-5 pb-5">
        <Button variant="help">
          <QuestionIcon className="size-6" />
          <span className="truncate">帮助中心</span>
        </Button>
      </div>

      <p className="text-center text-sm font-normal leading-normal text-[var(--text-secondary)] pb-3 pt-1 px-4">© 2025 智赢. 所有权利。|隐私政策|用户协议</p>
    </DashboardLayout>
  );
};

export default DashboardPage;