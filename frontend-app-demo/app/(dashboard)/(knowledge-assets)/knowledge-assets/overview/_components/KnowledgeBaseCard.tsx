import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Book, MoreHorizontal } from 'lucide-react';
import SpaceProgress from './SpaceProgress';
import { getSlugByName } from './utils';

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
  const router = useRouter();

  const handleCardClick = () => {
    const slug = getSlugByName(name);
    router.push(`/knowledge-assets/${slug}`);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 实现更多操作菜单
    console.log('More options for:', name);
  };

  return (
    <Card
      className="bg-[var(--bg-primary)] p-5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-500)]">
            <Book className="w-5 h-5" />
          </div>
          <button
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--bg-secondary)]"
            onClick={handleMoreClick}
            aria-label={`${name}更多操作`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mt-4 group-hover:text-[var(--color-primary-600)] transition-colors">{name}</h3>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">{entryCount} 个条目</p>
        <SpaceProgress used={used} total={total} unit={unit} />
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseCard;