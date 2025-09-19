import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserLifecycleChartProps {}

const lifecycleData = [
  { name: 'new', label: '新用户', value: 20, count: 30000, fill: 'var(--color-new)' },
  { name: 'active', label: '活跃用户', value: 45, count: 67500, fill: 'var(--color-active)' },
  { name: 'dormant', label: '休眠用户', value: 25, count: 37500, fill: 'var(--color-dormant)' },
  { name: 'churn', label: '流失用户', value: 10, count: 15000, fill: 'var(--color-churn)' }
];

const chartConfig: ChartConfig = {
  new: {
    label: '新用户',
    color: '#3B82F6'
  },
  active: {
    label: '活跃用户',
    color: '#10B981'
  },
  dormant: {
    label: '休眠用户',
    color: '#F59E0B'
  },
  churn: {
    label: '流失用户',
    color: '#EF4444'
  }
};

const UserLifecycleChart: React.FC<UserLifecycleChartProps> = () => {
  return (
    <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm w-full lg:max-w-sm">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">用户生命周期分布</h2>

      <div className="w-full h-48 relative">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={lifecycleData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {lifecycleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* 中心文本显示 - 修复定位问题 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-center">
            <div className="text-xs text-[var(--text-secondary)]">平均LTV</div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">¥265</div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {lifecycleData.map((item) => (
          <div key={item.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartConfig[item.name]?.color }}></span>
              <span className="text-[var(--text-secondary)]">{item.label} ({item.value}%)</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">{item.count.toLocaleString()}人</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button variant="secondary" className="w-full py-2 text-sm font-medium">
          查看详细报告
        </Button>
        <Button variant="secondary" className="w-full py-2 text-sm font-medium">
          下载报告
        </Button>
      </div>
    </div>
  );
};

export default UserLifecycleChart;