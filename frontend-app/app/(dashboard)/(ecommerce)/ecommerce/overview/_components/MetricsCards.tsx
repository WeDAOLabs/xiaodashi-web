'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
  children
}) => (
  <Card className="relative group">
    <CardContent className="p-5">
      <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
      <div className="mt-2 flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
      </div>

      {subtitle && (
        <p className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</p>
      )}

      {change && (
        <div className="mt-2 flex items-center text-xs">
          <span
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full font-semibold ${
              isPositive
                ? 'text-[var(--success-color)] bg-[var(--success-bg)]'
                : 'text-[var(--danger-color)] bg-[var(--danger-bg)]'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{change}</span>
          </span>
          <span className="ml-2 text-[var(--text-tertiary)]">vs 上一周期</span>
        </div>
      )}

      {children}
    </CardContent>
  </Card>
);

interface AIHealthCardProps {
  score: number;
  issues: number;
}

const AIHealthCard: React.FC<AIHealthCardProps> = ({ score, issues }) => (
  <Card className="relative group">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">AI运营健康度</h3>
        <p className="text-3xl font-bold text-[var(--success-color)] mt-1">{score}分</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-2">{issues}个待改进项</p>
      </div>
      <CheckCircle className="w-16 h-16 text-[var(--success-color)]" strokeWidth={1} />
    </CardContent>
  </Card>
);

const MetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="总GMV"
        value="¥8,560,000"
        change="+12.5%"
        isPositive={true}
      />

      <MetricCard
        title="总订单数"
        value="45,210"
        change="+8.2%"
        isPositive={true}
      />

      <MetricCard
        title="平均转化率"
        value="4.75%"
        change="-0.5%"
        isPositive={false}
      />

      <AIHealthCard score={92} issues={3} />
    </div>
  );
};

export default MetricsCards;