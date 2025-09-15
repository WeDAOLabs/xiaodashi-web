import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => {
  return (
    <Card className="bg-[var(--color-neutral-50)] rounded-lg">
      <CardContent className="p-4">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <p className="text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;