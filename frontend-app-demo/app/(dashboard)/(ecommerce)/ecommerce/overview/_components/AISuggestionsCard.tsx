'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface AISuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  canApply: boolean;
}

interface SuggestionItemProps {
  suggestion: AISuggestion;
  onApply?: (id: string) => void;
  onIgnore?: (id: string) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  onApply,
  onIgnore
}) => {
  return (
    <div className="p-4 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-tertiary)]">
      <div className="flex items-start">
        <Lightbulb className="w-5 h-5 text-[var(--warning-color)] mr-3 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-[var(--text-primary)]">{suggestion.title}</h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {suggestion.description}
          </p>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-3 mt-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium"
          onClick={() => onIgnore?.(suggestion.id)}
        >
          忽略
        </Button>
        {suggestion.canApply && (
          <Button
            size="sm"
            className="px-3 py-1 text-sm text-white bg-[var(--primary-color)] rounded-md hover:bg-[var(--primary-hover)] font-medium"
            onClick={() => onApply?.(suggestion.id)}
          >
            应用AI建议
          </Button>
        )}
      </div>
    </div>
  );
};

const AISuggestionsCard: React.FC = () => {
  const suggestions: AISuggestion[] = [
    {
      id: '1',
      category: '商品优化',
      title: '商品优化建议',
      description: '"夏季新款T恤"主图点击率偏低，建议更换为场景化实拍图以提升吸引力。',
      canApply: true,
    },
    {
      id: '2',
      category: '活动策略',
      title: '活动策略建议',
      description: '"618大促"预热期，建议针对"居家生活馆"高价值客户发放专属优惠券，提升复购率。',
      canApply: true,
    },
  ];

  const handleApplySuggestion = (id: string) => {
    console.log('应用AI建议:', id);
    // 这里可以添加应用建议的逻辑
  };

  const handleIgnoreSuggestion = (id: string) => {
    console.log('忽略建议:', id);
    // 这里可以添加忽略建议的逻辑
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">AI优化建议</h3>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              onApply={handleApplySuggestion}
              onIgnore={handleIgnoreSuggestion}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestionsCard;