'use client';

import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  Lightbulb,
  Plus,
  Sparkles
} from 'lucide-react';
import React from 'react';

// 报告状态类型定义
type ReportStatus = 'published' | 'approved' | 'pending' | 'draft';

interface ReportCardProps {
  title: string;
  status: ReportStatus;
  description: string;
  author: string;
  date: string;
}

// 报告状态样式映射
const statusConfig = {
  published: { label: '已发布', className: 'bg-[var(--success-bg)] text-[var(--success-color)]' },
  approved: { label: '已批准', className: 'bg-[var(--info-bg)] text-[var(--info-color)]' },
  pending: { label: '待审批', className: 'bg-[var(--warning-bg)] text-[var(--warning-color)]' },
  draft: { label: '草稿', className: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' },
};

const ReportCard: React.FC<ReportCardProps> = ({ title, status, description, author, date }) => (
  <Card className="bg-[var(--bg-tertiary)] hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight">{title}</h3>
        <Badge className={`text-xs font-medium px-2 py-1 ${statusConfig[status].className}`}>
          {statusConfig[status].label}
        </Badge>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center text-xs text-[var(--text-tertiary)] mb-4">
        <span>发布人: {author}</span>
        <span>{date}</span>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs"
          aria-label={`查看${title}报告`}
        >
          <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
          查看
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs"
          aria-label={`编辑${title}报告`}
        >
          <Edit className="w-4 h-4 mr-1" aria-hidden="true" />
          编辑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs"
          aria-label={`导出${title}报告`}
        >
          <Download className="w-4 h-4 mr-1" aria-hidden="true" />
          导出
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface KPICardProps {
  title: string;
  value: string;
  target: string;
  progress: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, target, progress }) => (
  <Card className="bg-[var(--bg-tertiary)]">
    <CardContent className="p-4">
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)] my-1">{value}</p>
      <div className="text-xs text-[var(--text-tertiary)] mb-2">目标: {target}</div>
      <Progress value={progress} className="h-1.5" />
    </CardContent>
  </Card>
);

