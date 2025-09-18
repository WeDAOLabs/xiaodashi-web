'use client';

import React from 'react';
import Image from 'next/image';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  ChevronRight,
  Upload,
  FileText,
  Edit,
  Copy,
  ChevronDown,
  ChevronLeft,
  XCircle,
  MessageSquare,
  Brain,
  Target,
  Shield
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

// 类型定义
interface AgentRatingCardProps {
  avatar: string | null;
  name: string;
  type: string;
  rating: number;
  metrics: {
    professional: number;
    efficiency: number;
    satisfaction: number;
  };
  suggestion: string;
  bgColor: string;
  borderColor: string;
}

interface DialogueRecordProps {
  id: string;
  customerName: string;
  customerAvatar: string;
  agentName: string;
  agentType: 'ai' | 'human';
  conversationType: string;
  duration: string;
  dateTime: string;
  rating: number;
  metrics: {
    professional: number;
    efficiency: number;
    satisfaction: number;
  };
  isHighlighted?: boolean;
}

interface FilterSectionProps {
  className?: string;
}

interface EvaluationStandardProps {
  name: string;
  description: string;
  weight: number;
}

// 星级评分组件
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const halfStarOpacity = rating % 1; // 更精确的透明度计算

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const getStarProps = (index: number) => {
    const baseClass = sizeClasses[size];

    if (index < fullStars) {
      // 满星
      return {
        className: `${baseClass} text-[var(--color-warning-600)] fill-current`,
        style: {}
      };
    } else if (index === fullStars && hasHalfStar) {
      // 半星 - 使用内联样式实现精确透明度
      const opacity = Math.max(0.3, halfStarOpacity); // 最小透明度0.3，避免过淡
      return {
        className: `${baseClass} text-[var(--color-warning-600)] fill-current`,
        style: { opacity }
      };
    } else {
      // 空星
      return {
        className: `${baseClass} text-[var(--text-tertiary)] fill-current`,
        style: {}
      };
    }
  };

  return (
    <div className="flex items-center" role="img" aria-label={`评分 ${rating.toFixed(1)} 分，共5分`}>
      {Array.from({ length: 5 }, (_, i) => {
        const starProps = getStarProps(i);
        return (
          <Star
            key={i}
            className={starProps.className}
            style={starProps.style}
            aria-hidden="true"
          />
        );
      })}
      <span className="ml-2 font-bold text-base" aria-label={`${rating.toFixed(1)}分`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// 筛选器组件
const FilterSection: React.FC<FilterSectionProps> = ({ className }) => (
  <Card className={className}>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-[var(--text-secondary)]">时间范围</label>
          <div className="mt-1 flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded-md text-sm">
            <span>近30天</span>
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)]">评分范围</label>
          <div className="mt-1 flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded-md text-sm">
            <span>全部评分</span>
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)]">质检数量配置</label>
          <div className="mt-1 flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded-md text-sm">
            <span>每日自动质检 50 条</span>
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)]">关键词搜索</label>
          <input
            type="text"
            placeholder="搜索对话内容..."
            className="mt-1 w-full bg-[var(--bg-secondary)] p-2 rounded-md text-sm placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]"
          />
        </div>
      </div>
      <div className="flex justify-end items-center space-x-3 mt-4">
        <Button variant="outline" className="text-sm">重置筛选</Button>
        <Button className="text-sm bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">应用筛选</Button>
        <Button className="text-sm bg-[var(--color-info-600)] hover:bg-blue-700">下载记录</Button>
      </div>
    </CardContent>
  </Card>
);

