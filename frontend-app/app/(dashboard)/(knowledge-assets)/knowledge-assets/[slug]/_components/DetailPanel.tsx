import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Edit, Share, Download, Info, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeItem } from './types';

interface DetailPanelProps {
  item: KnowledgeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ item, isOpen, onClose }) => {
  return (
    <>
      {/* 背景遮罩 - 条件渲染 */}
      {isOpen && item && (
        <div
          className="fixed inset-0 bg-black\/20 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* 详情面板 */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-2xl bg-[var(--bg-primary)] shadow-2xl z-[60] flex flex-col",
          "transition-all duration-300 ease-in-out",
          isOpen && item
            ? "transform translate-x-0 opacity-100"
            : "transform translate-x-full opacity-0 pointer-events-none"
        )}
      >
        {item && (
          <div className="flex flex-col h-full">
            {/* 头部 */}
            <div className="p-5 border-b border-[var(--border-secondary)] flex items-start justify-between">
              <div>
                <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] mb-1 inline-block border-0">
                  {item.category}
                </Badge>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{item.title}</h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-3 py-1.5 rounded-md hover:bg-[var(--border-primary)] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-3 py-1.5 rounded-md hover:bg-[var(--border-primary)] transition-colors"
                >
                  <Share className="w-4 h-4" />
                  分享
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-sm bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-3 py-1.5 rounded-md hover:bg-[var(--border-primary)] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* 标签栏 */}
            <div className="p-3 border-b border-[var(--border-secondary)] flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
              >
                <Info className="w-4 h-4" />
                知识详情
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              >
                <GitBranch className="w-4 h-4" />
                知识引用
              </Button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* 基本信息 */}
                <div>
                  <h3 className="font-semibold mb-2 text-[var(--text-primary)]">基本信息</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--text-secondary)]">创建日期：</span>
                      <span className="text-[var(--text-primary)]">{item.date}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">版本：</span>
                      <span className="text-[var(--text-primary)]">{item.version}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">评论数：</span>
                      <span className="text-[var(--text-primary)]">{item.comments}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">状态：</span>
                      <span className="text-[var(--text-primary)]">
                        {item.status === 'published' && '已发布'}
                        {item.status === 'draft' && '草稿'}
                        {item.status === 'pending' && '待审核'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 详细内容 */}
                <div>
                  <h3 className="font-semibold mb-2 text-[var(--text-primary)]">详细内容</h3>
                  <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
                    <p>{item.description}</p>
                    <p className="mt-4">这里可以展示更多的详细内容，包括文档的完整内容、图片、附件等信息。</p>
                  </div>
                </div>

                {/* AI摘要 */}
                <div>
                  <h3 className="font-semibold mb-2 text-[var(--text-primary)]">AI智能摘要</h3>
                  <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] rounded-lg p-4">
                    <p className="text-sm text-[var(--color-primary-700)]">
                      <span className="font-bold">AI 摘要：</span> {item.aiSummary}
                    </p>
                  </div>
                </div>

                {/* 标签 */}
                <div>
                  <h3 className="font-semibold mb-2 text-[var(--text-primary)]">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="text-sm font-semibold px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 相关知识 */}
                <div>
                  <h3 className="font-semibold mb-2 text-[var(--text-primary)]">相关知识</h3>
                  <div className="space-y-2">
                    <div className="p-3 border border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">相关文档标题1</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">相关文档的简短描述...</p>
                    </div>
                    <div className="p-3 border border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">相关文档标题2</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">相关文档的简短描述...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailPanel;