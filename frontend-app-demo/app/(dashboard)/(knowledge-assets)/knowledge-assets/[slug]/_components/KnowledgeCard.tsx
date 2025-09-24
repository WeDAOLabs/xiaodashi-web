import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageCircle, GitBranch } from 'lucide-react';
import { KnowledgeItem } from './types';

interface KnowledgeCardProps {
  item: KnowledgeItem;
  isSelected: boolean;
  onSelectionChange: (id: string, selected: boolean) => void;
  onClick?: (item: KnowledgeItem) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  item,
  isSelected,
  onSelectionChange,
  onClick
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-success-50)] text-[var(--color-success-600)] border-0">
            已发布
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-0">
            草稿
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-0">
            待审核
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`bg-[var(--bg-primary)] rounded-lg shadow-sm border-2 transition-all duration-200 group cursor-pointer flex flex-col p-0 gap-0 ${
        isSelected
          ? 'border-[var(--color-primary-500)]'
          : 'border-transparent hover:border-[var(--border-primary)]'
      }`}
      onClick={() => onClick?.(item)}
    >
      <CardContent className="p-5 flex-1">
        <div className="flex items-start justify-between mb-2">
          <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-0">
            {item.category}
          </Badge>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(item.id, !!checked)}
            className={`h-4 w-4 rounded border-[var(--border-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] transition-opacity ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <h3 className="text-md font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)] transition-colors leading-tight">
          {item.title}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-3">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1">
          {item.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded border-0"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-secondary)]">
          <p className="text-xs text-[var(--text-primary)] font-medium">
            <span className="font-bold text-[var(--color-primary-700)]">AI 摘要:</span> {item.aiSummary}
          </p>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 bg-[var(--bg-tertiary)] rounded-b-lg flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>{item.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-3 h-3" />
          <span>{item.comments}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3 h-3" />
          <span>{item.version}</span>
        </div>
        {getStatusBadge(item.status)}
      </CardFooter>
    </Card>
  );
};

export default KnowledgeCard;