// 人员评分卡片组件
const AgentRatingCard: React.FC<AgentRatingCardProps> = ({
  avatar,
  name,
  type,
  rating,
  metrics,
  suggestion,
  bgColor,
  borderColor
}) => (
  <div className={`flex-shrink-0 w-72 p-4 rounded-xl border relative ${bgColor} ${borderColor}`}>
    <div className="flex items-center">
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 bg-blue-100 text-[var(--color-primary-500)] rounded-full flex items-center justify-center font-bold text-lg">
          智
        </div>
      )}
      <div className="ml-3">
        <p className="font-bold text-[var(--text-primary)]">{name}</p>
        <p className="text-xs text-[var(--text-secondary)]">{type}</p>
      </div>
    </div>
    <div className="text-center my-3">
      <p className="text-5xl font-bold">{rating.toFixed(1)}</p>
      <div className="flex justify-center mt-1">
        <StarRating rating={rating} size="lg" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <span className="w-20 text-[var(--text-secondary)]">专业性</span>
        <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5 mx-2">
          <div
            className="h-1.5 rounded-full bg-[var(--color-primary-500)]"
            style={{ width: `${(metrics.professional / 5) * 100}%` }}
          />
        </div>
        <span className="w-6 font-medium">{metrics.professional.toFixed(1)}</span>
      </div>
      <div className="flex items-center text-sm">
        <span className="w-20 text-[var(--text-secondary)]">解决效率</span>
        <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5 mx-2">
          <div
            className="h-1.5 rounded-full bg-[var(--color-success-600)]"
            style={{ width: `${(metrics.efficiency / 5) * 100}%` }}
          />
        </div>
        <span className="w-6 font-medium">{metrics.efficiency.toFixed(1)}</span>
      </div>
      <div className="flex items-center text-sm">
        <span className="w-20 text-[var(--text-secondary)]">客户满意度</span>
        <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-1.5 mx-2">
          <div
            className="h-1.5 rounded-full bg-[var(--color-info-600)]"
            style={{ width: `${(metrics.satisfaction / 5) * 100}%` }}
          />
        </div>
        <span className="w-6 font-medium">{metrics.satisfaction.toFixed(1)}</span>
      </div>
    </div>
    <div className="mt-3 bg-white/70 p-2 rounded-md text-xs text-[var(--text-secondary)]">
      <span className="font-semibold">改进建议: </span>
      <span>{suggestion}</span>
    </div>
  </div>
);

