'use client';

import React, { useState, useMemo, use } from 'react';
import { notFound } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import SearchFilterBar from './_components/SearchFilterBar';
import BatchActionBar from './_components/BatchActionBar';
import KnowledgeGrid from './_components/KnowledgeGrid';
import DetailPanel from './_components/DetailPanel';
import { KNOWLEDGE_BASE_CONFIG, MOCK_KNOWLEDGE_ITEMS, FilterState, KnowledgeItem } from './_components/types';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function KnowledgeManagePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const config = KNOWLEDGE_BASE_CONFIG[resolvedParams.slug];

  // 如果找不到配置，显示404
  if (!config) {
    notFound();
  }

  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    tag: 'all',
    status: 'all',
    sortBy: 'relevance'
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedDetailItem, setSelectedDetailItem] = useState<KnowledgeItem | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // 筛选和搜索逻辑
  const filteredItems = useMemo(() => {
    let items = [...MOCK_KNOWLEDGE_ITEMS];

    // 搜索筛选
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower) ||
        item.aiSummary.toLowerCase().includes(searchTermLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    // 分类筛选
    if (filters.category !== 'all') {
      items = items.filter(item => item.category === filters.category);
    }

    // 标签筛选
    if (filters.tag !== 'all') {
      items = items.filter(item => item.tags.includes(filters.tag));
    }

    // 状态筛选
    if (filters.status !== 'all') {
      items = items.filter(item => item.status === filters.status);
    }

    // 排序
    switch (filters.sortBy) {
      case 'date':
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'comments':
        items.sort((a, b) => b.comments - a.comments);
        break;
      case 'relevance':
      default:
        // 保持原有顺序作为相关度排序
        break;
    }

    return items;
  }, [searchTerm, filters]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 重置筛选
  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      category: 'all',
      tag: 'all',
      status: 'all',
      sortBy: 'relevance'
    });
    setCurrentPage(1);
  };

  // 筛选器变更
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // 重置到第一页
  };

  // 选择管理
  const handleSelectionChange = (id: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(paginatedItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  // 批量操作
  const handleBatchDownload = () => {
    console.log('批量下载:', Array.from(selectedItems));
    // TODO: 实现批量下载逻辑
  };

  const handleBatchShare = () => {
    console.log('批量分享:', Array.from(selectedItems));
    // TODO: 实现批量分享逻辑
  };

  const handleBatchEditTags = () => {
    console.log('批量编辑标签:', Array.from(selectedItems));
    // TODO: 实现批量编辑标签逻辑
  };

  const handleBatchDelete = () => {
    console.log('批量删除:', Array.from(selectedItems));
    // TODO: 实现批量删除逻辑
  };

  // 知识项点击
  const handleItemClick = (item: KnowledgeItem) => {
    setSelectedDetailItem(item);
    setIsDetailPanelOpen(true);
  };

  // 关闭详情面板
  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedDetailItem(null);
  };

  // 页码变更时重置选择
  React.useEffect(() => {
    setSelectedItems(new Set());
  }, [currentPage]);

  return (
    <ToolPageLayout
      title={config.title}
      description={config.description}
      breadcrumbs={[
        { label: '赋能与效率提升', href: '#' },
        { label: '智能知识库', href: '/knowledge-assets/overview' },
        { label: config.name, href: `/knowledge-assets/${resolvedParams.slug}`, current: true }
      ]}
    >
      <div className="space-y-6">
        {/* 搜索和筛选栏 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* 批量操作栏 */}
        <BatchActionBar
          selectedCount={selectedItems.size}
          totalCount={paginatedItems.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onBatchDownload={handleBatchDownload}
          onBatchShare={handleBatchShare}
          onBatchEditTags={handleBatchEditTags}
          onBatchDelete={handleBatchDelete}
        />

        {/* 知识网格 */}
        <KnowledgeGrid
          items={paginatedItems}
          selectedItems={selectedItems}
          onSelectionChange={handleSelectionChange}
          onItemClick={handleItemClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
        />

        {/* 详情面板 */}
        <DetailPanel
          item={selectedDetailItem}
          isOpen={isDetailPanelOpen}
          onClose={handleCloseDetailPanel}
        />
      </div>
    </ToolPageLayout>
  );
}