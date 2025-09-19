import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart } from 'recharts';

const AdoptionRateCard: React.FC = () => {
  return (
    <Card className="bg-white p-5 rounded-lg shadow-sm h-full flex flex-col">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[var(--text-primary)]">推荐话术采纳率</h3>
          <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[var(--color-success-600)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
        </div>

        <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">75%</p>

        <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 my-2">
          <div
            className="bg-[var(--color-success-600)] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: '75%' }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
          <span>目标: 85%</span>
          <span>较上月提升5%</span>
        </div>

        {/* 趋势图 */}
        <div className="h-20 -mx-5 -mb-5 mt-auto">
          <ChartContainer
            config={{
              rate: {
                label: '采纳率',
                color: 'var(--color-success-600)',
              },
            }}
            className="h-full w-full"
          >
            <AreaChart
              data={[
                { month: '1月', rate: 65 },
                { month: '2月', rate: 68 },
                { month: '3月', rate: 70 },
                { month: '4月', rate: 72 },
                { month: '5月', rate: 75 },
              ]}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success-600)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-success-600)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="rate"
                stroke="var(--color-success-600)"
                strokeWidth={2}
                fill="url(#fillRate)"
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdoptionRateCard;