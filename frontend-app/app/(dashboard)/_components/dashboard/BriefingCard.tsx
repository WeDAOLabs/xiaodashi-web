import { BorderlessCard, BorderlessCardContent } from '@/components/ui/borderless-card';
import Image from 'next/image';
import React from 'react';

interface BriefingCardProps {
  imageUrl: string;
  title: string;
  author: string;
  stats: string;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ imageUrl, title, author, stats }) => {
  return (
    <BorderlessCard variant="default" className="overflow-hidden">
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="rounded-t-xl object-cover"
        />
      </div>
      <BorderlessCardContent direction="column" padding="sm" className="gap-1">
        <p className="text-base font-medium leading-normal text-[var(--text-primary)]">{title}</p>
        <p className="text-sm font-normal leading-normal text-[var(--text-secondary)]">{stats}</p>
        <p className="text-sm font-normal leading-normal text-[var(--text-secondary)]">{author}</p>
      </BorderlessCardContent>
    </BorderlessCard>
  );
};

export default BriefingCard;
