'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Plus,
  FolderOpen,
  Zap,
  UserPlus,
  Edit,
  Eye,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Play
} from 'lucide-react';

// 类型定义
interface StatCardProps {
  title: string;
  value: string;
  target: string;
  progress: number;
  trend: string;
  isPositive: boolean;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TreeNodeProps {
  label: string;
  children?: TreeNodeProps[];
  level?: number;
}

interface GanttTaskProps {
  name: string;
  startWeek: number;
  duration: number;
  status: 'complete' | 'in-progress' | 'to-do';
}

interface FunnelStageProps {
  name: string;
  value: string;
  percentage: number;
  isBottleneck?: boolean;
}

// 统计卡片组件
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  target,
  progress,
  trend,
  isPositive,
  subtitle,
  icon: Icon
}) => (
  <Card className="relative group">
    <CardContent className="p-5">
      <button
        className="absolute top-4 right-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`查看${title}详情`}
      >
        <Eye className="w-4 h-4" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium mb-2">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>

      <div className="flex justify-between items-baseline mb-2">
        <p className="text-3xl font-bold text-[var(--text-primary)]">{value} / {target}</p>
        {subtitle && <p className="text-xs text-[var(--text-tertiary)]">{subtitle}</p>}
      </div>

      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center text-sm">
        <div className={`flex items-center font-semibold ${isPositive ? 'text-[var(--success-color)]' : 'text-red-600'}`}>
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
        <p className="text-[var(--text-secondary)] ml-1.5"> | 预测达成率: {Math.round(progress * 1.1)}%</p>
      </div>
    </CardContent>
  </Card>
);

// 树状图节点组件
const TreeNode: React.FC<TreeNodeProps> = ({ label, children, level = 0 }) => (
  <div className={`relative ${level > 0 ? 'ml-6 mt-2' : ''}`}>
    {level > 0 && (
      <>
        <div className="absolute -left-6 top-3 w-4 h-px bg-[var(--border-primary)]" />
        <div className="absolute -left-6 -top-2 w-px h-5 bg-[var(--border-primary)]" />
      </>
    )}
    <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md p-2 inline-block">
      <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
    </div>
    {children && (
      <div className="mt-2">
        {children.map((child, index) => (
          <TreeNode key={index} {...child} level={level + 1} />
        ))}
      </div>
    )}
  </div>
);

// 甘特图任务条组件
const GanttTask: React.FC<GanttTaskProps> = ({ name, startWeek, duration, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'bg-[var(--success-color)]';
      case 'in-progress': return 'bg-[var(--warning-color)]';
      case 'to-do': return 'bg-[var(--border-primary)]';
    }
  };

  const leftPercentage = (startWeek / 6) * 100;
  const widthPercentage = (duration / 6) * 100;

  return (
    <div className="relative flex items-center mb-2 h-6">
      <span className="w-24 text-xs text-[var(--text-primary)] truncate">{name}</span>
      <div className="flex-1 relative ml-2">
        <div
          className={`absolute h-4 rounded-sm ${getStatusColor()}`}
          style={{ left: `${leftPercentage}%`, width: `${widthPercentage}%` }}
        />
      </div>
      <div className={`w-3 h-3 rounded-full ml-2 ${getStatusColor()}`} />
    </div>
  );
};

// 漏斗阶段组件
const FunnelStage: React.FC<FunnelStageProps> = ({ name, value, percentage, isBottleneck }) => (
  <div
    className={`relative py-2 px-4 text-white text-sm flex justify-between items-center ${
      isBottleneck ? 'bg-yellow-500' : 'bg-[var(--primary-color)]'
    }`}
    style={{ width: `${percentage}%`, margin: '0 auto 2px' }}
  >
    <span>{name}</span>
    <span>{value}</span>
  </div>
);

// 示例数据
const goalsData = [
  {
    title: '总GMV (Q2)',
    value: '¥1.2M',
    target: '¥2.0M',
    progress: 60,
    trend: '+15%',
    isPositive: true,
    subtitle: '占总销售额 35%',
    icon: Target
  },
  {
    title: '用户增长率 (Q2)',
    value: '25,000',
    target: '30,000',
    progress: 83,
    trend: '+8%',
    isPositive: true,
    icon: Users
  },
  {
    title: '品牌声量 (Q2)',
    value: '8.5k',
    target: '10k',
    progress: 85,
    trend: '+22%',
    isPositive: true,
    icon: MessageSquare
  }
];

const treeData: TreeNodeProps = {
  label: 'Q2 GMV 增长 20%',
  children: [
    {
      label: '官网销售额提升 15%',
      children: [
        { label: '优化着陆页转化率' },
        { label: '启动EDM营销活动' }
      ]
    },
    {
      label: '小程序销售额提升 30%',
      children: [
        { label: '上线社交裂变功能' },
        { label: 'KOL合作推广' }
      ]
    }
  ]
};

const ganttTasks: GanttTaskProps[] = [
  { name: '优化着陆页', startWeek: 0, duration: 2, status: 'complete' },
  { name: 'EDM营销', startWeek: 1, duration: 3, status: 'in-progress' },
  { name: '社交裂变', startWeek: 2, duration: 3, status: 'to-do' },
  { name: 'KOL合作', startWeek: 4, duration: 2, status: 'to-do' }
];

const funnelStages: FunnelStageProps[] = [
  { name: '获客 (Acquisition)', value: '100%', percentage: 100 },
  { name: '激活 (Activation)', value: '35%', percentage: 90, isBottleneck: true },
  { name: '留存 (Retention)', value: '60%', percentage: 80 },
  { name: '收益 (Revenue)', value: '20%', percentage: 70 },
  { name: '推荐 (Referral)', value: '5%', percentage: 60 }
];

const StrategicPlanningMarketingGoalDecompositionPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="营销目标拆解与策略规划"
      description="通过AI智能分析，系统化拆解营销目标，制定科学的执行策略与时间计划"
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '营销目标拆解与策略规划', href: '/strategic-planning-marketing-goal-decomposition', current: true }
      ]}
    >
      {/* 年度/季度营销目标概览 */}
      <Card>
        <CardHeader className="border-b border-[var(--border-secondary)]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">年度/季度营销目标概览</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FolderOpen className="w-4 h-4 mr-1" />
                查看所有目标
              </Button>
              <Button size="sm" className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                <Plus className="w-4 h-4 mr-1" />
                新建营销目标
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalsData.map((goal, index) => (
              <StatCard key={index} {...goal} />
            ))}
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <strong className="text-blue-600">AI建议：</strong>
              <span className="text-blue-600">当前季度社交媒体曝光目标可提升15%，以匹配近期的市场热度。</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* 营销目标拆解工作台 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-[var(--border-secondary)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">营销目标拆解工作台</CardTitle>
                <Button size="sm" className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                  <Zap className="w-4 h-4 mr-1" />
                  AI智能生成路径
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  拆解子目标
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  分配负责人 / 创建飞书任务
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-4">目标分解树状图</h4>
                  <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                    <TreeNode {...treeData} />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-4">关键行动甘特图</h4>
                  <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                    <div className="grid grid-cols-6 gap-1 text-xs text-[var(--text-tertiary)] text-center mb-2">
                      <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span>
                    </div>
                    {ganttTasks.map((task, index) => (
                      <GanttTask key={index} {...task} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AARRR增长模型分析 */}
        <Card>
          <CardHeader className="border-b border-[var(--border-secondary)]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">AARRR增长模型分析</CardTitle>
              <Button variant="ghost" size="sm">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mb-4">
              {funnelStages.map((stage, index) => (
                <FunnelStage key={index} {...stage} />
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-yellow-600">AI洞察：</strong>
                <span className="text-yellow-600 text-sm">用户激活率低于行业均值，建议优化首次互动引导语。</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                查看详细数据
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                发起优化策略讨论
              </Button>
              <Button size="sm" className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                应用AI优化方案
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 营销策略制定与评估 */}
      <Card className="mt-6">
        <CardHeader className="border-b border-[var(--border-secondary)]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">营销策略制定与评估</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                新建策略 / 选择模板
              </Button>
              <Button size="sm" className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                <Zap className="w-4 h-4 mr-1" />
                AI生成策略草案
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">策略画布：Q3社交媒体推广</h4>
              <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="market-position" className="text-xs text-[var(--text-secondary)]">市场定位</Label>
                    <Input id="market-position" defaultValue="年轻人的潮流数码社区" className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="target-audience" className="text-xs text-[var(--text-secondary)]">目标客群</Label>
                    <Input id="target-audience" defaultValue="18-25岁，科技爱好者" className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="product" className="text-xs text-[var(--text-secondary)]">产品 (Product)</Label>
                    <Input id="product" defaultValue="新款TWS耳机" className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-xs text-[var(--text-secondary)]">价格 (Price)</Label>
                    <Input id="price" defaultValue="首发优惠价¥399" className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="place" className="text-xs text-[var(--text-secondary)]">渠道 (Place)</Label>
                    <Input id="place" defaultValue="抖音、B站、小红书" className="mt-1 bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="promotion" className="text-xs text-[var(--text-secondary)]">推广 (Promotion)</Label>
                    <Input id="promotion" defaultValue="KOL评测、信息流广告" className="mt-1 bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">ROI预测对比</h4>
              <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <span className="w-24 text-sm text-[var(--text-primary)] flex-shrink-0">策略A: KOL</span>
                    <div className="flex-1 relative">
                      <div className="w-full bg-[var(--border-secondary)] rounded h-6 overflow-hidden">
                        <div className="bg-[var(--accent-color)] h-full flex items-center justify-end px-2 text-white text-xs font-medium" style={{width: '75%'}}>
                          150%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm text-[var(--text-primary)] flex-shrink-0">策略B: 信息流</span>
                    <div className="flex-1 relative">
                      <div className="w-full bg-[var(--border-secondary)] rounded h-6 overflow-hidden">
                        <div className="bg-[var(--accent-color)] h-full flex items-center justify-end px-2 text-white text-xs font-medium" style={{width: '55%'}}>
                          110%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-green-600">AI评估：</strong>
                    <span className="text-green-600 text-sm">此社交媒体营销策略预计ROI为150%，但存在舆情风险。</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[var(--border-secondary)]">
            <Button variant="outline">
              评估策略可行性
            </Button>
            <Button className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
              <Play className="w-4 h-4 mr-1" />
              发布策略 / 提交审批
            </Button>
          </div>
        </CardContent>
      </Card>

    </ToolPageLayout>
  );
};

export default StrategicPlanningMarketingGoalDecompositionPage;