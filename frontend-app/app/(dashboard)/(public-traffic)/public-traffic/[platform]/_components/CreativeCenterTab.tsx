import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import CreativeCard from './shared/CreativeCard';
import { BaseTabProps, CreativeData } from './types';

const CreativeCenterTab: React.FC<BaseTabProps> = () => {
  // 示例创意素材数据
  const creativeData: CreativeData[] = [
    {
      id: 'creative-1',
      name: '创意素材 1',
      imageUrl: 'https://picsum.photos/seed/1/300/200',
      ctr: 4.21,
      cvr: 1.85,
      usageCount: 23,
      aiScore: 88
    },
    {
      id: 'creative-2',
      name: '创意素材 2',
      imageUrl: 'https://picsum.photos/seed/2/300/200',
      ctr: 2.55,
      cvr: 2.10,
      usageCount: 41,
      aiScore: 92
    },
    {
      id: 'creative-3',
      name: '创意素材 3',
      imageUrl: 'https://picsum.photos/seed/3/300/200',
      ctr: 3.18,
      cvr: 0.95,
      usageCount: 15,
      aiScore: 78
    },
    {
      id: 'creative-4',
      name: '创意素材 4',
      imageUrl: 'https://picsum.photos/seed/4/300/200',
      ctr: 4.80,
      cvr: 2.90,
      usageCount: 33,
      aiScore: 95
    },
    {
      id: 'creative-5',
      name: '创意素材 5',
      imageUrl: 'https://picsum.photos/seed/5/300/200',
      ctr: 1.99,
      cvr: 1.12,
      usageCount: 8,
      aiScore: 72
    },
    {
      id: 'creative-6',
      name: '创意素材 6',
      imageUrl: 'https://picsum.photos/seed/6/300/200',
      ctr: 3.50,
      cvr: 2.50,
      usageCount: 29,
      aiScore: 91
    }
  ];

  // AI优化建议数据
  const optimizationSuggestions = [
    {
      id: 'suggestion-1',
      creative: {
        name: '创意素材 5',
        imageUrl: 'https://picsum.photos/seed/10/50/50'
      },
      suggestion: '图片色彩不够亮眼，吸引力较低。可尝试使用AI增强图片饱和度或更换为暖色调背景。'
    },
    {
      id: 'suggestion-2',
      creative: {
        name: '创意素材 3',
        imageUrl: 'https://picsum.photos/seed/11/50/50'
      },
      suggestion: '文案CTR偏低，可尝试使用疑问句或数字来增加紧迫感。AI已为您生成3个备选文案。'
    }
  ];

  const handleABTest = (creative: CreativeData) => {
    console.log('启动A/B测试:', creative);
  };

  const handleApplyToCampaign = (creative: CreativeData) => {
    console.log('应用到计划:', creative);
  };

  return (
    <div className="space-y-6">
      {/* 素材库头部 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">素材库</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            上传素材
          </Button>
          <Button className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI智能生成创意
          </Button>
        </div>
      </div>

      {/* 创意素材网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {creativeData.map((creative) => (
          <CreativeCard
            key={creative.id}
            creative={creative}
            onABTest={handleABTest}
            onApplyToCampaign={handleApplyToCampaign}
          />
        ))}
      </div>

      {/* AI 创意优化建议 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI 创意优化建议</h3>
        <ul className="space-y-3">
          {optimizationSuggestions.map((item) => (
            <li key={item.id} className="flex items-start space-x-3">
              <Image
                src={item.creative.imageUrl}
                alt={item.creative.name}
                width={50}
                height={50}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
              <div>
                <p className="font-medium text-[var(--text-primary)]">&ldquo;{item.creative.name}&rdquo;</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  <strong>建议:</strong> {item.suggestion}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CreativeCenterTab;