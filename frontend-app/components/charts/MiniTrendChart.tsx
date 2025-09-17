import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { type MiniTrendChartProps } from '@/types/charts';

const MiniTrendChart: React.FC<MiniTrendChartProps> = ({
  data,
  color,
  className = "h-16 -mb-4 -mx-4",
  height = "100%"
}) => {
  const gradientId = React.useId();

  const chartConfig: ChartConfig = {
    value: {
      label: "趋势",
      color: color,
    },
  };

  const formattedData = React.useMemo(() =>
    data.map((point, index) => ({
      index,
      value: point.y
    })), [data]
  );

  return (
    <div className={className} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            aria-label="趋势图表"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity="0.3" />
                <stop offset="95%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MiniTrendChart;