import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, RefreshCw, Sparkles, Plus } from 'lucide-react';
import { FilterState } from './types';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="mb-6">
      {/* 筛选和操作栏 - 单行布局 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[var(--text-secondary)]" />

          <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
            <SelectTrigger className="w-[140px] bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-sm">
              <SelectValue placeholder="按分类筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="营销素材库">营销素材库</SelectItem>
              <SelectItem value="竞品分析">竞品分析</SelectItem>
              <SelectItem value="产品文档">产品文档</SelectItem>
              <SelectItem value="用户研究">用户研究</SelectItem>
              <SelectItem value="品牌资产">品牌资产</SelectItem>
              <SelectItem value="营销活动">营销活动</SelectItem>
              <SelectItem value="投放策略">投放策略</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.tag} onValueChange={(value) => onFilterChange('tag', value)}>
            <SelectTrigger className="w-[140px] bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-sm">
              <SelectValue placeholder="按标签筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部标签</SelectItem>
              <SelectItem value="社交媒体">社交媒体</SelectItem>
              <SelectItem value="内容策略">内容策略</SelectItem>
              <SelectItem value="竞品分析">竞品分析</SelectItem>
              <SelectItem value="新品发布">新品发布</SelectItem>
              <SelectItem value="用户画像">用户画像</SelectItem>
              <SelectItem value="AI工具">AI工具</SelectItem>
              <SelectItem value="品牌规范">品牌规范</SelectItem>
              <SelectItem value="活动复盘">活动复盘</SelectItem>
              <SelectItem value="短视频">短视频</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger className="w-[140px] bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-sm">
              <SelectValue placeholder="按状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
            <SelectTrigger className="w-[120px] bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-sm">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">相关度</SelectItem>
              <SelectItem value="date">更新时间</SelectItem>
              <SelectItem value="comments">评论数</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索智能知识库中的全部知识"
              className="w-80 pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent transition-shadow text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-[var(--color-primary-50)] text-[var(--color-primary-700)] px-4 py-2 rounded-lg hover:bg-[var(--color-primary-100)] transition-colors text-sm font-semibold border-[var(--color-primary-100)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI智能筛选</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[var(--color-primary-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold">
            <Plus className="w-4 h-4" />
            <span>新建知识</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;