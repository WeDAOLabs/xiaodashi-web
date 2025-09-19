"use client"

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { day: 'Mon', value: 4000 },
  { day: 'Tue', value: 3000 },
  { day: 'Wed', value: 2000 },
  { day: 'Thu', value: 2780 },
  { day: 'Fri', value: 1890 },
  { day: 'Sat', value: 2390 },
  { day: 'Sun', value: 3490 },
];

const chartConfig = {
  value: {
    label: "健康度",
    color: "#007A7A",
  },
};

const HealthChart: React.FC = () => {
  return (
    <div className="h-40">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-value)"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="var(--color-value)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            className="text-xs"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
            className="text-xs"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Area
            dataKey="value"
            type="monotone"
            fill="url(#fillValue)"
            fillOpacity={0.6}
            stroke="var(--color-value)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default HealthChart;