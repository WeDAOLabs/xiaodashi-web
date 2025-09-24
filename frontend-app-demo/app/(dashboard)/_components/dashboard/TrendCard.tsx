import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

interface TrendCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const TrendCard: React.FC<TrendCardProps> = ({ imageUrl, title, description }) => {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="p-4">
        <div className="flex items-stretch justify-between gap-4 rounded-lg">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold leading-tight text-[var(--text-primary)]">{title}</p>
              <p className="text-sm font-normal leading-normal text-[var(--text-secondary)]">{description}</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/80 w-fit"
            >
              <span className="truncate">More</span>
            </Button>
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
      </CardContent>
    </Card>
  );
};

export default TrendCard;