interface AlertCardProps {
  type: 'warning' | 'info';
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const AlertCard: React.FC<AlertCardProps> = ({ type, title, description, icon }) => {
  const bgClass = type === 'warning' ? 'bg-[var(--warning-bg)]' : 'bg-[var(--info-bg)]';
  const textClass = type === 'warning' ? 'text-[var(--warning-color)]' : 'text-[var(--info-color)]';
  const defaultIcon = type === 'warning' ?
    <AlertTriangle className="w-6 h-6" /> :
    <Lightbulb className="w-6 h-6" />;

  return (
    <div className={`p-4 rounded-lg ${bgClass}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 mr-3 ${textClass}`}>
          {icon || defaultIcon}
        </div>
        <div>
          <h4 className={`font-semibold ${textClass}`}>{title}</h4>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface ApprovalItemProps {
  title: string;
  initiator: string;
  date: string;
}

const ApprovalItem: React.FC<ApprovalItemProps> = ({ title, initiator, date }) => (
  <Card className="bg-[var(--bg-tertiary)]">
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[var(--text-primary)] text-sm">{title}</p>
          <p className="text-xs text-[var(--text-tertiary)]">发起人: {initiator} | {date}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium text-[var(--warning-color)]">
          <Clock className="w-4 h-4" />
          <span>待审批</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ExecutiveReportingPage: React.FC = () => {
  return (
    <ToolPageLayout
      title="高层决策支持与会议报告"
      description="为高层决策提供全面的数据支持，生成专业的会议报告，提升决策效率和质量"
      breadcrumbs={[
        { label: '智能业务与营销战略规划', href: '#' },
        { label: '高层决策支持与会议报告', href: '/strategic-planning-executive-reporting', current: true }
      ]}
    >
      {/* Region I: 决策报告中心 */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">决策报告中心</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                选择模板
              </Button>
              <Button className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI生成报告草稿
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportCard
              title="2024年Q3季度战略回顾报告"
              status="published"
              description="本季度GMV同比增长15%，市场份额稳定增长，新用户获取成本有所上升。"
              author="张伟"
              date="2024-07-15"
            />
            <ReportCard
              title="董事会专项汇报 - 新兴市场拓展计划"
              status="approved"
              description="东南亚市场潜力巨大，初步调研显示A产品线有较强竞争力，建议启动试点项目。"
              author="李娜"
              date="2024-07-12"
            />
            <ReportCard
              title="AI营销活动复盘与Q4规划"
              status="pending"
              description="AI驱动的内容营销ROI提升30%，但品牌影响力指标未达预期，需调整策略。"
              author="王强"
              date="2024-07-10"
            />
            <ReportCard
              title="产品A用户反馈与迭代建议"
              status="draft"
              description="用户高频投诉集中在电池续航问题，建议立即启动硬件优化项目。"
              author="赵敏"
              date="2024-07-08"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Region II: 核心战略执行概览 */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">核心战略执行概览</h2>

              <div className="space-y-4 mb-6">
                <KPICard
                  title="年度GMV增长率"
                  value="18%"
                  target="25%"
                  progress={72}
                />
                <KPICard
                  title="市场份额"
                  value="22.5%"
                  target="25%"
                  progress={90}
                />
                <KPICard
                  title="新用户获取成本(CAC)"
                  value="120元"
                  target="100元"
                  progress={100}
                />
                <KPICard
                  title="用户月活(MAU)"
                  value="5.2百万"
                  target="6百万"
                  progress={87}
                />
              </div>

              <AlertCard
                type="warning"
                title="AI 预警"
                description="品牌影响力指标未达预期，建议复盘内容策略。"
              />

              <div className="mt-6 text-center">
                <Button variant="outline" className="w-full">
                  查看详细KPI报告
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Region III: 关键洞察与战略建议 */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">关键洞察与战略建议</h2>
              <div className="space-y-4">
                <AlertCard
                  type="warning"
                  title="AI预警：新兴市场增长迅猛"
                  description="某新兴市场增长迅猛，建议启动'细分市场进入'战略推演。"
                />
                <AlertCard
                  type="warning"
                  title="AI预警：品牌影响力指标未达预期"
                  description="品牌影响力指标未达预期，建议复盘内容策略。"
                />
                <AlertCard
                  type="info"
                  title="AI推荐：下一步行动"
                  description="产品A需立即优化电池续航能力，以应对用户高频投诉。"
                />
                <AlertCard
                  type="info"
                  title="AI推荐：优化广告投放"
                  description="检测到渠道B的转化率下降，建议将预算转移至渠道C，预计可提升15%的ROI。"
                />

                <Card className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">AI推荐：下一步行动</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">产品A需立即优化电池续航能力，以应对用户高频投诉。</p>
                    <div className="flex items-center space-x-2">
                      <Button className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        一键采纳AI建议
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        发起飞书会议讨论
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Region IV: 决策协同与审批流程 */}
      <Card className="shadow-sm mt-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">决策协同与审批流程</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline">查看历史版本</Button>
              <Button variant="outline">共享至飞书群聊</Button>
              <Button className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                发起审批流程
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">待审批事项</h3>
              <div className="space-y-3">
                <ApprovalItem
                  title="Q4市场营销预算审批"
                  initiator="市场部-李娜"
                  date="2024-07-16"
                />
                <ApprovalItem
                  title="火种计划项目立项申请"
                  initiator="战略部-王强"
                  date="2024-07-15"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">历史决策记录</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start">
                  <span className="text-[var(--text-tertiary)] mr-2">•</span>
                  <span>
                    2024-07-12: 批准了 &ldquo;新兴市场拓展计划&rdquo;。
                    <a href="#" className="text-[var(--accent-color)] hover:underline ml-1">查看详情</a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text-tertiary)] mr-2">•</span>
                  <span>
                    2024-06-30: 批准了 Q3市场营销预算。
                    <a href="#" className="text-[var(--accent-color)] hover:underline ml-1">查看详情</a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--text-tertiary)] mr-2">•</span>
                  <span>
                    2024-06-15: 驳回了 &ldquo;产品线C&rdquo; 的初步设计方案。
                    <a href="#" className="text-[var(--accent-color)] hover:underline ml-1">查看详情</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="py-4"></div>
    </ToolPageLayout>
  );
};

export default ExecutiveReportingPage;