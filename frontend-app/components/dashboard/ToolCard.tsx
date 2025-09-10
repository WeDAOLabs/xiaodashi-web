
import React from 'react';

interface ToolCardProps {
  icon: React.ElementType;
  title: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title }) => {
  return (
    <div className="flex flex-1 gap-3 rounded-lg border border-[var(--border-secondary)] bg-white p-4 items-center">
      <Icon className="size-6 text-[var(--text-primary)]" />
      <h2 className="text-base font-bold leading-tight text-[var(--text-primary)]">{title}</h2>
    </div>
  );
};

export default ToolCard;
