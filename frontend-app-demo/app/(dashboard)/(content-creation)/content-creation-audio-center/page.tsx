'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Sparkles,
  CheckSquare,
  Layers,
  Zap,
  BarChart3,
  Shield,
  ArrowRight,
  Plus,
  FileText,
  Radio,
  Scissors,
  ShieldAlert
} from 'lucide-react';

interface StatCardProps {
  title: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, description, icon, actions, className }) => (
  <Card className={`relative group h-full ${className}`}>
    <CardContent className="p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          {description}
        </p>
      </div>
      <div className="mt-4">
        {actions}
      </div>
    </CardContent>
  </Card>
);

interface TemplateCardProps {
  title: string;
  description: string;
  preview: string;
  status: 'approved' | 'needs-review';
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, description, preview, status }) => {
  const router = useRouter();

  const handleUseTemplate = React.useCallback(() => {
    router.push('/content-creation-ai-voice-synthesis');
  }, [router]);

  return (
    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-secondary)] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
          <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            status === 'approved'
              ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
              : 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]'
          }`}>
            {status === 'approved' ? '已合规' : '需校验'}
          </Badge>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-2 italic">&ldquo;{preview}&rdquo;</p>
      </div>
      <Button
        variant="ghost"
        onClick={handleUseTemplate}
        className="mt-4 w-full justify-center px-4 py-2 rounded-lg transition-colors text-sm font-semibold text-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)]"
      >
        使用此模板
      </Button>
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center gap-3 p-4 bg-[var(--color-primary-50)] rounded-lg hover:bg-[var(--color-primary-100)] transition-colors text-[var(--color-primary-700)] text-center"
  >
    {icon}
    <span className="text-sm font-semibold">{title}</span>
  </button>
);

// 音频模板数据
const AUDIO_TEMPLATES = [
  {
    title: "访谈播客",
    description: "人物专访、行业对谈",
    preview: "开场白、嘉宾介绍、问题串...",
    status: "approved" as const
  },
  {
    title: "有声新闻",
    description: "新闻摘要、深度报道",
    preview: "新闻导语、背景阐述、结尾...",
    status: "approved" as const
  },
  {
    title: "产品介绍有声版",
    description: "新品发布、功能讲解",
    preview: "痛点引入、功能演示、价值...",
    status: "needs-review" as const
  }
];

// 合规风险数据
const COMPLIANCE_RISK_DATA = [
  { name: '敏感词', value: 40, fill: 'var(--color-chart-5)' },
  { name: '版权风险', value: 30, fill: 'var(--color-chart-4)' },
  { name: '事实性错误', value: 20, fill: 'var(--color-warning-500)' },
  { name: '其他', value: 10, fill: 'var(--color-chart-1)' }
];

const ContentCreationAudioCenterPage: React.FC = () => {
  const router = useRouter();

  // 使用 useMemo 优化趋势数据
  const trendData = React.useMemo(() => [
    { day: '周一', effect: 4.2 },
    { day: '周二', effect: 4.8 },
    { day: '周三', effect: 5.1 },
    { day: '周四', effect: 4.9 },
    { day: '周五', effect: 5.5 },
    { day: '周六', effect: 5.2 },
  ], []);

  // 快捷操作处理
  const handleQuickAction = React.useCallback((actionType: string) => {
    if (actionType === '播客脚本生成') {
      router.push('/content-creation-podcast-script');
    } else if (actionType === '文案转语音' || actionType === '智能音频剪辑') {
      router.push('/content-creation-ai-voice-synthesis');
    } else {
      console.log(`执行快捷操作: ${actionType}`);
      // 这里可以添加其他实际的业务逻辑
    }
  }, [router]);

  // 生成播客脚本处理
  const handleGeneratePodcastScript = React.useCallback(() => {
    router.push('/content-creation-podcast-script');
  }, [router]);

  return (
    <ToolPageLayout
      title="听觉创作中心"
      description="通过AI技术驱动的听觉内容创作平台，提供从脚本生成到音频制作的完整解决方案"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '听觉内容智能创作与编辑', href: '/content-creation-audio-center', current: true }
      ]}
    >
      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          {/* Top Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Creative Audio Card */}
            <StatCard
              title="创意音频推荐"
              description={
                <>
                  根据 <span className="text-[var(--color-primary-700)] font-medium">[IP人设]</span> 和{' '}
                  <span className="text-[var(--color-primary-700)] font-medium">[市场热点]</span>，为您推荐最新音频创意。
                </>
              }
              icon={<Sparkles className="w-5 h-5 text-[var(--color-primary-500)]" />}
              actions={
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm font-semibold"
                  >
                    查看更多灵感
                  </Button>
                  <Button
                    className="flex-1 text-sm font-semibold"
                    onClick={handleGeneratePodcastScript}
                  >
                    <ArrowRight className="w-4 h-4" />
                    生成此主题播客脚本
                  </Button>
                </div>
              }
              className="lg:col-span-3"
            />

            {/* Project Overview Card */}
            <StatCard
              title="音频任务与项目概览"
              description=""
              icon={<CheckSquare className="w-5 h-5 text-[var(--color-primary-500)]" />}
              actions={
                <>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between items-center text-sm py-1.5 text-[var(--text-secondary)]">
                      <span>待制作播客</span>
                      <span className="text-[var(--text-primary)] font-medium">8 个</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1.5 text-[var(--text-secondary)]">
                      <span>待生成语音</span>
                      <span className="text-[var(--text-primary)] font-medium">12 段</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1.5 text-[var(--color-warning-600)] font-bold">
                      <span>待合规审核音频</span>
                      <span>3 个</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1.5 text-[var(--text-secondary)]">
                      <span>已完成音频</span>
                      <span className="text-[var(--text-primary)] font-medium">128 个</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1.5 text-[var(--text-secondary)]">
                      <span>今日新增</span>
                      <span className="text-[var(--text-primary)] font-medium">5 个</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="text-sm font-semibold">
                      查看所有任务
                    </Button>
                    <Button variant="outline" className="text-sm font-semibold">
                      <Plus className="w-4 h-4" />
                      快速新建
                    </Button>
                    <Button className="col-span-2 text-sm font-semibold">
                      <ShieldAlert className="w-4 h-4" />
                      前往合规审核
                    </Button>
                  </div>
                </>
              }
              className="lg:col-span-2"
            />
          </div>

          {/* Template Library */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[var(--color-primary-500)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">音频模板库</h3>
                </div>
                <Button variant="ghost" className="text-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)]">
                  查看更多模板
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2">精选音频模板，助您高效创作。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {AUDIO_TEMPLATES.map((template, index) => (
                  <TemplateCard
                    key={`template-${index}`}
                    title={template.title}
                    description={template.description}
                    preview={template.preview}
                    status={template.status}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[var(--color-primary-500)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">智能生成快捷入口</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-2">快速开始您的AI听觉创作。</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <QuickActionButton
                  icon={<FileText className="w-6 h-6" />}
                  title="文案转语音"
                  onClick={() => handleQuickAction('文案转语音')}
                />
                <QuickActionButton
                  icon={<Radio className="w-6 h-6" />}
                  title="播客脚本生成"
                  onClick={() => handleQuickAction('播客脚本生成')}
                />
                <QuickActionButton
                  icon={<Scissors className="w-6 h-6" />}
                  title="智能音频剪辑"
                  onClick={() => handleQuickAction('智能音频剪辑')}
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar */}
        <aside className="xl:col-span-1 space-y-6">

          {/* Trend Chart */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--color-primary-500)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">音频效果预估趋势</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">基于历史数据及内容特征的预测。</p>
              <div style={{ width: '100%', height: '250px' }}>
                <ChartContainer
                  config={{
                    effect: {
                      label: '效果评分',
                      color: 'var(--color-chart-1)',
                    },
                  }}
                  className="h-full w-full"
                >
                  <RechartsLineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="effect"
                      stroke="var(--color-effect)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </RechartsLineChart>
                </ChartContainer>
              </div>
              <div className="text-center mt-4">
                <Button variant="ghost" className="text-sm font-semibold text-[var(--color-primary-500)] hover:underline">
                  查看详细报告
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Chart */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--color-primary-500)]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">合规风险速览</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1 mb-2">当前音频素材库合规风险概览。</p>
              <div className="space-y-1.5 text-sm my-4">
                <div className="flex justify-between">
                  <span>待处理音频合规风险:</span>
                  <span className="font-bold text-[var(--color-danger-600)]">15 条</span>
                </div>
                <div className="flex justify-between">
                  <span>高风险音频:</span>
                  <span className="font-bold text-[var(--color-warning-600)]">4 个</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={COMPLIANCE_RISK_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COMPLIANCE_RISK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[var(--text-secondary)] mt-3 mb-4">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[var(--color-chart-5)] mr-2"></span>
                  敏感词
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[var(--color-chart-4)] mr-2"></span>
                  版权风险
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[var(--color-warning-500)] mr-2"></span>
                  事实性错误
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[var(--color-chart-1)] mr-2"></span>
                  其他
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button variant="outline" className="flex-1 text-sm font-semibold">
                  查看全部风险
                </Button>
                <Button className="flex-1 text-sm font-semibold">
                  配置合规规则
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </ToolPageLayout>
  );
};

export default ContentCreationAudioCenterPage;