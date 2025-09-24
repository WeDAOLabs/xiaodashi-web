'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Code, Activity, AlertTriangle, CheckCircle, Search, Settings } from 'lucide-react';

interface EventTracker {
  id: string;
  name: string;
  type: 'click' | 'view' | 'conversion' | 'custom';
  status: 'active' | 'inactive' | 'error';
  selector: string;
  description: string;
  lastTriggered: string;
  triggerCount: number;
}

const eventTrackers: EventTracker[] = [
  {
    id: '1',
    name: '产品页面浏览',
    type: 'view',
    status: 'active',
    selector: '.product-page',
    description: '跟踪用户浏览产品详情页的行为',
    lastTriggered: '5分钟前',
    triggerCount: 1247
  },
  {
    id: '2',
    name: '购买按钮点击',
    type: 'click',
    status: 'active',
    selector: '.buy-button',
    description: '跟踪用户点击购买按钮的行为',
    lastTriggered: '12分钟前',
    triggerCount: 89
  },
  {
    id: '3',
    name: '表单提交转化',
    type: 'conversion',
    status: 'active',
    selector: '#contact-form',
    description: '跟踪联系表单提交转化事件',
    lastTriggered: '1小时前',
    triggerCount: 23
  },
  {
    id: '4',
    name: '视频播放完成',
    type: 'custom',
    status: 'error',
    selector: '.video-player',
    description: '跟踪营销视频播放完成事件',
    lastTriggered: '3小时前',
    triggerCount: 156
  },
  {
    id: '5',
    name: '文档下载',
    type: 'click',
    status: 'inactive',
    selector: '.download-link',
    description: '跟踪营销资料下载行为',
    lastTriggered: '2天前',
    triggerCount: 67
  }
];

const getTypeInfo = (type: EventTracker['type']) => {
  switch (type) {
    case 'click':
      return {
        label: '点击事件',
        className: 'text-[var(--color-info-600)] border-[var(--color-info-200)] bg-[var(--color-info-50)]'
      };
    case 'view':
      return {
        label: '浏览事件',
        className: 'text-[var(--color-success-600)] border-[var(--color-success-200)] bg-[var(--color-success-50)]'
      };
    case 'conversion':
      return {
        label: '转化事件',
        className: 'text-[var(--color-primary-600)] border-[var(--color-primary-200)] bg-[var(--color-primary-50)]'
      };
    case 'custom':
      return {
        label: '自定义',
        className: 'text-[var(--color-warning-600)] border-[var(--color-warning-200)] bg-[var(--color-warning-50)]'
      };
  }
};

const getStatusInfo = (status: EventTracker['status']) => {
  switch (status) {
    case 'active':
      return {
        icon: CheckCircle,
        label: '运行中',
        className: 'text-[var(--color-success-600)]'
      };
    case 'inactive':
      return {
        icon: Activity,
        label: '已停用',
        className: 'text-[var(--text-secondary)]'
      };
    case 'error':
      return {
        icon: AlertTriangle,
        label: '异常',
        className: 'text-[var(--color-danger-600)]'
      };
  }
};

const EventTrackerCard: React.FC<{ tracker: EventTracker }> = ({ tracker }) => {
  const typeInfo = getTypeInfo(tracker.type);
  const statusInfo = getStatusInfo(tracker.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-secondary)]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-[var(--text-primary)]">{tracker.name}</p>
            <Badge variant="outline" className={typeInfo.className}>
              {typeInfo.label}
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">{tracker.description}</p>
          <code className="text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded text-[var(--text-secondary)]">
            {tracker.selector}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={tracker.status === 'active'}
          />
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${statusInfo.className}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusInfo.label}</span>
          </div>
          <span className="text-[var(--text-secondary)]">
            触发 {tracker.triggerCount} 次
          </span>
        </div>
        <span className="text-[var(--text-secondary)]">
          {tracker.lastTriggered}
        </span>
      </div>
    </div>
  );
};

const EventTrackerManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');

  const filteredTrackers = React.useMemo(() => {
    return eventTrackers.filter(tracker => {
      const matchesSearch = tracker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tracker.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || tracker.type === filterType;
      const matchesStatus = filterStatus === 'all' || tracker.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, filterType, filterStatus]);

  const activeTrackers = eventTrackers.filter(t => t.status === 'active').length;
  const errorTrackers = eventTrackers.filter(t => t.status === 'error').length;
  const totalEvents = eventTrackers.reduce((sum, t) => sum + t.triggerCount, 0);

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-5 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">事件埋点管理器</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              代码生成器
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建埋点
            </Button>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--color-success-600)] mb-1">{activeTrackers}</div>
            <div className="text-sm text-[var(--text-secondary)]">运行中埋点</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--color-danger-600)] mb-1">{errorTrackers}</div>
            <div className="text-sm text-[var(--text-secondary)]">异常埋点</div>
          </div>
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{totalEvents.toLocaleString()}</div>
            <div className="text-sm text-[var(--text-secondary)]">累计触发</div>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1\/2 transform -translate-y-1\/2 w-4 h-4 text-[var(--text-secondary)]" />
            <Input
              placeholder="搜索埋点名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="事件类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="click">点击事件</SelectItem>
              <SelectItem value="view">浏览事件</SelectItem>
              <SelectItem value="conversion">转化事件</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">运行中</SelectItem>
              <SelectItem value="inactive">已停用</SelectItem>
              <SelectItem value="error">异常</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 埋点列表 */}
        <div className="flex-1 space-y-4">
          {filteredTrackers.map((tracker) => (
            <EventTrackerCard key={tracker.id} tracker={tracker} />
          ))}
          {filteredTrackers.length === 0 && (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              没有找到匹配的埋点事件
            </div>
          )}
        </div>

        {/* 操作提示 */}
        <div className="p-4 bg-[var(--color-info-50)] rounded-lg border border-[var(--color-info-200)]">
          <div className="flex items-start gap-3">
            <Code className="w-5 h-5 text-[var(--color-info-600)] mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-[var(--color-info-700)] mb-1">埋点说明</p>
              <p className="text-[var(--color-info-600)]">
                系统会自动生成对应的JavaScript代码，您可以将代码部署到相应页面来开始数据收集。
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm">
            批量管理埋点
          </Button>
          <Button size="sm">
            导出埋点配置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventTrackerManager;