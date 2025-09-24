'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Briefcase, ChevronsUpDown } from 'lucide-react';

interface ContextSwitcherProps {
  className?: string;
}

const ContextSwitcher: React.FC<ContextSwitcherProps> = ({ className }) => {
  return (
    <div className={`bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm border border-[var(--border-secondary)] flex flex-col md:flex-row items-center gap-4 ${className || ''}`}>
      {/* 公司选择器 */}
      <div className="relative w-full md:w-64">
        <Select defaultValue="zhiying-tech">
          <SelectTrigger className="w-full flex items-center justify-between bg-[var(--bg-primary)] px-4 py-3.5 border border-[var(--border-primary)] rounded-lg shadow-sm text-left transition-colors hover:bg-[var(--bg-secondary)] h-auto min-h-[60px] [&>svg:last-child]:hidden">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[var(--color-primary-500)]" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">当前公司</p>
                <SelectValue />
              </div>
            </div>
            <ChevronsUpDown className="w-5 h-5 text-[var(--text-tertiary)]" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zhiying-tech">智赢科技</SelectItem>
            <SelectItem value="other-company">其他公司</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 项目选择器 */}
      <div className="relative w-full md:w-64">
        <Select defaultValue="ai-marketing">
          <SelectTrigger className="w-full flex items-center justify-between bg-[var(--bg-primary)] px-4 py-3.5 border border-[var(--border-primary)] rounded-lg shadow-sm text-left transition-colors hover:bg-[var(--bg-secondary)] h-auto min-h-[60px] [&>svg:last-child]:hidden">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-[var(--color-primary-500)]" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">当前项目</p>
                <SelectValue />
              </div>
            </div>
            <ChevronsUpDown className="w-5 h-5 text-[var(--text-tertiary)]" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai-marketing">AI全域营销大师</SelectItem>
            <SelectItem value="other-project">其他项目</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContextSwitcher;