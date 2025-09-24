import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis } from 'recharts';
import { TrendChartProps } from '../types';

const TrendChart: React.FC<TrendChartProps> = React.memo(({
  data,
  color,
  dataKey,
  label,
  formatValue
}) => {
  const chartConfig = React.useMemo(() => ({
    [dataKey]: {
      label: label,
      color: color,
    },
  }), [dataKey, label, color]);

  const tooltipFormatter = React.useCallback(
    (value: unknown) => [
      formatValue && typeof value === 'number'
        ? formatValue(value)
        : typeof value === 'number'
          ? value.toLocaleString()
          : String(value),
      label
    ] as [React.ReactNode, string],
    [formatValue, label]
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <RechartsLineChart
        data={[...data]}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10 }}
          hide
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10 }}
          hide
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={tooltipFormatter} />}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
});

TrendChart.displayName = 'TrendChart';

export default TrendChart;