'use client';

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
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

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
          className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white p-0"
          title="查看详情"
          onClick={() => onView?.(id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white p-0"
          title="下载"
          onClick={() => onDownload?.(id)}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white p-0 text-red-500 hover:text-red-600"
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

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: string;
    title: string;
    image: string;
    type: string;
    compliance: {
      status: string;
      label: string;
    };
    tags: string[];
  } | null;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ isOpen, onClose, material }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* 关闭按钮 */}
        <Button
          size="sm"
          variant="outline"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white p-0"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* 图片区域 */}
        <div className="relative">
          <Image
            src={material.image}
            alt={material.title}
            width={800}
            height={600}
            className="w-full max-h-[70vh] object-contain"
            priority
          />
        </div>

        {/* 信息区域 */}
        <div className="p-6 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {material.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                ID: {material.id} • 类型: {material.type}
              </p>

              {/* 合规状态 */}
              <div className="mb-4">
                <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  material.compliance.status === 'compliant'
                    ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-200)]'
                    : material.compliance.status === 'low-risk'
                    ? 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-200)]'
                    : material.compliance.status === 'medium-risk'
                    ? 'bg-[var(--color-warning-100)] text-[var(--color-warning-700)] border-[var(--color-warning-300)]'
                    : material.compliance.status === 'high-risk'
                    ? 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-200)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-secondary)]'
                }`}>
                  {material.compliance.label}
                </Badge>
              </div>

              {/* 标签 */}
              {material.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {material.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 示例数据 - 移到组件外部避免重复创建
const MOCK_MATERIALS = [
    {
      id: 'MT001',
      title: '夏季新品发布会主视觉.jpg',
      type: '图片',
      image: '/images/materials/summer-campaign.jpg',
      compliance: { status: 'compliant' as const, label: '已合规' },
      tags: ['夏季', '新品', '时尚']
    },
    {
      id: 'MT002',
      title: '品牌宣传视频V2.mp4',
      type: '视频',
      image: '/images/materials/brand-video.jpg',
      compliance: { status: 'low-risk' as const, label: '低风险' },
      tags: ['品牌', '宣传片', 'TVC']
    },
    {
      id: 'MT004',
      title: '代言人形象照-备选.jpg',
      type: '图片',
      image: '/images/materials/celebrity-portrait.jpg',
      compliance: { status: 'high-risk' as const, label: '高风险' },
      tags: ['代言人', '肖像']
    },
    {
      id: 'MT003',
      title: '产品介绍核心卖点.doc',
      type: '文案',
      image: '/images/materials/document-thumbnail.jpg',
      compliance: { status: 'compliant' as const, label: '已合规' },
      tags: ['产品', '卖点', '文案']
    },
    {
      id: 'MT005',
      title: 'App开屏广告设计稿.psd',
      type: '设计稿',
      image: '/images/materials/design-draft.jpg',
      compliance: { status: 'compliant' as const, label: '已合规' },
      tags: ['APP', '开屏', '广告']
    },
    {
      id: 'MT006',
      title: '电台广告音频.mp3',
      type: '音频',
      image: '/images/materials/audio-wave.jpg',
      compliance: { status: 'medium-risk' as const, label: '中风险' },
      tags: ['电台', '广告', '音频']
    },
    {
      id: 'MT007',
      title: '社交媒体九宫格图.zip',
      type: '图片',
      image: '/images/materials/social-media.jpg',
      compliance: { status: 'compliant' as const, label: '已合规' },
      tags: ['社交', '九宫格', '媒体']
    },
    {
      id: 'MT008',
      title: '用户访谈录音.wav',
      type: '音频',
      image: '/images/materials/interview-record.jpg',
      compliance: { status: 'low-risk' as const, label: '低风险' },
      tags: ['访谈', '录音', '用户']
    }
];

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

  // 模态框状态
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [viewingMaterial, setViewingMaterial] = React.useState<typeof MOCK_MATERIALS[0] | null>(null);

  // 材料数据状态 - 支持删除操作
  const [materials, setMaterials] = React.useState(MOCK_MATERIALS);

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
      setIsViewModalOpen(true);
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

      {/* 图片查看模态框 */}
      <ImageViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingMaterial(null);
        }}
        material={viewingMaterial}
      />

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default MaterialManagementPage;