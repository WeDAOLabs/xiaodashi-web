'use client';

import React, { useState } from 'react';
import ActivityTypeSelector, { type ActivityType } from './ActivityTypeSelector';
import ActivityInfoForm from './ActivityInfoForm';
import CouponConfigForm from './CouponConfigForm';

const ActivityPublishTab: React.FC = () => {
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('cash-coupon');
  const [activityInfo, setActivityInfo] = useState({
    name: '',
    banner: null as File | null,
    description: '',
    startTime: '',
    endTime: ''
  });
  const [couponConfig, setCouponConfig] = useState({
    couponValue: '',
    usageThreshold: '',
    quantity: 0,
    limitPerUser: 0
  });

  return (
    <div className="space-y-6">
      {/* 活动类型选择 */}
      <ActivityTypeSelector
        selectedType={selectedActivityType}
        onTypeChange={setSelectedActivityType}
      />

      {/* 通用活动信息 */}
      <ActivityInfoForm
        activityInfo={activityInfo}
        onInfoChange={setActivityInfo}
      />

      {/* 优惠券配置 */}
      <CouponConfigForm
        activityType={selectedActivityType}
        couponConfig={couponConfig}
        onConfigChange={setCouponConfig}
      />
    </div>
  );
};

export default ActivityPublishTab;