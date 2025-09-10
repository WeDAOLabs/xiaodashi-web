
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ToolCardProps {
  icon: React.ElementType;
  title: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title }) => {
  return (
    <Card className="border-[var(--border-secondary)] shadow-none">
      <CardContent className="flex flex-1 gap-3 items-center p-4">
        <Icon className="size-6 text-[var(--text-primary)]" />
        <h2 className="text-base font-bold leading-tight text-[var(--text-primary)]">{title}</h2>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
