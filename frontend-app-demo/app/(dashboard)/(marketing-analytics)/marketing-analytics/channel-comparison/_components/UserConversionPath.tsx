'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ConversionStep {
  step: number;
  title: string;
  percentage: number;
  color: string;
}

interface UserConversionPathProps {
  title?: string;
  data?: ConversionStep[];
}

const defaultData: ConversionStep[] = [
  {
    step: 1,
    title: '广告曝光',
    percentage: 100,
    color: 'var(--color-chart-1)'
  },
  {
    step: 2,
    title: '首次点击',
    percentage: 50,
    color: 'var(--color-chart-1)'
  },
  {
    step: 3,
    title: '浏览商品',
    percentage: 30,
    color: 'var(--color-chart-1)'
  },
  {
    step: 4,
    title: '加入购物车',
    percentage: 10,
    color: 'var(--color-chart-1)'
  },
  {
    step: 5,
    title: '最终支付',
    percentage: 5,
    color: 'var(--color-chart-1)'
  }
];

const UserConversionPath: React.FC<UserConversionPathProps> = ({
  title = '典型用户转化路径',
  data = defaultData
}) => {
  return (
    <div className="bg-[var(--bg-primary)] p-5 lg:p-6 rounded-lg shadow-sm border border-[var(--border-secondary)]">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h2>

      {/* 转化路径步骤 */}
      <div className="space-y-2">
        {data.map((step) => (
          <div key={step.step} className="flex items-center gap-4">
            {/* 步骤编号 */}
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-600)] flex items-center justify-center font-bold text-sm">
              {step.step}
            </div>

            {/* 步骤内容 */}
            <div className="flex-grow">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-[var(--text-primary)]">{step.title}</span>
                <span className="font-semibold text-[var(--text-secondary)]">{step.percentage}%</span>
              </div>
              <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5 mt-1">
                <Progress
                  value={step.percentage}
                  className="h-2.5"
                  style={{
                    '--progress-background': step.color,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-2 mt-6">
        <Button variant="outline" className="flex-1 text-sm font-semibold">
          自定义维度
        </Button>
        <Button variant="outline" className="flex-1 text-sm font-semibold">
          流失分析
        </Button>
      </div>
    </div>
  );
};

export default UserConversionPath;