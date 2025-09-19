'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CompetitorData {
  id: string;
  name: string;
  avatar: string;
  marketShare: string;
  trend: string;
  isPositive: boolean;
  isSelected: boolean;
}

interface CompetitorSelectorProps {
  competitors: CompetitorData[];
  onSelectionChange: (competitorId: string, selected: boolean) => void;
}

const CompetitorSelector: React.FC<CompetitorSelectorProps> = ({
  competitors,
  onSelectionChange
}) => {
  const handleCheckboxChange = (competitorId: string, checked: boolean) => {
    onSelectionChange(competitorId, checked);
  };

  return (
    <Card className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">选择对比竞品</h2>
        <div className="space-y-3">
          {competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="flex items-center p-3 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer border border-transparent transition-all"
            >
              <Checkbox
                id={`competitor-${competitor.id}`}
                checked={competitor.isSelected}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(competitor.id, checked as boolean)
                }
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              />
              <Image
                src={competitor.avatar}
                alt={competitor.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full mx-3 object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes('placeholder')) {
                    target.src = '/images/competitors/placeholder.jpg';
                  }
                }}
              />
              <div className="flex-grow">
                <p className="font-semibold text-[var(--text-primary)]">{competitor.name}</p>
                <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
                  <span>市占率: {competitor.marketShare}</span>
                  <div className={`flex items-center text-xs font-semibold ${
                    competitor.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {competitor.isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    <span>{competitor.trend}</span>
                  </div>
                </div>
              </div>
              <div className="w-16 h-8">
                {/* 简化的趋势图 - 使用SVG */}
                <svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path
                    d={competitor.isPositive
                      ? "M 0 20 C 16 5, 48 5, 64 20"
                      : "M 0 15 C 16 30, 48 30, 64 15"
                    }
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorSelector;