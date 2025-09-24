import { Progress } from '@/components/ui/progress';
import React from 'react';

interface ProgressCardProps {
  title: string;
  percentage: number;
  target: string;
  achieved: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, percentage, target, achieved }) => {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <h4 className="font-medium text-[var(--text-primary)]">{title}</h4>
        <p className="text-xs text-[var(--text-secondary)]">
          <span className="font-semibold">{percentage}%</span>
        </p>
      </div>
      <Progress
        value={percentage}
        className="w-full h-2 my-1 bg-[var(--color-neutral-200)]"
      />
      <div className="flex justify-between items-baseline text-xs text-[var(--text-secondary)]">
        <p>目标: {target}</p>
        <p>已完成: {achieved}</p>
      </div>
    </div>
  );
};

export default ProgressCard;