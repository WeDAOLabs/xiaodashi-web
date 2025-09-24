import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, LayersIcon, EyeIcon, PencilIcon } from 'lucide-react';

 
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AITagManagementProps {}

interface TagData {
  name: string;
  description: string;
  userCount: number;
  percentage: number;
}

const aiRecommendedTags: TagData[] = [
  {
    name: '新品尝鲜家',
    description: '近3个月购买过新品且评价较好',
    userCount: 25000,
    percentage: 16.7
  },
  {
    name: '忠实复购者',
    description: '累计购买≥5次且总GMV≥800元',
    userCount: 18000,
    percentage: 12.0
  },
  {
    name: '甜点爱好者',
    description: '在对话中高频提及甜品/蛋糕关键词',
    userCount: 30000,
    percentage: 20.0
  }
];

const TagItem: React.FC<{ tag: TagData }> = ({ tag }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-[var(--border-primary)] bg-gray-50/50 w-full">
    <div className="flex-1 mb-3 sm:mb-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-[var(--text-primary)]">{tag.name}</h3>
        <Badge className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
          AI推荐
        </Badge>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mt-1">{tag.description}</p>
    </div>
    <div className="flex items-center gap-6 w-full sm:w-auto">
      <div className="min-w-[80px] text-center">
        <p className="text-sm text-[var(--text-secondary)]">用户数</p>
        <p className="font-semibold text-[var(--text-primary)]">{tag.userCount.toLocaleString()}</p>
      </div>
      <div className="min-w-[60px] text-center">
        <p className="text-sm text-[var(--text-secondary)]">占比</p>
        <p className="font-semibold text-[var(--text-primary)]">{tag.percentage}%</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="p-2 rounded-md hover:bg-gray-200">
          <EyeIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        </Button>
        <Button variant="ghost" size="sm" className="p-2 rounded-md hover:bg-gray-200">
          <PencilIcon className="w-4 h-4 text-[var(--text-secondary)]" />
        </Button>
      </div>
    </div>
  </div>
);

const AITagManagement: React.FC<AITagManagementProps> = () => {
  return (
    <div className="bg-[var(--bg-primary)] p-5 rounded-xl shadow-sm mt-6">
      {/* 标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI自动化标签管理</h2>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
            <PlusIcon className="w-4 h-4" />
            新建标签
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
            <LayersIcon className="w-4 h-4" />
            批量操作
          </Button>
        </div>
      </div>

      {/* 标签页和内容 - 全宽显示 */}
      <Tabs defaultValue="ai-recommended" className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="ai-recommended" className="text-sm">AI推荐标签</TabsTrigger>
          <TabsTrigger value="custom-tags" className="text-sm">自定义标签</TabsTrigger>
          <TabsTrigger value="tag-rules" className="text-sm">标签规则配置</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-recommended" className="mt-4 w-full">
          <div className="space-y-3 w-full">
            {aiRecommendedTags.map((tag, index) => (
              <TagItem key={index} tag={tag} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="link" className="text-sm font-medium text-[var(--primary-color)] hover:underline">
              查看全部标签
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="custom-tags" className="mt-4 w-full">
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">自定义标签功能开发中...</p>
          </div>
        </TabsContent>

        <TabsContent value="tag-rules" className="mt-4 w-full">
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">标签规则配置功能开发中...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITagManagement;