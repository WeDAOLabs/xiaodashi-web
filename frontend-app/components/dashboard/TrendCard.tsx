
import React from 'react';
import Image from 'next/image';

interface TrendCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const TrendCard: React.FC<TrendCardProps> = ({ imageUrl, title, description }) => {
  return (
    <div className="p-4">
      <div className="flex items-stretch justify-between gap-4 rounded-lg">
        <div className="flex flex-[2_2_0px] flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold leading-tight text-[var(--text-primary)]">{title}</p>
            <p className="text-sm font-normal leading-normal text-[var(--text-secondary)]">{description}</p>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium leading-normal w-fit">
            <span className="truncate">More</span>
          </button>
        </div>
        <div className="relative w-full aspect-video flex-1">
            <Image
                src={imageUrl}
                alt={title}
                fill
                className="rounded-lg object-cover"
            />
        </div>
      </div>
    </div>
  );
};

export default TrendCard;