// 对话记录行组件
const DialogueRecordRow: React.FC<DialogueRecordProps> = ({
  id,
  customerName,
  customerAvatar,
  agentName,
  agentType,
  conversationType,
  duration,
  dateTime,
  rating,
  metrics,
  isHighlighted = false
}) => (
  <tr className={`border-b border-[var(--border-secondary)] ${isHighlighted ? 'bg-red-50' : 'bg-white hover:bg-[var(--bg-secondary)]'} transition-colors`}>
    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{id}</td>
    <td className="px-4 py-3">
      <div className="flex items-center">
        <Image
          src={customerAvatar}
          alt={customerName}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 font-medium">{customerName}</span>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center">
        {agentType === 'ai' ? (
          <div className="w-7 h-7 bg-[var(--color-primary-50)] text-[var(--color-primary-600)] rounded-full flex items-center justify-center font-bold text-xs">
            智
          </div>
        ) : (
          <Image
            src="/images/conversation-qa/agent-avatar.jpg"
            alt={agentName}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover"
          />
        )}
        <span className="ml-2">{agentName}</span>
      </div>
    </td>
    <td className="px-4 py-3">
      <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        conversationType === '产品咨询' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' :
        conversationType === '投诉建议' ? 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]' :
        'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
      }`}>
        {conversationType}
      </Badge>
    </td>
    <td className="px-4 py-3">{duration}</td>
    <td className="px-4 py-3">{dateTime}</td>
    <td className="px-4 py-3">
      <div className="flex items-center">
        <StarRating rating={rating} size="sm" />
      </div>
      <div className="text-xs text-[var(--text-secondary)] mt-1">
        专业性: {metrics.professional.toFixed(1)} | 解决效率: {metrics.efficiency.toFixed(1)} | 满意度: {metrics.satisfaction.toFixed(1)}
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center space-x-2">
        <button className="p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] rounded">
          <Copy className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] rounded">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

// 评分标准组件
const EvaluationStandard: React.FC<EvaluationStandardProps> = ({ name, description, weight }) => (
  <div>
    <h4 className="font-semibold text-[var(--text-primary)]">{name}</h4>
    <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
    <div className="mt-2">
      <label className="text-xs font-medium">权重</label>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
        <div
          className="bg-blue-600 h-1.5 rounded-full"
          style={{ width: `${weight}%` }}
        />
      </div>
    </div>
  </div>
);

// 主页面组件
const ConversationQAPage: React.FC = () => {
  // 图表数据
  const chartData = [
    { month: '1月', aiScore: 4.2, humanScore: 3.8 },
    { month: '2月', aiScore: 4.3, humanScore: 3.9 },
    { month: '3月', aiScore: 4.1, humanScore: 4.1 },
    { month: '4月', aiScore: 4.5, humanScore: 4.0 },
    { month: '5月', aiScore: 4.4, humanScore: 4.2 },
    { month: '6月', aiScore: 4.6, humanScore: 4.1 }
  ];

  const chartConfig = {
    aiScore: {
      label: 'AI评分',
      color: 'var(--color-primary-500)'
    },
    humanScore: {
      label: '人工评分',
      color: 'var(--color-success-600)'
    }
  };

  // 模拟数据
  const agentRatings = [
    {
      avatar: null,
      name: '智赢助手A',
      type: '智能客服',
      rating: 4.8,
      metrics: { professional: 4.9, efficiency: 4.7, satisfaction: 4.8 },
      suggestion: '在处理复杂问题时，可适当增加主动询问频率',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      avatar: '/images/conversation-qa/agent-human.jpg',
      name: '张明',
      type: '人工销售',
      rating: 4.2,
      metrics: { professional: 4.5, efficiency: 3.8, satisfaction: 4.0 },
      suggestion: '提高首次解决率，减少客户等待转接次数',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      avatar: null,
      name: '智赢助手B',
      type: '智能客服',
      rating: 4.0,
      metrics: { professional: 3.9, efficiency: 4.2, satisfaction: 4.1 },
      suggestion: '产品功能解释需更准确，避免误导客户',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const dialogueRecords: DialogueRecordProps[] = [
    {
      id: 'CS-202306-8745',
      customerName: '李小明',
      customerAvatar: '/images/conversation-qa/customer-1.jpg',
      agentName: '智赢助手A',
      agentType: 'ai',
      conversationType: '产品咨询',
      duration: '5分23秒',
      dateTime: '2023-06-15 14:23',
      rating: 5.0,
      metrics: { professional: 5.0, efficiency: 5.0, satisfaction: 5.0 }
    },
    {
      id: 'CS-202306-8743',
      customerName: '王建国',
      customerAvatar: '/images/conversation-qa/customer-2.jpg',
      agentName: '智赢助手B',
      agentType: 'ai',
      conversationType: '投诉建议',
      duration: '12分15秒',
      dateTime: '2023-06-15 13:58',
      rating: 2.0,
      metrics: { professional: 2.5, efficiency: 1.5, satisfaction: 2.0 },
      isHighlighted: true
    }
  ];

  const evaluationStandards: EvaluationStandardProps[] = [
    { name: '专业性', description: '销售话术的专业程度与产品知识掌握情况', weight: 30 },
    { name: '解决效率', description: '问题解决速度与一次性解决率', weight: 25 },
    { name: '客户满意度', description: '客户情绪反馈与问题解决满意度', weight: 25 },
    { name: '话术合规性', description: '是否符合公司话术规范与法律法规要求', weight: 20 }
  ];

  return (
    <ToolPageLayout
      title="对话质检与优化"
      description="全面评估智能与人工销售对话质量，驱动沟通效率与转化率提升"
      breadcrumbs={[
        { label: '智能销售赋能', href: '#' },
        { label: '对话质检与优化', href: '/sales-intelligent-conversation-qa', current: true }
      ]}
    >
      {/* 筛选器区域 */}
      <FilterSection />

      {/* 人员评分统计 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">按人员评分统计</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
            {agentRatings.map((agent, index) => (
              <AgentRatingCard key={index} {...agent} />
            ))}
            <div className="flex-shrink-0 w-72 p-4 rounded-xl border border-dashed flex items-center justify-center">
              <button className="text-[var(--color-primary-500)] font-medium hover:underline">
                查看全部人员评分
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 对话记录列表 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-secondary)]">
                <tr>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">对话ID</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">客户名称</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">销售员</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">类型</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">时长</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">日期时间</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">评分结果</th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {dialogueRecords.map((record) => (
                  <DialogueRecordRow key={record.id} {...record} />
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="flex justify-between items-center mt-4 text-sm text-[var(--text-secondary)]">
            <p>显示 1 到 2 条, 共 128 条</p>
            <div className="flex items-center">
              <button className="p-2 rounded-md hover:bg-[var(--bg-secondary)] disabled:opacity-50" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 rounded-md bg-[var(--color-primary-500)] text-white font-semibold">1</button>
              <button className="w-8 h-8 rounded-md hover:bg-[var(--bg-secondary)]">2</button>
              <button className="w-8 h-8 rounded-md hover:bg-[var(--bg-secondary)]">3</button>
              <span className="mx-2">...</span>
              <button className="w-8 h-8 rounded-md hover:bg-[var(--bg-secondary)]">26</button>
              <button className="p-2 rounded-md hover:bg-[var(--bg-secondary)]">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 评分设置和报告 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">对话评分设置</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">自定义评分标准</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">设置多维度评分标准与权重</p>
              <div className="space-y-5 border-t pt-4">
                {evaluationStandards.map((standard, index) => (
                  <EvaluationStandard key={index} {...standard} />
                ))}
                <button className="text-sm text-[var(--color-primary-500)] hover:underline">
                  + 添加评分维度
                </button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[var(--text-primary)]">评分报告</h3>
                <div className="flex items-center space-x-1 bg-[var(--bg-secondary)] p-1 rounded-md text-sm">
                  <button className="px-2 py-0.5 rounded">本周</button>
                  <button className="px-2 py-0.5 rounded bg-white shadow text-[var(--color-primary-500)] font-medium">本月</button>
                  <button className="px-2 py-0.5 rounded">本季度</button>
                </div>
              </div>
              <h4 className="font-medium text-sm mb-2">总体评分趋势</h4>
              <ChartContainer config={chartConfig} className="h-40 w-full">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    domain={[3.5, 5.0]}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="aiScore"
                    stroke="var(--color-primary-500)"
                    strokeWidth={2.5}
                    dot={{ fill: 'var(--color-primary-500)', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humanScore"
                    stroke="var(--color-success-600)"
                    strokeWidth={2.5}
                    dot={{ fill: 'var(--color-success-600)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
              <div className="flex justify-end items-center -mt-2 text-sm space-x-4">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-[var(--color-primary-500)] rounded-full mr-2"></span>
                  AI评分
                </div>
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-[var(--color-success-600)] rounded-full mr-2"></span>
                  人工评分
                </div>
              </div>

              {/* 低分对话筛选 */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">低分对话筛选</h4>
                  <button className="text-xs text-[var(--color-primary-600)] hover:underline">设置阈值</button>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 rounded-md border-l-4 bg-red-50 border-red-400">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">CS-202306-8743 (王建国)</span>
                      <div className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        2.0
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">主要问题：产品功能解释不准确，客户情绪管理不当</p>
                  </div>
                  <div className="p-2 rounded-md border-l-4 bg-orange-50 border-orange-400">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">CS-202306-8739 (张伟)</span>
                      <div className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        3.0
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">主要问题：解决效率低，需多次转接</p>
                  </div>
                  <div className="p-2 rounded-md border-l-4 bg-yellow-50 border-yellow-400">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-[var(--text-primary)]">CS-202306-8732 (刘芳)</span>
                      <div className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        3.2
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">主要问题：话术合规性不足，提及竞品敏感信息</p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button className="text-sm text-[var(--color-primary-500)] hover:underline">查看全部低分对话</button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 对话上传和AI分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">对话上传入口</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">上传人工对话记录，进行AI深度分析</p>
            <div className="border-2 border-dashed border-[var(--border-primary)] rounded-xl p-8 text-center bg-[var(--bg-secondary)]">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                <Upload className="h-6 w-6 text-[var(--color-primary-500)]" />
              </div>
              <p className="mt-4 text-[var(--text-primary)] font-semibold">拖放文件到此处或点击上传</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">支持 .txt, .docx, .pdf, .mp3, .wav 格式文件</p>
              <Button className="mt-4 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
                选择文件
              </Button>
            </div>
            <div className="mt-4 text-sm text-[var(--text-secondary)] space-y-2">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">上传说明</h3>
              <p>① 语音文件将自动转为文本进行分析</p>
              <p>② 单个文件大小不超过20MB</p>
              <p>③ 支持批量上传，最多同时上传10个文件</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">AI智能分析结果</h2>
              <Badge className="bg-[var(--color-success-50)] text-[var(--color-success-600)] text-sm font-semibold px-3 py-1 rounded-full">
                分析完成
              </Badge>
            </div>
            <div className="bg-[var(--bg-secondary)] p-3 rounded-lg flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-[var(--color-success-600)] mr-2" />
                <span>销售对话记录_20230615.docx</span>
              </div>
              <button className="text-[var(--color-primary-500)] font-semibold hover:underline">更换</button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-6 items-start">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 mr-1 text-[var(--color-primary-500)]" />
                  情绪识别
                </h4>
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl font-bold">70%</span>
                      <span className="text-sm text-[var(--text-secondary)] block">积极</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center justify-center">
                  <Target className="w-4 h-4 mr-1 text-[var(--color-success-600)]" />
                  问题解决率
                </h4>
                <p className="text-3xl font-bold">85%</p>
                <div className="h-10 -mx-4 mt-2">
                  <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full">
                    <div className="h-2 bg-[var(--color-primary-500)] rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-1 text-[var(--color-warning-600)]" />
                  话术合规性
                </h4>
                <p className="text-3xl font-bold">88%</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">发现2处潜在合规风险</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-1 text-[var(--color-primary-500)]" />
                关键词提取
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="text-sm px-3 py-1 rounded-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                  价格政策
                </Badge>
                <Badge className="text-sm px-3 py-1 rounded-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                  售后服务
                </Badge>
                <Badge className="text-sm px-3 py-1 rounded-full bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100">
                  产品功能
                </Badge>
                <Badge className="text-sm px-3 py-1 rounded-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100">
                  合同条款
                </Badge>
                <Badge className="text-sm px-3 py-1 rounded-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  技术支持
                </Badge>
                <Badge className="text-sm px-3 py-1 rounded-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                  竞品比较
                </Badge>
                <Badge className="text-sm px-3 py-1 rounded-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                  退款政策
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-2">AI分析报告</h4>
              <p className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-3 rounded-md">
                对话中客户主要关注价格政策和售后服务，情绪整体积极。发现2处潜在合规风险：1) 对退款政策的描述不准确；2) 与竞品比较时使用了绝对化用语。问题解决率85%，建议加强对产品价格政策和退款条款的培训。
              </p>
              <button className="text-sm text-[var(--color-primary-500)] hover:underline mt-2">
                查看完整分析报告 →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI评分与改进建议 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">AI评分与改进建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">AI自动评分</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">根据预设评分标准自动评分</p>
              <div className="text-center bg-[var(--bg-secondary)] p-4 rounded-lg">
                <p className="text-sm text-[var(--text-secondary)]">总体评分</p>
                <p className="text-6xl font-bold text-[var(--color-primary-500)] my-2">4.2</p>
                <div className="flex justify-center">
                  <StarRating rating={4.2} size="lg" />
                </div>
              </div>
              <div className="space-y-4 mt-4">
                {evaluationStandards.map((standard, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{standard.name}</span>
                      <span className="font-medium">{(4.2 + index * 0.1).toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[var(--color-primary-500)] h-2 rounded-full"
                        style={{ width: `${((4.2 + index * 0.1) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">改进意见与优化</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">针对低分对话提供具体改进建议</p>
              <div className="space-y-5 border-t border-[var(--border-primary)] pt-4">
                <div>
                  <h4 className="font-semibold flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
                    提高问题解决效率
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-6">
                    建议在回答常见问题时，先提供解决方案概述，再询问是否需要详细解释。例如：&ldquo;关于您提到的产品安装问题，我们提供上门安装服务，标准费用为200元。需要我为您详细介绍安装流程吗？&rdquo;
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
                    加强产品知识培训
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-6">
                    在提及产品功能差异时，需更准确。建议参考知识库中&ldquo;产品版本对比&rdquo;章节，重点掌握企业版与专业版的功能区别。
                  </p>
                  <button className="text-sm text-[var(--color-primary-500)] hover:underline mt-1 pl-6 flex items-center">
                    查看知识库: 产品版本对比 <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[var(--color-primary-500)]" />
                    优化合规话术
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-6">
                    避免使用&ldquo;最佳&rdquo;、&ldquo;最高级&rdquo;等绝对化用语描述产品。建议改为：&ldquo;我们的产品在数据安全方面采用了行业领先的加密技术&rdquo;而非&ldquo;我们的产品是最安全的&rdquo;。
                  </p>
                </div>
              </div>
              <div className="mt-6 bg-[var(--bg-secondary)] p-4 rounded-lg">
                <h4 className="font-semibold">最佳实践提炼</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-2 italic">
                  &ldquo;非常理解您对价格的关注。我们的产品定价是基于其独特的功能和服务支持。考虑到您是企业客户，我可以为您提供一份详细的ROI分析报告，展示使用我们产品后可能带来的效率提升和成本节约。您是否有兴趣了解一下？&rdquo;
                </p>
                <p className="text-sm text-[var(--text-primary)] mt-2">
                  <span className="font-semibold">点评：</span>这段回应既表达了理解，又巧妙地将话题从价格转移到价值，同时提供了具体的后续步骤，值得借鉴。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 异常分析与优化 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">异常对话归因分析与优化</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center border-b border-[var(--border-primary)] pb-6 mb-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-200 bg-blue-50 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <p className="font-semibold mt-2 text-[var(--text-primary)]">知识库内容缺失</p>
              <p className="text-sm text-[var(--text-secondary)]">占比 35%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-red-200 bg-red-50 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-red-600">5</p>
              </div>
              <p className="font-semibold mt-2 text-[var(--text-primary)]">系统Bug</p>
              <p className="text-sm text-[var(--text-secondary)]">占比 15%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-200 bg-yellow-50 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-yellow-600">8</p>
              </div>
              <p className="font-semibold mt-2 text-[var(--text-primary)]">服务态度问题</p>
              <p className="text-sm text-[var(--text-secondary)]">占比 23%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-purple-200 bg-purple-50 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-purple-600">9</p>
              </div>
              <p className="font-semibold mt-2 text-[var(--text-primary)]">销售技巧不足</p>
              <p className="text-sm text-[var(--text-secondary)]">占比 27%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg flex items-center mb-3">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                问题归因分析：知识库内容缺失
              </h4>
              <ul className="space-y-2">
                {['企业版API接口使用说明缺失', '产品更新日志未及时同步', '国际版服务范围说明不清晰'].map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xs bg-gray-200 text-[var(--text-tertiary)] rounded-full w-5 h-5 flex items-center justify-center font-bold mt-0.5 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{issue}</p>
                      <div className="space-x-3 mt-1">
                        <button className="text-xs text-[var(--color-primary-500)] hover:underline">关联知识库</button>
                        <button className="text-xs text-[var(--color-primary-500)] hover:underline">查看相关对话</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg flex items-center mb-3">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                问题归因分析：系统Bug
              </h4>
              <ul className="space-y-2">
                {['文件上传功能偶尔失败，错误码：502', '客户信息查询接口响应缓慢'].map((bug, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xs bg-gray-200 text-[var(--text-tertiary)] rounded-full w-5 h-5 flex items-center justify-center font-bold mt-0.5 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{bug}</p>
                      <div className="space-x-3 mt-1">
                        <button className="text-xs text-[var(--color-danger-600)] hover:underline">提交Bug报告</button>
                        <button className="text-xs text-[var(--color-primary-500)] hover:underline">查看相关对话</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 优化方案建议 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">优化方案建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">知识库完善计划</h3>
              <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">建议:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>在一周内完成API接口文档的编写与审核</li>
                  <li>建立产品更新日志同步机制，确保每月更新</li>
                  <li>对国际版服务范围进行详细说明</li>
                </ul>
              </div>
              <div className="mt-4 text-sm space-y-1">
                <p><span className="font-semibold">负责人:</span> 张明 (产品文档团队)</p>
                <p><span className="font-semibold">截止日期:</span> 2023-07-15</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">系统Bug修复计划</h3>
              <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">建议:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>修复文件上传502错误，安排在本周迭代</li>
                  <li>优化客户信息查询接口性能，下周完成</li>
                  <li>增加系统错误自动上报机制</li>
                </ul>
              </div>
              <div className="mt-4 text-sm space-y-1">
                <p><span className="font-semibold">负责人:</span> 李强 (技术团队)</p>
                <p><span className="font-semibold">截止日期:</span> 2023-07-10</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">销售技能培训计划</h3>
              <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">建议:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>针对服务态度和销售技巧问题，开展客户情绪管理培训</li>
                  <li>组织角色扮演工作坊，提升异议处理能力</li>
                  <li>建立销售话术库，收集和分享最佳实践</li>
                </ul>
              </div>
              <div className="mt-4 text-sm space-y-1">
                <p><span className="font-semibold">负责人:</span> 王丽 (培训团队)</p>
                <p><span className="font-semibold">截止日期:</span> 2023-07-30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default ConversationQAPage;