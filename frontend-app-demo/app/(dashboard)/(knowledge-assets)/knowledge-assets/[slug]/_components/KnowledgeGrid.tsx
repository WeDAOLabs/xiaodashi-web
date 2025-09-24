import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KnowledgeCard from './KnowledgeCard';
import { KnowledgeItem } from './types';

interface KnowledgeGridProps {
  items: KnowledgeItem[];
  selectedItems: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
  onItemClick?: (item: KnowledgeItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const KnowledgeGrid: React.FC<KnowledgeGridProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onItemClick,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 调整起始页码，确保显示足够的页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-[var(--color-primary-500)] text-white'
              : 'hover:bg-[var(--color-primary-50)]'
          }`}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div>
      {/* 知识卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <KnowledgeCard
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelectionChange={onSelectionChange}
            onClick={onItemClick}
          />
        ))}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-sm text-[var(--text-secondary)]">
            显示 {startIndex} 到 {endIndex} 条, 共 {totalItems} 条
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {renderPaginationButtons()}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-primary-50)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGrid;