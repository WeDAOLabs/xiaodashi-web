'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Pie, PieChart, Cell } from 'recharts';

interface SentimentData {
  sentiment: string;
  value: number;
  fill: string;
}

interface CompetitorSentiment {
  name: string;
  data: SentimentData[];
  keywords: string[];
}

interface UserSentimentComparisonProps {
  competitors: CompetitorSentiment[];
  className?: string;
}

const chartConfig = {
  positive: {
    label: "正面",
    color: "#16a34a",
  },
  negative: {
    label: "负面",
    color: "#dc2626",
  },
  neutral: {
    label: "中性",
    color: "#6b7280",
  },
} satisfies ChartConfig;

const UserSentimentComparison: React.FC<UserSentimentComparisonProps> = ({ competitors, className }) => {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 text-center">用户评价对比</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitors.map((competitor, index) => (
          <div key={index} className="flex flex-col">
            <h4 className="font-semibold text-center mb-2 text-[var(--text-primary)]">{competitor.name}</h4>
            <div className="flex-grow h-64">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={competitor.data}
                    dataKey="value"
                    nameKey="sentiment"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={0}
                    strokeWidth={2}
                    label={({ sentiment, value }) => `${sentiment} ${value}%`}
                    labelLine={false}
                  >
                    {competitor.data.map((entry, entryIndex) => (
                      <Cell key={`cell-${entryIndex}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="mt-4 p-3 bg-[var(--bg-secondary)] rounded-lg">
              <h5 className="font-semibold text-sm mb-2 text-[var(--text-primary)]">热门词云</h5>
              <div className="flex flex-wrap gap-2">
                {competitor.keywords.map((keyword, keywordIndex) => (
                  <Badge
                    key={keywordIndex}
                    variant="secondary"
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSentimentComparison;