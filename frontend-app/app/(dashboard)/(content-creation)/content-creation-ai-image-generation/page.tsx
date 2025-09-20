'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload,
  Sparkles,
  Trash2,
  Download,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  Palette,
  Crop,
  Settings,
  Eye
} from 'lucide-react';

// 左侧参数设置面板组件
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ParameterPanelProps {}

const ParameterPanel: React.FC<ParameterPanelProps> = () => {
  const [prompt, setPrompt] = React.useState('一个充满活力的年轻人正在海边冲浪，阳光明媚，色彩鲜艳');
  const [style, setStyle] = React.useState('写实');
  const [aspectRatio, setAspectRatio] = React.useState('1:1 (方形)');
  const [aiModel, setAiModel] = React.useState('基础模型');
  const [industry, setIndustry] = React.useState('医药');
  const [complianceLevel, setComplianceLevel] = React.useState('低');

  return (
    <div className="h-full overflow-y-auto pr-2">
      <Card className="h-full">
        <CardContent className="p-5 h-full flex flex-col">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Prompt输入与参数设置</h2>

          <div className="space-y-5 flex-grow">
            {/* 图片描述 */}
            <div>
              <Label htmlFor="prompt" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                图片描述
              </Label>
              <Textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm"
                placeholder="一个充满活力的年轻人正在海边冲浪，阳光明媚，色彩鲜艳"
              />
            </div>

            {/* 图片风格 */}
            <div>
              <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                图片风格
              </Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择图片风格" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="写实">写实</SelectItem>
                  <SelectItem value="卡通">卡通</SelectItem>
                  <SelectItem value="赛博朋克">赛博朋克</SelectItem>
                  <SelectItem value="水彩">水彩</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 尺寸/比例 */}
            <div>
              <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                尺寸/比例
              </Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择尺寸比例" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1 (方形)">1:1 (方形)</SelectItem>
                  <SelectItem value="16:9 (横向)">16:9 (横向)</SelectItem>
                  <SelectItem value="9:16 (纵向)">9:16 (纵向)</SelectItem>
                  <SelectItem value="自定义">自定义</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 参考图上传 */}
            <div>
              <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                参考图上传
              </Label>
              <div className="flex justify-center items-center w-full px-6 py-8 border-2 border-[var(--border-secondary)] border-dashed rounded-md cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-[var(--text-tertiary)]" />
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">点击或拖拽上传图片</p>
                </div>
              </div>
            </div>

            {/* AI模型选择 */}
            <div>
              <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                AI模型选择
              </Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择AI模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="基础模型">基础模型</SelectItem>
                  <SelectItem value="品牌定制模型">品牌定制模型</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 合规性配置 */}
            <div className="border-t border-[var(--border-secondary)] pt-4">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">合规性配置</h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    所属行业
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择所属行业" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="医药">医药</SelectItem>
                      <SelectItem value="金融">金融</SelectItem>
                      <SelectItem value="教育">教育</SelectItem>
                      <SelectItem value="电商">电商</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    合规等级
                  </Label>
                  <Select value={complianceLevel} onValueChange={setComplianceLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择合规等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="低">低</SelectItem>
                      <SelectItem value="中">中</SelectItem>
                      <SelectItem value="高">高</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-[var(--color-info-50)] text-sm text-[var(--color-info-600)] p-3 rounded-md flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>已启用智能合规监测，AI将识别并预警敏感元素、不当表现。</span>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="mt-6 pt-4 border-t border-[var(--border-secondary)]">
            <div className="flex items-center gap-3">
              <Button className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                智能生成
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center w-10 h-10 p-0 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-primary)] transition-colors"
                aria-label="清除描述"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 中间编辑区域组件
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EditorPanelProps {}

