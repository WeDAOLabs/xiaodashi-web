'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight } from 'lucide-react';
import { StepProps } from '../types/knowledge-base';

const BasicInfoStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  validation
}) => {
  const handleInputChange = (field: 'name' | 'description', value: string) => {
    onUpdate({ [field]: value });
  };

  const isNextDisabled = !formData.name?.trim();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pt-8">
      {/* 知识库名称 */}
      <div>
        <Label
          htmlFor="kb-name"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          知识库名称 <span className="text-[var(--color-danger-600)]">*</span>
        </Label>
        <Input
          id="kb-name"
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="例如：2025年夏季营销活动方案"
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm"
          required
          aria-required="true"
        />
        <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
          为您的知识库起一个有辨识度的名称。
        </p>
      </div>

      {/* 知识库描述 */}
      <div>
        <Label
          htmlFor="kb-desc"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          知识库描述 (可选)
        </Label>
        <Textarea
          id="kb-desc"
          rows={4}
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="简要描述知识库的用途、包含的数据范围等信息。"
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm resize-none"
        />
      </div>

      {/* 错误提示 */}
      {validation.errors.length > 0 && (
        <div className="rounded-md bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] p-4">
          <div className="text-sm text-[var(--color-danger-600)]">
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 底部操作按钮 */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold disabled:bg-[var(--color-primary-500)]/50 disabled:cursor-not-allowed flex items-center gap-2"
          aria-label="进入下一步"
        >
          下一步
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;