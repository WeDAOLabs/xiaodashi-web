import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const hourlyData = [
  { hour: '0时', ai: 150, human: 50 },
  { hour: '3时', ai: 100, human: 35 },
  { hour: '6时', ai: 140, human: 40 },
  { hour: '9时', ai: 450, human: 110 },
  { hour: '12时', ai: 380, human: 95 },
  { hour: '15时', ai: 260, human: 60 },
  { hour: '18时', ai: 480, human: 120 },
  { hour: '21时', ai: 320, human: 70 }
];

const chartConfig: ChartConfig = {
  ai: {
    label: 'AI对话',
    color: '#86efac'
  },
  human: {
    label: '人工对话',
    color: '#3b82f6'
  }
};

interface HourlyConversationChartProps {
  selectedPeriod?: string;
}

const HourlyConversationChart: React.FC<HourlyConversationChartProps> = ({ selectedPeriod = '周末' }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">时间点对话人数分析</h3>
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md text-sm">
          <button className={`px-2 py-0.5 rounded ${selectedPeriod === '工作日' ? 'bg-white shadow' : ''}`}>
            工作日
          </button>
          <button className={`px-2 py-0.5 rounded ${selectedPeriod === '周末' ? 'bg-white shadow' : ''}`}>
            周末
          </button>
          <button className={`px-2 py-0.5 rounded ${selectedPeriod === '节假日' ? 'bg-white shadow' : ''}`}>
            节假日
          </button>
        </div>
      </div>
      <div className="h-48">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hourlyData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barCategoryGap="20%"
            >
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6e6e73' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6e6e73' }}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="ai"
                stackId="conversations"
                fill="var(--color-ai)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="human"
                stackId="conversations"
                fill="var(--color-human)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default HourlyConversationChart;