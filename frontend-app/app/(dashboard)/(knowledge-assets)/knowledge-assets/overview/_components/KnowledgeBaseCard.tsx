import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Book, MoreHorizontal } from 'lucide-react';
import SpaceProgress from './SpaceProgress';

interface KnowledgeBaseCardProps {
  name: string;
  entryCount: string;
  used: number;
  total: number;
  unit?: string;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  name,
  entryCount,
  used,
  total,
  unit = 'GB'
}) => {
  return (
    <Card className="bg-[var(--bg-primary)] p-5 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-500)]">
            <Book className="w-5 h-5" />
          </div>
          <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mt-4">{name}</h3>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">{entryCount} 个条目</p>
        <SpaceProgress used={used} total={total} unit={unit} />
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseCard;