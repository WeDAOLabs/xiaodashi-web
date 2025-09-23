'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DangerZoneProps {
  className?: string;
}

const DangerZone: React.FC<DangerZoneProps> = ({ className }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // 这里可以添加删除账户的逻辑
    console.log('删除账户确认');
    // 重置确认状态
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className={`bg-[var(--bg-primary)] border border-[var(--color-danger-600)]/30 rounded-lg shadow-sm ${className || ''}`}>
      <div className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[var(--color-danger-600)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-danger-600)]">删除账户</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              永久删除您的账户和所有数据。此操作无法撤销。
            </p>
          </div>
        </div>

        {/* 确认提示 */}
        {showConfirmation && (
          <div className="mt-4 p-4 bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] rounded-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-danger-600)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[var(--color-danger-800)]">确认删除账户</h4>
                <p className="text-sm text-[var(--color-danger-800)] mt-1">
                  您确定要删除您的账户吗？这将永久删除您的所有数据，包括：
                </p>
                <ul className="text-sm text-[var(--color-danger-800)] mt-2 space-y-1 list-disc list-inside">
                  <li>个人资料和设置</li>
                  <li>所有项目和工作区数据</li>
                  <li>AI 生成的内容和历史记录</li>
                  <li>集成配置和账单信息</li>
                </ul>
                <p className="text-sm font-semibold text-[var(--color-danger-800)] mt-3">
                  此操作无法撤销！
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="bg-[var(--bg-tertiary)] border-t border-[var(--border-secondary)] px-6 py-4 flex justify-end gap-3 rounded-b-lg">
        {showConfirmation ? (
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-5 py-2 rounded-lg text-sm font-semibold"
            >
              取消
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-[var(--color-danger-600)] text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              确认删除我的账户
            </Button>
          </>
        ) : (
          <Button
            onClick={handleDeleteAccount}
            className="bg-[var(--color-danger-600)] text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
          >
            删除我的账户
          </Button>
        )}
      </div>
    </div>
  );
};

export default DangerZone;