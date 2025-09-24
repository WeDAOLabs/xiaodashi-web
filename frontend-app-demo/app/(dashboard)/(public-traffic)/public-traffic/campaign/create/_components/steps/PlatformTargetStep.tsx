'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { StepProps, Platform, MarketingObjective } from '../types/campaign';

// 平台图标组件
const PlatformIcons = {
  douyin: (
    <svg className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.35 2.15a.7.7 0 00-.7 0C7.1 4.5 4.55 7.1 2.15 11.65a.7.7 0 00.7.7c2.4-1.25 4.1-3.25 5.5-5.55v7.6a4.2 4.2 0 108.4 0V5.7a.7.7 0 00-.7-.7c-2.4 1.25-4.1 3.25-5.5 5.55V2.85a.7.7 0 00-.7-.7zM16.5 14a2.8 2.8 0 11-5.6 0 2.8 2.8 0 015.6 0z" />
    </svg>
  ),
  wechat: (
    <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.142 2.54 7.69 6.09 9.186-.34-.94-.07-2.01.12-2.73.19-.72.48-1.42.88-2.06.4-.64.92-1.2 1.5-1.68.58-.48 1.22-.84 1.9-1.08.68-.24 1.4-.36 2.13-.36s1.45.12 2.13.36c.68.24 1.32.6 1.9 1.08.58.48 1.1 1.04 1.5 1.68.4.64.69 1.34.88 2.06.19.72.46 1.79.12 2.73C19.46 19.69 22 16.142 22 12c0-5.523-4.477-10-10-10zm-4.12 9.1a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm8.24 0a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" />
    </svg>
  ),
  baidu: (
    <svg className="h-8 w-8 text-blue-600" viewBox="0 0 256 256" fill="currentColor">
      <path d="M136.25 210.37c-38.25-3.37-64.25-31.5-64.25-68.5s26-65.13 64.25-68.5c15.75-1.5 32.38 3.5 45.75 14.5l-20.75 22.88c-6-4.87-14.13-7.75-23.75-7.75-19.88 0-33.13 13.88-33.13 33.75s13.25 33.75 33.13 33.75c9.62 0 17.75-2.88 23.75-7.75l20.75 22.88c-13.37 11-30 16-45.75 14.5zm-5.12-164.62c-23.25 0-44.5 9-60.63 24.12-32.25 30.25-36.25 78.88-10.25 115.63 28.38 40.25 80.38 52.87 122.5 29 39-22 53.62-71.12 36.62-113.63-14.5-36.25-48.25-62.25-86.5-65.37-7.25-.63-14.37-.25-21.75.25z" />
    </svg>
  ),
  xiaohongshu: (
    <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 7H11v3.5h2V7h2.5v10H13v-4h-2v4H8.5V7z" />
    </svg>
  ),
  meituan: (
    <svg className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.5,8.15a1,1,0,0,0-1,.17L18,10.61V8a1,1,0,0,0-1-1H7A1,1,0,0,0,6,8V16a1,1,0,0,0,1,1h3.42l-1.6,2.57A1,1,0,0,0,9.7,21h4.6a1,1,0,0,0,.88-.55l5.3-9.54a1,1,0,0,0-.11-1.12A1,1,0,0,0,21.5,8.15ZM16,14.28,13.3,18H10.7L12,15.82l-3-2.15V9h7v1.61l2.5-1.78v5.3Z" />
    </svg>
  )
};

// 平台选项数据
const platformOptions = [
  { key: 'douyin' as Platform, name: '抖音', icon: PlatformIcons.douyin },
  { key: 'wechat' as Platform, name: '微信', icon: PlatformIcons.wechat },
  { key: 'baidu' as Platform, name: '百度', icon: PlatformIcons.baidu },
  { key: 'xiaohongshu' as Platform, name: '小红书', icon: PlatformIcons.xiaohongshu },
  { key: 'meituan' as Platform, name: '美团', icon: PlatformIcons.meituan }
];

// 营销目标选项数据
const objectiveOptions = [
  { key: 'brand' as MarketingObjective, name: '品牌曝光' },
  { key: 'traffic' as MarketingObjective, name: '引流至私域' },
  { key: 'conversion' as MarketingObjective, name: '商品销售转化' },
  { key: 'leads' as MarketingObjective, name: '收集线索' }
];

const PlatformTargetStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  validation
}) => {
  const handlePlatformSelect = (platform: Platform) => {
    onUpdate({ platform });
  };

  const handleObjectiveSelect = (objective: MarketingObjective) => {
    onUpdate({ objective });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">第一步: 选择平台与目标</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">选择您想要投放广告的公域平台和本次营销的核心目标。</p>

      {/* 平台选择 */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">目标广告平台选择</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {platformOptions.map((platform) => {
            const isSelected = formData.platform === platform.key;
            return (
              <div
                key={platform.key}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--primary-color)] bg-[var(--color-primary-50)]'
                    : 'border-[var(--border-primary)] bg-white hover:border-[var(--accent-color)]'
                }`}
                onClick={() => handlePlatformSelect(platform.key)}
              >
                <div className="flex flex-col items-center space-y-2">
                  {platform.icon}
                  <span className="font-medium">{platform.name}</span>
                </div>
                {isSelected && (
                  <Check className="absolute right-2 top-2 h-5 w-5 text-[var(--primary-color)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 营销目标选择 */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">营销目标选择</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {objectiveOptions.map((objective) => {
            const isSelected = formData.objective === objective.key;
            return (
              <div
                key={objective.key}
                className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--primary-color)] bg-[var(--color-primary-50)]'
                    : 'border-[var(--border-primary)] bg-white hover:border-[var(--accent-color)]'
                }`}
                onClick={() => handleObjectiveSelect(objective.key)}
              >
                <span className="font-medium">{objective.name}</span>
                {isSelected && (
                  <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-color)]">
                    <Check className="h-5 w-5 p-0.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 验证错误提示 */}
      {!validation.isValid && validation.errors.length > 0 && (
        <div className="mt-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="mt-10 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!validation.isValid}
          className="px-6 py-2.5 text-sm font-semibold"
        >
          下一步
        </Button>
      </div>
    </div>
  );
};

export default PlatformTargetStep;