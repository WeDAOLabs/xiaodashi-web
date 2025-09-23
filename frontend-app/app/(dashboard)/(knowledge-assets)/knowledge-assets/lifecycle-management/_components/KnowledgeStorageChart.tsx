'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/ui/circular-progress';
import type { KnowledgeStorageData } from './types';

interface KnowledgeStorageChartProps {
  className?: string;
}

const KnowledgeStorageChart: React.FC<KnowledgeStorageChartProps> = ({ className }) => {
  const data: KnowledgeStorageData = {
    core: 85,
    edge: 60,
    overall: 85,
    deficiencies: [
      '竞品B详细功能参数',
      '客户A行业成功案例'
    ]
  };

  return (
    <Card className={`bg-[var(--bg-primary)] shadow-sm border border-[var(--border-primary)] ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">知识储备度 (Knowledge Coverage)</CardTitle>
      </CardHeader>

      <CardContent className="flex items-start justify-between gap-8">
        {/* 左侧：环形进度图 */}
        <div className="flex-shrink-0 flex items-center justify-center w-40">
          <CircularProgress
            value={data.overall}
            size="lg"
            color="var(--primary-color)"
            className="w-24 h-24"
          />
        </div>

        {/* 右侧：详细信息 */}
        <div className="flex-1 text-sm space-y-3 max-w-xs">
          <div>
            <p>
              <span className="font-medium">核心知识储备度:</span> {data.core}% (高)
            </p>
            <p>
              <span className="font-medium">边缘知识储备度:</span> {data.edge}% (中)
            </p>
          </div>

          <div>
            <p className="font-medium text-[var(--text-primary)] mb-1">AI识别知识欠缺TOP3:</p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] text-xs space-y-0.5">
              {data.deficiencies.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="text-xs font-semibold text-[var(--accent-color)] hover:underline p-0 h-auto"
        >
          查看欠缺知识详情 →
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeStorageChart;