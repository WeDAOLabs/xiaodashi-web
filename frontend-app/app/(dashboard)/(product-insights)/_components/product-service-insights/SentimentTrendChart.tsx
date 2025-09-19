import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SentimentTrendChartProps {}

// 情感趋势数据
const sentimentData = [
  { month: '1月', positive: 85, negative: 5 },
  { month: '2月', positive: 82, negative: 8 },
  { month: '3月', positive: 88, negative: 4 },
  { month: '4月', positive: 86, negative: 6 },
  { month: '5月', positive: 87, negative: 5 },
  { month: '6月', positive: 90, negative: 3 },
  { month: '7月', positive: 85, negative: 5 }
];

// 图表配置
const chartConfig: ChartConfig = {
  positive: {
    label: '积极评价',
    color: '#22c55e'
  },
  negative: {
    label: '消极评价',
    color: '#ef4444'
  }
};

const SentimentTrendChart: React.FC<SentimentTrendChartProps> = () => {
  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm lg:col-span-2">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">用户反馈情感趋势</h2>
      </div>

      <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)] mt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
          <span>积极 85%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
          <span>中立 10%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          <span>消极 5%</span>
        </div>
      </div>

      <p className="text-xs text-[var(--text-tertiary)] mt-1">
        本月蛋糕产品积极评价占比85%，服务体验积极评价占比70%
      </p>

      <div className="h-48 mt-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart accessibilityLayer data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="var(--color-positive)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="var(--color-negative)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SentimentTrendChart;