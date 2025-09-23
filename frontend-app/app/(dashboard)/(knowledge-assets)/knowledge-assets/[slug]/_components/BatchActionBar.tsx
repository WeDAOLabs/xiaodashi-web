import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Share, Tag, Trash2 } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  onBatchDownload: () => void;
  onBatchShare: () => void;
  onBatchEditTags: () => void;
  onBatchDelete: () => void;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBatchDownload,
  onBatchShare,
  onBatchEditTags,
  onBatchDelete
}) => {
  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 mb-4">
        <Checkbox
          className="h-4 w-4 rounded border-[var(--border-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
          onCheckedChange={(checked) => onSelectAll(!!checked)}
        />
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          共 {totalCount} 项
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={selectedCount === totalCount}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          className="h-4 w-4 rounded border-[var(--border-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
        />
        <span className="text-sm font-medium text-[var(--color-primary-700)]">
          已选择 {selectedCount} 项
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-sm text-[var(--color-primary-500)] hover:underline p-0 h-auto"
        >
          取消选择
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBatchDownload}
          className="flex items-center gap-2 text-sm bg-white text-[var(--text-secondary)] px-3 py-1.5 rounded-md border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <Download className="w-4 h-4" />
          批量下载
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBatchShare}
          className="flex items-center gap-2 text-sm bg-white text-[var(--text-secondary)] px-3 py-1.5 rounded-md border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <Share className="w-4 h-4" />
          批量分享
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBatchEditTags}
          className="flex items-center gap-2 text-sm bg-white text-[var(--text-secondary)] px-3 py-1.5 rounded-md border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          <Tag className="w-4 h-4" />
          批量编辑标签
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBatchDelete}
          className="flex items-center gap-2 text-sm text-[var(--color-danger-600)] px-3 py-1.5 rounded-md hover:bg-[var(--color-danger-50)] transition-colors border-0"
        >
          <Trash2 className="w-4 h-4" />
          删除
        </Button>
      </div>
    </div>
  );
};

export default BatchActionBar;