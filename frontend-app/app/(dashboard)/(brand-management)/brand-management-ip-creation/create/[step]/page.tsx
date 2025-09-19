'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Step1Form from '../_components/forms/Step1Form';
import Step2Form from '../_components/forms/Step2Form';
import Step3Form from '../_components/forms/Step3Form';
import Step4Form from '../_components/forms/Step4Form';
import Step5Form from '../_components/forms/Step5Form';

interface StepPageProps {
  params: Promise<{
    step: string;
  }>;
}

const stepComponents = {
  step1: Step1Form,
  step2: Step2Form,
  step3: Step3Form,
  step4: Step4Form,
  step5: Step5Form,
};

const stepTitles = {
  step1: 'IP档案与核心信息',
  step2: 'IP概念与定位',
  step3: '视觉形象与人格化',
  step4: '故事与内容叙事',
  step5: '孵化与发布计划',
};

export default function StepPage({ params }: StepPageProps) {
  const { step } = React.use(params);

  // 验证步骤参数
  if (!stepComponents[step as keyof typeof stepComponents]) {
    notFound();
  }

  const StepComponent = stepComponents[step as keyof typeof stepComponents];
  const stepTitle = stepTitles[step as keyof typeof stepTitles];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{stepTitle}</h2>
      <StepComponent />
    </div>
  );
}