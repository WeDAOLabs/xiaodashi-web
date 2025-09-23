'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { AIInsight } from './types';

interface AIInsightPanelProps {
  className?: string;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ className }) => {
  const insights: AIInsight[] = [
    {
      type: 'warning',
      title: '软件安装教程',
      content: "发现'软件安装教程'类知识已半年未更新，部分内容可能已过期。"
    },
    {
      type: 'info',
      title: '新品发布会方案',
      content: "发现'新品发布会方案'文档近期被高频引用，建议定期更新。"
    }
  ];

  return (
    <Card className={`bg-[var(--info-bg)] border border-[var(--info-border)] ${className || ''}`}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-[var(--info-color)] text-sm mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI 质量洞察
        </h3>
        <ul className="space-y-1.5 list-disc list-inside text-sm text-[var(--text-primary)]">
          {insights.map((insight, index) => (
            <li key={index}>{insight.content}</li>
          ))}
        </ul>
        <div className="mt-3 text-xs flex gap-3">
          <Button
            variant="ghost"
            className="font-semibold text-[var(--accent-color)] hover:underline p-0 h-auto"
          >
            查看质量报告
          </Button>
          <Button
            variant="ghost"
            className="font-semibold text-[var(--accent-color)] hover:underline p-0 h-auto"
          >
            设置更新提醒
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightPanel;