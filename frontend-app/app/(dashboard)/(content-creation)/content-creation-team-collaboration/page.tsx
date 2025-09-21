'use client';

import React from 'react';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Bell,
  Plus,
} from 'lucide-react';

// 类型定义
type Priority = 'high' | 'medium' | 'low';
type TaskStatus = '待审批' | '审批中' | '已通过' | '已拒绝' | '已完成';
type TaskType = '合规审核' | '素材上传' | '视频剪辑任务' | '文案审批';

interface PendingTaskProps {
  title: string;
  author: string;
  priority: Priority;
  type: TaskType;
}

interface ApprovalRecordProps {
  title: string;
  type: TaskType;
  initiator: string;
  currentHandler: string;
  status: TaskStatus;
  initiateTime: string;
}

interface WorkflowConfigProps {
  name: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

// 优先级样式配置
const priorityStyles = {
  high: {
    dot: 'bg-[var(--color-danger-600)]',
    text: 'text-[var(--text-secondary)]'
  },
  medium: {
    dot: 'bg-[var(--color-warning-600)]',
    text: 'text-[var(--text-secondary)]'
  },
  low: {
    dot: 'bg-[var(--color-info-600)]',
    text: 'text-[var(--text-secondary)]'
  }
};

// 状态样式配置
const statusStyles = {
  '待审批': 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
  '审批中': 'bg-[var(--color-info-50)] text-[var(--color-info-600)]',
  '已通过': 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  '已拒绝': 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)]',
  '已完成': 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'
};

