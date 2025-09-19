'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PersonaInfo {
  age: number;
  location: string;
  occupation: string;
  income: string;
}

interface ConsumerBehavior {
  shoppingPreference: string;
  priceSensitivity: string;
  brandLoyalty: string;
}

interface PersonaDetailInfoProps {
  personalInfo: PersonaInfo;
  consumerBehavior: ConsumerBehavior;
}

const PersonaDetailInfo: React.FC<PersonaDetailInfoProps> = ({
  personalInfo,
  consumerBehavior
}) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border border-[var(--border-primary)] shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">关键信息</h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li><strong>年龄:</strong> {personalInfo.age}</li>
            <li><strong>地域:</strong> {personalInfo.location}</li>
            <li><strong>职业:</strong> {personalInfo.occupation}</li>
            <li><strong>收入:</strong> {personalInfo.income}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Consumer Behavior */}
      <Card className="border border-[var(--border-primary)] shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">消费行为</h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li>
              <strong>购物偏好:</strong><br />
              {consumerBehavior.shoppingPreference}
            </li>
            <li>
              <strong>价格敏感度:</strong><br />
              {consumerBehavior.priceSensitivity}
            </li>
            <li>
              <strong>品牌忠诚度:</strong><br />
              {consumerBehavior.brandLoyalty}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaDetailInfo;