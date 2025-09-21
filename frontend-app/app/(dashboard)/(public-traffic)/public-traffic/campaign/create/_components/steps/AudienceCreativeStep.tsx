'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { StepProps, AudienceType, CreativeSource } from '../types/campaign';

// 受众类型选项数据
const audienceOptions = [
  { key: 'ai' as AudienceType, name: 'AI推荐受众包' },
  { key: 'existing' as AudienceType, name: '选择已有受众包' },
  { key: 'custom' as AudienceType, name: '自定义受众' }
];

// 创意来源选项数据
const creativeOptions = [
  { key: 'library' as CreativeSource, name: '从素材中心选择' },
  { key: 'ai_generate' as CreativeSource, name: 'AI智能生成创意' }
];

const AudienceCreativeStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
  validation
}) => {
  const handleAudienceTypeSelect = (type: AudienceType) => {
    onUpdate({
      audience: {
        ...formData.audience,
        type
      }
    });
  };

  const handleCreativeSourceSelect = (source: CreativeSource) => {
    onUpdate({
      creative: {
        ...formData.creative,
        source
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">第三步: 受众与创意</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">选择目标受众并关联创意素材，或利用AI能力进行生成和优化。</p>

      {/* 受众定向设置 */}
      <div className="mt-6 border-t border-[var(--border-secondary)] pt-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">受众定向设置</h3>
        <div className="mt-4 flex space-x-4 rounded-lg bg-[var(--bg-secondary)] p-1">
          {audienceOptions.map((option) => {
            const isSelected = formData.audience?.type === option.key;
            return (
              <button
                key={option.key}
                onClick={() => handleAudienceTypeSelect(option.key)}
                className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[var(--primary-color)] text-white shadow'
                    : 'text-[var(--text-secondary)] hover:bg-gray-200'
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        {/* AI推荐受众包说明 */}
        {formData.audience?.type === 'ai' && (
          <div className="mt-4 rounded-lg border border-[var(--info-border)] bg-[var(--info-bg)] p-4 text-sm text-[var(--info-color)]">
            <p>
              <strong>AI推荐: 高转化潜力人群</strong> - 根据您选择的营销目标和历史数据，我们推荐这部分用户，他们近期表现出对相似产品/服务的高兴趣。
            </p>
          </div>
        )}

        {/* 已有受众包选择 */}
        {formData.audience?.type === 'existing' && (
          <div className="mt-4 rounded-lg border border-dashed border-[var(--border-primary)] p-4 text-center">
            <p className="text-[var(--text-secondary)]">点击选择已有的受众包</p>
            <Button variant="outline" className="mt-2">
              选择受众包
            </Button>
          </div>
        )}

        {/* 自定义受众设置 */}
        {formData.audience?.type === 'custom' && (
          <div className="mt-4 rounded-lg border border-dashed border-[var(--border-primary)] p-4 text-center">
            <p className="text-[var(--text-secondary)]">配置自定义受众定向条件</p>
            <Button variant="outline" className="mt-2">
              配置受众
            </Button>
          </div>
        )}
      </div>

      {/* 创意选择/生成 */}
      <div className="mt-8 border-t border-[var(--border-secondary)] pt-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">创意选择/生成</h3>
        <div className="mt-4 flex space-x-4 rounded-lg bg-[var(--bg-secondary)] p-1">
          {creativeOptions.map((option) => {
            const isSelected = formData.creative?.source === option.key;
            return (
              <button
                key={option.key}
                onClick={() => handleCreativeSourceSelect(option.key)}
                className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[var(--primary-color)] text-white shadow'
                    : 'text-[var(--text-secondary)] hover:bg-gray-200'
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        {/* 创意内容区域 */}
        <div className="mt-4 p-4 border border-dashed border-[var(--border-primary)] rounded-lg text-center">
          {formData.creative?.source === 'library' ? (
            <div>
              <p className="text-[var(--text-secondary)]">点击选择已有的文案、图片、视频</p>
              <Button variant="outline" className="mt-2">
                选择素材
              </Button>
            </div>
          ) : formData.creative?.source === 'ai_generate' ? (
            <div>
              <p className="text-[var(--text-secondary)]">AI将根据您的营销目标生成创意素材</p>
              <Button variant="outline" className="mt-2">
                开始生成
              </Button>
            </div>
          ) : (
            <p className="text-[var(--text-secondary)]">请先选择创意来源</p>
          )}
        </div>

        {/* AI创意优化建议 */}
        {formData.creative?.source && (
          <div className="mt-4 rounded-md bg-[var(--warning-bg)] p-3 text-sm text-[var(--warning-color)]">
            <p>
              <strong>AI创意优化建议:</strong> 当前素材的点击率可能偏低。建议尝试更具吸引力的标题，或在图片中加入明确的行动号召(CTA)元素。
            </p>
          </div>
        )}
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
      <div className="mt-10 flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          className="px-6 py-2.5 text-sm font-semibold"
        >
          上一步
        </Button>
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

export default AudienceCreativeStep;