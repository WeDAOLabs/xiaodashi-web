'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck } from 'lucide-react';

interface ABTestMetric {
  name: string;
  solutionA: number;
  solutionB: number;
  improvement: number;
}

const ABTestResults: React.FC = () => {
  const testData: ABTestMetric[] = [
    { name: '点击率', solutionA: 15, solutionB: 18, improvement: 20 },
    { name: '加购率', solutionA: 8, solutionB: 11, improvement: 37.5 },
    { name: '转化率', solutionA: 2.5, solutionB: 3.5, improvement: 40 }
  ];

  const formatPercentage = (value: number): string => `${value}%`;

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <CircleCheck className="w-5 h-5 text-[var(--primary-color)]" />
          A/B测试效果评估
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* 方案对比标题 */}
          <div className="flex justify-around items-center text-center">
            <div>
              <h4 className="font-bold text-lg text-[var(--color-info-600)]">方案 A</h4>
              <p className="text-sm text-[var(--text-secondary)]">原版详情页</p>
            </div>
            <div className="text-[var(--text-tertiary)] font-light text-2xl">VS</div>
            <div>
              <h4 className="font-bold text-lg text-[var(--color-success-600)]">方案 B</h4>
              <p className="text-sm text-[var(--text-secondary)]">视频版详情页</p>
            </div>
          </div>

          {/* 指标对比 */}
          <div className="space-y-2">
            {testData.map((metric, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] w-16">{metric.name}</span>
                <div className="flex items-center space-x-2 flex-1 justify-end">
                  <span className="font-semibold w-12 text-right">
                    {formatPercentage(metric.solutionA)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-[var(--color-success-50)] text-[var(--color-success-600)] font-bold px-2 py-0.5"
                  >
                    +{formatPercentage(metric.improvement)}
                  </Badge>
                  <span className="font-semibold w-12 text-left">
                    {formatPercentage(metric.solutionB)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 结论 */}
          <div className="p-3 bg-[var(--color-success-50)] border border-[var(--color-success-100)] rounded-lg text-center text-sm">
            <p>
              <strong className="text-[var(--color-success-600)]">结论:</strong>
              <span className="text-[var(--text-secondary)] ml-1">
                方案B在转化率上提升显著，建议全量推广。
              </span>
            </p>
          </div>

          {/* 统计显著性 */}
          <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-tertiary)]">
            <div className="flex items-center gap-1">
              <CircleCheck className="w-4 h-4 text-[var(--color-success-600)]" />
              <span>统计显著性: 95%</span>
            </div>
            <div className="flex items-center gap-1">
              <CircleCheck className="w-4 h-4 text-[var(--color-success-600)]" />
              <span>样本量: 10,000+</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ABTestResults;