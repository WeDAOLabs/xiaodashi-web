'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react';

interface OptimizationItem {
  id: string;
  strategy: string;
  channel: string;
  currentValue: number;
  recommendedValue: number;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'pending' | 'applied' | 'rejected';
}

interface OptimizationTableProps {
  title?: string;
  data?: OptimizationItem[];
}

const defaultData: OptimizationItem[] = [
  {
    id: '1',
    strategy: '预算分配',
    channel: '抖音短视频',
    currentValue: 15000,
    recommendedValue: 18500,
    impact: '+12.3%',
    priority: 'high',
    category: '预算优化',
    status: 'pending'
  },
  {
    id: '2',
    strategy: '目标受众',
    channel: '微信朋友圈',
    currentValue: 85000,
    recommendedValue: 125000,
    impact: '+8.7%',
    priority: 'high',
    category: '受众优化',
    status: 'pending'
  },
  {
    id: '3',
    strategy: '投放时段',
    channel: '小红书种草',
    currentValue: 24,
    recommendedValue: 18,
    impact: '+5.2%',
    priority: 'medium',
    category: '时段优化',
    status: 'applied'
  },
  {
    id: '4',
    strategy: '出价策略',
    channel: '百度搜索',
    currentValue: 3.2,
    recommendedValue: 2.8,
    impact: '+15.6%',
    priority: 'high',
    category: '出价优化',
    status: 'pending'
  },
  {
    id: '5',
    strategy: '创意素材',
    channel: '今日头条',
    currentValue: 2.8,
    recommendedValue: 3.5,
    impact: '+6.9%',
    priority: 'medium',
    category: '创意优化',
    status: 'rejected'
  }
];

const formatValue = (strategy: string, value: number): string => {
  switch (strategy) {
    case '预算分配':
      return `¥${(value / 1000).toFixed(1)}k`;
    case '目标受众':
      return `${(value / 1000).toFixed(0)}k`;
    case '投放时段':
      return `${value}h`;
    case '出价策略':
      return `¥${value.toFixed(1)}`;
    case '创意素材':
      return `${value.toFixed(1)}`;
    default:
      return value.toString();
  }
};

const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return { label: '高', className: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)]' };
    case 'medium':
      return { label: '中', className: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]' };
    case 'low':
      return { label: '低', className: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]' };
  }
};

const getStatusConfig = (status: 'pending' | 'applied' | 'rejected') => {
  switch (status) {
    case 'pending':
      return { label: '待处理', className: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]' };
    case 'applied':
      return { label: '已应用', className: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]' };
    case 'rejected':
      return { label: '已拒绝', className: 'bg-[var(--color-danger-50)] text-[var(--color-danger-600)]' };
  }
};

const getImpactIcon = (impact: string) => {
  if (impact.startsWith('+')) {
    return <TrendingUp className="w-3 h-3 text-[var(--color-chart-1)]" />;
  } else if (impact.startsWith('-')) {
    return <TrendingDown className="w-3 h-3 text-[var(--color-chart-5)]" />;
  } else {
    return <Minus className="w-3 h-3 text-[var(--text-secondary)]" />;
  }
};

const OptimizationTable: React.FC<OptimizationTableProps> = ({
  title = '策略优化建议',
  data = defaultData
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAction = (itemId: string, action: string): void => {
    console.log(`Item ${itemId}: ${action}`);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number = a[sortField as keyof OptimizationItem];
    let bValue: string | number = b[sortField as keyof OptimizationItem];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm border border-[var(--border-secondary)]">
      <div className="p-5 lg:p-6 border-b border-[var(--border-secondary)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              导出表格
            </Button>
            <Button size="sm" className="bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]">
              批量应用
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]">
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">
                <button
                  onClick={() => handleSort('strategy')}
                  className="flex items-center gap-1 font-medium hover:text-[var(--text-primary)]"
                >
                  策略类型
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">
                <button
                  onClick={() => handleSort('channel')}
                  className="flex items-center gap-1 font-medium hover:text-[var(--text-primary)]"
                >
                  投放渠道
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">当前值</TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">建议值</TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">
                <button
                  onClick={() => handleSort('impact')}
                  className="flex items-center gap-1 font-medium hover:text-[var(--text-primary)]"
                >
                  预期影响
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-1 font-medium hover:text-[var(--text-primary)]"
                >
                  优先级
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-xs text-[var(--text-secondary)] uppercase font-medium bg-[var(--bg-secondary)]">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 font-medium hover:text-[var(--text-primary)]"
                >
                  状态
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-12 bg-[var(--bg-secondary)]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              const priorityConfig = getPriorityConfig(item.priority);
              const statusConfig = getStatusConfig(item.status);

              return (
                <TableRow key={item.id} className="bg-[var(--bg-primary)] border-b border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)]">
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">
                        {item.strategy}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {item.category}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-[var(--text-primary)]">
                      {item.channel}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {formatValue(item.strategy, item.currentValue)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {formatValue(item.strategy, item.recommendedValue)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {getImpactIcon(item.impact)}
                      <span className={`text-sm font-medium ${
                        item.impact.startsWith('+')
                          ? 'text-[var(--color-chart-1)]'
                          : item.impact.startsWith('-')
                          ? 'text-[var(--color-chart-5)]'
                          : 'text-[var(--text-secondary)]'
                      }`}>
                        {item.impact}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`text-xs font-medium ${priorityConfig.className}`}>
                      {priorityConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`text-xs font-medium ${statusConfig.className}`}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleAction(item.id, 'apply')}
                          disabled={item.status === 'applied'}
                        >
                          应用建议
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction(item.id, 'reject')}
                          disabled={item.status === 'rejected'}
                        >
                          拒绝建议
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction(item.id, 'details')}
                        >
                          查看详情
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OptimizationTable;