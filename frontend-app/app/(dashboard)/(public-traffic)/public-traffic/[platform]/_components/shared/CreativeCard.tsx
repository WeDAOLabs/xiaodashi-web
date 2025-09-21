import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreativeData } from '../types';

interface CreativeCardProps {
  creative: CreativeData;
  onABTest?: (creative: CreativeData) => void;
  onApplyToCampaign?: (creative: CreativeData) => void;
}

const CreativeCard: React.FC<CreativeCardProps> = ({
  creative,
  onABTest,
  onApplyToCampaign
}) => {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Image
          src={creative.imageUrl}
          alt={creative.name}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = '/images/placeholder.jpg';
          }}
        />
      </div>

      <CardContent className="p-4">
        <h4 className="font-semibold text-[var(--text-primary)] truncate mb-2">
          {creative.name}
        </h4>

        <div className="text-xs text-[var(--text-secondary)] grid grid-cols-2 gap-1 mb-4">
          <span>CTR: <strong>{creative.ctr.toFixed(2)}%</strong></span>
          <span>CVR: <strong>{creative.cvr.toFixed(2)}%</strong></span>
          <span>使用次数: <strong>{creative.usageCount}</strong></span>
          <span>AI评分: <strong>{creative.aiScore}</strong></span>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onABTest?.(creative)}
          >
            A/B测试
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-[var(--primary-color)] hover:bg-[var(--primary-light)]"
            onClick={() => onApplyToCampaign?.(creative)}
          >
            应用到计划
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeCard;