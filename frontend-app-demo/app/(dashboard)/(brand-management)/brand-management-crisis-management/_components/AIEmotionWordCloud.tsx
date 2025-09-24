'use client';

import React from 'react';

interface EmotionWord {
  text: string;
  weight: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const AIEmotionWordCloud: React.FC = () => {
  const emotionWords: EmotionWord[] = React.useMemo(() => [
    { text: '质量问题', weight: 100, sentiment: 'negative' },
    { text: '失望', weight: 85, sentiment: 'negative' },
    { text: '欺骗', weight: 75, sentiment: 'negative' },
    { text: '退货', weight: 65, sentiment: 'negative' },
    { text: '不会再买', weight: 60, sentiment: 'negative' },
    { text: '垃圾', weight: 50, sentiment: 'negative' },
    { text: '售后', weight: 45, sentiment: 'neutral' },
    { text: '客服', weight: 40, sentiment: 'neutral' },
    { text: '价格', weight: 35, sentiment: 'neutral' },
    { text: '物流', weight: 30, sentiment: 'neutral' },
    { text: '包装', weight: 25, sentiment: 'neutral' },
    { text: '推荐', weight: 20, sentiment: 'positive' },
  ], []);

  const getSentimentColor = (sentiment: EmotionWord['sentiment']): string => {
    switch (sentiment) {
      case 'positive': return 'var(--color-success-600)';
      case 'negative': return 'var(--color-danger-600)';
      case 'neutral': return 'var(--color-warning-600)';
    }
  };

  const getFontSize = (weight: number): number => {
    // 将权重映射到合适的字体大小范围 (8px - 18px)，避免文字过大
    const minSize = 8;
    const maxSize = 18;
    const maxWeight = Math.max(...emotionWords.map(w => w.weight));
    const minWeight = Math.min(...emotionWords.map(w => w.weight));

    return minSize + ((weight - minWeight) / (maxWeight - minWeight)) * (maxSize - minSize);
  };

  const getRandomPosition = (index: number, totalWords: number) => {
    // 使用确定性的伪随机位置，基于索引
    const cols = 4;
    const rows = Math.ceil(totalWords / cols);
    const row = Math.floor(index / cols);
    const col = index % cols;

    // 计算基础位置，确保有足够边距
    const baseX = (col + 0.5) * (100 / cols);
    const baseY = (row + 0.5) * (100 / rows);

    // 使用更小的偏移量，确保不超出边界
    const offsetX = ((index * 37) % 10) - 5; // -5 到 5 的偏移
    const offsetY = ((index * 73) % 10) - 5;

    return {
      x: Math.max(10, Math.min(90, baseX + offsetX)),
      y: Math.max(15, Math.min(85, baseY + offsetY))
    };
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-center mb-2">
        <h4 className="text-xs font-medium text-[var(--text-secondary)]">AI情感词云分析</h4>
      </div>
      <div className="flex-1 relative overflow-hidden bg-gray-50 rounded-md">
        <div className="absolute inset-2">
          {emotionWords.map((word, index) => {
            const position = getRandomPosition(index, emotionWords.length);
            const fontSize = getFontSize(word.weight);
            const color = getSentimentColor(word.sentiment);

            return (
              <div
                key={`${word.text}-${index}`}
                className="absolute transition-all duration-300 hover:scale-105 cursor-pointer select-none"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${fontSize}px`,
                  color,
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap',
                }}
                title={`情感词: ${word.text} | 权重: ${word.weight} | 情感: ${word.sentiment === 'positive' ? '正面' : word.sentiment === 'negative' ? '负面' : '中性'}`}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* 情感分布统计 */}
      <div className="flex justify-center mt-2 pt-2 border-t border-[var(--border-secondary)]">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-danger-600)]"></div>
            <span className="text-[var(--text-tertiary)]">负面 67%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-warning-600)]"></div>
            <span className="text-[var(--text-tertiary)]">中性 25%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[var(--color-success-600)]"></div>
            <span className="text-[var(--text-tertiary)]">正面 8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEmotionWordCloud;