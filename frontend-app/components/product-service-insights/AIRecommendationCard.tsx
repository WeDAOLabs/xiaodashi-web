import React from 'react';

const AIRecommendationCard: React.FC = () => {
  const recommendations = [
    '基于用户对"低糖"和"新鲜水果"的需求, 建议开发',
    '采用代糖配方, 甜度降低30%, 符合健康趋势',
    '添加新鲜芒果果肉, 提升口感层次和果香',
    '设计简约清新造型, 适合夏季推广, 拍照分享传播性强',
    '使用环保可降解包装, 附赠小盆栽种子, 传递品牌理念',
  ];

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI新品研发指导建议</h2>
      </div>

      <div className="flex items-start gap-4 mt-4">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow">
          <svg className="w-6 h-6 text-[var(--color-primary-500)]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"/>
            <rect x="2" y="7" width="20" height="5"/>
            <line x1="12" y1="22" x2="12" y2="7"/>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">轻甜芒果慕斯蛋糕</p>
          <ul className="list-disc list-inside mt-2 space-y-1.5 text-sm text-[var(--text-secondary)] pl-2">
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationCard;