'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ChevronDown,
  FileText,
  ImageIcon,
  Monitor,
  Download,
  Save,
  Share,
  Type,
  Square,
  Plus,
  Eye,
  Lock,
  GripVertical,
  Layers,
  CloudUpload,
  Palette,
  Wand2,
  Shield,
  Lightbulb
} from 'lucide-react';

// 左侧模板与内容面板
interface TemplateCardProps {
  name: string;
  category: string;
  imageSrc: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, category, imageSrc }) => (
  <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm overflow-hidden group cursor-pointer border border-transparent hover:border-[var(--color-primary-500)] hover:shadow-md transition-all">
    <Image
      src={imageSrc}
      alt={name}
      width={400}
      height={500}
      className="w-full h-40 object-cover"
    />
    <div className="p-3">
      <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{name}</h4>
      <p className="text-xs text-[var(--text-tertiary)] mt-1">{category}</p>
    </div>
  </div>
);

const LeftPanel: React.FC = () => (
  <div className="xl:col-span-3">
    <div className="bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">模板与内容</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">设计类型</label>
          <div className="relative mt-1">
            <select className="w-full px-3 py-2 text-sm border border-[var(--border-primary)] rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent">
              <option>海报</option>
              <option>Banner</option>
              <option>H5</option>
              <option>产品详情页</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
          </div>
        </div>

        <Button className="bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold flex items-center justify-center w-full">
          无模板自由创作
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 flex items-center justify-center text-xs px-2">
            <FileText className="w-4 h-4 mr-1" />
            <span className="truncate">从文案导入</span>
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center text-xs px-2">
            <ImageIcon className="w-4 h-4 mr-1" />
            <span className="truncate">从素材库导入</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border-secondary)] flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">模板库</h3>
        <div className="relative mt-2">
          <Input
            type="text"
            placeholder="搜索模板..."
            className="w-full pl-9 pr-3 py-2 text-sm"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
        </div>

        <div className="mt-3 flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-4">
          <TemplateCard
            name="电商促销海报"
            category="海报"
            imageSrc="/images/design-canvas/template-1.jpg"
          />
          <TemplateCard
            name="新品发布Banner"
            category="Banner"
            imageSrc="/images/design-canvas/template-2.jpg"
          />
          <TemplateCard
            name="产品介绍长图"
            category="详情页"
            imageSrc="/images/design-canvas/template-3.jpg"
          />
          <TemplateCard
            name="品牌故事H5"
            category="H5"
            imageSrc="/images/design-canvas/template-4.jpg"
          />
        </div>
      </div>
    </div>
  </div>
);

