'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Plus,
  Trash2,
  BarChart3,
  Music,
  Shield,
  FileDown,
  Search,
  Sparkles,
  Mic,
  Video,
  AlertTriangle,
  Info
} from 'lucide-react';

// 类型定义
interface ScriptSectionData {
  id: number;
  sceneDescription: string;
  cameraShot: string;
  scriptText: string;
  backgroundMusic: string;
  duration: number;
  complianceWarnings?: string[];
}

interface RequirementsFormProps {
  onGenerate: () => void;
}

interface ScriptSectionProps {
  section: ScriptSectionData;
  onUpdate: (id: number, field: keyof ScriptSectionData, value: string | number) => void;
  onDelete: (id: number) => void;
}

interface ScriptEditorProps {
  sections: ScriptSectionData[];
  onUpdateSection: (id: number, field: keyof ScriptSectionData, value: string | number) => void;
  onDeleteSection: (id: number) => void;
  onAddSection: () => void;
}

interface MaterialRecommendationProps {
  className?: string;
}

// 需求表单组件
const RequirementsForm: React.FC<RequirementsFormProps> = ({ onGenerate }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">视频需求描述</h2>

        <div className="flex-grow overflow-y-auto pr-2">
          {/* 基础信息 */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">基础信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">视频主题</label>
                <input
                  type="text"
                  placeholder="如：新品发布会回顾"
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">目标平台</label>
                <select className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm">
                  <option>抖音</option>
                  <option>快手</option>
                  <option>视频号</option>
                  <option>B站</option>
                  <option>YouTube</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">预期时长 (秒)</label>
                <input
                  type="number"
                  placeholder="如: 30"
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">风格要求</label>
                <select className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm">
                  <option>快节奏</option>
                  <option>温馨</option>
                  <option>励志</option>
                  <option>专业</option>
                  <option>搞笑</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">核心关键词/信息</label>
                <input
                  type="text"
                  placeholder="用逗号隔开"
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">文案偏好</label>
                <select className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm">
                  <option>口语化</option>
                  <option>正式</option>
                  <option>幽默</option>
                  <option>书面语</option>
                </select>
              </div>
            </div>
          </div>

          {/* 合规性配置 */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">合规性配置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">所属行业</label>
                <select className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm">
                  <option>医药</option>
                  <option>金融</option>
                  <option>教育</option>
                  <option>电商</option>
                  <option>科技</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">合规等级</label>
                <select className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent bg-[var(--bg-primary)] text-sm">
                  <option>低</option>
                  <option>中</option>
                  <option>高</option>
                </select>
              </div>

              <Alert className="bg-[var(--color-info-50)] border-[var(--color-info-100)] text-[var(--color-info-600)]">
                <Info className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  已启用智能合规监测，AI将识别脚本中的敏感内容、不当表达和潜在视觉风险。
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="mt-auto pt-5 border-t border-[var(--border-secondary)]">
          <div className="space-y-2">
            <Button
              className="w-full bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] flex items-center justify-center gap-2"
              onClick={onGenerate}
            >
              生成视频脚本
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)] flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              从文案库导入
            </Button>
            <button className="w-full text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2">
              清除输入
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 分镜片段组件
const ScriptSection: React.FC<ScriptSectionProps> = React.memo(({ section, onUpdate, onDelete }) => {
  return (
    <Card className="border border-[var(--border-secondary)]">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-500)] font-bold text-sm">
              {section.id}
            </span>
            <h4 className="font-semibold text-[var(--text-primary)]">分镜 {section.id}</h4>
          </div>
          <button
            className="text-[var(--text-secondary)] hover:text-[var(--color-danger-600)] transition-colors"
            onClick={() => onDelete(section.id)}
            aria-label={`删除分镜 ${section.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <label className="font-medium text-[var(--text-secondary)] block mb-1">场景描述</label>
            <textarea
              rows={2}
              className="w-full p-2 border border-[var(--border-primary)] rounded-md text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
              value={section.sceneDescription}
              onChange={(e) => onUpdate(section.id, 'sceneDescription', e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium text-[var(--text-secondary)] block mb-1">画面/镜头</label>
            <textarea
              rows={2}
              className="w-full p-2 border border-[var(--border-primary)] rounded-md text-sm bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
              value={section.cameraShot}
              onChange={(e) => onUpdate(section.id, 'cameraShot', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-medium text-[var(--text-secondary)] block mb-1">文案/对白</label>
            <div className="w-full p-2 border border-[var(--border-primary)] rounded-md text-sm bg-transparent focus-within:ring-1 focus-within:ring-[var(--color-primary-500)]">
              <span>{section.scriptText.replace('赢回', '')}<span className="bg-[var(--color-danger-50)] text-[var(--color-danger-600)] rounded px-1 py-0.5" title="AI实时高亮敏感词句">赢回</span>{section.scriptText.includes('赢回') ? '每一秒。' : ''}</span>
            </div>
          </div>
          <div>
            <label className="font-medium text-[var(--text-secondary)] block mb-1">背景音乐/音效</label>
            <input
              className="w-full p-2 border border-[var(--border-primary)] rounded-md text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
              value={section.backgroundMusic}
              onChange={(e) => onUpdate(section.id, 'backgroundMusic', e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium text-[var(--text-secondary)] block mb-1">时长建议 (秒)</label>
            <input
              type="number"
              className="w-full p-2 border border-[var(--border-primary)] rounded-md text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
              value={section.duration}
              onChange={(e) => onUpdate(section.id, 'duration', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* AI合规提示 */}
        {section.complianceWarnings && section.complianceWarnings.length > 0 && (
          <Alert className="mt-4 bg-[var(--color-warning-50)] border-[var(--color-warning-100)] text-[var(--color-warning-600)]">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              <p className="font-semibold">AI合规提示</p>
              <ul className="list-disc pl-4 mt-1">
                {section.complianceWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
});

ScriptSection.displayName = 'ScriptSection';

// 脚本编辑器组件
const ScriptEditor: React.FC<ScriptEditorProps> = ({
  sections,
  onUpdateSection,
  onDeleteSection,
  onAddSection
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-5 border-b border-[var(--border-secondary)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI脚本展示与编辑</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">AI已生成视频脚本，您可以在此自由编辑和优化。</p>
      </div>

      <div className="flex-grow p-5 overflow-y-auto space-y-5">
        {sections.map((section) => (
          <ScriptSection
            key={section.id}
            section={section}
            onUpdate={onUpdateSection}
            onDelete={onDeleteSection}
          />
        ))}

        {/* 添加分镜按钮 */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-500)] transition-colors"
          onClick={onAddSection}
          aria-label="添加新的分镜片段"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          添加分镜
        </button>
      </div>

      {/* 底部工具栏 */}
      <div className="p-5 border-t border-[var(--border-secondary)] bg-[var(--bg-primary)] rounded-b-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <Button variant="outline" className="flex items-center justify-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            优化节奏
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-1.5">
            <Music className="w-4 h-4" />
            智能配乐
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            合规性检测
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-1.5">
            <FileDown className="w-4 h-4" />
            导出文档
          </Button>
          <Button variant="outline">保存脚本</Button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button className="bg-[var(--color-primary-50)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-100)] flex items-center justify-center gap-1.5">
            <Mic className="w-4 h-4" />
            一键转语音
          </Button>
          <Button className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] flex items-center justify-center gap-1.5">
            <Video className="w-4 h-4" />
            进入智能剪辑
          </Button>
        </div>
      </div>
    </Card>
  );
};

// 素材推荐组件
const MaterialRecommendation: React.FC<MaterialRecommendationProps> = () => {
  const materials = [
    { id: 1, src: 'https://picsum.photos/seed/material1/200/120', alt: 'Material 1', section: 1, status: 'approved', label: '已合规' },
    { id: 2, src: 'https://picsum.photos/seed/material2/200/120', alt: 'Material 2', section: 1, status: 'pending', label: '未校验' },
    { id: 3, src: 'https://picsum.photos/seed/material3/200/120', alt: 'Material 3', section: 2, status: 'approved', label: '已合规' },
    { id: 4, src: 'https://picsum.photos/seed/material4/200/120', alt: 'Material 4', section: 2, status: 'risk', label: '有风险' },
    { id: 5, src: 'https://picsum.photos/seed/material5/200/120', alt: 'Material 5', section: 3, status: 'approved', label: '已合规' },
    { id: 6, src: 'https://picsum.photos/seed/material6/200/120', alt: 'Material 6', section: 3, status: 'approved', label: '已合规' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-[var(--color-success-50)] text-[var(--color-success-600)]';
      case 'pending': return 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]';
      case 'risk': return 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)]';
      default: return 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">素材匹配与推荐</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">AI根据脚本内容，在素材库中匹配推荐的视频片段和图片。</p>

        <div className="flex-grow overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3">
            {materials.map((material) => (
              <div key={material.id} className="relative group overflow-hidden rounded-md">
                <Image
                  src={material.src}
                  alt={material.alt}
                  width={200}
                  height={120}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-2 left-2 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-[var(--color-primary-500)] text-white">
                  匹配分镜 {material.section}
                </div>
                <div className={`absolute bottom-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(material.status)}`}>
                  {material.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="mt-auto pt-5 border-t border-[var(--border-secondary)] space-y-2">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            从素材库选择
          </Button>
          <Button className="w-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-100)] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI生成缺失素材
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 主页面组件
const VideoScriptEditingPage: React.FC = () => {
  // 示例数据
  const [scriptSections, setScriptSections] = React.useState<ScriptSectionData[]>([
    {
      id: 1,
      sceneDescription: '都市上班族匆忙的早晨，阳光穿透窗户。',
      cameraShot: '特写咖啡杯，青年人快速浏览手机上的新闻，展现高效生活。',
      scriptText: '时间在加速，工作不停歇，但我们的新产品能帮你赢回每一秒。',
      backgroundMusic: '轻快节奏音乐起，充满活力。',
      duration: 5,
      complianceWarnings: [
        '文案存在夸大性词语"绝对的"，建议替换为"显著的"或"明显的"。',
        '画面描述"快速浏览手机"可能引发驾驶安全相关的负面联想，建议明确场景为"在办公室"或"在家中"。'
      ]
    },
    {
      id: 2,
      sceneDescription: '办公室场景，主角使用产品解决复杂问题。',
      cameraShot: '中景镜头，主角轻松点击屏幕，界面动画流畅展示问题解决过程。',
      scriptText: '不再为琐事烦恼，智能科技，带来绝对的效率提升。',
      backgroundMusic: '音乐转为平稳、富有科技感。',
      duration: 8,
      complianceWarnings: [
        '文案存在夸大性词语"绝对的"，建议替换为"显著的"或"明显的"。'
      ]
    },
    {
      id: 3,
      sceneDescription: '日落时分，主角在公园放松，享受生活。',
      cameraShot: '远景，主角背影，夕阳余晖洒在身上，画面温暖。',
      scriptText: '高效工作，是为了更好地生活。即刻体验，开启您的全新一天。',
      backgroundMusic: '温馨、舒缓的音乐，营造放松氛围。',
      duration: 5
    }
  ]);

  // 更新分镜片段
  const handleUpdateSection = React.useCallback((id: number, field: keyof ScriptSectionData, value: string | number) => {
    setScriptSections(prev =>
      prev.map(section =>
        section.id === id
          ? { ...section, [field]: value }
          : section
      )
    );
  }, []);

  // 删除分镜片段
  const handleDeleteSection = React.useCallback((id: number) => {
    setScriptSections(prev => prev.filter(section => section.id !== id));
  }, []);

  // 添加新分镜片段
  const handleAddSection = React.useCallback(() => {
    const newId = scriptSections.length > 0
      ? Math.max(...scriptSections.map(s => s.id)) + 1
      : 1;
    const newSection: ScriptSectionData = {
      id: newId,
      sceneDescription: '',
      cameraShot: '',
      scriptText: '',
      backgroundMusic: '',
      duration: 5
    };
    setScriptSections(prev => [...prev, newSection]);
  }, [scriptSections]);

  // 生成脚本（示例功能）
  const handleGenerate = React.useCallback(() => {
    console.log('生成视频脚本');
  }, []);

  return (
    <ToolPageLayout
      title="AI视频脚本生成与剪辑"
      description="通过AI技术智能生成视频脚本，优化创作流程与内容质量"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '视觉内容智能生成与编辑', href: '/content-creation-visual-generation' },
        { label: 'AI视频脚本生成与剪辑', href: '/content-creation-video-script-editing', current: true }
      ]}
    >
      <div className="grid grid-cols-12 gap-6" style={{ height: 'calc(100vh - 150px)' }}>
        {/* 左栏：需求表单 */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <RequirementsForm onGenerate={handleGenerate} />
        </div>

        {/* 中栏：脚本编辑器 */}
        <div className="col-span-12 lg:col-span-6 h-full">
          <ScriptEditor
            sections={scriptSections}
            onUpdateSection={handleUpdateSection}
            onDeleteSection={handleDeleteSection}
            onAddSection={handleAddSection}
          />
        </div>

        {/* 右栏：素材推荐 */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <MaterialRecommendation />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default VideoScriptEditingPage;