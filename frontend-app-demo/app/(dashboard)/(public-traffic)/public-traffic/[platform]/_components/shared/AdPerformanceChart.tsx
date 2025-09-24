import React, { useState } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

// 导出时间选择器组件供外部使用
export const TimePeriodSelect: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}> = ({ value, onValueChange, className = "w-32" }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className={className}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {timePeriods.map((period) => (
        <SelectItem key={period.value} value={period.value}>
          {period.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface AdPerformanceData {
  date: string;
  spend: number;
  conversions: number;
}

interface AdPerformanceChartProps {
  className?: string;
  showHeader?: boolean;
  onPeriodChange?: (period: string) => void;
  selectedPeriod?: string;
}

const chartConfig: ChartConfig = {
  spend: {
    label: '花费 (元)',
    color: 'var(--primary-color)',
  },
  conversions: {
    label: '转化数',
    color: '#10b981',
  },
};

const timePeriods = [
  { value: '7days', label: '最近7天' },
  { value: '30days', label: '最近30天' },
  { value: 'month', label: '本月' },
];

const generateMockData = (period: string): AdPerformanceData[] => {
  const baseData = {
    '7days': [
      { date: '12/15', spend: 8500, conversions: 45 },
      { date: '12/16', spend: 9200, conversions: 52 },
      { date: '12/17', spend: 7800, conversions: 41 },
      { date: '12/18', spend: 10500, conversions: 58 },
      { date: '12/19', spend: 11200, conversions: 62 },
      { date: '12/20', spend: 9800, conversions: 48 },
      { date: '12/21', spend: 12000, conversions: 65 },
    ],
    '30days': [
      { date: '11/22', spend: 156000, conversions: 850 },
      { date: '11/29', spend: 162000, conversions: 920 },
      { date: '12/06', spend: 148000, conversions: 780 },
      { date: '12/13', spend: 175000, conversions: 980 },
      { date: '12/20', spend: 182000, conversions: 1050 },
    ],
    'month': [
      { date: '第1周', spend: 68000, conversions: 380 },
      { date: '第2周', spend: 72000, conversions: 420 },
      { date: '第3周', spend: 65000, conversions: 350 },
      { date: '第4周', spend: 78000, conversions: 465 },
    ],
  } as const;

  const validPeriods = ['7days', '30days', 'month'] as const;
  type ValidPeriod = typeof validPeriods[number];

  const safePeriod: ValidPeriod = validPeriods.includes(period as ValidPeriod)
    ? (period as ValidPeriod)
    : '7days';

  return [...baseData[safePeriod]];
};

const AdPerformanceChart: React.FC<AdPerformanceChartProps> = ({
  className,
  showHeader = true,
  onPeriodChange,
  selectedPeriod: externalSelectedPeriod
}) => {
  const [internalSelectedPeriod, setInternalSelectedPeriod] = useState('7days');
  const selectedPeriod = externalSelectedPeriod || internalSelectedPeriod;
  const data = generateMockData(selectedPeriod);

  const handlePeriodChange = (period: string) => {
    if (onPeriodChange) {
      onPeriodChange(period);
    } else {
      setInternalSelectedPeriod(period);
    }
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">投放数据趋势</h3>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="h-80">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
              barCategoryGap="25%"
            >
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      name === 'spend'
                        ? `¥${Number(value).toLocaleString()}`
                        : `${value}次`,
                      chartConfig[name as keyof typeof chartConfig]?.label || name
                    ]}
                  />
                }
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              />
              <YAxis
                yAxisId="spend"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="conversions"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                yAxisId="spend"
                dataKey="spend"
                fill="var(--color-spend)"
                radius={[4, 4, 0, 0]}
                name="spend"
              />
              <Bar
                yAxisId="conversions"
                dataKey="conversions"
                fill="var(--color-conversions)"
                radius={[4, 4, 0, 0]}
                name="conversions"
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[var(--primary-color)] rounded mr-2"></div>
          <span className="text-[var(--text-secondary)]">花费</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#10b981] rounded mr-2"></div>
          <span className="text-[var(--text-secondary)]">转化数</span>
        </div>
      </div>
    </div>
  );
};

export default AdPerformanceChart;