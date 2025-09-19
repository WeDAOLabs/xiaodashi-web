'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Bot } from 'lucide-react';

interface EmotionTrendData {
  month: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface AIEmotionAnalysisProps {
  topic: string;
  emotionTrendData: EmotionTrendData[];
}


const EmotionTrendChart: React.FC<{ data: EmotionTrendData[] }> = ({ data }) => {
  const chartConfig = {
    positive: {
      label: '正面情绪',
      color: 'var(--color-success-600)',
    },
    negative: {
      label: '负面情绪',
      color: 'var(--color-warning-600)',
    },
    neutral: {
      label: '中性情绪',
      color: 'var(--text-tertiary)',
    },
  };

  return (
    <div className="h-64">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              domain={[0, 100]}
            />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="var(--color-success-600)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="var(--color-warning-600)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="var(--text-tertiary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

const AIEmotionAnalysis: React.FC<AIEmotionAnalysisProps> = ({
  topic,
  emotionTrendData
}) => {
  return (
    <Card className="border border-[var(--border-primary)] shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-[var(--text-primary)] flex items-center mb-4">
          <Bot className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
          AI情绪趋势分析 (关于: {topic})
        </h3>

        {/* Emotion Trend Chart - Full Width */}
        <div className="w-full">
          <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">情绪趋势图</h4>
          <EmotionTrendChart data={emotionTrendData} />
        </div>

        <Button
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary-500)] bg-[var(--bg-primary)] border border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] transition-colors"
          variant="outline"
        >
          <Bot className="w-4 h-4" />
          AI生成内容偏好建议
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIEmotionAnalysis;