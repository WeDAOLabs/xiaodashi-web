'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import StepIndicator from './_components/StepIndicator';
import PlatformTargetStep from './_components/steps/PlatformTargetStep';
import StrategyBudgetStep from './_components/steps/StrategyBudgetStep';
import AudienceCreativeStep from './_components/steps/AudienceCreativeStep';
import PreviewPublishStep from './_components/steps/PreviewPublishStep';
import { CampaignFormData, StepValidation } from './_components/types/campaign';

const STEPS = [
  { id: 1, title: '选择平台与目标' },
  { id: 2, title: '策略与预算' },
  { id: 3, title: '受众与创意' },
  { id: 4, title: '预览与发布' }
];

const CreateCampaignPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从URL参数获取当前步骤
  const currentStepParam = searchParams.get('step');
  const currentStep = currentStepParam ? parseInt(currentStepParam, 10) : 1;

  // 表单数据状态管理
  const [formData, setFormData] = useState<CampaignFormData>(() => {
    // 尝试从sessionStorage恢复数据
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('campaign-form-data');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  // 保存数据到sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('campaign-form-data', JSON.stringify(formData));
    }
  }, [formData]);

  // 步骤验证状态
  const [validations, setValidations] = useState<Record<number, StepValidation>>({
    1: { isValid: false, errors: [] },
    2: { isValid: false, errors: [] },
    3: { isValid: false, errors: [] },
    4: { isValid: false, errors: [] }
  });

  // 更新表单数据
  const updateFormData = useCallback((data: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // 验证步骤1
  const validateStep1 = useCallback((data: CampaignFormData): StepValidation => {
    const errors: string[] = [];
    if (!data.platform) errors.push('请选择投放平台');
    if (!data.objective) errors.push('请选择营销目标');

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // 验证步骤2
  const validateStep2 = useCallback((data: CampaignFormData): StepValidation => {
    const errors: string[] = [];
    if (!data.strategy) errors.push('请选择投放策略');
    if (!data.budget?.total || data.budget.total <= 0) errors.push('请设置有效的总预算');
    if (!data.budget?.daily || data.budget.daily <= 0) errors.push('请设置有效的日预算');
    if (!data.schedule?.startDate) errors.push('请设置开始日期');
    if (!data.schedule?.endDate) errors.push('请设置结束日期');

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // 验证步骤3
  const validateStep3 = useCallback((data: CampaignFormData): StepValidation => {
    const errors: string[] = [];
    if (!data.audience?.type) errors.push('请选择受众定向方式');
    if (!data.creative?.source) errors.push('请选择创意来源');

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // 验证步骤4
  const validateStep4 = useCallback((): StepValidation => {
    // 步骤4主要是预览，只要前面步骤都通过就可以
    return { isValid: true, errors: [] };
  }, []);

  // 更新验证状态
  useEffect(() => {
    const newValidations = {
      1: validateStep1(formData),
      2: validateStep2(formData),
      3: validateStep3(formData),
      4: validateStep4()
    };
    setValidations(newValidations);
  }, [formData, validateStep1, validateStep2, validateStep3, validateStep4]);

  // 导航到指定步骤
  const navigateToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('step', step.toString());
      router.push(`?${params.toString()}`);
    }
  }, [router, searchParams]);

  // 下一步
  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      navigateToStep(currentStep + 1);
    }
  }, [currentStep, navigateToStep]);

  // 上一步
  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  }, [currentStep, navigateToStep]);

  // 步骤点击处理 - 只允许访问已验证的步骤
  const handleStepClick = useCallback((step: number) => {
    // 检查是否可以访问该步骤
    for (let i = 1; i < step; i++) {
      if (!validations[i]?.isValid) {
        return; // 前面有未完成的步骤，不允许跳转
      }
    }
    navigateToStep(step);
  }, [validations, navigateToStep]);

  // 渲染当前步骤内容
  const renderStepContent = () => {
    const stepProps = {
      formData,
      onUpdate: updateFormData,
      onNext: handleNext,
      onPrev: handlePrev,
      onNavigateToStep: navigateToStep,
      validation: validations[currentStep] || { isValid: false, errors: [] }
    };

    switch (currentStep) {
      case 1:
        return <PlatformTargetStep {...stepProps} />;
      case 2:
        return <StrategyBudgetStep {...stepProps} />;
      case 3:
        return <AudienceCreativeStep {...stepProps} />;
      case 4:
        return <PreviewPublishStep {...stepProps} />;
      default:
        return <PlatformTargetStep {...stepProps} />;
    }
  };

  return (
    <ToolPageLayout
      title="新建投放计划"
      description="通过智能向导创建投放计划，AI将协助您优化投放策略和设置"
      breadcrumbs={[
        { label: '增长与运营执行', href: '#' },
        { label: '智能公域流量投放与优化', href: '#' },
        { label: '投放平台数据概览', href: '/public-traffic/overview' },
        { label: '新建投放计划', href: '/public-traffic/campaign/create', current: true }
      ]}
    >
      <div className="w-full">
        {/* 步骤指示器 */}
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="mb-8"
        />

        {/* 步骤内容 */}
        <Card className="rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-primary)] shadow-sm">
          <CardContent className="p-6 lg:p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default CreateCampaignPage;