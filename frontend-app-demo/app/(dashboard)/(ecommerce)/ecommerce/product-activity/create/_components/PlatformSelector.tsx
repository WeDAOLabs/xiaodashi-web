'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Platform {
  id: string;
  name: string;
  logoUrl: string;
  stores?: Store[];
}

interface Store {
  id: string;
  name: string;
}

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (selectedPlatforms: string[]) => void;
}

const platforms: Platform[] = [
  {
    id: 'jingdong',
    name: '京东',
    logoUrl: '/images/platforms/jingdong-logo.png',
    stores: [
      { id: 'jd-flagship', name: '京东旗舰店' },
      { id: 'jd-pop', name: '京东POP店' }
    ]
  },
  {
    id: 'douyin',
    name: '抖音',
    logoUrl: '/images/platforms/douyin-logo.png'
  },
  {
    id: 'meituan',
    name: '美团',
    logoUrl: '/images/platforms/meituan-logo.png'
  },
  {
    id: 'taobao',
    name: '淘宝',
    logoUrl: '/images/platforms/taobao-logo.png'
  }
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onPlatformChange
}) => {
  const [selectedStores, setSelectedStores] = useState<string[]>(['jd-flagship', 'jd-pop']);

  const handlePlatformToggle = (platformId: string) => {
    const isSelected = selectedPlatforms.includes(platformId);
    if (isSelected) {
      onPlatformChange(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onPlatformChange([...selectedPlatforms, platformId]);
    }
  };

  const handleStoreToggle = (storeId: string) => {
    const isSelected = selectedStores.includes(storeId);
    if (isSelected) {
      setSelectedStores(selectedStores.filter(id => id !== storeId));
    } else {
      setSelectedStores([...selectedStores, storeId]);
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-[var(--text-primary)] mb-3">选择目标平台与店铺</h4>
      <div className="space-y-3">
        {platforms.map((platform) => (
          <div key={platform.id} className="p-3 border border-[var(--border-secondary)] rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  {/* 临时使用背景色替代图标 */}
                  <div className="w-6 h-6 bg-[var(--primary-color)] rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {platform.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <span className="font-medium text-[var(--text-secondary)]">{platform.name}</span>
              </div>
              <Checkbox
                checked={selectedPlatforms.includes(platform.id)}
                onCheckedChange={() => handlePlatformToggle(platform.id)}
                className="h-4 w-4"
              />
            </div>
            {platform.stores && selectedPlatforms.includes(platform.id) && (
              <div className="mt-3 pl-9 space-y-2">
                {platform.stores.map((store) => (
                  <div key={store.id} className="flex items-center">
                    <Checkbox
                      checked={selectedStores.includes(store.id)}
                      onCheckedChange={() => handleStoreToggle(store.id)}
                      className="h-4 w-4 mr-2"
                    />
                    <label className="text-sm text-[var(--text-tertiary)]">{store.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;