'use client';

import React, { useState } from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Save,
  History,
  Share2,
  Download,
  Sparkles,
  Shield,
  BarChart3,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface ConfigState {
  contentType: string;
  platform: string;
  style: string;
  length: number[];
  personality: string;
  keywords: string;
}

const AIEditorPage: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState('夏季新品推广文案');
  const [config, setConfig] = useState<ConfigState>({
    contentType: '推文',
    platform: '微信公众号',
    style: '活泼有趣',
    length: [200],
    personality: '年轻活力',
    keywords: 'AI营销, 增长'
  });
  const [activeTab, setActiveTab] = useState('optimize');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  // 示例文案内容
  const sampleContent = `🚀 引爆增长新纪元：智赢·AI全域营销大师，您的增长加速器！

还在为营销文案的创作而烦恼吗？还在为无法精准触达目标用户而焦虑吗？

智赢·AI全域营销大师，集成了尖端AI技术，为您提供一站式营销内容解决方案。无论是社交媒体推文、广告语还是产品详情页，我们都能根据您的&ldquo;专业&rdquo;品牌调性，生成&ldquo;活泼有趣&rdquo;风格的爆款文案。

✨ 核心优势:
- 智能创作: 输入关键词&ldquo;AI营销&rdquo;，秒速生成多版本高质量文案。
- 效果预估: AI精准预测文案点击率与转化率，让每一次投放都胸有成竹。
- 合规检测: 规避营销风险，确保内容安全合规。

👇 立即体验，开启智能营销新篇章！`;

  const [content, setContent] = useState(sampleContent);

  const handleConfigChange = (key: keyof ConfigState, value: string | number[]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // 顶部操作按钮组
  const pageActions = (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex justify-center">
        <Input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="text-center text-lg font-semibold bg-transparent focus:bg-[var(--bg-secondary)] rounded-md px-3 py-1 outline-none transition-colors duration-200 w-full max-w-md border-none focus:ring-0"
          placeholder="项目标题"
        />
      </div>
      <Button variant="outline" className="hidden md:flex items-center gap-2">
        <Save className="w-4 h-4" />
        保存草稿
      </Button>
      <Button variant="outline" size="icon" className="bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
        <History className="w-5 h-5" />
      </Button>
      <Button variant="outline" size="icon" className="bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
        <Share2 className="w-5 h-5" />
      </Button>
      <Button variant="outline" size="icon" className="bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
        <Download className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <ToolPageLayout
      title="AI文案生成与编辑"
      description="智能AI文案创作与编辑器，支持多种文案类型和平台优化"
      breadcrumbs={[
        { label: '品牌与创意资产', href: '#' },
        { label: '智能内容创作与素材中心', href: '#' },
        { label: 'AI文案生成与编辑', href: '/content-creation-ai-editor', current: true }
      ]}
      actions={pageActions}
    >

      {/* Config Panel */}
      <div className="bg-[var(--bg-primary)] -mx-6 lg:-mx-8 px-6 lg:px-8 py-4 border border-[var(--border-secondary)] rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-end">
          <div>
            <Label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">文案类型</Label>
            <Select value={config.contentType} onValueChange={(value) => handleConfigChange('contentType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="推文">推文</SelectItem>
                <SelectItem value="广告语">广告语</SelectItem>
                <SelectItem value="朋友圈文案">朋友圈文案</SelectItem>
                <SelectItem value="产品详情页">产品详情页</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">目标平台</Label>
            <Select value={config.platform} onValueChange={(value) => handleConfigChange('platform', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="微信公众号">微信公众号</SelectItem>
                <SelectItem value="微博">微博</SelectItem>
                <SelectItem value="抖音小红书">抖音小红书</SelectItem>
                <SelectItem value="电商平台">电商平台</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">文案风格</Label>
            <Select value={config.style} onValueChange={(value) => handleConfigChange('style', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="专业严谨">专业严谨</SelectItem>
                <SelectItem value="活泼有趣">活泼有趣</SelectItem>
                <SelectItem value="真诚温情">真诚温情</SelectItem>
                <SelectItem value="幽默风趣">幽默风趣</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="xl:col-span-1">
            <Label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">文案长度</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={config.length}
                onValueChange={(value) => handleConfigChange('length', value)}
                max={1000}
                min={50}
                step={50}
                className="w-full"
              />
              <span className="text-sm font-semibold w-12 text-right">{config.length[0]}</span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">IP人设/品牌调性</Label>
            <Select value={config.personality} onValueChange={(value) => handleConfigChange('personality', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="年轻活力">年轻活力</SelectItem>
                <SelectItem value="科技先锋">科技先锋</SelectItem>
                <SelectItem value="行业专家">行业专家</SelectItem>
                <SelectItem value="贴心闺蜜">贴心闺蜜</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2 xl:col-span-1">
            <Label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">核心关键词</Label>
            <Input
              type="text"
              value={config.keywords}
              onChange={(e) => handleConfigChange('keywords', e.target.value)}
              placeholder="用逗号分隔"
              className="w-full"
            />
          </div>

          <Button className="w-full bg-[var(--color-primary-500)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            一键生成
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Editor Panel */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-[600px] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[var(--border-secondary)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">关于&ldquo;AI营销&rdquo;的推文</h3>
            </div>
            <div className="flex-grow p-5 overflow-y-auto relative">
              {editorMode === 'edit' ? (
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full resize-none border-none focus:ring-0 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  placeholder="在这里编写您的文案内容..."
                />
              ) : (
                <div className="prose prose-sm max-w-none w-full h-full text-sm leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-[var(--border-secondary)] flex-shrink-0 bg-[var(--bg-tertiary)]">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-md">
                  <Button
                    variant={editorMode === 'edit' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setEditorMode('edit')}
                    className={editorMode === 'edit' ? 'bg-[var(--bg-primary)] text-[var(--color-primary-600)] shadow-sm' : ''}
                  >
                    编辑
                  </Button>
                  <Button
                    variant={editorMode === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setEditorMode('preview')}
                    className={editorMode === 'preview' ? 'bg-[var(--bg-primary)] text-[var(--color-primary-600)] shadow-sm' : ''}
                  >
                    预览
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Assistant Panel */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b border-[var(--border-secondary)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--color-primary-50)] rounded-md text-[var(--color-primary-500)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">AI 优化与赋能</h3>
              </div>
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-5 h-5" />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <div className="border-b border-[var(--border-secondary)] px-2">
                <TabsList className="w-full grid grid-cols-4 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="optimize"
                    className="flex flex-col items-center gap-1 py-2 text-sm font-medium data-[state=active]:text-[var(--color-primary-500)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:bg-transparent rounded-none"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs">智能优化</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="compliance"
                    className="flex flex-col items-center gap-1 py-2 text-sm font-medium data-[state=active]:text-[var(--color-primary-500)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:bg-transparent rounded-none"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-xs">合规检测</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="flex flex-col items-center gap-1 py-2 text-sm font-medium data-[state=active]:text-[var(--color-primary-500)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:bg-transparent rounded-none"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-xs">效果预估</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="related"
                    className="flex flex-col items-center gap-1 py-2 text-sm font-medium data-[state=active]:text-[var(--color-primary-500)] data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary-500)] data-[state=active]:bg-transparent rounded-none"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs">相关内容</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-grow p-4 overflow-y-auto">
                <TabsContent value="optimize" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--text-secondary)]">智能优化工具</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="text-left p-3 h-auto justify-start">
                        文案润色
                      </Button>
                      <Button variant="outline" className="text-left p-3 h-auto justify-start">
                        标题优化
                      </Button>
                      <Button variant="outline" className="text-left p-3 h-auto justify-start">
                        SEO优化
                      </Button>
                      <Button variant="outline" className="text-left p-3 h-auto justify-start">
                        风格转换
                      </Button>
                      <Button variant="outline" className="text-left p-3 h-auto justify-start">
                        摘要生成
                      </Button>
                      <Button variant="outline" className="text-left p-3 h-auto justify-start">
                        更多工具
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="compliance" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--text-secondary)]">合规检测</h4>
                    <p className="text-sm text-[var(--text-secondary)]">检测文案中的合规风险，确保内容安全。</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>敏感词检测</span>
                        <span className="text-green-600">通过</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>虚假宣传</span>
                        <span className="text-green-600">通过</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>错别字检查</span>
                        <span className="text-yellow-600">需注意</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--text-secondary)]">效果预估</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">预估点击率</span>
                        <span className="font-semibold">4.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">预估转化率</span>
                        <span className="font-semibold">2.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">情感分值</span>
                        <span className="font-semibold text-green-600">积极</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="related" className="mt-0">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--text-secondary)]">相关内容</h4>
                    <p className="text-sm text-[var(--text-secondary)]">推荐相关的素材和内容模板。</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-sm">
                        夏季营销模板
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        AI技术文案库
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        增长营销案例
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default AIEditorPage;