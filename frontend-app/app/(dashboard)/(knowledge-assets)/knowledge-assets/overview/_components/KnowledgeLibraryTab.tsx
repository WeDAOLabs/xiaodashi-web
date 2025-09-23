'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import KnowledgeBaseCard from './KnowledgeBaseCard';

const KnowledgeLibraryTab: React.FC = () => {
  // 知识库数据
  const knowledgeBases = [
    {
      name: '产品资料库',
      entryCount: '450,320',
      used: 12.5,
      total: 25
    },
    {
      name: '营销话术库',
      entryCount: '120,500',
      used: 5.2,
      total: 10
    },
    {
      name: '销售FAQ',
      entryCount: '80,100',
      used: 3.9,
      total: 10
    },
    {
      name: '技术支持文档',
      entryCount: '580,569',
      used: 3.0,
      total: 15
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            首次使用？
            <Button variant="link" className="p-0 h-auto text-[var(--color-primary-600)] font-semibold" onClick={() => {}}>
              立即创建您的第一个知识库！
            </Button>
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            如何高效管理知识库？
            <Button variant="link" className="p-0 h-auto text-[var(--color-primary-600)] font-semibold" onClick={() => {}}>
              查看最佳实践。
            </Button>
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建知识库
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {knowledgeBases.map((kb, index) => (
          <KnowledgeBaseCard
            key={index}
            name={kb.name}
            entryCount={kb.entryCount}
            used={kb.used}
            total={kb.total}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeLibraryTab;