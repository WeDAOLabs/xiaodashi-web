'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const ContentFeatureCard: React.FC = () => {
  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--primary-color)]" />
          高转化内容特征
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="p-3 bg-[var(--color-success-50)] border border-[var(--color-success-100)] rounded-lg">
            <h4 className="font-semibold text-[var(--color-success-600)] mb-1">内容类型</h4>
            <p className="text-[var(--text-secondary)] text-sm">开箱测评、教程类短视频</p>
          </div>

          <div className="p-3 bg-[var(--color-info-50)] border border-[var(--color-info-100)] rounded-lg">
            <h4 className="font-semibold text-[var(--color-info-600)] mb-1">标题关键词</h4>
            <p className="text-[var(--text-secondary)] text-sm">&ldquo;夏日必备&rdquo;, &ldquo;懒人神器&rdquo;, &ldquo;学生党&rdquo;</p>
          </div>

          <div className="p-3 bg-[var(--color-warning-50)] border border-[var(--color-warning-100)] rounded-lg">
            <h4 className="font-semibold text-[var(--color-warning-600)] mb-1">图片风格</h4>
            <p className="text-[var(--text-secondary)] text-sm">明亮、高饱和度、生活场景</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentFeatureCard;