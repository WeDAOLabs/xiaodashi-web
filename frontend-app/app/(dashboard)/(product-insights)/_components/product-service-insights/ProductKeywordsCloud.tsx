import React from 'react';

interface Keyword {
  text: string;
  size: string;
  color: string;
}

const ProductKeywordsCloud: React.FC = () => {
  const keywords: Keyword[] = [
    { text: '口感松软', size: 'text-2xl', color: 'text-blue-600' },
    { text: '不甜不腻', size: 'text-xl', color: 'text-purple-600' },
    { text: '奶油动物性', size: 'text-3xl', color: 'text-pink-600' },
    { text: '颜值高', size: 'text-2xl', color: 'text-teal-600' },
    { text: '包装精美', size: 'text-xl', color: 'text-green-600' },
    { text: '份量足', size: 'text-lg', color: 'text-orange-600' },
    { text: '水果新鲜', size: 'text-2xl', color: 'text-red-600' },
  ];

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">产品特点偏好分析</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">热门关键词</p>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-4 h-24">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className={`font-semibold ${keyword.size} ${keyword.color}`}
          >
            {keyword.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductKeywordsCloud;