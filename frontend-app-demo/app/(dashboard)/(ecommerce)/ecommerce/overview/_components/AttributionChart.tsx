'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const AttributionChart: React.FC = () => {
  // 营销归因数据
  const attributionData = [
    {
      category: '智能内容创作',
      investment: 15000,
      gmv: 150000,
    },
    {
      category: '智能公域投放',
      investment: 45000,
      gmv: 450000,
    },
    {
      category: '智能私域运营',
      investment: 20000,
      gmv: 300000,
    },
  ];

  const chartConfig = {
    investment: {
      label: '投入',
      color: 'var(--color-chart-2)',
    },
    gmv: {
      label: '产出GMV',
      color: 'var(--color-chart-1)',
    },
  };

  return (
    <div className="lg:col-span-3 xl:col-span-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">营销效果归因</h3>
            <Button
              variant="ghost"
              className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-medium"
            >
              查看详情
            </Button>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-4">
            清晰展示各营销模块的投入如何转化为电商端的GMV和订单。
          </p>

          <div className="h-[350px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attributionData}
                  margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
                  barCategoryGap="25%"
                >
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--color-chart-2)' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--color-chart-1)' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="investment"
                    fill="var(--color-chart-2)"
                    radius={[2, 2, 0, 0]}
                    name="投入"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="gmv"
                    fill="var(--color-chart-1)"
                    radius={[2, 2, 0, 0]}
                    name="产出GMV"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          name === 'investment'
                            ? `¥${Number(value).toLocaleString()}`
                            : `¥${Number(value).toLocaleString()}`,
                          chartConfig[name as keyof typeof chartConfig]?.label || name
                        ]}
                      />
                    }
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="rect"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttributionChart;