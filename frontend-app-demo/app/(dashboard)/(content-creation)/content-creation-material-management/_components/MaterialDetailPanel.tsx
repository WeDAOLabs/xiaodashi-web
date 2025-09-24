'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ComplianceReport from './ComplianceReport';
import InfoSection from './InfoSection';
import { MaterialDetailPanelProps } from './types';

/**
 * 素材详情面板组件
 * 右侧滑出的详情面板，展示完整的素材信息
 */
const MaterialDetailPanel: React.FC<MaterialDetailPanelProps> = ({
  isOpen,
  onClose,
  material,
  onDownload
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 bg-black\/30 z-40 transition-opacity">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-[var(--bg-primary)] shadow-xl z-50 flex flex-col transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-title"
      >
        {/* 头部 */}
        <header className="p-4 flex justify-between items-center border-b border-[var(--border-secondary)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]" id="detail-panel-title">素材详情</h2>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 rounded-full hover:bg-[var(--bg-secondary)]"
            onClick={onClose}
            aria-label="关闭详情面板"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </Button>
        </header>

        {/* 滚动内容区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 图片预览区域 */}
          <div className="aspect-video bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
            <Image
              src={material.image}
              alt={material.title}
              width={800}
              height={450}
              className="max-w-full max-h-full object-contain rounded-lg"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-material.svg';
              }}
            />
          </div>

          {/* 合规性检测报告 */}
          <ComplianceReport compliance={material.compliance} />

          {/* 基本信息 */}
          <InfoSection
            title="基本信息"
            data={[
              { label: '素材名称', value: material.title },
              { label: '素材 ID', value: material.id },
              { label: '类型', value: material.type },
              ...(material.basicInfo.size ? [{ label: '尺寸', value: material.basicInfo.size }] : []),
              { label: '文件大小', value: material.basicInfo.fileSize },
              { label: '上传人', value: material.basicInfo.uploader },
              { label: '上传时间', value: material.basicInfo.uploadTime }
            ]}
          />

          {/* 版权信息 */}
          {material.copyrightInfo && (
            <InfoSection
              title="版权信息"
              data={[
                ...(material.copyrightInfo.authorizer ? [{ label: '授权方', value: material.copyrightInfo.authorizer }] : []),
                ...(material.copyrightInfo.authPeriod ? [{ label: '授权期限', value: material.copyrightInfo.authPeriod }] : []),
                ...(material.copyrightInfo.usageScope ? [{ label: '使用范围', value: material.copyrightInfo.usageScope }] : [])
              ]}
            />
          )}

          {/* AI 标签 */}
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">AI 标签</h3>
            <div className="flex flex-wrap gap-2">
              {material.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm font-medium px-2.5 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <footer className="p-4 border-t border-[var(--border-secondary)] flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            aria-label="编辑素材信息"
          >
            编辑信息
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-600)] hover:bg-[var(--color-warning-100)]"
            aria-label="发起审批流程"
          >
            发起审批
          </Button>
          <Button
            className="flex-1"
            onClick={() => onDownload?.(material.id)}
            aria-label={`下载 ${material.title}`}
          >
            下载
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MaterialDetailPanel;