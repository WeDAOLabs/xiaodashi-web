'use client';

import ImageIcon from '@/components/icons/ImageIcon';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PageCard, PageCardContent, PageCardDescription, PageCardHeader, PageCardTitle } from '@/components/ui/page-card';
import React from 'react';

const imageGenerationTools = [
  {
    title: 'AI图像生成器（文生图）',
    description: '通过文字描述生成高质量图像，支持多种艺术风格。',
    features: ['文字转图像', '多种风格', '高分辨率输出'],
  },
  {
    title: 'AI图像生成器（图生图）', 
    description: '基于参考图像生成新图像，保持风格一致性。',
    features: ['图像参考', '风格迁移', '细节优化'],
  },
  {
    title: '智能编辑工具（抠图/背景替换）',
    description: '智能抠图和背景替换，快速制作营销素材。',
    features: ['一键抠图', '背景替换', '批量处理'],
  }
];

const ImageGenerationPage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '/dashboard' },
    { label: '生图', href: '/image-generation', current: true }
  ];

  return (
    <DashboardLayout 
      title="图像生成工具集" 
      breadcrumbs={breadcrumbs}
    >
      <div className="content-section">
        <p className="text-[var(--text-secondary)] text-base mb-6 px-4">
          使用先进的AI技术生成和编辑图像，为您的营销活动创造视觉冲击力。
        </p>
        
        <div className="feature-grid">
          {imageGenerationTools.map((tool, index) => (
            <PageCard key={index} variant="default" size="lg">
              <PageCardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                    <ImageIcon className="size-6 text-[var(--text-primary)]" />
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

export default ImageGenerationPage;