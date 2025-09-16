import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis } from 'recharts';

const ABTestMonitor: React.FC = () => {
  return (
    <>
      <div className="mt-6 border border-[var(--border-primary)] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[var(--text-primary)]">正在进行的A/B测试</h3>
          <span className="text-xs font-semibold bg-[var(--color-info-100)] text-[var(--color-info-600)] px-2 py-1 rounded-full">
            进行中 (2/3天)
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-1">【新品推荐话术】A/B测试</p>

        <div className="flex justify-around text-center mt-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">版本 A</p>
            <p className="text-3xl font-bold text-[var(--color-success-600)]">21.5%</p>
            <p className="text-sm text-[var(--color-success-600)]">转化率</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">版本 B</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">18.2%</p>
            <p className="text-sm text-[var(--text-secondary)]">转化率</p>
          </div>
        </div>

        <div className="h-32 mt-2 -mx-4">
          <ChartContainer
            config={{
              versionA: {
                label: '版本 A',
                color: 'var(--color-success-600)',
              },
              versionB: {
                label: '版本 B',
                color: 'var(--text-secondary)',
              },
            }}
            className="h-full w-full"
          >
            <LineChart
              data={[
                { day: '第一天', versionA: 19.5, versionB: 17.8 },
                { day: '第二天', versionA: 20.8, versionB: 18.9 },
                { day: '第三天', versionA: 21.5, versionB: 18.2 },
              ]}
              margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              />
              <Line
                type="monotone"
                dataKey="versionA"
                stroke="var(--color-success-600)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-success-600)', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="versionB"
                stroke="var(--text-secondary)"
                strokeWidth={2}
                dot={{ fill: 'var(--text-secondary)', r: 3 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="flex justify-between items-center text-sm text-[var(--text-secondary)] mt-2">
          <span>已触达: 3,200 人</span>
          <a href="#" className="text-[var(--color-primary-500)] hover:underline flex items-center gap-1">
            查看详细报告
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>

      <div className="mt-6 bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4 rounded-lg">
        <h3 className="font-semibold text-[var(--text-primary)]">AI测试建议</h3>
        <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">
          根据当前测试数据，版本A的转化率高于版本B约3.3个百分点。建议继续完成剩余测试周期，以确认结果稳定性。若希望提升整体转化率，可优先选择版本A进行全量推送。
        </p>
      </div>
    </>
  );
};

export default ABTestMonitor;