import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { KPICardProps } from '../types';

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
  chart
}) => {
  return (
    <Card className="relative group cursor-pointer hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <button
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`查看${title}详情`}
        >
          <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
        </button>

        <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">{title}</p>

        <div className="flex justify-between items-baseline">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {subtitle && <p className="text-xs text-[var(--text-tertiary)]">{subtitle}</p>}
        </div>

        <div className="flex items-center text-sm mt-2">
          <span className={`flex items-center mr-2 font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </span>
          <span className="text-[var(--text-tertiary)]">vs 上期</span>
        </div>

        {chart && (
          <div className="h-20 w-full mt-3 -mb-2">
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;