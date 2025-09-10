'use client';

import FileTextIcon from '@/components/icons/FileTextIcon';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PageCard, PageCardContent, PageCardDescription, PageCardHeader, PageCardTitle } from '@/components/ui/page-card';
import React from 'react';

const copywritingTools = [
  {
    title: '智能营销文案创作',
    description: '基于AI的营销文案生成工具，支持多种营销场景和文案风格。',
    icon: FileTextIcon,
    features: ['自动生成营销文案', '多种文案风格', '一键优化建议'],
    href: '/copywriting/generator'
  },
  {
    title: '社交媒体文案优化', 
    description: '专为社交媒体平台优化的文案工具，提升用户互动率。',
    icon: FileTextIcon,
    features: ['平台适配', '互动优化', '热点融合'],
    href: '/copywriting/social-optimizer'
  },
  {
    title: '广告语快速生成',
    description: '快速生成吸引眼球的广告语，适用于各类广告投放场景。',
    icon: FileTextIcon,
    features: ['快速生成', '多版本对比', 'A/B测试支持'],
    href: '/copywriting/ad-generator'
  }
];

const CopywritingPage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '/dashboard' },
    { label: '文案', href: '/copywriting', current: true }
  ];

  return (
    <DashboardLayout 
      title="文案工具集" 
      breadcrumbs={breadcrumbs}
    >
      <div className="content-section">
        <p className="text-[var(--text-secondary)] text-base mb-6 px-4">
          使用AI驱动的文案工具，快速创作高质量的营销内容，提升品牌传播效果。
        </p>
        
        <div className="feature-grid">
          {copywritingTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <PageCard key={index} variant="default" size="lg">
                <PageCardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                      <Icon className="size-6 text-[var(--text-primary)]" />
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
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      // TODO: Navigate to tool page
                      console.log(`Navigate to ${tool.href}`);
                    }}
                  >
                    立即使用
                  </Button>
                </div>
              </PageCard>
            );
          })}
        </div>
      </div>

      <div className="content-section">
        <h2 className="subsection-header">快速开始</h2>
        <PageCard variant="info" className="mx-4">
          <PageCardContent>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[var(--info-bg)]">
                <FileTextIcon className="size-6 text-[var(--info-color)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">文案创作流程</h3>
                <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>1. 选择适合的文案工具</li>
                  <li>2. 输入产品信息和目标受众</li>
                  <li>3. 选择文案风格和调性</li>
                  <li>4. 生成并优化文案内容</li>
                  <li>5. 导出或直接应用到营销渠道</li>
                </ol>
              </div>
            </div>
          </PageCardContent>
        </PageCard>
      </div>
    </DashboardLayout>
  );
};

export default CopywritingPage;