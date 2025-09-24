import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  subtitle
}) => {
  return (
    <Card className="relative group">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] truncate">
          {title}
        </h3>
        <p className="text-3xl font-bold text-[var(--text-primary)] my-2">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)] mb-1">
            {subtitle}
          </p>
        )}
        {change && (
          <div className="flex items-center text-sm">
            <div className={`flex items-center font-semibold ${
              isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
            <span className="text-[var(--text-secondary)] ml-1.5">环比</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;