'use client';

import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ComplianceReportProps } from './types';

/**
 * 合规性报告组件
 * 根据风险等级显示不同样式的报告卡片
 */
const ComplianceReport: React.FC<ComplianceReportProps> = ({ compliance }) => {
  const getComplianceConfig = (status: string) => {
    switch (status) {
      case 'compliant':
        return {
          bg: 'bg-[var(--color-success-50)]',
          icon: 'text-[var(--color-success-600)]',
          title: 'text-[var(--color-success-600)]'
        };
      case 'low-risk':
        return {
          bg: 'bg-[var(--color-warning-50)]',
          icon: 'text-[var(--color-warning-600)]',
          title: 'text-[var(--color-warning-600)]'
        };
      case 'medium-risk':
        return {
          bg: 'bg-[var(--color-warning-100)]',
          icon: 'text-[var(--color-warning-700)]',
          title: 'text-[var(--color-warning-700)]'
        };
      case 'high-risk':
        return {
          bg: 'bg-[var(--color-danger-50)]',
          icon: 'text-[var(--color-danger-600)]',
          title: 'text-[var(--color-danger-600)]'
        };
      default:
        return {
          bg: 'bg-[var(--bg-secondary)]',
          icon: 'text-[var(--text-secondary)]',
          title: 'text-[var(--text-secondary)]'
        };
    }
  };

  const config = getComplianceConfig(compliance.status);

  if (compliance.status === 'compliant') {
    return (
      <div className={`p-4 rounded-lg ${config.bg}`}>
        <div className="flex items-center gap-3">
          <CheckCircle className={`w-6 h-6 flex-shrink-0 ${config.icon}`} />
          <div>
            <h4 className={`text-base font-semibold ${config.title}`}>合规性检测报告</h4>
            <p className={`text-sm font-bold ${config.title}`}>{compliance.label}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${config.bg}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${config.icon}`} />
        <div>
          <h4 className={`text-base font-semibold ${config.title}`}>合规性检测报告</h4>
          <p className={`text-sm font-bold ${config.title}`}>{compliance.label}</p>
        </div>
      </div>
      {(compliance.riskType || compliance.description || compliance.aiSolution) && (
        <div className="mt-3 text-sm space-y-2">
          {compliance.riskType && (
            <p><strong className="text-[var(--text-primary)]">风险类型：</strong>{compliance.riskType}</p>
          )}
          {compliance.description && (
            <p><strong className="text-[var(--text-primary)]">具体描述：</strong>{compliance.description}</p>
          )}
          {compliance.aiSolution && (
            <p><strong className="text-[var(--text-primary)]">AI解决方案：</strong>{compliance.aiSolution}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceReport;