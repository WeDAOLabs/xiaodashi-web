'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ActivityType } from './ActivityTypeSelector';

interface CouponConfig {
  couponValue: string;
  usageThreshold: string;
  quantity: number;
  limitPerUser: number;
}

interface CouponConfigFormProps {
  activityType: ActivityType;
  couponConfig: CouponConfig;
  onConfigChange: (config: CouponConfig) => void;
}

const CouponConfigForm: React.FC<CouponConfigFormProps> = ({
  activityType,
  couponConfig,
  onConfigChange
}) => {
  const handleInputChange = (field: keyof CouponConfig) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'quantity' || field === 'limitPerUser'
      ? parseInt(e.target.value) || 0
      : e.target.value;

    onConfigChange({
      ...couponConfig,
      [field]: value
    });
  };

  // 根据活动类型获取标题
  const getConfigTitle = () => {
    switch (activityType) {
      case 'cash-coupon':
        return '现金券 配置';
      case 'discount-coupon':
        return '折扣券 配置';
      case 'full-reduction':
        return '满减活动 配置';
      case 'flash-sale':
        return '秒杀活动 配置';
      case 'limited-discount':
        return '限时折扣 配置';
      case 'n-for-m':
        return 'N件M折 配置';
      case 'buy-m-get-n':
        return '买M送N 配置';
      case 'free-shipping':
        return '免运费 配置';
      default:
        return '优惠 配置';
    }
  };

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">
          {getConfigTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="couponValue" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              优惠券面额
            </Label>
            <Input
              id="couponValue"
              placeholder="例如: 50元 或 8折"
              value={couponConfig.couponValue}
              onChange={handleInputChange('couponValue')}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="usageThreshold" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              使用门槛
            </Label>
            <Input
              id="usageThreshold"
              placeholder="例如: 满300元可用"
              value={couponConfig.usageThreshold}
              onChange={handleInputChange('usageThreshold')}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="quantity" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              发放数量
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="1000"
              value={couponConfig.quantity}
              onChange={handleInputChange('quantity')}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="limitPerUser" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              每人限领张数
            </Label>
            <Input
              id="limitPerUser"
              type="number"
              placeholder="1"
              value={couponConfig.limitPerUser}
              onChange={handleInputChange('limitPerUser')}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponConfigForm;