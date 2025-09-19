import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

interface TrendCardEnhancedProps {
  imageUrl: string;
  title: string;
  description: string;
  metrics?: Array<{
    label: string;
    value: string;
  }>;
  progressMetrics?: Array<{
    label: string;
    value: string;
    percentage: number;
  }>;
}

const TrendCardEnhanced: React.FC<TrendCardEnhancedProps> = ({
  imageUrl,
  title,
  description,
  metrics,
  progressMetrics
}) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <CardContent className="flex-1 p-0">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{description}</p>

        {metrics && (
          <div className="flex gap-8 mb-6">
            {metrics.map((metric, index) => (
              <div key={index}>
                <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
                <p className="text-2xl font-bold text-[var(--color-primary-500)]">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        {progressMetrics && (
          <div className="flex gap-4 mb-6">
            {progressMetrics.map((metric, index) => (
              <div key={index} className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--text-secondary)]">{metric.label}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{metric.value}</span>
                </div>
                <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-1.5">
                  <div
                    className="bg-[var(--color-primary-500)] h-1.5 rounded-full"
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="bg-[var(--color-neutral-50)] text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] text-sm px-4 py-2 rounded-lg"
        >
          查看详细报告
        </Button>
      </CardContent>

      <div className="w-full md:w-56 lg:w-72 h-48 rounded-lg overflow-hidden flex-shrink-0 relative">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </Card>
  );
};

export default TrendCardEnhanced;