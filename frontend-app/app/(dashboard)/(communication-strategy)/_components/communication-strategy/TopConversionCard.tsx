import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ConversionItemProps {
  title: string;
  description: string;
  conversionRate: string;
  rank: number;
  change: string;
  isPositive: boolean;
  isFirst: boolean;
}

const ConversionItem: React.FC<ConversionItemProps> = ({
  title,
  description,
  conversionRate,
  rank,
  change,
  isPositive,
  isFirst
}) => (
  <div className={`${isFirst ? 'bg-[var(--color-success-50)] border border-[var(--color-success-100)]' : 'bg-[var(--bg-secondary)] border'} p-3 rounded-md`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`font-semibold ${isFirst ? 'text-[var(--color-success-800)]' : 'text-[var(--text-primary)]'}`}>
          {title}
        </p>
        <p className={`text-xs mt-1 ${isFirst ? 'text-[var(--color-success-700)]' : 'text-[var(--text-secondary)]'}`}>
          {description}
        </p>
      </div>
      <div className="text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
          isFirst ? 'bg-[var(--color-success-600)]' : 'bg-[var(--text-secondary)]'
        }`}>
          {conversionRate}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4 mt-2">
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isFirst
          ? 'bg-[var(--color-success-200)] text-[var(--color-success-800)]'
          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
      }`}>
        排名第{rank === 1 ? '一' : '二'}
      </span>

      <div className={`flex items-center text-sm font-semibold ${
        isPositive ? 'text-[var(--color-success-600)]' : 'text-[var(--color-danger-600)]'
      }`}>
        <svg
          className={`w-4 h-4 ${!isPositive && 'transform rotate-180'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
        <span>{change}</span>
      </div>
    </div>
  </div>
);

const TopConversionCard: React.FC = () => {
  return (
    <Card className="bg-white p-5 rounded-lg shadow-sm h-full flex flex-col">
      <CardContent className="p-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[var(--text-primary)]">话术转化效果TOP 2</h3>
          <a
            href="#"
            className="text-sm text-[var(--color-primary-500)] hover:underline flex items-center gap-1"
          >
            查看全部
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        <div className="mt-4 space-y-3">
          <ConversionItem
            title="【生日专属优惠话术】"
            description="针对生日月用户的个性化祝福与优惠推送"
            conversionRate="25%"
            rank={1}
            change="+2%"
            isPositive={true}
            isFirst={true}
          />

          <ConversionItem
            title="【新品尝鲜邀请话术】"
            description="针对新品感兴趣用户的尝鲜邀请"
            conversionRate="18%"
            rank={2}
            change="-1%"
            isPositive={false}
            isFirst={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TopConversionCard;