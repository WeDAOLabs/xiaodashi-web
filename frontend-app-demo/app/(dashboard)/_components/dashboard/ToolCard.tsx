import { BorderlessCard, BorderlessCardContent } from '@/components/ui/borderless-card';
import React from 'react';

interface ToolCardProps {
  icon: React.ElementType;
  title: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title }) => {
  return (
    <BorderlessCard variant="default">
      <BorderlessCardContent direction="row">
        <Icon className="size-6 text-[var(--text-primary)] shrink-0" />
        <h2 className="text-base font-bold leading-tight text-[var(--text-primary)]">{title}</h2>
      </BorderlessCardContent>
    </BorderlessCard>
  );
};

export default ToolCard;
