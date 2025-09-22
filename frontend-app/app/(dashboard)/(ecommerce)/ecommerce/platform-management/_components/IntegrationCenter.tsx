'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Integration } from './types';

// 集成工具数据
const integrations: Integration[] = [
  {
    id: 'wanliniu',
    name: '万里牛ERP',
    description: '订单、库存、商品数据同步正常。',
    status: 'connected',
    avatar: 'W',
    color: '#3b82f6'
  },
  {
    id: 'dianxiaomi',
    name: '店小秘CRM',
    description: '授权已过期，请重新连接。',
    status: 'disconnected',
    avatar: 'D',
    color: '#f97316'
  },
  {
    id: 'qianniu',
    name: '千牛工作台',
    description: '消息与客服工具集成在线。',
    status: 'connected',
    avatar: 'Q',
    color: '#06b6d4'
  },
  {
    id: 'doudian',
    name: '抖店后台',
    description: 'API接口异常，部分数据同步失败。',
    status: 'error',
    avatar: '抖',
    color: '#ef4444'
  }
];

interface IntegrationCardProps {
  integration: Integration;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
  const getStatusConfig = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return {
          dotColor: 'var(--color-success-600)',
          text: '已连接',
          actionText: '管理',
          actionClass: 'text-[var(--primary-color)] hover:text-[var(--primary-hover)]'
        };
      case 'disconnected':
        return {
          dotColor: 'var(--text-tertiary)',
          text: '未连接',
          actionText: '连接',
          actionClass: 'text-[var(--primary-color)] hover:text-[var(--primary-hover)]'
        };
      case 'error':
        return {
          dotColor: 'var(--color-danger-600)',
          text: '连接异常',
          actionText: '连接',
          actionClass: 'text-[var(--primary-color)] hover:text-[var(--primary-hover)]'
        };
    }
  };

  const statusConfig = getStatusConfig(integration.status);

  return (
    <Card className="shadow-sm border border-[var(--border-secondary)]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: integration.color }}
            >
              {integration.avatar}
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)]">{integration.name}</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {integration.description}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: statusConfig.dotColor }}
              />
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {statusConfig.text}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm font-semibold ${statusConfig.actionClass}`}
            >
              {statusConfig.actionText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const IntegrationCenter: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">授权与集成区</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">统一管理外部工具连接</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </section>
  );
};

export default IntegrationCenter;