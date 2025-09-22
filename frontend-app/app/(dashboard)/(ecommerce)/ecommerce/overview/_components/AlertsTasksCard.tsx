'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, MessageCircle, Archive } from 'lucide-react';

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'danger';
  title: string;
  store: string;
  priority?: 'low' | 'medium' | 'high';
}

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const getIcon = (type: 'info' | 'warning' | 'danger') => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'info':
        return <Package className={`${iconClass} text-[var(--info-color)]`} />;
      case 'warning':
        return <Archive className={`${iconClass} text-[var(--warning-color)]`} />;
      case 'danger':
        return <MessageCircle className={`${iconClass} text-[var(--danger-color)]`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-[var(--warning-color)]`} />;
    }
  };

  const getBgColor = (type: 'info' | 'warning' | 'danger') => {
    switch (type) {
      case 'info':
        return 'bg-[var(--info-bg)]';
      case 'warning':
        return 'bg-[var(--warning-bg)]';
      case 'danger':
        return 'bg-[var(--danger-bg)]';
      default:
        return 'bg-[var(--bg-tertiary)]';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${getBgColor(alert.type)}`}>
          {getIcon(alert.type)}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{alert.title}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{alert.store}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-medium"
      >
        前往处理
      </Button>
    </div>
  );
};

const AlertsTasksCard: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'info',
      title: '35个订单待发货',
      store: '潮流前线旗舰店',
    },
    {
      id: '2',
      type: 'warning',
      title: 'SKU#1025库存低于10件',
      store: '居家生活馆',
    },
    {
      id: '3',
      type: 'danger',
      title: '收到1条新的差评，请及时处理',
      store: '数码先锋专营店',
    },
    {
      id: '4',
      type: 'warning',
      title: '爆款连衣裙红色S码库存告急',
      store: '潮流前线旗舰店',
    },
  ];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">关键任务与预警区</h3>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsTasksCard;