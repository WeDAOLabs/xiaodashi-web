'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Zap,
  Settings,
  Shield,
  FileText,
  Download,
  Save,
  Volume2,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Trash2
} from 'lucide-react';

// 类型定义
interface PodcastFormData {
  topic: string;
  targetAudience: string;
  duration: string;
  style: string;
  keywords: string;
  roles: string;
  industry: string;
  complianceLevel: string;
}

interface DialogueSegment {
  id: string;
  role: string;
  content: string;
  suggestions?: Array<{
    type: 'optimization' | 'warning' | 'info';
    message: string;
  }>;
}

interface ScriptSection {
  id: string;
  title: string;
  segments: DialogueSegment[];
}

interface ContentSuggestion {
  id: string;
  type: 'emotion' | 'case' | 'compliance' | 'interaction';
  icon: React.ReactNode;
  title: string;
  description: string;
}

// 组件：左侧配置表单
interface ScriptConfigFormProps {
  formData: PodcastFormData;
  onFormChange: (field: keyof PodcastFormData, value: string) => void;
  onGenerate: () => void;
  onImport: () => void;
  onClear: () => void;
}

const ScriptConfigForm: React.FC<ScriptConfigFormProps> = ({
  formData,
  onFormChange,
  onGenerate,
  onImport,
  onClear
}) => {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div>
        <Label htmlFor="podcast-topic" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          播客主题
        </Label>
        <Input
          id="podcast-topic"
          value={formData.topic}
          onChange={(e) => onFormChange('topic', e.target.value)}
          placeholder="例如：AI在营销领域的未来趋势"
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm bg-white"
        />
      </div>

      <div>
        <Label htmlFor="target-audience" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          目标听众
        </Label>
        <Input
          id="target-audience"
          value={formData.targetAudience}
          onChange={(e) => onFormChange('targetAudience', e.target.value)}
          placeholder="例如：市场营销从业者、科技爱好者"
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            预期时长
          </Label>
          <Select value={formData.duration} onValueChange={(value) => onFormChange('duration', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择预期时长" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15分钟">15分钟</SelectItem>
              <SelectItem value="30分钟">30分钟</SelectItem>
              <SelectItem value="45分钟">45分钟</SelectItem>
              <SelectItem value="60分钟">60分钟</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="style" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            节目风格
          </Label>
          <Select value={formData.style} onValueChange={(value) => onFormChange('style', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择节目风格" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="轻松对话">轻松对话</SelectItem>
              <SelectItem value="专业访谈">专业访谈</SelectItem>
              <SelectItem value="深度分析">深度分析</SelectItem>
              <SelectItem value="故事讲述">故事讲述</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="keywords" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          关键词/核心观点
        </Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => onFormChange('keywords', e.target.value)}
          placeholder="输入核心词，用逗号隔开"
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm bg-white"
        />
      </div>

      <div>
        <Label htmlFor="roles" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          对话角色
        </Label>
        <Input
          id="roles"
          value={formData.roles}
          onChange={(e) => onFormChange('roles', e.target.value)}
          placeholder="例如：主持人, 嘉宾A, 嘉宾B"
          className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent text-sm bg-white"
        />
      </div>

      <div className="pt-4 border-t border-[var(--border-secondary)]">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">合规性配置</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="industry" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              所属行业
            </Label>
            <Select value={formData.industry} onValueChange={(value) => onFormChange('industry', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择所属行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="医药">医药</SelectItem>
                <SelectItem value="金融">金融</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
                <SelectItem value="电商">电商</SelectItem>
                <SelectItem value="科技">科技</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="compliance-level" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              合规等级
            </Label>
            <Select value={formData.complianceLevel} onValueChange={(value) => onFormChange('complianceLevel', value)}>
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
        </div>
        <div className="bg-[var(--color-info-50)] text-[var(--color-info-600)] p-3 rounded-md text-xs flex items-start gap-2">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>已启用智能合规监测，AI将识别脚本中的敏感内容、不当表达和潜在风险。</p>
        </div>
      </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-5 space-y-3">
        <Button
          onClick={onGenerate}
          className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] w-full"
        >
          <Zap className="w-4 h-4" />
          智能生成脚本
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onImport}
            variant="outline"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-secondary)] border border-[var(--border-primary)]"
          >
            <FileText className="w-4 h-4" />
            从文案库导入
          </Button>
          <Button
            onClick={onClear}
            variant="ghost"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
          >
            <Trash2 className="w-4 h-4" />
            清除输入
          </Button>
        </div>
      </div>
    </div>
  );
};

