import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { type ConversationTypePieChartProps } from '@/types/charts';

const defaultConversationData = [
  { name: 'consultation', label: '产品咨询', value: 45, fill: '#3b82f6' },
  { name: 'service', label: '售后服务', value: 35, fill: '#10b981' },
  { name: 'complaint', label: '投诉建议', value: 20, fill: '#f59e0b' }
];

const ConversationTypePieChart: React.FC<ConversationTypePieChartProps> = ({
  data = defaultConversationData,
  className,
  height = "48"
}) => {
  const chartConfig: ChartConfig = React.useMemo(() => {
    return data.reduce((config, item) => {
      config[item.name] = {
        label: item.label,
        color: item.fill
      };
      return config;
    }, {} as ChartConfig);
  }, [data]);
  const totalValue = React.useMemo(() =>
    data.reduce((sum, item) => sum + item.value, 0), [data]
  );

  return (
    <div className={className}>
      <h3 className="font-semibold text-center mb-2">对话类型分析</h3>
      <div className={`h-${height} relative`}>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="white"
                strokeWidth={5}
                aria-label="对话类型分布饼图"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 中心文本显示 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">{totalValue}</div>
            <div className="text-xs text-[var(--text-secondary)]">总对话量</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-4 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: item.fill }}
              aria-label={`${item.label}指示器`}
            ></span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationTypePieChart;