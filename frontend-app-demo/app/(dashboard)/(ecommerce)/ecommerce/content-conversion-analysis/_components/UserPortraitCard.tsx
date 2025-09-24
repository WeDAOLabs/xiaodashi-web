'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const UserPortraitCard: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <User className="w-5 h-5 text-[var(--primary-color)]" />
          高转化用户画像
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 text-center h-full flex flex-col justify-center">
          <div className="flex justify-center">
            <Image
              src="/images/customers/user-avatar.jpg"
              alt="User Persona"
              width={120}
              height={120}
              className="w-24 h-24 rounded-full object-cover border-4 border-[var(--primary-color)]"
              onError={(e) => {
                if (!imageError) {
                  setImageError(true);
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/images/customers/default-avatar.png';
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <strong className="text-[var(--text-primary)]">年龄:</strong>
              <span className="text-[var(--text-secondary)] ml-2">18-25岁</span>
            </p>
            <p className="text-sm">
              <strong className="text-[var(--text-primary)]">城市:</strong>
              <span className="text-[var(--text-secondary)] ml-2">一线、新一线城市</span>
            </p>
            <p className="text-sm">
              <strong className="text-[var(--text-primary)]">兴趣:</strong>
              <span className="text-[var(--text-secondary)] ml-2">美妆、潮流、追星</span>
            </p>
            <p className="text-sm">
              <strong className="text-[var(--text-primary)]">平台:</strong>
              <span className="text-[var(--text-secondary)] ml-2">抖音、小红书</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPortraitCard;