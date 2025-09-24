import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUpIcon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TopStatsCardsProps {}

const TopStatsCards: React.FC<TopStatsCardsProps> = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 私域用户总数 */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">私域用户总数</p>
          <p className="text-4xl font-bold text-[var(--text-primary)] mt-2">150,000</p>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center text-green-600 font-semibold">
            <ArrowUpIcon className="w-4 h-4" />
            <span>10% 月环比</span>
          </div>
          <span className="text-[var(--text-secondary)]">较上月新增13,600人</span>
        </div>
      </div>

      {/* 自动化标签覆盖率 */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">自动化标签覆盖率</p>
          <p className="text-4xl font-bold text-[var(--text-primary)] mt-2">85%</p>
        </div>
        <div className="mt-3">
          <Progress value={85} className="w-full h-2" />
          <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] mt-1">
            <span>目标: 90%</span>
            <span>较上月提升5%</span>
          </div>
        </div>
      </div>

      {/* 分层用户群活跃度 */}
      <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">分层用户群活跃度</p>
          <div className="flex items-baseline gap-6 mt-2">
            <div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">3次</span>
              <span className="text-[var(--text-secondary)] text-sm">/周</span>
              <p className="text-xs text-[var(--text-secondary)] mt-1">高价值用户</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">1次</span>
              <span className="text-[var(--text-secondary)] text-sm">/周</span>
              <p className="text-xs text-[var(--text-secondary)] mt-1">新入用户</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-3">高价值用户活跃度较上月提升15%</p>
      </div>
    </div>
  );
};

export default TopStatsCards;