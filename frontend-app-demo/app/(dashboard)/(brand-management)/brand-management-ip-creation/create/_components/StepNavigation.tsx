'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useIPCreation } from './IPCreationContext';

const steps = [
  {
    number: 1,
    title: 'IP档案与核心信息',
    description: '基础信息录入',
  },
  {
    number: 2,
    title: 'IP概念与定位',
    description: '目标和价值定义',
  },
  {
    number: 3,
    title: '视觉形象与人格化',
    description: '形象设计',
  },
  {
    number: 4,
    title: '故事与内容叙事',
    description: '内容策划',
  },
  {
    number: 5,
    title: '孵化与发布计划',
    description: '发布策略',
  },
];

export default function StepNavigation() {
  const { currentStep, goToStep, canGoToStep } = useIPCreation();

  return (
    <nav className="bg-[var(--bg-primary)] p-4 rounded-[var(--radius)] shadow-sm sticky top-8">
      <ul className="space-y-1">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isAccessible = canGoToStep(step.number);
          const isCompleted = currentStep > step.number;

          return (
            <li key={step.number}>
              <button
                onClick={() => isAccessible && goToStep(step.number)}
                disabled={!isAccessible}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium flex items-center gap-3",
                  isActive && "bg-[var(--primary-color)] text-white shadow-md",
                  !isActive && isAccessible && "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
                  !isAccessible && "text-[var(--text-tertiary)] opacity-60 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isActive && "bg-white text-[var(--primary-color)]",
                    !isActive && isCompleted && "bg-[var(--primary-color)] text-white",
                    !isActive && !isCompleted && "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                  )}
                >
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isActive && "text-white/80",
                    !isActive && "text-[var(--text-tertiary)]"
                  )}>
                    {step.description}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}