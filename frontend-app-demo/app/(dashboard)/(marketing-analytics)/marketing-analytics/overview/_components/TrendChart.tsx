import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart
} from 'recharts';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export type ChartType = 'bar' | 'line' | 'mixed';

interface ChartDataPoint {
  month: string;
  value: number;
  secondaryValue?: number;
}

interface TrendChartProps {
  title: string;
  chartType: ChartType;
  data: ChartDataPoint[];
  primaryColor?: string;
  secondaryColor?: string;
  formatValue?: (value: number) => string;
  showIcon?: boolean;
  iconType?: 'bar' | 'trend' | 'users';
}

const TrendChart: React.FC<TrendChartProps> = ({
  title,
  chartType,
  data,
  primaryColor = 'var(--chart-primary)',
  secondaryColor = 'var(--chart-secondary)',
  formatValue,
  showIcon = true,
  iconType = 'bar'
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'trend':
        return TrendingUp;
      case 'users':
        return Users;
      default:
        return BarChart3;
    }
  };

  const IconComponent = getIcon();

  const chartConfig = {
    value: {
      label: title,
      color: primaryColor,
    },
    secondaryValue: {
      label: '辅助指标',
      color: secondaryColor,
    },
  } satisfies ChartConfig;

  const tooltipFormatter = (value: unknown, name: string | number) => [
    formatValue && typeof value === 'number' ? formatValue(value) :
    typeof value === 'number' ? value.toLocaleString() : String(value),
    String(name) === 'value' ? title : '辅助指标'
  ];

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={tooltipFormatter} />}
          />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={4}
          />
        </BarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="value"
            type="natural"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      );
    }

    if (chartType === 'mixed') {
      return (
        <ComposedChart
          accessibilityLayer
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={4}
          />
          <Line
            dataKey="secondaryValue"
            type="natural"
            stroke="var(--color-secondaryValue)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      );
    }

    return <div>不支持的图表类型</div>;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            {showIcon && (
              <IconComponent className="w-5 h-5 text-[var(--text-secondary)]" />
            )}
            <h4 className="font-semibold text-sm text-[var(--text-primary)]">
              {title}
            </h4>
          </div>
          <div className="flex-grow w-full h-[200px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              {renderChart()}
            </ChartContainer>
          </div>
          {/* 图例 */}
          <div className="flex justify-center items-center mt-3 text-sm space-x-4">
            <div className="flex items-center">
              <span
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: 'var(--color-value)' }}
              ></span>
              <span className="text-[var(--text-secondary)]">
                {chartType === 'mixed' ? '增长' : title}
              </span>
            </div>
            {chartType === 'mixed' && (
              <div className="flex items-center">
                <span
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: 'var(--color-secondaryValue)' }}
                ></span>
                <span className="text-[var(--text-secondary)]">流失</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;