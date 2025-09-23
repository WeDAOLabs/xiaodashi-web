'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import KnowledgeItem from './KnowledgeItem';
import type { KnowledgeItem as KnowledgeItemType } from './types';

interface KnowledgeListProps {
  selectedId?: string;
  onItemSelect?: (item: KnowledgeItemType) => void;
  className?: string;
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({ selectedId, onItemSelect, className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const knowledgeItems: KnowledgeItemType[] = [
    {
      id: '1',
      title: '产品A - 高级功能配置',
      version: 'V2.1',
      references: 15,
      lastUpdated: '2025-09-01',
      status: { id: 'published', color: 'green', label: '已发布' }
    },
    {
      id: '2',
      title: '新品发布会宣传文案',
      version: 'V1.0',
      references: 8,
      lastUpdated: '2025-09-05',
      status: { id: 'pending', color: 'yellow', label: '待审核' },
      isHighFrequency: true
    },
    {
      id: '3',
      title: '软件安装教程',
      version: 'V1.5',
      references: 150,
      lastUpdated: '2024-03-12',
      status: { id: 'expired', color: 'red', label: '已过期' }
    },
    {
      id: '4',
      title: 'Q3 市场分析报告',
      version: 'V3.0',
      references: 45,
      lastUpdated: '2025-08-20',
      status: { id: 'published', color: 'green', label: '已发布' },
      isHighFrequency: true
    }
  ];

  const filteredItems = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item: KnowledgeItemType) => {
    onItemSelect?.(item);
  };

  return (
    <Card className={`bg-[var(--bg-primary)] shadow-sm border border-[var(--border-primary)] flex flex-col ${className || ''}`}>
      <div className="p-3 border-b border-[var(--border-primary)] flex justify-between items-center">
        <h2 className="font-semibold">知识分类与管理</h2>
        <Button
          size="sm"
          variant="ghost"
          className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-md text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-3 border-b border-[var(--border-primary)]">
        <Input
          type="text"
          placeholder="筛选知识条目..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm px-3 py-1.5 border border-[var(--border-primary)] rounded-md focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
        />
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        {filteredItems.map((item) => (
          <KnowledgeItem
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </Card>
  );
};

export default KnowledgeList;