// 待处理任务卡片组件
const PendingTaskCard = React.memo<PendingTaskProps>(({
  title,
  author,
  priority,
  type
}) => {
  const priorityStyle = priorityStyles[priority];

  return (
    <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-secondary)]">
      <div className="flex items-center justify-between">
        <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-500)]">
          {type}
        </Badge>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${priorityStyle.dot}`} />
          <span className={`text-xs font-medium ${priorityStyle.text}`}>
            {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
          </span>
        </div>
      </div>
      <p className="font-semibold text-md text-[var(--text-primary)] mt-3 truncate">
        {title}
      </p>
      <p className="text-sm text-[var(--text-secondary)] mt-1">发起人: {author}</p>
      <Button
        className="w-full mt-4 bg-[var(--color-primary-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold"
      >
        进入审批
      </Button>
    </div>
  );
});

PendingTaskCard.displayName = 'PendingTaskCard';

// 工作流配置组件
const WorkflowConfig = React.memo<WorkflowConfigProps>(({
  name,
  isEnabled,
  onToggle
}) => (
  <li className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-md">
    <span className="font-medium">{name}</span>
    <div className="flex items-center gap-3">
      <button className="text-sm font-semibold text-[var(--color-primary-600)] hover:underline">
        编辑
      </button>
      <Switch
        checked={isEnabled}
        onCheckedChange={onToggle}
        aria-label={`${isEnabled ? '禁用' : '启用'} ${name}`}
      />
    </div>
  </li>
));

WorkflowConfig.displayName = 'WorkflowConfig';

const TeamCollaborationPage: React.FC = () => {
  // 工作流状态管理
  const [workflows, setWorkflows] = React.useState([
    { id: 1, name: '文案发布审批流', isEnabled: true },
    { id: 2, name: '图片上传审批流', isEnabled: true },
    { id: 3, name: '高风险内容合规审批流', isEnabled: true },
    { id: 4, name: '视频内容发布流程', isEnabled: false },
  ]);

  const handleWorkflowToggle = (id: number, enabled: boolean) => {
    setWorkflows(prev =>
      prev.map(workflow =>
        workflow.id === id ? { ...workflow, isEnabled: enabled } : workflow
      )
    );
  };

  // 示例数据
  const pendingTasks: PendingTaskProps[] = [
    {
      title: '夏季新品发布会营销文案',
      author: '王晓婷',
      priority: 'high',
      type: '合规审核'
    },
    {
      title: '春节促销活动主视觉图',
      author: '张伟',
      priority: 'medium',
      type: '素材上传'
    }
  ];

  const approvalRecords: ApprovalRecordProps[] = [
    {
      title: '夏季新品发布会营销文案',
      type: '合规审核',
      initiator: '王晓婷',
      currentHandler: '李军',
      status: '待审批',
      initiateTime: '2025-01-16 09:30'
    },
    {
      title: '春节促销活动主视觉图',
      type: '素材上传',
      initiator: '张伟',
      currentHandler: '陈琳',
      status: '审批中',
      initiateTime: '2025-01-15 14:00'
    },
    {
      title: '品牌故事宣传视频初稿',
      type: '视频剪辑任务',
      initiator: '赵敏',
      currentHandler: '孙悦',
      status: '已通过',
      initiateTime: '2025-01-14 11:20'
    },
    {
      title: '用户访谈音频素材',
      type: '素材上传',
      initiator: '周杰',
      currentHandler: '吴芳',
      status: '已拒绝',
      initiateTime: '2025-01-13 18:00'
    },
    {
      title: '双十一活动策划文案',
      type: '文案审批',
      initiator: '王晓婷',
      currentHandler: '李军',
      status: '已完成',
      initiateTime: '2025-01-12 10:00'
    }
  ];

  return (
    <ToolPageLayout
      title="团队协同与审批"
      description="管理团队内容审批流程，提升协作效率"
      breadcrumbs={[
        { label: '智能内容创作与素材中心', href: '#' },
        { label: '智能素材资产管理与协同', href: '/content-creation-material-center' },
        { label: '团队协同与审批', href: '/content-creation-team-collaboration', current: true }
      ]}
    >
      {/* 待我审批/待我处理区域 */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[var(--color-primary-500)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    待我审批/待我处理
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    您有 <span className="font-bold text-[var(--color-primary-700)]">2</span> 个待处理的审批/任务。
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-sm font-semibold text-[var(--color-primary-600)] hover:underline"
              >
                查看所有任务
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map((task, index) => (
                <PendingTaskCard key={index} {...task} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 所有审批与任务记录 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-1">
              <div className="p-5">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  所有审批与任务记录
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  团队所有内容相关的审批和任务记录。
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[var(--bg-tertiary)]">
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        标题
                      </TableHead>
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        类型
                      </TableHead>
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        发起人
                      </TableHead>
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        当前处理人
                      </TableHead>
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        状态
                      </TableHead>
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        发起时间
                      </TableHead>
                      <TableHead className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                        操作
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalRecords.map((record, index) => (
                      <TableRow
                        key={index}
                        className="border-t border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)]"
                      >
                        <TableCell className="px-6 py-4 font-semibold text-[var(--text-primary)] max-w-xs truncate">
                          {record.title}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {record.type}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {record.initiator}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {record.currentHandler}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              statusStyles[record.status as keyof typeof statusStyles]
                            }`}
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {record.initiateTime}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] hover:underline p-0"
                              aria-label={`查看${record.title}的详情`}
                            >
                              查看详情
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-semibold text-[var(--color-info-600)] hover:text-[var(--color-info-700)] hover:underline p-0"
                              aria-label={`催办${record.title}`}
                            >
                              催办
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-semibold text-[var(--color-danger-600)] hover:text-[var(--color-danger-700)] hover:underline p-0"
                              aria-label={`撤回${record.title}`}
                            >
                              撤回
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 审批流程配置 */}
        <div>
          <Card className="h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    审批流程配置
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    自定义素材和内容审批流程。
                  </p>
                </div>
                <Button className="bg-[var(--color-primary-500)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary-600)] transition-colors text-sm font-semibold flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  新建
                </Button>
              </div>
              <ul className="mt-4 space-y-3">
                {workflows.map((workflow) => (
                  <WorkflowConfig
                    key={workflow.id}
                    name={workflow.name}
                    isEnabled={workflow.isEnabled}
                    onToggle={(enabled) => handleWorkflowToggle(workflow.id, enabled)}
                  />
                ))}
              </ul>
              <p className="text-xs text-[var(--text-tertiary)] mt-4">
                可设置&ldquo;合规检测结果&rdquo;作为审批触发条件，例如：高风险内容需额外增加法务部审批节点。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="py-4" />
    </ToolPageLayout>
  );
};

export default TeamCollaborationPage;