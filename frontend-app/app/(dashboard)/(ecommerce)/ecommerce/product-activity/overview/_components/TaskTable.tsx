'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TaskActions from './TaskActions';
import { TaskStatus } from './StatusFilter';

export interface TaskItem {
  id: string;
  name: string;
  type: '商品' | '活动';
  createTime: string;
  updateTime: string;
  status: 'published' | 'draft' | 'pending' | 'failed';
  operator: string;
}

interface TaskTableProps {
  filter?: TaskStatus;
}

// 模拟任务数据
const mockTasks: TaskItem[] = [
  {
    id: '1',
    name: '夏季大促启动',
    type: '活动',
    createTime: '2023-10-26 10:00',
    updateTime: '2023-10-27 14:30',
    status: 'published',
    operator: '张三',
  },
  {
    id: '2',
    name: '秋季新品系列发布',
    type: '商品',
    createTime: '2023-10-25 15:20',
    updateTime: '2023-10-26 11:00',
    status: 'draft',
    operator: '李四',
  },
  {
    id: '3',
    name: '黑五预热活动',
    type: '活动',
    createTime: '2023-10-24 09:00',
    updateTime: '2023-10-24 18:45',
    status: 'pending',
    operator: '王五',
  },
  {
    id: '4',
    name: '京东店铺每日秒杀',
    type: '活动',
    createTime: '2023-10-23 11:30',
    updateTime: '2023-10-23 12:00',
    status: 'failed',
    operator: '张三',
  },
  {
    id: '5',
    name: '手工牛皮钱包',
    type: '商品',
    createTime: '2023-10-22 18:00',
    updateTime: '2023-10-25 09:15',
    status: 'published',
    operator: '赵六',
  },
  {
    id: '6',
    name: '中秋节特别优惠',
    type: '活动',
    createTime: '2023-10-21 14:00',
    updateTime: '2023-10-22 16:20',
    status: 'published',
    operator: '李四',
  },
];

const getStatusBadge = (status: TaskItem['status']) => {
  const statusConfig = {
    published: {
      label: '已发布',
      className: 'bg-[var(--color-success-50)] text-[var(--color-success-600)] border-[var(--color-success-100)]'
    },
    draft: {
      label: '草稿',
      className: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-secondary)]'
    },
    pending: {
      label: '待发布',
      className: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)] border-[var(--color-warning-100)]'
    },
    failed: {
      label: '发布失败',
      className: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)] border-[var(--color-danger-100)]'
    },
  };

  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

const TaskTable: React.FC<TaskTableProps> = ({ filter = 'all' }) => {
  const [tasks] = useState<TaskItem[]>(mockTasks);

  // 根据筛选条件过滤任务
  const filteredTasks = React.useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
  }, [tasks, filter]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[var(--bg-secondary)]">
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase">
              任务名称
            </TableHead>
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase">
              类型
            </TableHead>
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase">
              创建时间
            </TableHead>
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase">
              最新修改
            </TableHead>
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase">
              状态
            </TableHead>
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase">
              操作人
            </TableHead>
            <TableHead className="px-6 py-3 text-xs text-[var(--text-tertiary)] uppercase text-right">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow
              key={task.id}
              className="bg-[var(--bg-primary)] border-b border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)]"
            >
              <TableCell className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                {task.name}
              </TableCell>
              <TableCell className="px-6 py-4 text-[var(--text-secondary)]">
                {task.type}
              </TableCell>
              <TableCell className="px-6 py-4 text-[var(--text-secondary)]">
                {task.createTime}
              </TableCell>
              <TableCell className="px-6 py-4 text-[var(--text-secondary)]">
                {task.updateTime}
              </TableCell>
              <TableCell className="px-6 py-4">
                {getStatusBadge(task.status)}
              </TableCell>
              <TableCell className="px-6 py-4 text-[var(--text-secondary)]">
                {task.operator}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TaskActions taskId={task.id} taskName={task.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;