import React from 'react';

interface SpaceProgressProps {
  used: number;
  total: number;
  unit?: string;
}

const SpaceProgress: React.FC<SpaceProgressProps> = ({
  used,
  total,
  unit = 'GB'
}) => {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
        <span>空间占用</span>
        <span>{used} / {total} {unit}</span>
      </div>
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-1.5">
        <div
          className="bg-[var(--color-primary-500)] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SpaceProgress;