// 中央画布设计区域
const CenterPanel: React.FC = () => (
  <div className="xl:col-span-6">
    <div className="flex flex-col h-full">
      {/* 顶部工具栏 */}
      <div className="flex-shrink-0 bg-[var(--bg-primary)] p-3 rounded-t-lg shadow-sm border-b border-[var(--border-secondary)]">
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] text-sm font-semibold">
            <Monitor className="w-4 h-4 mr-2" />
            AI智能排版
          </Button>
          <Button variant="outline" className="text-xs font-semibold">
            <Wand2 className="w-4 h-4 mr-2" />
            品牌元素应用
          </Button>
          <Button variant="outline" className="text-xs font-semibold">
            <Shield className="w-4 h-4 mr-2" />
            构图优化建议
          </Button>
          <Button variant="outline" className="text-xs font-semibold">
            <Palette className="w-4 h-4 mr-2" />
            配色方案推荐
          </Button>

          <div className="h-6 w-px bg-[var(--border-secondary)] mx-2"></div>

          <Button variant="outline" size="sm" className="w-9 h-9 p-0">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-9 h-9 p-0">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-9 h-9 p-0">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 主要设计区域 */}
      <div className="flex-1 flex min-h-0">
        {/* 左侧工具栏 */}
        <div className="w-16 bg-[var(--bg-primary)] p-2 flex flex-col items-center gap-2 border-r border-[var(--border-secondary)]">
          <Button variant="outline" className="w-14 h-14 flex-col text-xs p-1">
            <Type className="w-5 h-5 mb-1" />
            添加文字
          </Button>
          <Button variant="outline" className="w-14 h-14 flex-col text-xs p-1">
            <ImageIcon className="w-5 h-5 mb-1" />
            添加图片
          </Button>
          <Button variant="outline" className="w-14 h-14 flex-col text-xs p-1">
            <Square className="w-5 h-5 mb-1" />
            添加图形
          </Button>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 bg-[var(--bg-tertiary)] p-8 flex items-center justify-center">
          <div className="w-full max-w-lg h-full max-h-[500px] bg-white shadow-lg rounded-md flex items-center justify-center">
            <Image
              src="/images/design-canvas/canvas-preview.jpg"
              alt="Design Canvas"
              width={500}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* 右侧图层管理 */}
        <div className="w-60 bg-[var(--bg-primary)] p-4 flex flex-col border-l border-[var(--border-secondary)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              图层管理
            </h3>
            <Button variant="outline" size="sm" className="w-9 h-9 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-1">
            <div className="flex items-center p-2 rounded-md hover:bg-[var(--color-primary-50)] transition-colors text-sm">
              <GripVertical className="w-4 h-4 mr-2 text-[var(--text-tertiary)] cursor-move" />
              <ImageIcon className="w-4 h-4 text-[var(--color-primary-500)]" />
              <span className="flex-1 ml-2 text-[var(--text-secondary)] truncate">主图-模特.png</span>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer" />
                <Lock className="w-4 h-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="flex-shrink-0 bg-[var(--bg-primary)] p-2 rounded-b-lg shadow-sm border-t border-[var(--border-secondary)] text-center text-xs text-[var(--text-tertiary)]">
        画布: 1080 x 1350 px | 缩放: 75%
      </div>
    </div>
  </div>
);

// 右侧素材与品牌面板
const RightPanel: React.FC = () => (
  <div className="xl:col-span-3">
    <div className="bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">素材与品牌</h2>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1 text-xs px-2">
          <CloudUpload className="w-4 h-4 mr-1" />
          <span className="truncate">上传自定义素材</span>
        </Button>
        <Button variant="outline" className="flex-1 text-xs px-2">
          <ImageIcon className="w-4 h-4 mr-1" />
          <span className="truncate">从素材库选择</span>
        </Button>
      </div>

      <div className="mt-6 flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
          素材库推荐
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 overflow-y-auto pr-1">
          <div className="rounded-md overflow-hidden cursor-pointer">
            <Image
              src="/images/design-canvas/asset-1.jpg"
              alt="Asset 1"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-md overflow-hidden cursor-pointer">
            <Image
              src="/images/design-canvas/asset-2.jpg"
              alt="Asset 2"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border-secondary)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center">
          <FileText className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
          品牌元素库
        </h3>
        <div className="mt-3 space-y-4">
          <div>
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Logo</p>
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-md flex items-center justify-center p-1">
                <Image
                  src="/images/design-canvas/brand-logo.png"
                  alt="Brand Logo"
                  width={100}
                  height={40}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-md flex items-center justify-center p-1">
                <Image
                  src="/images/design-canvas/brand-icon.png"
                  alt="Brand Icon"
                  width={40}
                  height={40}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">标准色板</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-[var(--border-secondary)]" style={{backgroundColor: '#007A7A'}}></div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-primary)]">主青绿</p>
                  <p className="text-xs text-[var(--text-tertiary)]">#007A7A</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-[var(--border-secondary)]" style={{backgroundColor: '#1d1d1f'}}></div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-primary)]">主要文本</p>
                  <p className="text-xs text-[var(--text-tertiary)]">#1d1d1f</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 主页面组件
const IntelligentLayoutPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="智能排版与设计"
      description="通过AI技术实现智能排版与设计，提升视觉内容创作效率与质量"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '视觉内容智能生成与编辑', href: '/content-creation-visual-generation' },
        { label: '智能排版与设计', href: '/content-creation-intelligent-layout', current: true }
      ]}
    >
      {/* 主要内容区域 - 三栏布局 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 左侧面板 */}
        <LeftPanel />

        {/* 中央画布 */}
        <CenterPanel />

        {/* 右侧面板 */}
        <RightPanel />
      </div>

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default IntelligentLayoutPage;