'use client';

import VideoIcon from '@/components/icons/VideoIcon';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PageCard, PageCardContent, PageCardDescription, PageCardHeader, PageCardTitle } from '@/components/ui/page-card';
import React from 'react';

const videoGenerationTools = [
  {
    title: 'AI短视频脚本生成',
    description: '智能生成吸引人的短视频脚本，提升内容创作效率。',
    features: ['脚本自动生成', '多平台适配', '热点融合'],
  },
  {
    title: '智能剪辑建议', 
    description: '基于AI分析的视频剪辑建议，优化视频效果。',
    features: ['剪辑点推荐', '节奏优化', '效果增强'],
  },
  {
    title: '创意素材联想与推荐',
    description: '根据主题推荐相关的视频素材和创意方向。',
    features: ['素材推荐', '创意联想', '风格匹配'],
  }
];

const VideoGenerationPage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '/dashboard' },
    { label: '生视频', href: '/video-generation', current: true }
  ];

  return (
    <DashboardLayout 
      title="视频生成工具集" 
      breadcrumbs={breadcrumbs}
    >
      <div className="content-section">
        <p className="text-[var(--text-secondary)] text-base mb-6 px-4">
          利用AI技术辅助视频创作，从脚本生成到剪辑建议，全方位提升视频制作效率。
        </p>
        
        <div className="feature-grid">
          {videoGenerationTools.map((tool, index) => (
            <PageCard key={index} variant="default" size="lg">
              <PageCardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                    <VideoIcon className="size-6 text-[var(--text-primary)]" />
                  </div>
                  <PageCardTitle className="text-lg">{tool.title}</PageCardTitle>
                </div>
                <PageCardDescription className="text-[var(--text-secondary)]">
                  {tool.description}
                </PageCardDescription>
              </PageCardHeader>
              
              <PageCardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-[var(--text-primary)] text-sm">核心功能：</h4>
                  <ul className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)]"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </PageCardContent>
              
              <div className="flex items-center justify-end p-6 pt-0">
                <Button variant="default" size="sm">
                  立即使用
                </Button>
              </div>
            </PageCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoGenerationPage;