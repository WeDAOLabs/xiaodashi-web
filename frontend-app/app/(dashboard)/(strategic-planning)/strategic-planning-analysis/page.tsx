'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis } from 'recharts';
import {
  Eye,
  Download,
  RefreshCw,
  Plus,
  AlertTriangle,
  Settings,
  Edit,
  Target,
  Grid,
  Play
} from 'lucide-react';

// 类型定义
interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  subtitle: string;
  color?: string;
}

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface SwotItemProps {
  text: string;
}

// 圆形进度图组件 - 基于shadcn Chart和Recharts PieChart实现
const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  label,
  subtitle,
  color = 'var(--primary-color)'
}) => {
  const percentage = Math.round((value / max) * 100);

  // 适用于PieChart的数据格式
  const chartData = [
    { name: 'progress', value: percentage, fill: color },
    { name: 'remaining', value: 100 - percentage, fill: 'hsl(var(--muted))' }
  ];

  const chartConfig: ChartConfig = {
    progress: {
      label: label,
      color: color,
    },
    remaining: {
      label: '剩余',
      color: 'hsl(var(--muted))',
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={45}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-[var(--text-primary)]">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="mt-2 font-semibold text-[var(--text-primary)] text-center">
        {label}
      </p>
      <p className="text-sm text-[var(--text-secondary)] text-center">
        {subtitle}
      </p>
    </div>
  );
};

// 水平柱状图组件 - 基于shadcn Chart和Recharts BarChart实现
const HorizontalBarChart: React.FC<{ data: BarData[] }> = ({ data }) => {
  const chartConfig: ChartConfig = {
    value: {
      label: '热度',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-[200px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 5, right: 5, left: 40, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            hide
          />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            width={35}
          />
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))"
            radius={[0, 2, 2, 0]}
            className="transition-all duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 雷达图组件 - 基于shadcn Chart和Recharts RadarChart实现
const RadarChart: React.FC<{ strokeColor?: string; fillColor?: string }> = ({
  strokeColor = 'hsl(var(--primary))',
  fillColor = 'hsl(var(--primary))'
}) => {
  // PESTEL分析数据
  const radarData = [
    { subject: '政治', value: 8, fullMark: 10 },
    { subject: '经济', value: 7, fullMark: 10 },
    { subject: '社会', value: 6, fullMark: 10 },
    { subject: '技术', value: 9, fullMark: 10 },
    { subject: '环境', value: 5, fullMark: 10 },
    { subject: '法律', value: 7, fullMark: 10 },
  ];

  const chartConfig: ChartConfig = {
    value: {
      label: '影响指数',
      color: fillColor,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <PolarGrid
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Radar
            name="PESTEL分析"
            dataKey="value"
            stroke={strokeColor}
            fill={fillColor}
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: strokeColor, strokeWidth: 2, r: 3 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// SWOT项目组件
const SwotItem: React.FC<SwotItemProps> = ({ text }) => (
  <li className="flex items-start">
    <span className="mr-2 mt-1 block h-1.5 w-1.5 rounded-full bg-current flex-shrink-0"></span>
    <span>{text}</span>
  </li>
);

// 示例数据
const strategicGoalsData = [
  { value: 18, max: 20, label: '年度营收增长率', subtitle: '18% / 20%' },
  { value: 12, max: 15, label: '市场份额', subtitle: '12% / 15%' },
  { value: 92, max: 95, label: '客户满意度', subtitle: '92% / 95%' },
];

const hotTopicsData = [
  { label: 'AI+', value: 95, color: 'var(--primary-light)' },
  { label: '新能源', value: 82, color: 'var(--primary-light)' },
  { label: '数字孪生', value: 76, color: 'var(--primary-light)' },
  { label: '元宇宙', value: 65, color: 'var(--primary-light)' },
  { label: '碳中和', value: 58, color: 'var(--primary-light)' },
];

const StrategicPlanningAnalysisPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="战略制定和宏观分析"
      description="通过AI深度分析宏观环境与竞争态势，制定科学的战略目标与发展规划"
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '战略制定和宏观分析', href: '/strategic-planning-analysis', current: true }
      ]}
    >
      {/* 战略目标设定与概览 */}
      <Card>
        <CardHeader className="border-b border-[var(--border-secondary)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">战略目标设定与概览</CardTitle>
              <button className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]" aria-label="查看帮助">
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
            <CardAction>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-[var(--text-secondary)]">
                  查看所有目标
                </Button>
                <Button size="sm" className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                  <Plus className="w-4 h-4 mr-1" />
                  设定新目标
                </Button>
              </div>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {strategicGoalsData.map((goal, index) => (
              <CircularProgress
                key={index}
                value={goal.value}
                max={goal.max}
                label={goal.label}
                subtitle={goal.subtitle}
                color="var(--primary-color)"
              />
            ))}

            {/* AI预测卡片 */}
            <div className="bg-[var(--info-bg)] border border-[var(--info-border)] rounded-lg p-4 flex flex-col items-center justify-center text-center">
              <Target className="h-8 w-8 text-[var(--info-color)] mb-2" />
              <p className="text-sm font-semibold text-[var(--info-color)]">
                AI预测：按当前趋势，本季度GMV将超额完成5%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* PESTEL分析 */}
        <Card>
          <CardHeader className="border-b border-[var(--border-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">AI驱动的宏观环境PESTEL分析</CardTitle>
                <button className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
              <CardAction>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    AI分析报告
                  </Button>
                </div>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 text-center">影响力与趋势</h4>
                <div className="flex-grow flex items-center justify-center">
                  <RadarChart />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 text-center">热门概念热度排行</h4>
                <div className="flex-grow">
                  <HorizontalBarChart data={hotTopicsData} />
                </div>
                <div className="mt-4 bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded-lg p-3 flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-[var(--warning-color)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--warning-color)] font-medium">
                    AI预警：某环保政策或将影响供应链成本
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SWOT分析 */}
        <Card>
          <CardHeader className="border-b border-[var(--border-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">AI智能SWOT分析</CardTitle>
                <button className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
              <CardAction>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button size="sm" className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                    <Target className="w-4 h-4 mr-1" />
                    生成行动建议
                  </Button>
                </div>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-[var(--success-bg)]">
                <h4 className="font-bold text-md text-[var(--success-color)] mb-2">优势 (Strengths)</h4>
                <ul className="space-y-1.5 text-sm text-[var(--text-primary)]">
                  <SwotItem text="强大的品牌认知度" />
                  <SwotItem text="领先的技术平台" />
                  <SwotItem text="经验丰富的管理团队" />
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-[var(--warning-bg)]">
                <h4 className="font-bold text-md text-[var(--warning-color)] mb-2">劣势 (Weaknesses)</h4>
                <ul className="space-y-1.5 text-sm text-[var(--text-primary)]">
                  <SwotItem text="供应链依赖单一供应商" />
                  <SwotItem text="高昂的运营成本" />
                  <SwotItem text="在新兴市场渗透率低" />
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-[var(--success-bg)]">
                <h4 className="font-bold text-md text-[var(--success-color)] mb-2">机会 (Opportunities)</h4>
                <ul className="space-y-1.5 text-sm text-[var(--text-primary)]">
                  <SwotItem text="进入亚洲市场的潜力" />
                  <SwotItem text="与战略伙伴合作开发新产品" />
                  <SwotItem text="利用AI提升运营效率" />
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-[var(--warning-bg)]">
                <h4 className="font-bold text-md text-[var(--warning-color)] mb-2">威胁 (Threats)</h4>
                <ul className="space-y-1.5 text-sm text-[var(--text-primary)]">
                  <SwotItem text="来自新兴创业公司的激烈竞争" />
                  <SwotItem text="全球经济衰退风险" />
                  <SwotItem text="数据安全法规收紧" />
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* 波特五力模型分析 */}
        <Card>
          <CardHeader className="border-b border-[var(--border-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">行业竞争分析（波特五力模型）</CardTitle>
                <button className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
              <CardAction>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  管理监测竞品
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 text-center">竞争力强度</h4>
                <div className="flex-grow flex items-center justify-center">
                  <RadarChart strokeColor="#0077ed" fillColor="#0077ed" />
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">核心竞品</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-[var(--bg-tertiary)] p-2 rounded-md">
                      <span className="text-sm font-medium">竞品A</span>
                      <span className="text-sm text-[var(--text-secondary)] font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between items-center bg-[var(--bg-tertiary)] p-2 rounded-md">
                      <span className="text-sm font-medium">竞品B</span>
                      <span className="text-sm text-[var(--text-secondary)] font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center bg-[var(--bg-tertiary)] p-2 rounded-md">
                      <span className="text-sm font-medium">竞品C</span>
                      <span className="text-sm text-[var(--text-secondary)] font-semibold">19%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--info-bg)] border border-[var(--info-border)] rounded-lg p-3 flex items-start space-x-2">
                  <Target className="h-5 w-5 text-[var(--info-color)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--info-color)] font-medium">
                    AI洞察：新兴市场进入者威胁上升，建议启动&apos;细分市场进入&apos;战略推演
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 商业模式画布 */}
        <Card>
          <CardHeader className="border-b border-[var(--border-secondary)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">商业模式画布 / 增长模型推演</CardTitle>
                <button className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
              <CardAction>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Grid className="w-4 h-4 mr-1" />
                    选择模板
                  </Button>
                  <Button size="sm" className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)]">
                    <Play className="w-4 h-4 mr-1" />
                    启动模拟推演
                  </Button>
                </div>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 grid-rows-3 gap-2 min-h-[300px]">
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-2">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">关键合作伙伴</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">供应商...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-1">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">核心活动</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">生产, 营销...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-2">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">价值主张</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">为客户创造...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-1">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">客户关系</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">社群, 客服...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-2">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">客户细分</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">目标用户...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-1">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">核心资源</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">团队, 专利...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-1 row-span-1">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">渠道通路</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">线上, 线下...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-2 row-span-1">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">成本结构</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">固定/可变成本...</p>
              </div>
              <div className="bg-[var(--bg-tertiary)] p-2 rounded-md border border-[var(--border-secondary)] text-center flex flex-col justify-center col-span-3 row-span-1">
                <h5 className="text-xs font-bold text-[var(--text-primary)]">盈利模式</h5>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">订阅, 销售...</p>
              </div>
            </div>
            <div className="mt-4 bg-[var(--info-bg)] border border-[var(--info-border)] rounded-lg p-3 flex items-start space-x-2">
              <Target className="h-5 w-5 text-[var(--info-color)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--info-color)] font-medium">
                AI建议：您的价值主张与客户细分匹配度较高，但盈利模式存在单一风险
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 刷新按钮 */}
      <div className="flex justify-end mt-4">
        <Button variant="ghost" size="sm" className="text-[var(--text-secondary)]">
          <RefreshCw className="w-4 h-4 mr-1" />
          刷新数据
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default StrategicPlanningAnalysisPage;