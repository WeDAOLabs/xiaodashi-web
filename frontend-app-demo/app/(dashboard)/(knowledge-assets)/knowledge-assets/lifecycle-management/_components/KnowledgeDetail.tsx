'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import type { KnowledgeDetail, KnowledgeDetailTab, MarketingTag } from './types';

interface KnowledgeDetailProps {
  selectedItem?: KnowledgeDetail | null;
  className?: string;
}

const KnowledgeDetail: React.FC<KnowledgeDetailProps> = ({ selectedItem, className }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [tags, setTags] = useState<MarketingTag[]>([
    { id: '1', label: '目标客户', removable: true },
    { id: '2', label: '产品卖点', removable: true },
    { id: '3', label: '营销活动', removable: true },
    { id: '4', label: '竞品对比', removable: true }
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  const tabs: KnowledgeDetailTab[] = [
    { id: 'content', label: '知识内容' },
    { id: 'history', label: '版本历史' },
    { id: 'permissions', label: '权限管理' },
    { id: 'review', label: '审核与发布' },
    { id: 'references', label: '知识引用' },
    { id: 'testing', label: '测试验证' }
  ];

  const defaultItem: KnowledgeDetail = {
    id: '2',
    title: '新品发布会宣传文案',
    version: 'V1.0',
    status: '待审核',
    content: '',
    tags: tags
  };

  const currentItem = selectedItem || defaultItem;

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const newTag: MarketingTag = {
        id: Date.now().toString(),
        label: newTagInput.trim(),
        removable: true
      };
      setTags([...tags, newTag]);
      setNewTagInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <Card className={`bg-[var(--bg-primary)] shadow-sm border border-[var(--border-primary)] flex flex-col overflow-hidden p-0 gap-0 ${className || ''}`}>
      <div className="p-4 border-b border-[var(--border-primary)] flex-shrink-0">
        <h2 className="text-lg font-semibold">{currentItem.title}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          版本: {currentItem.version} | 状态: <span className="font-medium">{currentItem.status}</span>
        </p>
      </div>

      <div className="border-b border-[var(--border-primary)] px-4 flex-shrink-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-none p-0 h-auto w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors data-[state=active]:border-[var(--primary-color)] data-[state=active]:text-[var(--primary-color)] data-[state=inactive]:border-transparent data-[state=inactive]:text-[var(--text-secondary)] data-[state=inactive]:hover:text-[var(--text-primary)] bg-transparent"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        <Tabs value={activeTab}>
          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
              <div>
                <Label className="font-medium text-sm">标题</Label>
                <Input
                  type="text"
                  value={currentItem.title}
                  className="mt-1 w-full text-base p-2 border border-[var(--border-primary)] rounded-md"
                  readOnly
                />
              </div>
              <div>
                <Label className="font-medium text-sm">内容 (富文本编辑器)</Label>
                <div className="mt-1 w-full h-64 p-2 border border-[var(--border-primary)] rounded-md bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-tertiary)]">
                  [富文本编辑器区域]
                </div>
              </div>
              <div>
                <Label className="font-medium text-sm">营销标签库</Label>
                <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-[var(--border-primary)] rounded-md">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full text-sm flex items-center gap-1.5"
                    >
                      {tag.label}
                      {tag.removable && (
                        <button onClick={() => handleRemoveTag(tag.id)}>
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  <Input
                    placeholder="添加标签..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-sm flex-grow bg-transparent focus:outline-none p-1 border-none shadow-none"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {tabs.slice(1).map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <div className="flex items-center justify-center h-full">
                <p className="text-[var(--text-secondary)]">{tab.label}功能即将推出</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] flex-shrink-0 flex justify-end items-center space-x-3">
        <Button variant="outline" className="text-sm px-4 py-1.5 rounded-md border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]">
          保存草稿
        </Button>
        <Button className="text-sm px-4 py-1.5 rounded-md bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)]">
          提交审核
        </Button>
      </div>
    </Card>
  );
};

export default KnowledgeDetail;