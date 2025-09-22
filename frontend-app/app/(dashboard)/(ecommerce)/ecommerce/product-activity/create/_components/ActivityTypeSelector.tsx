'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ActivityType = 'discount-coupon' | 'cash-coupon' | 'full-reduction' | 'flash-sale' |
  'limited-discount' | 'n-for-m' | 'buy-m-get-n' | 'free-shipping';

interface ActivityTypeSelectorProps {
  selectedType: ActivityType;
  onTypeChange: (type: ActivityType) => void;
}

const activityTypes = [
  { key: 'discount-coupon' as ActivityType, label: '折扣券' },
  { key: 'cash-coupon' as ActivityType, label: '现金券' },
  { key: 'full-reduction' as ActivityType, label: '满减活动' },
  { key: 'flash-sale' as ActivityType, label: '秒杀活动' },
  { key: 'limited-discount' as ActivityType, label: '限时折扣' },
  { key: 'n-for-m' as ActivityType, label: 'N件M折' },
  { key: 'buy-m-get-n' as ActivityType, label: '买M送N' },
  { key: 'free-shipping' as ActivityType, label: '免运费' },
];

const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          活动类型选择
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-3">
          {activityTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => onTypeChange(type.key)}
              className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-colors ${
                selectedType === type.key
                  ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white'
                  : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--primary-color)]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTypeSelector;