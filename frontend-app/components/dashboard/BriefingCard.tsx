
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface BriefingCardProps {
  imageUrl: string;
  title: string;
  author: string;
  stats: string;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ imageUrl, title, author, stats }) => {
  return (
    <Card className="border-none shadow-none bg-transparent p-0">
      <CardContent className="flex flex-col gap-3 pb-3 p-0">
        <div className="relative w-full aspect-square">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div>
          <p className="text-base font-medium leading-normal text-[var(--text-primary)]">{title}</p>
          <p className="text-sm font-normal leading-normal text-[var(--text-secondary)]">{stats}</p>
          <p className="text-sm font-normal leading-normal text-[var(--text-secondary)]">{author}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BriefingCard;
