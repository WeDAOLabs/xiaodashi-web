import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseTabProps, BudgetAllocationData, OptimizationSuggestion } from './types';

const BudgetStrategyTab: React.FC<BaseTabProps> = () => {
  // 预算分配数据
  const budgetData = {
    totalBudget: 150000,
    todaySpent: 37000,
    remaining: 113000
  };

  // 各计划预算分配
  const campaignBudgets: BudgetAllocationData[] = [
    {
      campaignName: '主线-新品推广',
      spent: 8000,
      budget: 30000,
      percentage: 26.67,
      color: 'bg-green-500'
    },
    {
      campaignName: '明星同款系列',
      spent: 20000,
      budget: 70000,
      percentage: 28.57,
      color: 'bg-blue-500'
    },
    {
      campaignName: '辅线-日常拉新',
      spent: 4000,
      budget: 20000,
      percentage: 20,
      color: 'bg-red-500'
    },
    {
      campaignName: '节日限定活动',
      spent: 5000,
      budget: 30000,
      percentage: 16.67,
      color: 'bg-yellow-500'
    }
  ];

  // AI优化建议
  const optimizationSuggestions: OptimizationSuggestion[] = [
    {
      type: 'budget',
      title: '预算建议',
      description: '"主线-新品推广"ROI表现优异，建议提升20%预算。',
      impact: 'high'
    },
    {
      type: 'bidding',
      title: '出价建议',
      description: '当前CPC出价偏低，建议提升至 ¥1.5-2.0 区间以获得更好展位。',
      impact: 'medium'
    }
  ];

  const biddingStrategies = [
    { value: 'ocpc', label: 'OCPC (目标转化出价)' },
    { value: 'cpc', label: 'CPC (点击出价)' },
    { value: 'ocpm', label: 'OCPM (目标千次展示出价)' }
  ];

  const spentPercentage = (budgetData.todaySpent / budgetData.totalBudget) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：预算分配概览 */}
      <div className="bg-[var(--bg-primary)] rounded-xl shadow-sm p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">预算分配概览</h3>

        {/* 总预算概览 */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">总预算</span>
            <span className="font-semibold text-xl">¥ {budgetData.totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5">
            <div
              className="bg-[var(--primary-color)] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>今日已消耗: ¥ {budgetData.todaySpent.toLocaleString()}</span>
            <span>剩余可用: ¥ {budgetData.remaining.toLocaleString()}</span>
          </div>
        </div>

        {/* 各计划预算 */}
        <div className="border-t border-[var(--border-secondary)] pt-6">
          <h4 className="font-semibold mb-4">各计划预算</h4>
          <ul className="space-y-3">
            {campaignBudgets.map((campaign, index) => (
              <li key={index} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>{campaign.campaignName}</span>
                  <span>¥ {campaign.spent.toLocaleString()} / ¥ {campaign.budget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`${campaign.color} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${campaign.percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 右侧：AI建议和出价策略 */}
      <div className="space-y-6">
        {/* AI 优化建议 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI 优化建议</h3>
          <div className="bg-[var(--color-info-50)] p-3 rounded-lg text-sm space-y-3">
            {optimizationSuggestions.map((suggestion, index) => (
              <p key={index}>
                <strong className="text-[var(--color-info-600)]">{suggestion.title}:</strong>{' '}
                {suggestion.description}
              </p>
            ))}
          </div>
          <Button className="w-full mt-4">
            应用AI建议
          </Button>
        </Card>

        {/* 出价策略 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">出价策略</h3>
          <select className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] mb-4">
            {biddingStrategies.map((strategy) => (
              <option key={strategy.value} value={strategy.value}>
                {strategy.label}
              </option>
            ))}
          </select>
          <Button variant="outline" className="w-full">
            设置自动规则
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BudgetStrategyTab;