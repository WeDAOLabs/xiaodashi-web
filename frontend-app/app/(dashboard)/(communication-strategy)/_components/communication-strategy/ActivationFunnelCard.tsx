import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ActivationFunnelCard: React.FC = () => {
  return (
    <Card className="bg-white p-5 rounded-lg shadow-sm h-full flex flex-col">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[var(--text-primary)]">激活漏斗运行概览</h3>
          <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[var(--color-info-600)]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </div>
        </div>

        <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">10%</p>
        <p className="text-xs text-[var(--text-secondary)]">流失预警客户唤回</p>

        <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 my-2">
          <div
            className="bg-[var(--color-info-600)] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: '10%' }}
          ></div>
        </div>

        <ul className="text-sm space-y-2 mt-4 text-[var(--text-secondary)]">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success-600)]"></span>
            正在运行: 3个激活漏斗
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning-600)]"></span>
            计划中: 2个激活漏斗
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)]"></span>
            已完成: 8个激活漏斗
          </li>
        </ul>

        <button
          className="w-full mt-auto py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--border-primary)] transition-colors"
          aria-label="管理激活漏斗"
        >
          管理激活漏斗
        </button>
      </CardContent>
    </Card>
  );
};

export default ActivationFunnelCard;