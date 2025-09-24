'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, CheckCircle, Clock, MessageCircle, ShoppingCart, Users, ExternalLink } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  status: 'connected' | 'pending';
}

const dataSources: DataSource[] = [
  {
    id: '1',
    name: '微信广告平台',
    icon: MessageCircle,
    iconColor: 'text-[var(--color-success-500)]',
    status: 'connected'
  },
  {
    id: '2',
    name: '电商平台A',
    icon: ShoppingCart,
    iconColor: 'text-[var(--color-info-500)]',
    status: 'connected'
  },
  {
    id: '3',
    name: 'CRM系统',
    icon: Users,
    iconColor: 'text-[var(--color-primary-500)]',
    status: 'pending'
  }
];

const getStatusInfo = (status: DataSource['status']) => {
  switch (status) {
    case 'connected':
      return {
        icon: CheckCircle,
        text: '已连接',
        className: 'text-[var(--color-success-600)]'
      };
    case 'pending':
      return {
        icon: Clock,
        text: '待连接',
        className: 'text-[var(--color-warning-600)]'
      };
  }
};

const DataSourceCard: React.FC<{ dataSource: DataSource }> = ({ dataSource }) => {
  const IconComponent = dataSource.icon;
  const statusInfo = getStatusInfo(dataSource.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <IconComponent className={`w-8 h-8 ${dataSource.iconColor}`} />
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{dataSource.name}</p>
          <div className={`flex items-center gap-1.5 text-xs ${statusInfo.className}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusInfo.text}</span>
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" className="px-3 py-1.5 text-xs">
        管理
      </Button>
    </div>
  );
};

const DataSourceManager: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">数据源连接与管理</h3>
          <div className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加新数据源
            </Button>
            <Button variant="outline">
              配置 API/授权
            </Button>
            <Button variant="outline">
              数据同步日志
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((dataSource) => (
              <DataSourceCard key={dataSource.id} dataSource={dataSource} />
            ))}
          </div>

          {/* API授权管理卡片 */}
          <div className="bg-[var(--color-primary-50)] p-4 rounded-lg flex flex-col justify-center items-start">
            <ExternalLink className="w-8 h-8 text-[var(--color-primary-700)] mb-2" />
            <p className="font-semibold text-[var(--color-primary-700)] text-base">API授权管理</p>
            <p className="text-sm text-[var(--color-primary-600)]">管理第三方API接口密钥和授权。</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceManager;