'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles } from 'lucide-react';
import { StepProps, InvestmentStrategy } from '../types/campaign';

// 投放策略选项数据
const strategyOptions = [
  {
    key: 'max_performance' as InvestmentStrategy,
    name: '效果最大化',
    description: '在预算范围内，AI自动优化以获取最佳转化效果。'
  },
  {
    key: 'cost_control' as InvestmentStrategy,
    name: '成本控制',
    description: '严格控制单次转化成本，适合对成本敏感的计划。'
  },
  {
    key: 'fast_delivery' as InvestmentStrategy,
    name: '快速跑量',
    description: '以最快速度消耗预算，适合需要快速起量的活动。'
  }
];

const StrategyBudgetStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
  validation
}) => {
  const handleStrategySelect = (strategy: InvestmentStrategy) => {
    onUpdate({ strategy });
  };

  const handleBudgetChange = (field: 'total' | 'daily', value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdate({
      budget: {
        total: formData.budget?.total || 0,
        daily: formData.budget?.daily || 0,
        [field]: numValue
      }
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onUpdate({
      schedule: {
        startDate: formData.schedule?.startDate || '',
        endDate: formData.schedule?.endDate || '',
        longTerm: formData.schedule?.longTerm || false,
        [field]: value
      }
    });
  };

  const handleLongTermChange = (checked: boolean) => {
    onUpdate({
      schedule: {
        startDate: formData.schedule?.startDate || '',
        endDate: formData.schedule?.endDate || '',
        longTerm: checked
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)]">第二步: 策略与预算</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">设定投放策略、预算和时间，AI将为您提供智能建议。</p>

      {/* AI智能投放策略选择 */}
      <div className="mt-6">
        <h3 className="flex items-center text-base font-semibold text-[var(--text-primary)]">
          <Sparkles className="mr-2 h-5 w-5 text-[var(--accent-color)]" />
          AI智能投放策略选择
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {strategyOptions.map((strategy) => {
            const isSelected = formData.strategy === strategy.key;
            return (
              <div
                key={strategy.key}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--primary-color)] bg-[var(--color-primary-50)]'
                    : 'border-[var(--border-primary)] bg-white hover:border-[var(--accent-color)]'
                }`}
                onClick={() => handleStrategySelect(strategy.key)}
              >
                <p className="font-medium text-center">{strategy.name}</p>
                <p className="mt-2 text-xs text-[var(--text-secondary)] text-center">
                  {strategy.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 预算设置 */}
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label htmlFor="total-budget" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">
            总预算
          </Label>
          <div className="mt-2">
            <Input
              type="number"
              id="total-budget"
              value={formData.budget?.total || ''}
              onChange={(e) => handleBudgetChange('total', e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6"
              placeholder="请输入总预算"
            />
          </div>
          {formData.budget?.total && formData.budget.total >= 3000 && (
            <p className="mt-2 text-xs text-[var(--info-color)]">
              AI建议: 预算充足，预计可获得良好曝光。
            </p>
          )}
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="daily-budget" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">
            日预算
          </Label>
          <div className="mt-2">
            <Input
              type="number"
              id="daily-budget"
              value={formData.budget?.daily || ''}
              onChange={(e) => handleBudgetChange('daily', e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color)] sm:text-sm sm:leading-6"
              placeholder="请输入日预算"
            />
          </div>
        </div>
      </div>

      {/* 投放时间设置 */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">投放时间设置</h3>
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <Label htmlFor="start-date" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">
              开始日期
            </Label>
            <Input
              type="date"
              id="start-date"
              value={formData.schedule?.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="end-date" className="block text-sm font-medium leading-6 text-[var(--text-primary)]">
              结束日期
            </Label>
            <Input
              type="date"
              id="end-date"
              value={formData.schedule?.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="sm:col-span-2 flex items-end pb-1.5">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="long-term"
                checked={formData.schedule?.longTerm || false}
                onCheckedChange={handleLongTermChange}
              />
              <Label
                htmlFor="long-term"
                className="text-sm text-[var(--text-primary)]"
              >
                长期投放
              </Label>
            </div>
          </div>
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

export default StrategyBudgetStep;