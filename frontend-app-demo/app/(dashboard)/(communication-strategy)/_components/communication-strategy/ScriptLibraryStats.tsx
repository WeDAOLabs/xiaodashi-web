import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis } from 'recharts';

const ScriptLibraryStats: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 话术使用趋势图 */}
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">话术使用趋势</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">近6个月AI话术使用量持续增长</p>

        <div className="h-40 mt-2">
          <ChartContainer
            config={{
              usage: {
                label: '使用量',
                color: 'var(--color-primary-500)',
              },
            }}
            className="h-full w-full"
          >
            <LineChart
              data={[
                { month: '1月', usage: 3200 },
                { month: '2月', usage: 4800 },
                { month: '3月', usage: 6200 },
                { month: '4月', usage: 5500 },
                { month: '5月', usage: 7800 },
                { month: '6月', usage: 8500 },
              ]}
              margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="var(--color-primary-500)"
                strokeWidth={2}
                dot={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* 场景转化效果 */}
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">场景转化效果</h3>
        <div className="space-y-3 mt-3">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">新品推荐</span>
              <span className="font-semibold text-[var(--text-primary)]">18%</span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 mt-1">
              <div
                className="bg-[var(--color-info-600)] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '54%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">生日祝福</span>
              <span className="font-semibold text-[var(--text-primary)]">25%</span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 mt-1">
              <div
                className="bg-[var(--color-info-600)] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">活动通知</span>
              <span className="font-semibold text-[var(--text-primary)]">15%</span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 mt-1">
              <div
                className="bg-[var(--color-info-600)] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '45%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">客户关怀</span>
              <span className="font-semibold text-[var(--text-primary)]">12%</span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 mt-1">
              <div
                className="bg-[var(--color-info-600)] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '36%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">用户激活</span>
              <span className="font-semibold text-[var(--text-primary)]">10%</span>
            </div>
            <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5 mt-1">
              <div
                className="bg-[var(--color-info-600)] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: '30%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptLibraryStats;