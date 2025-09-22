'use client';

import React from 'react';
import { Plus, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Platform } from './types';

// 平台图标组件
const JDIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#E2231A"/>
    <path d="M7.5 16.5L9 18L15 12L9 6L7.5 7.5L12 12L7.5 16.5Z" fill="white"/>
    <path d="M12.5 16.5L14 18L20 12L14 6L12.5 7.5L17 12L12.5 16.5Z" fill="white" fillOpacity="0.6"/>
  </svg>
);

const TaobaoIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FF5500"/>
    <path d="M8 8H16V10H13V16H11V10H8V8Z" fill="white"/>
  </svg>
);

const DouyinIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="black"/>
    <path d="M14.5 6C13.1193 6 12 7.11929 12 8.5V14C12 16.2091 10.2091 18 8 18C5.79086 18 4 16.2091 4 14C4 11.7909 5.79086 10 8 10" stroke="white" strokeWidth="2"/>
    <path d="M12 8.5C12 7.11929 13.1193 6 14.5 6C15.8807 6 17 7.11929 17 8.5C17 9.88071 15.8807 11 14.5 11C13.1193 11 12 9.88071 12 8.5Z" fill="#3BDEFF"/>
    <path d="M12 8.5C12 7.11929 13.1193 6 14.5 6C15.8807 6 17 7.11929 17 8.5C17 9.88071 15.8807 11 14.5 11C13.1193 11 12 9.88071 12 8.5Z" fill="#FF4284" style={{mixBlendMode: 'plus-lighter'}}/>
  </svg>
);

const MeituanIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFC300"/>
    <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="#1d1d1f"/>
  </svg>
);

// 平台数据
const platforms: Platform[] = [
  {
    id: 'jd',
    name: '京东',
    status: 'authorized',
    logo: <JDIcon />,
    stats: {
      averageSales: '¥120,500',
      conversionRate: '5.2%',
      issues: 25
    },
    aiInsight: '京东平台客单价高，建议主推高品质商品，优化物流体验。'
  },
  {
    id: 'taobao',
    name: '淘宝',
    status: 'authorized',
    logo: <TaobaoIcon />,
    stats: {
      averageSales: '¥85,200',
      conversionRate: '8.9%',
      issues: 152
    },
    aiInsight: '淘宝流量巨大但竞争激烈，建议通过直播和短视频引流，提升转化率。'
  },
  {
    id: 'douyin',
    name: '抖音',
    status: 'authorized',
    logo: <DouyinIcon />,
    stats: {
      averageSales: '¥210,300',
      conversionRate: '12.5%',
      issues: 88
    },
    aiInsight: '抖音是内容电商主战场，应加强爆款视频内容创作，刺激冲动消费。'
  },
  {
    id: 'meituan',
    name: '美团',
    status: 'unauthorized',
    logo: <MeituanIcon />,
    aiInsight: '美团侧重本地生活服务，连接后可开拓O2O新零售场景。'
  }
];

interface PlatformCardProps {
  platform: Platform;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  return (
    <Card className="shadow-sm border border-[var(--border-secondary)] hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {platform.logo}
            <span className="text-lg font-bold text-[var(--text-primary)]">{platform.name}</span>
          </div>
          <Badge
            className={
              platform.status === 'authorized'
                ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]'
                : 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]'
            }
          >
            {platform.status === 'authorized' ? '已授权' : '未授权'}
          </Badge>
        </div>

        {platform.stats && (
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">平均销售额</p>
              <p className="font-semibold text-[var(--text-primary)]">{platform.stats.averageSales}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">转化率</p>
              <p className="font-semibold text-[var(--text-primary)]">{platform.stats.conversionRate}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">问题数</p>
              <p className="font-semibold text-[var(--text-primary)]">{platform.stats.issues}</p>
            </div>
          </div>
        )}

        <div className="bg-[var(--bg-secondary)] p-3 rounded-lg flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[var(--color-warning-600)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold text-[var(--text-primary)]">AI洞察: </span>
            {platform.aiInsight}
          </p>
        </div>

        {platform.status === 'unauthorized' && (
          <Button className="w-full mt-4 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white">
            立即授权
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const PlatformOverview: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">平台总览</h2>
        <Button className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white">
          <Plus className="w-4 h-4" />
          新增平台授权
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}
      </div>
    </section>
  );
};

export default PlatformOverview;