// 组件：中间脚本编辑区域
interface ScriptEditorProps {
  sections: ScriptSection[];
  onOptimizeStructure: () => void;
  onAddInteraction: () => void;
  onComplianceCheck: () => void;
  onSave: () => void;
  onExport: () => void;
  onConvertToAudio: () => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({
  sections,
  onOptimizeStructure,
  onAddInteraction,
  onComplianceCheck,
  onSave,
  onExport,
  onConvertToAudio
}) => {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-[var(--border-secondary)] flex-shrink-0">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">AI生成播客脚本</h3>
        <p className="text-xs text-[var(--text-tertiary)]">支持分角色、分段落编辑，AI将实时高亮风险与优化点。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={onOptimizeStructure}
            variant="outline"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            优化结构
          </Button>
          <Button
            onClick={onAddInteraction}
            variant="outline"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            增加互动环节
          </Button>
          <Button
            onClick={onComplianceCheck}
            variant="outline"
            className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            合规性检测
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 text-sm leading-relaxed">
        {sections.map((section) => (
          <div key={section.id}>
            <h4 className="font-semibold text-[var(--color-primary-700)] mb-3 sticky top-0 bg-white\/80 backdrop-blur-sm py-1">
              {section.title}
            </h4>
            <div className="space-y-4">
              {section.segments.map((segment) => (
                <div key={segment.id} className="flex gap-4 items-start">
                  <span className="font-semibold text-[var(--text-secondary)] w-16 flex-shrink-0 pt-0.5">
                    {segment.role}:
                  </span>
                  <div className="flex-1">
                    <p className="text-[var(--text-primary)]">{segment.content}</p>
                    {segment.suggestions?.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`mt-2 text-xs p-2 rounded-md flex items-start gap-2 border ${
                          suggestion.type === 'warning'
                            ? 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]'
                            : suggestion.type === 'optimization'
                            ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] border-[var(--color-primary-100)]'
                            : 'bg-[var(--color-info-50)] text-[var(--color-info-600)] border-[var(--color-info-100)]'
                        }`}
                      >
                        {suggestion.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : suggestion.type === 'optimization' ? (
                          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold">
                            [{suggestion.type === 'warning' ? 'AI预警' : suggestion.type === 'optimization' ? 'AI优化' : 'AI提示'}]
                          </span>{' '}
                          {suggestion.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[var(--border-secondary)] bg-[var(--bg-tertiary)] rounded-b-lg flex items-center gap-3 flex-shrink-0">
        <Button
          onClick={onSave}
          variant="outline"
          className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          保存脚本
        </Button>
        <Button
          onClick={onExport}
          variant="outline"
          className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          导出为文本文档
        </Button>
        <Button
          onClick={onConvertToAudio}
          className="px-4 py-2 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] ml-auto"
        >
          <Volume2 className="w-4 h-4" />
          一键转语音
          <ChevronRight className="w-4 h-4 -mr-1" />
        </Button>
      </div>
    </div>
  );
};

// 组件：右侧建议面板
interface ContentSuggestionsProps {
  suggestions: ContentSuggestion[];
  onAcceptSuggestion: (id: string) => void;
  onIgnoreSuggestion: (id: string) => void;
}

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  suggestions,
  onAcceptSuggestion,
  onIgnoreSuggestion
}) => {
  return (
    <div className="bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">内容优化与建议</h3>
      <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]"
          >
            <h4 className="font-semibold text-sm flex items-center mb-1.5">
              {suggestion.icon}
              {suggestion.title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{suggestion.description}</p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onAcceptSuggestion(suggestion.id)}
                variant="ghost"
                className="px-2 h-7 rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                采纳建议
              </Button>
              <Button
                onClick={() => onIgnoreSuggestion(suggestion.id)}
                variant="ghost"
                className="px-2 h-7 rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                忽略
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主页面组件
const PodcastScriptGenerationPage: React.FC = () => {
  // 表单数据状态
  const [formData, setFormData] = React.useState<PodcastFormData>({
    topic: '',
    targetAudience: '',
    duration: '30分钟',
    style: '轻松对话',
    keywords: '',
    roles: '',
    industry: '科技',
    complianceLevel: '中'
  });

  // 脚本数据状态
  const [scriptSections] = React.useState<ScriptSection[]>([
    {
      id: 'opening',
      title: '开场',
      segments: [
        {
          id: 'opening-1',
          role: '主持人',
          content: '大家好，欢迎收听本期的《营销新视界》，我是你们的主持人，Alex。'
        },
        {
          id: 'opening-2',
          role: '主持人',
          content: '今天我们请到了一位重量级嘉宾，AI营销专家，Sarah！'
        },
        {
          id: 'opening-3',
          role: '嘉宾A',
          content: 'Alex好，各位听众好，很高兴来到这里。'
        }
      ]
    },
    {
      id: 'discussion-1',
      title: '主题讨论 1: AI在内容创作中的应用',
      segments: [
        {
          id: 'discussion-1-1',
          role: '主持人',
          content: 'Sarah，我们都知道AI现在非常火，它在营销内容创作上，具体能做些什么呢？'
        },
        {
          id: 'discussion-1-2',
          role: '嘉宾A',
          content: 'AI的应用非常广泛。从生成博客文章、社交媒体帖子，到今天我们讨论的播客脚本，AI都能高效完成。'
        },
        {
          id: 'discussion-1-3',
          role: '嘉宾A',
          content: '它能保证内容质量的稳定，这是人工难以做到的。',
          suggestions: [
            {
              type: 'optimization',
              message: '可以替换为："它能确保内容质量的基准线，这是人工团队在规模化生产时的一大挑战。"'
            }
          ]
        }
      ]
    },
    {
      id: 'discussion-2',
      title: '主题讨论 2: 潜在风险与合规',
      segments: [
        {
          id: 'discussion-2-1',
          role: '主持人',
          content: '听起来很棒，但使用AI是否存在风险？尤其是在金融、医药这些强监管行业。'
        },
        {
          id: 'discussion-2-2',
          role: '嘉宾A',
          content: '绝对有。AI可能会生成一些听起来正确但实际上有误导性的信息，甚至可能触及法律红线。'
        },
        {
          id: 'discussion-2-3',
          role: '嘉宾A',
          content: '比如，宣传某个金融产品时，AI可能会使用"保证收益"这类词汇，这是绝对不允许的。',
          suggestions: [
            {
              type: 'warning',
              message: '"保证收益"是金融广告中的禁用词，存在高合规风险。'
            }
          ]
        }
      ]
    },
    {
      id: 'ending',
      title: '结尾引导',
      segments: [
        {
          id: 'ending-1',
          role: '主持人',
          content: '非常感谢Sarah的精彩分享。相信大家对AI在营销领域的应用有了更深的理解。'
        },
        {
          id: 'ending-2',
          role: '主持人',
          content: '如果你想了解更多，欢迎访问我们的官网。我们下期再见！'
        }
      ]
    }
  ]);

  // 建议数据状态
  const [suggestions, setSuggestions] = React.useState<ContentSuggestion[]>([
    {
      id: 'emotion-analysis',
      type: 'emotion',
      icon: <Sparkles className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />,
      title: '情感起伏分析',
      description: '当前脚本情感曲线较为平稳，可在"主题讨论2"部分增加一个有争议的案例来创造讨论高潮。'
    },
    {
      id: 'case-support',
      type: 'case',
      icon: <Lightbulb className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />,
      title: '增加案例支撑',
      description: '在讨论AI应用时，建议引用1-2个知名品牌的成功案例，使内容更具说服力。'
    },
    {
      id: 'compliance-suggestion',
      type: 'compliance',
      icon: <Shield className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />,
      title: '合规性建议',
      description: '脚本合规风险评估为中等。建议处理1个高风险点：金融产品宣传语。'
    },
    {
      id: 'interaction-enhancement',
      type: 'interaction',
      icon: <Sparkles className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />,
      title: '增强互动性',
      description: '结尾处可以设计一个问题，邀请听众在评论区留言互动，以提升用户参与度。'
    }
  ]);

  // 表单处理函数
  const handleFormChange = React.useCallback((field: keyof PodcastFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // 事件处理函数
  const handleGenerate = React.useCallback(() => {
    console.log('生成脚本', formData);
    // 这里可以添加实际的AI生成逻辑
  }, [formData]);

  const handleImport = React.useCallback(() => {
    console.log('从文案库导入');
  }, []);

  const handleClear = React.useCallback(() => {
    setFormData({
      topic: '',
      targetAudience: '',
      duration: '30分钟',
      style: '轻松对话',
      keywords: '',
      roles: '',
      industry: '科技',
      complianceLevel: '中'
    });
  }, []);

  const handleOptimizeStructure = React.useCallback(() => {
    console.log('优化结构');
  }, []);

  const handleAddInteraction = React.useCallback(() => {
    console.log('增加互动环节');
  }, []);

  const handleComplianceCheck = React.useCallback(() => {
    console.log('合规性检测');
  }, []);

  const handleSave = React.useCallback(() => {
    console.log('保存脚本');
  }, []);

  const handleExport = React.useCallback(() => {
    console.log('导出脚本');
  }, []);

  const handleConvertToAudio = React.useCallback(() => {
    console.log('转换为语音');
  }, []);

  const handleAcceptSuggestion = React.useCallback((id: string) => {
    console.log('采纳建议', id);
    setSuggestions(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleIgnoreSuggestion = React.useCallback((id: string) => {
    console.log('忽略建议', id);
    setSuggestions(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <ToolPageLayout
      title="AI播客脚本生成"
      description="通过AI技术快速生成高质量播客脚本，支持多角色对话、智能优化和合规检测"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '听觉内容智能创作与编辑', href: '/content-creation-audio-center' },
        { label: 'AI播客脚本生成', href: '/content-creation-podcast-script', current: true }
      ]}
    >
      <div className="grid grid-cols-12 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Left Column: Form */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <ScriptConfigForm
            formData={formData}
            onFormChange={handleFormChange}
            onGenerate={handleGenerate}
            onImport={handleImport}
            onClear={handleClear}
          />
        </div>

        {/* Center Column: Script Editor */}
        <div className="col-span-12 lg:col-span-6 h-full">
          <ScriptEditor
            sections={scriptSections}
            onOptimizeStructure={handleOptimizeStructure}
            onAddInteraction={handleAddInteraction}
            onComplianceCheck={handleComplianceCheck}
            onSave={handleSave}
            onExport={handleExport}
            onConvertToAudio={handleConvertToAudio}
          />
        </div>

        {/* Right Column: Suggestions */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <ContentSuggestions
            suggestions={suggestions}
            onAcceptSuggestion={handleAcceptSuggestion}
            onIgnoreSuggestion={handleIgnoreSuggestion}
          />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default PodcastScriptGenerationPage;