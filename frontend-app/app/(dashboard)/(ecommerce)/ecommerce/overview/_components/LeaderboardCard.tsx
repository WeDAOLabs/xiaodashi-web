'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StorePerformance {
  id: string;
  rank: number;
  name: string;
  gmv: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface StoreItemProps {
  store: StorePerformance;
}

const StoreItem: React.FC<StoreItemProps> = ({ store }) => {
  const formatGMV = (value: number) => {
    return `¥${(value / 10000).toFixed(0)}万`;
  };

  const formatConversionRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-[var(--success-color)]" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-[var(--danger-color)]" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center">
      <div className="text-lg font-semibold text-[var(--text-tertiary)] w-6">
        {store.rank}
      </div>
      <div className="flex-1 ml-4">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {store.name}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">
          GMV: {formatGMV(store.gmv)} | 转化率: {formatConversionRate(store.conversionRate)}
        </p>
      </div>
      {getTrendIcon(store.trend)}
    </div>
  );
};

const LeaderboardCard: React.FC = () => {
  const storeData: StorePerformance[] = [
    {
      id: '1',
      rank: 1,
      name: '潮流前线旗舰店',
      gmv: 12500000,
      conversionRate: 5.8,
      trend: 'up',
    },
    {
      id: '2',
      rank: 2,
      name: '居家生活馆',
      gmv: 9800000,
      conversionRate: 4.2,
      trend: 'up',
    },
    {
      id: '3',
      rank: 3,
      name: '数码先锋专营店',
      gmv: 8500000,
      conversionRate: 6.1,
      trend: 'down',
    },
    {
      id: '4',
      rank: 4,
      name: '美妆个护优选',
      gmv: 7200000,
      conversionRate: 3.9,
      trend: 'stable',
    },
    {
      id: '5',
      rank: 5,
      name: '运动户外装备',
      gmv: 6500000,
      conversionRate: 4.5,
      trend: 'up',
    },
  ];

  return (
    <div className="lg:col-span-1 xl:col-span-1">
      <Card className="h-full">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">多店铺绩效榜单</h3>
            <Button
              variant="ghost"
              className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-medium"
            >
              查看详情
            </Button>
          </div>

          <div className="space-y-4">
            {storeData.map((store) => (
              <StoreItem key={store.id} store={store} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardCard;