'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const TrendChart: React.FC = () => {
  // GMV趋势数据
  const gmvData = [
    { month: 'Jan', value: 100000 },
    { month: 'Feb', value: 150000 },
    { month: 'Mar', value: 120000 },
    { month: 'Apr', value: 200000 },
    { month: 'May', value: 250000 },
    { month: 'Jun', value: 280000 },
  ];

  const chartConfig = {
    value: {
      label: 'GMV',
      color: 'var(--color-chart-1)',
    },
  };

  return (
    <div className="lg:col-span-2 xl:col-span-3">
      <Card className="h-full">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">总GMV趋势</h3>
            <Button
              variant="ghost"
              className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-medium"
            >
              查看详情
            </Button>
          </div>

          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gmvData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-chart-1)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'var(--color-chart-1)', strokeWidth: 2 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          typeof value === 'number' ? `¥${(value / 1000).toFixed(0)}K` : String(value),
                          'GMV'
                        ]}
                      />
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendChart;