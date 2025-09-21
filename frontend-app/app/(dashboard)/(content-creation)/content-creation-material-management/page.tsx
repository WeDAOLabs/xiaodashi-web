'use client';

import { lazy, Suspense } from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Folder,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Search,
  Trash2,
  Upload
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

// 导入组件和数据
const MaterialDetailPanel = lazy(() => import('./_components/MaterialDetailPanel'));
import { ExtendedMaterialData } from './_components/types';
import { EXTENDED_MOCK_MATERIALS } from './_components/data';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedTime: string;
  onTimeChange: (value: string) => void;
  complianceFilters: string[];
  onComplianceFilterChange: (filter: string, checked: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  selectedTime,
  onTimeChange,
  complianceFilters,
  onComplianceFilterChange
}) => (
  <aside className="w-72 bg-[var(--bg-primary)] rounded-lg shadow-sm p-5 flex-shrink-0 flex flex-col">
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
      <Input
        type="text"
        placeholder="关键词、AI标签搜索..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>

    <Button
      variant="outline"
      className="w-full text-sm font-medium text-[var(--color-primary-500)] bg-[var(--color-primary-50)] border-[var(--color-primary-500)] hover:bg-[var(--color-primary-100)] mb-4"
    >
      <ImageIcon className="w-4 h-4 mr-2" />
      AI相似图片搜索
    </Button>

    <div className="flex-1 overflow-y-auto -mr-3 pr-3 divide-y divide-[var(--border-secondary)]">
      <div className="py-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">分类目录</h3>
        <ul className="space-y-1 text-sm">
          {[
            { key: 'all', label: '所有素材' },
            { key: 'image', label: '图片' },
            { key: 'video', label: '视频' },
            { key: 'copy', label: '文案' },
            { key: 'audio', label: '音频' },
            { key: 'design', label: '设计稿' }
          ].map((category) => (
            <li
              key={category.key}
              className={`px-2 py-1.5 rounded-md cursor-pointer ${
                selectedCategory === category.key
                  ? 'font-semibold text-[var(--color-primary-700)] bg-[var(--color-primary-50)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
              onClick={() => onCategoryChange(category.key)}
            >
              {category.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="py-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">高级筛选</h3>
        <div className="space-y-3">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="所有类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类型</SelectItem>
              <SelectItem value="image">图片</SelectItem>
              <SelectItem value="video">视频</SelectItem>
              <SelectItem value="document">文档</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTime} onValueChange={onTimeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="上传时间" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有时间</SelectItem>
              <SelectItem value="today">最近一天</SelectItem>
              <SelectItem value="week">最近一周</SelectItem>
              <SelectItem value="month">最近一月</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="py-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">合规状态</h3>
        {[
          { id: 'no-risk', label: '无风险' },
          { id: 'low-risk', label: '低风险' },
          { id: 'medium-risk', label: '中风险' },
          { id: 'high-risk', label: '高风险' }
        ].map((filter) => (
          <div key={filter.id} className="flex items-center mb-2">
            <Checkbox
              id={filter.id}
              checked={complianceFilters.includes(filter.id)}
              onCheckedChange={(checked) =>
                onComplianceFilterChange(filter.id, checked as boolean)
              }
            />
            <label htmlFor={filter.id} className="ml-2 text-sm text-[var(--text-secondary)]">
              {filter.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

interface MaterialCardProps {
  id: string;
  title: string;
  type: string;
  image: string;
  compliance: {
    status: 'compliant' | 'low-risk' | 'medium-risk' | 'high-risk';
    label: string;
  };
  tags: string[];
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  id,
  title,
  image,
  compliance,
  tags,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onDelete
}) => {
  const getComplianceStyles = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-200)]';
      case 'low-risk':
        return 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-200)]';
      case 'medium-risk':
        return 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)] border-[var(--color-warning-300)]';
      case 'high-risk':
        return 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-200)]';
      default:
        return 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-secondary)]';
    }
  };

  return (
    <div className={`bg-[var(--bg-primary)] rounded-lg shadow-sm transition-all hover:shadow-md relative group border-2 ${
      isSelected ? 'border-[var(--color-primary-500)]' : 'border-transparent'
    }`}>
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(id, checked as boolean)}
          className="h-5 w-5"
        />
      </div>

      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 rounded-full bg-white shadow-md hover:bg-gray-50 p-0"
          title="查看详情"
          onClick={() => onView?.(id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 rounded-full bg-white shadow-md hover:bg-gray-50 p-0"
          title="下载"
          onClick={() => onDownload?.(id)}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 rounded-full bg-white shadow-md hover:bg-gray-50 p-0 text-red-500 hover:text-red-600"
          title="删除"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <figure className="aspect-[4/3] w-full">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </figure>

      <div className="p-4">
        <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getComplianceStyles(compliance.status)}`}>
          {compliance.label}
        </Badge>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-2 truncate">{title}</h3>
        <p className="text-xs text-[var(--text-tertiary)] truncate">ID: {id}</p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  selectedCount: number;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  selectedCount,
  onSelectAll,
  isAllSelected
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
        />
        <label className="text-sm text-[var(--text-secondary)]">
          全选 {selectedCount > 0 && `(已选 ${selectedCount} 个)`}
        </label>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        className="w-8 h-8 p-0"
        onClick={() => onViewModeChange('grid')}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'list' ? 'default' : 'outline'}
        className="w-8 h-8 p-0"
        onClick={() => onViewModeChange('list')}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => (
  <div className="flex items-center justify-between mt-4">
    <p className="text-sm text-[var(--text-secondary)]">
      共 <span className="font-medium text-[var(--text-primary)]">{totalItems}</span> 个素材
    </p>
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        className="w-8 h-8 p-0"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const page = i + 1;
        return (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? 'default' : 'outline'}
            className="w-8 h-8 p-0"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      {totalPages > 5 && (
        <>
          <span className="text-[var(--text-secondary)]">...</span>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="outline"
        className="w-8 h-8 p-0"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const MaterialManagementPage: React.FC = () => {
  // 状态管理
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedTime, setSelectedTime] = React.useState('all');
  const [complianceFilters, setComplianceFilters] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  // 详情面板状态
  const [isDetailPanelOpen, setIsDetailPanelOpen] = React.useState(false);
  const [viewingMaterial, setViewingMaterial] = React.useState<ExtendedMaterialData | null>(null);

  // 材料数据状态 - 支持删除操作
  const [materials, setMaterials] = React.useState(EXTENDED_MOCK_MATERIALS);

  const handleComplianceFilterChange = React.useCallback((filter: string, checked: boolean) => {
    setComplianceFilters(prev =>
      checked
        ? [...prev, filter]
        : prev.filter(f => f !== filter)
    );
  }, []);

  const handleMaterialSelect = React.useCallback((id: string, selected: boolean) => {
    setSelectedMaterials(prev =>
      selected
        ? [...prev, id]
        : prev.filter(materialId => materialId !== id)
    );
  }, []);

  const handleSelectAll = React.useCallback(() => {
    const isAllSelected = selectedMaterials.length === materials.length;
    setSelectedMaterials(isAllSelected ? [] : materials.map(m => m.id));
  }, [selectedMaterials.length, materials]);

  const isAllSelected = selectedMaterials.length === materials.length && materials.length > 0;

  // 处理查看
  const handleView = React.useCallback((id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      setViewingMaterial(material);
      setIsDetailPanelOpen(true);
    }
  }, [materials]);

  const handleDownload = React.useCallback((id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      // 模拟下载
      const link = document.createElement('a');
      link.href = material.image;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`开始下载：${material.title}`);
    }
  }, [materials]);

  const handleDelete = React.useCallback((id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      const confirmed = window.confirm(`确认删除素材：${material.title}？\n此操作不可撤销。`);
      if (confirmed) {
        setMaterials(prev => prev.filter(m => m.id !== id));
        setSelectedMaterials(prev => prev.filter(selectedId => selectedId !== id));
      }
    }
  }, [materials]);

  return (
    <ToolPageLayout
      title="素材库管理"
      description="集中管理、智能处理并协同您的所有营销素材资产"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '智能素材资产管理与协同', href: '/content-creation-material-center' },
        { label: '素材库管理', href: '/content-creation-material-management', current: true }
      ]}
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            文件夹管理
          </Button>
          <Button variant="outline">
            手动上传
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            AI智能上传
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            批量上传
          </Button>
        </div>
      }
    >
      <div className="flex-1 flex gap-6 min-h-0">
        <FilterPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedTime={selectedTime}
          onTimeChange={setSelectedTime}
          complianceFilters={complianceFilters}
          onComplianceFilterChange={handleComplianceFilterChange}
        />

        <div className="flex-1 flex flex-col gap-4">
          <Toolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedMaterials.length}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />

          <div className="flex-1 overflow-y-auto -mr-2 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  {...material}
                  isSelected={selectedMaterials.includes(material.id)}
                  onSelect={handleMaterialSelect}
                  onView={handleView}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(materials.length / 20)}
            totalItems={materials.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 素材详情面板 */}
      <Suspense fallback={<div className="fixed inset-0 bg-black\/30 z-40 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>}>
        <MaterialDetailPanel
          isOpen={isDetailPanelOpen}
          onClose={() => {
            setIsDetailPanelOpen(false);
            setViewingMaterial(null);
          }}
          material={viewingMaterial}
          onDownload={handleDownload}
        />
      </Suspense>

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default MaterialManagementPage;