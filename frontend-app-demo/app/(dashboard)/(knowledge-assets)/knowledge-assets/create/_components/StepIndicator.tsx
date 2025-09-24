'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
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
    <nav aria-label="Progress" className={cn('w-full flex justify-center', className)}>
      <ol role="list" className="flex items-start justify-between w-4/5">
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
                      status === 'completed' ? 'bg-[var(--color-primary-500)]' : 'bg-[var(--border-secondary)]'
                    )}
                  />
                </div>
              )}

              {/* 步骤圆圈 */}
              <div
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 z-10',
                  status === 'completed' && 'bg-[var(--color-primary-500)]',
                  status === 'current' && 'border-2 border-[var(--color-primary-500)] bg-[var(--bg-primary)]',
                  status === 'upcoming' && 'border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]',
                  clickable && 'cursor-pointer hover:scale-105'
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
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                ) : status === 'current' ? (
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary-500)]"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="sr-only">{step.title} (Upcoming)</span>
                )}
                <span className="sr-only">
                  {status === 'completed' ? `${step.title} (Completed)` :
                   status === 'current' ? `${step.title} (Current)` :
                   `${step.title} (Upcoming)`}
                </span>
              </div>

              {/* 步骤标题和描述 */}
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    'text-sm font-semibold transition-colors duration-200 whitespace-nowrap',
                    status === 'completed' && 'text-[var(--color-primary-600)]',
                    status === 'current' && 'text-[var(--color-primary-600)]',
                    status === 'upcoming' && 'text-[var(--text-secondary)]'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5 whitespace-nowrap">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;