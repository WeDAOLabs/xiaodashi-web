
import React from 'react';
import Image from 'next/image';

interface BriefingCardProps {
  imageUrl: string;
  title: string;
  author: string;
  stats: string;
}

const BriefingCard: React.FC<BriefingCardProps> = ({ imageUrl, title, author, stats }) => {
  return (
    <div className="flex flex-col gap-3 pb-3">
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
    </div>
  );
};

export default BriefingCard;
