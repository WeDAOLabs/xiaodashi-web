import React from 'react';

interface SentimentItem {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
}

const SentimentAnalysisCard: React.FC = () => {
  const sentimentData: SentimentItem[] = [
    {
      type: 'positive',
      title: '对"创意造型"的积极评价增多',
      description: '"卡通造型特别受孩子们喜欢, 生日派对上..."',
    },
    {
      type: 'negative',
      title: '对"添加人工色素"的负面评价',
      description: '"希望减少人工色素使用, 更注重健康和天然..."',
    },
    {
      type: 'neutral',
      title: '对"蛋糕尺寸"的多样化需求',
      description: '"希望增加迷你尺寸选项, 适合1-2人食用"',
    },
  ];

  const getIconAndColor = (type: SentimentItem['type']) => {
    switch (type) {
      case 'positive':
        return {
          bgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          icon: (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          ),
        };
      case 'negative':
        return {
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          ),
        };
      case 'neutral':
        return {
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          icon: (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          ),
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: null,
        };
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">情感倾向分析</h2>
      </div>

      <div className="space-y-4 mt-4">
        {sentimentData.map((item, index) => {
          const { bgColor, iconColor, icon } = getIconAndColor(item.type);
          return (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0 mt-1`}>
                <div className={iconColor}>{icon}</div>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SentimentAnalysisCard;