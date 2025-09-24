'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Bot } from 'lucide-react';

interface OverviewStatsProps {
  totalPersonas: number;
  latestInsights: number;
  aiPrediction: string;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
  totalPersonas,
  latestInsights,
  aiPrediction
}) => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <Card className="border border-[var(--border-primary)] shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">已建立用户画像</h3>
            <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{totalPersonas}个</p>
          </CardContent>
        </Card>

        <Card className="border border-[var(--border-primary)] shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">最新消费者洞察</h3>
            <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{latestInsights}条</p>
          </CardContent>
        </Card>

        <Card className="border border-[var(--border-primary)] shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] flex items-center">
              <Bot className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
              AI预测
            </h3>
            <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">
              &ldquo;{aiPrediction}&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <Button className="flex items-center gap-2 text-sm font-semibold text-white bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] transition-colors">
          <Plus className="w-4 h-4" />
          新建用户画像
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <Eye className="w-4 h-4" />
          查看所有洞察
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <Bot className="w-4 h-4" />
          AI生成消费者情绪报告
        </Button>
      </div>
    </div>
  );
};

export default OverviewStats;