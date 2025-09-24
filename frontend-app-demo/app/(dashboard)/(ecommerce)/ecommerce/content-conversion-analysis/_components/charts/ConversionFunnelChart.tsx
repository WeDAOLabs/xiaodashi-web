'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface FunnelStep {
  label: string;
  count: number;
  color: string;
}

const ConversionFunnelChart: React.FC = () => {
  const funnelData: FunnelStep[] = [
    { label: '公域点击 (80,000)', count: 80000, color: 'var(--color-primary-500)' },
    { label: '浏览商品 (32,000)', count: 32000, color: 'var(--color-primary-600)' },
    { label: '加入购物车 (4,000)', count: 4000, color: 'var(--color-primary-700)' },
    { label: '下单支付 (2,500)', count: 2500, color: 'var(--primary-color)' }
  ];


  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardHeader className="px-6 py-4 border-b border-[var(--border-secondary)]">
        <CardTitle className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Filter className="w-5 h-5 text-[var(--primary-color)]" />
          流量来源与转化漏斗
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="w-full h-[300px] flex justify-center items-center">
          <svg width="100%" height="100%" viewBox="0 0 500 300" className="overflow-visible">
            <g transform="translate(100, 20)">
              {/* 漏斗层级 */}
              <polygon
                points="0,0 300,0 260,60 40,60"
                fill={funnelData[0].color}
                className="transition-opacity hover:opacity-80"
              />
              <polygon
                points="40,60 260,60 230,120 70,120"
                fill={funnelData[1].color}
                className="transition-opacity hover:opacity-80"
              />
              <polygon
                points="70,120 230,120 200,180 100,180"
                fill={funnelData[2].color}
                className="transition-opacity hover:opacity-80"
              />
              <polygon
                points="100,180 200,180 180,240 120,240"
                fill={funnelData[3].color}
                className="transition-opacity hover:opacity-80"
              />

              {/* 标签文字 */}
              <text x="310" y="35" fill="var(--text-primary)" fontSize="14" fontWeight="500">
                {funnelData[0].label}
              </text>
              <text x="310" y="95" fill="var(--text-primary)" fontSize="14" fontWeight="500">
                {funnelData[1].label}
              </text>
              <text x="310" y="155" fill="var(--text-primary)" fontSize="14" fontWeight="500">
                {funnelData[2].label}
              </text>
              <text x="310" y="215" fill="var(--text-primary)" fontSize="14" fontWeight="500">
                {funnelData[3].label}
              </text>

              {/* 转化率指示线 */}
              <line x1="260" y1="30" x2="305" y2="30" stroke="var(--border-primary)" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="230" y1="90" x2="305" y2="90" stroke="var(--border-primary)" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="200" y1="150" x2="305" y2="150" stroke="var(--border-primary)" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="180" y1="210" x2="305" y2="210" stroke="var(--border-primary)" strokeWidth="1" strokeDasharray="2,2"/>
            </g>
          </svg>
        </div>

        {/* 转化率统计 */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-[var(--text-tertiary)]">整体转化率</p>
            <p className="font-bold text-[var(--primary-color)]">3.13%</p>
          </div>
          <div>
            <p className="text-[var(--text-tertiary)]">加购转化率</p>
            <p className="font-bold text-[var(--primary-color)]">12.5%</p>
          </div>
          <div>
            <p className="text-[var(--text-tertiary)]">支付转化率</p>
            <p className="font-bold text-[var(--primary-color)]">62.5%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionFunnelChart;