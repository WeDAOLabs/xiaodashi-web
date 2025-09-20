'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  FileText,
  Film,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  Settings
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

// AI创意素材推荐组件
const AIRecommendation: React.FC = () => (
  <Card className="xl:col-span-2">
    <CardContent className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI创意素材推荐</h2>
        <button
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="更多选项"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        根据 <span className="text-[var(--color-primary-600)] font-semibold">[品牌调性]</span> 和{' '}
        <span className="text-[var(--color-primary-600)] font-semibold">[市场趋势]</span>，为您推荐最新视觉创意。
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Image
          src="/images/visual-content/recommendation-1.jpg"
          alt="推荐视觉素材 1"
          width={200}
          height={200}
          className="rounded-md aspect-square object-cover"
        />
        <Image
          src="/images/visual-content/recommendation-2.jpg"
          alt="推荐视觉素材 2"
          width={200}
          height={200}
          className="rounded-md aspect-square object-cover"
        />
        <div className="rounded-md aspect-square bg-[var(--bg-secondary)] flex items-center justify-center">
          <FileText className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
        <div className="rounded-md aspect-square bg-[var(--bg-secondary)] flex items-center justify-center">
          <FileText className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button className="bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
          查看更多灵感
        </Button>
        <Button variant="outline">
          生成类似素材
        </Button>
      </div>
    </CardContent>
  </Card>
);

// 视觉任务与项目概览组件
const VisualTaskOverview: React.FC = () => (
  <Card>
    <CardContent className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">视觉任务与项目概览</h2>
        <button
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="更多选项"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <ul className="space-y-3 text-sm mb-4">
        <li className="flex justify-between items-center">
          <span>待设计海报</span>
          <span className="font-semibold text-[var(--text-primary)]">8 张</span>
        </li>
        <li className="flex justify-between items-center">
          <span>待剪辑视频</span>
          <span className="font-semibold text-[var(--text-primary)]">3 个</span>
        </li>
        <li className="flex justify-between items-center text-[var(--color-warning-600)]">
          <strong>待合规审核视觉素材</strong>
          <span className="font-bold">12 个</span>
        </li>
        <li className="flex justify-between items-center pt-2 border-t border-[var(--border-secondary)]">
          <span>已完成设计</span>
          <span className="font-semibold text-[var(--color-success-600)]">128 个</span>
        </li>
        <li className="flex justify-between items-center">
          <span>今日新增</span>
          <span className="font-semibold text-[var(--color-success-600)]">+15 个</span>
        </li>
      </ul>
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)] hover:bg-[var(--color-primary-100)] border-[var(--color-primary-100)]">
          查看所有任务
        </Button>
        <Button variant="outline" className="w-full bg-[var(--color-warning-50)] text-[var(--color-warning-600)] hover:bg-[var(--color-warning-100)] border-[var(--color-warning-100)]">
          前往合规审核
        </Button>
        <Button className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          快速新建视觉素材
        </Button>
      </div>
    </CardContent>
  </Card>
);

// 合规风险速览组件
const ComplianceRiskOverview: React.FC = () => {
  const riskData = React.useMemo(() => [
    { name: 'high', label: '高风险', value: 30, count: 9, fill: 'var(--color-chart-5)' },
    { name: 'medium', label: '中风险', value: 25, count: 8, fill: 'var(--color-chart-4)' },
    { name: 'low', label: '低风险', value: 35, count: 11, fill: 'var(--color-chart-1)' },
    { name: 'safe', label: '安全', value: 10, count: 3, fill: 'var(--color-chart-2)' }
  ], []);

  const chartConfig: ChartConfig = React.useMemo(() => {
    return riskData.reduce((config, item) => {
      config[item.name] = {
        label: item.label,
        color: item.fill
      };
      return config;
    }, {} as ChartConfig);
  }, [riskData]);

  const totalRisks = React.useMemo(() =>
    riskData.reduce((sum, item) => sum + item.count, 0), [riskData]
  );

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">合规风险速览</h2>
          <button
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="更多选项"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">当前视觉素材库合规风险概览。</p>
        <ul className="space-y-3 text-sm mb-4">
          <li className="flex justify-between items-center">
            <span>待处理视觉合规风险</span>
            <span className="font-semibold text-[var(--color-danger-600)]">4 条</span>
          </li>
          <li className="flex justify-between items-center">
            <span>高风险图片/视频</span>
            <span className="font-semibold text-[var(--color-danger-600)]">9 个</span>
          </li>
        </ul>

        <div className="h-40 relative mb-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
                aria-label="合规风险分布饼图"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* 中心文本显示 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{totalRisks}</div>
              <div className="text-xs text-[var(--text-secondary)]">总素材数</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full bg-[var(--color-danger-50)] text-[var(--color-danger-600)] hover:bg-[var(--color-danger-100)] border-[var(--color-danger-100)]">
            查看全部风险
          </Button>
          <Button variant="outline" className="w-full">
            配置合规规则
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 精选视觉模板组件
const VisualTemplateLibrary: React.FC = () => (
  <Card>
    <CardContent className="p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">精选视觉模板</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">精选视觉模板，助您高效设计。</p>
        </div>
        <button className="text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors flex items-center gap-1">
          查看更多模板
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: '节日促销海报', category: '海报设计', status: '已合规', statusColor: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]', image: 'template-1.jpg' },
          { name: '新品宣传视频', category: '视频脚本', status: '已合规', statusColor: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]', image: 'template-2.jpg' },
          { name: '活动邀请函H5', category: 'H5页面', status: '需校验', statusColor: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]', image: 'template-3.jpg' },
          { name: '社交媒体九宫格', category: '社交媒体', status: '已合规', statusColor: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]', image: 'template-4.jpg' }
        ].map((template, index) => (
          <div key={index} className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg overflow-hidden group">
            <div className="relative h-32">
              <Image
                src={`/images/visual-content/${template.image}`}
                alt={template.name}
                width={400}
                height={300}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                <Button
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  size="sm"
                >
                  使用此模板
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">{template.name}</h3>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-[var(--text-tertiary)]">{template.category}</span>
                <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${template.statusColor}`}>
                  {template.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// 智能生成快捷入口组件
const SmartGenerationQuickAccess: React.FC = () => (
  <Card>
    <CardContent className="p-5">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">智能生成快捷入口</h2>
      <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">快速开始您的AI视觉创作。</p>
      <div className="flex flex-col md:flex-row gap-4">
        {[
          { icon: ImageIcon, title: '文生图', description: '输入文本，生成高质量图片素材' },
          { icon: FileText, title: 'AI海报设计', description: '智能排版，一键生成营销海报' },
          { icon: Film, title: '短视频脚本', description: 'AI生成视频脚本，提升内容创意' },
          { icon: Settings, title: '智能剪辑', description: '上传素材，AI自动完成视频剪辑' }
        ].map((item, index) => (
          <button
            key={index}
            className="flex-1 text-left p-6 bg-[var(--bg-tertiary)] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border border-transparent hover:border-[var(--color-primary-500)]"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-[var(--color-primary-50)] rounded-lg text-[var(--color-primary-500)]">
                <item.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--color-primary-600)] transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mt-4 text-[var(--text-primary)]">{item.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description}</p>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
);

// 主页面组件
const VisualGenerationPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="视觉内容智能生成与编辑"
      description="通过AI技术实现视觉内容的智能生成、编辑与优化，提升创作效率与质量"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '视觉内容智能生成与编辑', href: '/content-creation-visual-generation', current: true }
      ]}
    >
      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* AI创意素材推荐 */}
        <AIRecommendation />

        {/* 视觉任务与项目概览 */}
        <VisualTaskOverview />

        {/* 合规风险速览 */}
        <ComplianceRiskOverview />
      </div>

      {/* 精选视觉模板 */}
      <div className="mt-6">
        <VisualTemplateLibrary />
      </div>

      {/* 智能生成快捷入口 */}
      <div className="mt-6">
        <SmartGenerationQuickAccess />
      </div>

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default VisualGenerationPage;