'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  className
}) => {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const isClickable = (stepId: number) => {
    return onStepClick && stepId <= currentStep;
  };

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-start justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;
          const clickable = isClickable(step.id);

          return (
            <li
              key={step.id}
              className="relative flex flex-col items-center flex-1"
            >
              {/* 连接线 */}
              {!isLast && (
                <div className="absolute left-1/2 top-4 w-full h-0.5 -ml-4" aria-hidden="true">
                  <div
                    className={cn(
                      'h-full w-full transition-colors duration-200',
                      status === 'completed' ? 'bg-[var(--primary-color)]' : 'bg-gray-200'
                    )}
                  />
                </div>
              )}

              {/* 步骤圆圈 */}
              <div
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 z-10',
                  status === 'completed' && 'bg-[var(--primary-color)] hover:scale-110',
                  status === 'current' && 'border-2 border-[var(--primary-color)] bg-white',
                  status === 'upcoming' && 'border-2 border-gray-300 bg-white',
                  clickable && 'cursor-pointer'
                )}
                onClick={() => clickable && onStepClick?.(step.id)}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onStepClick?.(step.id);
                  }
                }}
              >
                {status === 'completed' ? (
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                ) : status === 'current' ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary-color)]" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                )}
                <span className="sr-only">{step.title}</span>
              </div>

              {/* 步骤标题 */}
              <span
                className={cn(
                  'mt-3 text-center transition-colors duration-200 whitespace-nowrap',
                  status === 'completed' && 'text-xs font-medium text-[var(--primary-color)]',
                  status === 'current' && 'text-sm font-semibold text-[var(--primary-color)]',
                  status === 'upcoming' && 'text-xs text-[var(--text-tertiary)]'
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;