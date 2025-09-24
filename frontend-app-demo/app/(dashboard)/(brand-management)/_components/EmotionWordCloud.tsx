'use client';

import React from 'react';

interface WordData {
  text: string;
  weight: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface EmotionWordCloudProps {
  words: WordData[];
  width?: number;
  height?: number;
  className?: string;
}

const EmotionWordCloud = React.memo<EmotionWordCloudProps>(({
  words,
  width = 280,
  height = 150,
  className
}) => {
  // 根据情感类型获取颜色
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive':
        return 'var(--primary-color)';
      case 'negative':
        return 'var(--text-secondary)';
      default:
        return 'var(--text-primary)';
    }
  };

  // 根据权重计算字体大小
  const getFontSize = (weight: number): number => {
    const minSize = 14;
    const maxSize = 38;
    return minSize + (weight / 100) * (maxSize - minSize);
  };

  // 预定义的词云布局位置（基于效果图）
  const getWordPosition = (index: number) => {
    const positions = [
      { x: 140, y: 70 }, // 中心主词
      { x: 75, y: 65 },  // 左侧
      { x: 195, y: 75 }, // 右侧
      { x: 140, y: 30 }, // 上方
      { x: 80, y: 110 }, // 左下
      { x: 210, y: 40 }, // 右上
      { x: 190, y: 120 }, // 右下
      { x: 60, y: 35 },  // 左上
      { x: 120, y: 130 }, // 底部
    ];

    return positions[index % positions.length] || { x: 140, y: 70 };
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
        {words.map((word, index) => {
          const position = getWordPosition(index);
          const fontSize = getFontSize(word.weight);
          const color = getSentimentColor(word.sentiment);

          return (
            <text
              key={`${word.text}-${index}`}
              x={position.x}
              y={position.y}
              fontSize={fontSize}
              fill={color}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontWeight: 600 }}
              className="transition-all duration-200 hover:opacity-80 cursor-default"
            >
              {word.text}
            </text>
          );
        })}
      </svg>
    </div>
  );
});

EmotionWordCloud.displayName = 'EmotionWordCloud';

export default EmotionWordCloud;