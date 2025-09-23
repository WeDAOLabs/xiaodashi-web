'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, ChevronLeft, FileText, Globe, Edit, Upload, Trash2 } from 'lucide-react';
import { StepProps, UploadedFile, DataSourceType, DataSource, SUPPORTED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_COUNT, SupportedFileType } from '../types/knowledge-base';
import { formatFileSize, generateFileId } from '../utils';

const DataSourceStep: React.FC<StepProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
  validation
}) => {
  const [activeTab, setActiveTab] = useState<DataSourceType>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取当前数据源
  const dataSource = useMemo(() =>
    formData.dataSource || { type: 'upload', files: [] },
    [formData.dataSource]
  );

  const handleTabChange = (value: string) => {
    const newType = value as DataSourceType;
    setActiveTab(newType);
    onUpdate({
      dataSource: {
        ...dataSource,
        type: newType as DataSourceType
      } as DataSource
    });
  };

  // 文件上传处理
  const handleFileUpload = useCallback((files: FileList) => {
    const currentFiles = dataSource.files || [];
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      // 检查文件类型
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_FILE_TYPES.includes(fileExtension as SupportedFileType)) {
        alert(`不支持的文件类型: ${file.name}`);
        return;
      }

      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        alert(`文件 ${file.name} 超过最大限制 (10MB)`);
        return;
      }

      // 检查总文件数量
      if (currentFiles.length + newFiles.length >= MAX_FILE_COUNT) {
        alert(`最多只能上传 ${MAX_FILE_COUNT} 个文件`);
        return;
      }

      newFiles.push({
        id: generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type
      });
    });

    if (newFiles.length > 0) {
      onUpdate({
        dataSource: {
          ...dataSource,
          files: [...currentFiles, ...newFiles]
        } as DataSource
      });
    }
  }, [dataSource, onUpdate]);

  // 移除文件
  const removeFile = useCallback((fileId: string) => {
    const currentFiles = dataSource.files || [];
    onUpdate({
      dataSource: {
        ...dataSource,
        files: currentFiles.filter(file => file.id !== fileId)
      } as DataSource
    });
  }, [dataSource, onUpdate]);

  const hasFiles = (dataSource.files || []).length > 0;
  const isNextDisabled = !hasFiles; // 简化验证，只要有文件就可以下一步

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Tab Headers */}
        <div className="border-b border-[var(--border-secondary)]">
          <TabsList className="bg-transparent border-none p-0 h-auto -mb-px flex space-x-6">
            <TabsTrigger
              value="upload"
              className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-600)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] data-[state=inactive]:hover:text-[var(--text-primary)] data-[state=inactive]:hover:border-[var(--border-primary)] bg-transparent"
              role="tab"
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              上传文件
            </TabsTrigger>
            <TabsTrigger
              value="website"
              className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-600)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] data-[state=inactive]:hover:text-[var(--text-primary)] data-[state=inactive]:hover:border-[var(--border-primary)] bg-transparent"
              role="tab"
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              网站链接
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:text-[var(--color-primary-600)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] data-[state=inactive]:hover:text-[var(--text-primary)] data-[state=inactive]:hover:border-[var(--border-primary)] bg-transparent"
              role="tab"
            >
              <Edit className="w-5 h-5" aria-hidden="true" />
              手动输入
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-12">
          {/* 文件上传 Tab */}
          <TabsContent value="upload" className="mt-0" role="tabpanel">
            <div className="space-y-4">
              {/* 文件上传区域 */}
              <div
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-[var(--border-secondary)] bg-[var(--bg-tertiary)] hover:border-[var(--color-primary-500)]/50"
                role="button"
                aria-label="文件上传区域"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    handleFileUpload(files);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept={SUPPORTED_FILE_TYPES.join(',')}
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files);
                    }
                  }}
                />
                <Upload className="w-10 h-10 text-[var(--text-tertiary)]" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                  点击或拖拽文件到此区域
                </p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                  支持 TXT, PDF, MD, DOCX, CSV 等格式
                </p>
              </div>

              {/* 已上传文件列表 */}
              {hasFiles && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {(dataSource.files || []).map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between bg-[var(--bg-tertiary)] p-2.5 rounded-md"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-[var(--color-primary-500)] flex-shrink-0" aria-hidden="true" />
                        <div className="text-sm overflow-hidden">
                          <p className="font-medium text-[var(--text-primary)] truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="p-1 rounded-full hover:bg-[var(--color-danger-600)]/10 text-[var(--color-danger-600)]/70 hover:text-[var(--color-danger-600)] flex-shrink-0 ml-2"
                        aria-label={`移除文件 ${file.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* 网站链接 Tab */}
          <TabsContent value="website" className="mt-0" role="tabpanel">
            <div className="flex items-center justify-center h-64">
              <p className="text-[var(--text-secondary)]">网站链接导入功能即将推出</p>
            </div>
          </TabsContent>

          {/* 手动输入 Tab */}
          <TabsContent value="manual" className="mt-0" role="tabpanel">
            <div className="flex items-center justify-center h-64">
              <p className="text-[var(--text-secondary)]">手动输入功能即将推出</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

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
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold disabled:bg-[var(--color-primary-500)]/50 disabled:cursor-not-allowed flex items-center gap-2"
          aria-label="进入下一步"
        >
          下一步
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;