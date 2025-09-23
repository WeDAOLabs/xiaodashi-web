'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Brain,
  Info,
  Clock,
  ThumbsDown,
  FileText,
  ThumbsUp
} from 'lucide-react';

interface AISuggestion {
  id: string;
  category: string;
  categoryColor: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
}

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAction?: (suggestionId: string, action: string) => void;
}

const defaultSuggestions: AISuggestion[] = [
  {
    id: '1',
    category: '预算优化',
    categoryColor: 'bg-blue-100 text-blue-600',
    description: 'AI建议：针对\'夏季防晒霜主推活动\'，将短视频信息流预算上调15%，转化率预计提升8%。',
    status: 'pending'
  },
  {
    id: '2',
    category: '内容优化',
    categoryColor: 'bg-purple-100 text-purple-600',
    description: 'AI建议：针对\'新客欢迎语\'，在原基础上增加用户兴趣偏好标签，可提升点击率10%。',
    status: 'pending'
  },
  {
    id: '3',
    category: '触达时机',
    categoryColor: 'bg-amber-100 text-amber-600',
    description: 'AI建议：针对\'限时秒杀活动\'，将私域群发时间提前1小时，避免与竞品冲突。',
    status: 'pending'
  }
];

const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  onAction
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleAction = (action: string): void => {
    onAction?.(suggestion.id, action);
  };

  return (
    <Card
      className="bg-[var(--bg-primary)] shadow-sm border border-transparent hover:border-[var(--color-primary-500)] transition-all group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="bg-[var(--color-primary-50)] p-2 rounded-full">
            <Brain className="w-6 h-6 text-[var(--color-primary-500)]" />
          </div>
          <div className="flex-1">
            <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${suggestion.categoryColor}`}>
              {suggestion.category}
            </Badge>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              {suggestion.description}
            </p>
          </div>
        </div>

        {/* 操作按钮 - 悬浮时显示 */}
        <div className={`mt-4 flex items-center justify-end gap-2 transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('view-details')}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            查看详情
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('later')}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            稍后处理
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('reject')}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            不采纳
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('generate-instruction')}
            className="text-xs font-medium bg-[var(--color-primary-50)] text-[var(--color-primary-600)] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[var(--color-primary-100)] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            生成营销指令
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction('apply')}
            className="text-xs font-medium bg-[var(--color-primary-500)] text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[var(--color-primary-600)] transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            一键采纳并应用
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface AISuggestionListProps {
  title?: string;
  suggestions?: AISuggestion[];
}

const AISuggestionList: React.FC<AISuggestionListProps> = ({
  title = 'AI营销优化建议',
  suggestions = defaultSuggestions
}) => {
  const handleAction = (suggestionId: string, action: string): void => {
    console.log(`Suggestion ${suggestionId}: ${action}`);
    // 这里可以添加实际的处理逻辑
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex flex-col gap-4">
        {suggestions.map((suggestion) => (
          <AISuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAction={handleAction}
          />
        ))}
      </div>
    </section>
  );
};

export default AISuggestionList;