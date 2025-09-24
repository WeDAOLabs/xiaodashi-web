'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft } from 'lucide-react';
import { StepProps } from '../types/knowledge-base';
import { formatFileSize } from '../utils';

const ConfirmStep: React.FC<StepProps> = ({
  formData,
  onPrev,
  validation
}) => {
  const handleCreateKnowledgeBase = () => {
    // TODO: 实现创建知识库的逻辑
    alert('知识库创建功能即将推出！');
  };

  const files = formData.dataSource?.files || [];
  const fileCount = files.length;

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        请确认您的知识库信息
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mt-1">
        核对无误后，点击&ldquo;完成创建&rdquo;即可。
      </p>

      <dl className="mt-8">
        {/* 知识库名称 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 py-5 border-b border-[var(--border-secondary)] last:border-b-0">
          <dt className="text-sm font-medium text-[var(--text-secondary)]">
            知识库名称
          </dt>
          <dd className="text-sm text-[var(--text-primary)] md:col-span-2">
            <span className="font-semibold">
              {formData.name || '未设置'}
            </span>
          </dd>
        </div>

        {/* 知识库描述 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 py-5 border-b border-[var(--border-secondary)] last:border-b-0">
          <dt className="text-sm font-medium text-[var(--text-secondary)]">
            知识库描述
          </dt>
          <dd className="text-sm text-[var(--text-primary)] md:col-span-2">
            <p className="whitespace-pre-wrap">
              {formData.description || '无描述'}
            </p>
          </dd>
        </div>

        {/* 数据源 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 py-5 border-b border-[var(--border-secondary)] last:border-b-0">
          <dt className="text-sm font-medium text-[var(--text-secondary)]">
            数据源
          </dt>
          <dd className="text-sm text-[var(--text-primary)] md:col-span-2">
            {fileCount > 0 ? (
              <div className="flex items-start gap-3">
                <FileText
                  className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">
                    {fileCount} 个文件
                  </p>
                  <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 mt-1 space-y-1">
                    {files.slice(0, 3).map((file) => (
                      <li key={file.id} className="truncate max-w-xs">
                        {file.name} ({formatFileSize(file.size)})
                      </li>
                    ))}
                    {fileCount > 3 && (
                      <li className="text-[var(--text-tertiary)]">
                        还有 {fileCount - 3} 个文件...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <span className="text-[var(--text-tertiary)]">未选择数据源</span>
            )}
          </dd>
        </div>
      </dl>

      {/* 错误提示 */}
      {validation.errors.length > 0 && (
        <div className="mt-6 rounded-md bg-[var(--color-danger-50)] border border-[var(--color-danger-200)] p-4">
          <div className="text-sm text-[var(--color-danger-600)]">
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 底部操作按钮 */}
      <div className="mt-8 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrev}
          className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-5 py-2.5 rounded-lg hover:bg-[var(--border-secondary)] transition-colors text-sm font-semibold flex items-center gap-2"
          aria-label="返回上一步"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          上一步
        </Button>
        <Button
          onClick={handleCreateKnowledgeBase}
          className="bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold flex items-center gap-2"
          aria-label="完成创建知识库"
        >
          完成创建
        </Button>
      </div>
    </div>
  );
};

export default ConfirmStep;