const EditorPanel: React.FC<EditorPanelProps> = () => {
  const [selectedImage, setSelectedImage] = React.useState(2); // 默认选择第二张图片（有风险的那张）

  const generatedImages = [
    { id: 1, src: '/images/ai-generation/examples/generated-sample-1.jpg', safe: true },
    { id: 2, src: '/images/ai-generation/examples/generated-sample-2.jpg', safe: false },
    { id: 3, src: '/images/ai-generation/examples/generated-sample-3.jpg', safe: true },
    { id: 4, src: '/images/ai-generation/examples/generated-sample-4.jpg', safe: true },
  ];

  const editTools = [
    { icon: Palette, label: '局部修改' },
    { icon: Palette, label: '背景替换' },
    { icon: Crop, label: '构图优化' },
    { icon: Palette, label: '色彩校正' },
    { icon: Settings, label: '添加水印' },
    { icon: Eye, label: '高清修复' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Card className="h-full flex flex-col">
        <CardContent className="p-5 h-full flex flex-col">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">AI生成结果与编辑区</h2>

          <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-5 overflow-hidden">
            {/* 编辑画布 */}
            <div className="lg:col-span-4 bg-[var(--bg-secondary)] rounded-lg p-4 flex flex-col items-center justify-center relative">
              <Image
                src={generatedImages.find(img => img.id === selectedImage)?.src || generatedImages[1].src}
                alt="一个充满活力的年轻人正在海边冲浪，阳光明媚，色彩鲜艳"
                width={512}
                height={512}
                className="max-w-full max-h-full object-contain rounded-md"
              />
              {/* AI预警弹窗 - 只在选中有风险图片时显示 */}
              {!generatedImages.find(img => img.id === selectedImage)?.safe && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs border border-[var(--color-warning-100)]">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--color-warning-100)] text-[var(--color-warning-600)]">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--color-warning-600)]">AI预警</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">图片右下角标志疑似某品牌Logo，存在侵权风险。</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 编辑工具栏 */}
            <div className="lg:col-span-1 flex lg:flex-col items-center gap-2 overflow-y-auto">
              {editTools.map((tool, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`${tool.label}工具`}
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-md hover:bg-[var(--color-primary-50)] text-[var(--text-secondary)] hover:text-[var(--color-primary-500)] transition-colors w-24"
                >
                  <tool.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs font-medium">{tool.label}</span>
                </button>
              ))}
              <div className="w-full border-t my-2 border-[var(--border-secondary)]"></div>
              <Button
                className="w-full text-sm font-semibold p-2.5 rounded-lg bg-[var(--color-warning-50)] text-[var(--color-warning-600)] hover:bg-[var(--color-warning-100)] transition-colors"
              >
                合规性检测
              </Button>
            </div>
          </div>

          {/* 缩略图展示区域 */}
          <div className="mt-5 pt-4 border-t border-[var(--border-secondary)]">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {generatedImages.map((image) => (
                <div key={image.id} className="group cursor-pointer">
                  <div
                    className={`aspect-square rounded-md overflow-hidden ring-2 transition-all ${
                      selectedImage === image.id
                        ? 'ring-[var(--color-primary-500)]'
                        : 'ring-transparent group-hover:ring-[var(--color-primary-100)]'
                    }`}
                    onClick={() => setSelectedImage(image.id)}
                  >
                    <Image
                      src={image.src}
                      alt={`Generated image ${image.id}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1.5 truncate">AI生成初稿</p>
                  <div className={`flex items-center gap-1 text-xs ${image.safe ? 'text-green-600' : 'text-[var(--color-warning-600)]'}`}>
                    {image.safe ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    <span>合规检测：{image.safe ? '无风险' : '存在潜在风险'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button variant="outline" className="flex items-center justify-center gap-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-5 py-2.5 rounded-lg hover:bg-[var(--border-primary)] transition-colors text-sm font-semibold">
              <Save className="w-4 h-4" />
              保存至素材库
            </Button>
            <Button className="flex items-center justify-center gap-2 bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold">
              <Download className="w-4 h-4" />
              导出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 右侧历史记录面板组件
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HistoryPanelProps {}

const HistoryPanel: React.FC<HistoryPanelProps> = () => {
  const historyItems = [
    {
      id: 1,
      image: '/images/ai-generation/history/history-1.jpg',
      prompt: '一只可爱的卡通猫咪在写代码'
    },
    {
      id: 2,
      image: '/images/ai-generation/history/history-2.jpg',
      prompt: '赛博朋克风格的未来城市夜景'
    },
    {
      id: 3,
      image: '/images/ai-generation/history/history-3.jpg',
      prompt: '水彩画：宁静的湖边小屋'
    }
  ];

  return (
    <div className="h-full overflow-y-auto pl-2">
      <Card className="h-full flex flex-col">
        <CardContent className="p-5 h-full flex flex-col">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
            历史生成记录
          </h2>

          <div className="space-y-4 flex-grow overflow-y-auto pr-1">
            {historyItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors">
                <Image
                  src={item.image}
                  alt={item.prompt}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-[var(--text-primary)] leading-snug line-clamp-3">
                    {item.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 主页面组件
const AIImageGenerationPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="AI图片生成与编辑"
      description="通过AI技术实现图片的智能生成与编辑，提升创作效率与质量"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '视觉内容智能生成与编辑', href: '/content-creation-visual-generation' },
        { label: 'AI图片生成与编辑', href: '/content-creation-ai-image-generation', current: true }
      ]}
    >
      {/* 三栏布局 */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 overflow-hidden">
        {/* 左侧参数设置面板 */}
        <div className="xl:col-span-3 h-full">
          <ParameterPanel />
        </div>

        {/* 中间编辑区域 */}
        <div className="xl:col-span-6 h-full">
          <EditorPanel />
        </div>

        {/* 右侧历史记录面板 */}
        <div className="xl:col-span-3 h-full">
          <HistoryPanel />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default AIImageGenerationPage;