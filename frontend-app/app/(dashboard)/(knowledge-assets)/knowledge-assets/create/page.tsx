'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import StepIndicator from './_components/StepIndicator';
import BasicInfoStep from './_components/steps/BasicInfoStep';
import ConfirmStep from './_components/steps/ConfirmStep';
import DataSourceStep from './_components/steps/DataSourceStep';
import { KnowledgeBaseFormData, Step, StepValidation } from './_components/types/knowledge-base';

const STEPS: Step[] = [
  { id: 1, title: '基本信息', description: '知识库名称与描述' },
  { id: 2, title: '数据源', description: '导入知识库内容' },
  { id: 3, title: '确认创建', description: '预览并完成' }
];

const CreateKnowledgeBasePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从URL参数获取当前步骤
  const currentStepParam = searchParams.get('step');
  const currentStep = currentStepParam ? parseInt(currentStepParam, 10) : 1;

  // 表单数据状态管理
  const [formData, setFormData] = useState<KnowledgeBaseFormData>(() => {
    // 尝试从sessionStorage恢复数据
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('knowledge-base-form-data');
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
      sessionStorage.setItem('knowledge-base-form-data', JSON.stringify(formData));
    }
  }, [formData]);

  // 步骤验证状态
  const [validations, setValidations] = useState<Record<number, StepValidation>>({
    1: { isValid: false, errors: [] },
    2: { isValid: false, errors: [] },
    3: { isValid: false, errors: [] }
  });

  // 更新表单数据
  const updateFormData = useCallback((data: Partial<KnowledgeBaseFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // 验证步骤1
  const validateStep1 = useCallback((data: KnowledgeBaseFormData): StepValidation => {
    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('请输入知识库名称');

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // 验证步骤2
  const validateStep2 = useCallback((data: KnowledgeBaseFormData): StepValidation => {
    const errors: string[] = [];
    const files = data.dataSource?.files || [];
    if (files.length === 0) errors.push('请至少上传一个文件');

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // 验证步骤3
  const validateStep3 = useCallback((): StepValidation => {
    // 步骤3主要是预览，只要前面步骤都通过就可以
    return { isValid: true, errors: [] };
  }, []);

  // 更新验证状态
  useEffect(() => {
    const newValidations = {
      1: validateStep1(formData),
      2: validateStep2(formData),
      3: validateStep3()
    };
    setValidations(newValidations);
  }, [formData, validateStep1, validateStep2, validateStep3]);

  // 导航到指定步骤
  const navigateToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 3) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('step', step.toString());
      router.push(`?${params.toString()}`);
    }
  }, [router, searchParams]);

  // 下一步
  const handleNext = useCallback(() => {
    if (currentStep < 3) {
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
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <DataSourceStep {...stepProps} />;
      case 3:
        return <ConfirmStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  return (
    <ToolPageLayout
      title="创建您的专属知识库"
      description="请跟随引导，完成知识库的创建流程。"
      breadcrumbs={[
        { label: '智能知识库', href: '#' },
        { label: '全部知识资产', href: '/knowledge-assets/overview' },
        { label: '新建知识库', href: '/knowledge-assets/create', current: true }
      ]}
    >
      <div className="w-full space-y-8">
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

export default CreateKnowledgeBasePage;