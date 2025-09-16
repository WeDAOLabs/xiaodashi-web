import React from 'react';
import { Button } from '@/components/ui/button';

interface FunnelData {
  name: string;
  targetCustomer: string;
  triggerCondition: string;
  status: 'running' | 'planned' | 'completed';
  conversionRate: string;
  reachedCustomers: string;
}

const funnelData: FunnelData[] = [
  {
    name: '流失预警客户唤醒漏斗',
    targetCustomer: '流失预警客户',
    triggerCondition: '30天未登录',
    status: 'running',
    conversionRate: '10%',
    reachedCustomers: '12,500',
  },
  {
    name: '沉睡会员复购漏斗',
    targetCustomer: '90天未消费会员',
    triggerCondition: '90天未下单',
    status: 'running',
    conversionRate: '8%',
    reachedCustomers: '8,300',
  },
  {
    name: '低频客户活跃提升漏斗',
    targetCustomer: '低频消费客户',
    triggerCondition: '60天消费≤1次',
    status: 'running',
    conversionRate: '12%',
    reachedCustomers: '15,200',
  },
  {
    name: '高价值客户忠诚度提升漏斗',
    targetCustomer: '高价值客户',
    triggerCondition: '自定义触发',
    status: 'planned',
    conversionRate: '--',
    reachedCustomers: '--',
  },
];

const StatusBadge: React.FC<{ status: FunnelData['status'] }> = ({ status }) => {
  const getStatusConfig = (status: FunnelData['status']) => {
    switch (status) {
      case 'running':
        return {
          text: '运行中',
          className: 'bg-green-100 text-green-800',
        };
      case 'planned':
        return {
          text: '计划中',
          className: 'bg-yellow-100 text-yellow-800',
        };
      case 'completed':
        return {
          text: '已完成',
          className: 'bg-gray-100 text-gray-800',
        };
      default:
        return {
          text: '未知',
          className: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
      {config.text}
    </span>
  );
};

const ActionButtons: React.FC<{ status: FunnelData['status'] }> = ({ status }) => {
  return (
    <div className="text-[var(--color-primary-500)] font-medium text-sm space-x-3">
      <button className="hover:underline" aria-label="查看漏斗详情">查看</button>
      <button className="hover:underline" aria-label="编辑漏斗">编辑</button>
      {status === 'running' ? (
        <button className="hover:underline text-red-500" aria-label="暂停漏斗">暂停</button>
      ) : status === 'planned' ? (
        <button className="hover:underline text-green-500" aria-label="启用漏斗">启用</button>
      ) : (
        <button className="hover:underline text-red-500" aria-label="删除漏斗">删除</button>
      )}
    </div>
  );
};

const ActivationFunnelTable: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">老用户激活漏斗管理</h2>
        <Button className="px-4 py-2 bg-[var(--color-primary-500)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-600)] transition-colors text-sm flex items-center gap-2">
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          新建激活漏斗
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="text-[var(--text-secondary)] bg-[var(--bg-secondary)]">
            <tr>
              <th className="p-3 font-medium">漏斗名称</th>
              <th className="p-3 font-medium">目标客户</th>
              <th className="p-3 font-medium">触发条件</th>
              <th className="p-3 font-medium">状态</th>
              <th className="p-3 font-medium">转化率</th>
              <th className="p-3 font-medium">已触达客户数</th>
              <th className="p-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {funnelData.map((item, index) => (
              <tr key={index} className="border-b border-[var(--border-primary)]">
                <td className="p-3 font-semibold text-[var(--text-primary)]">{item.name}</td>
                <td className="p-3">{item.targetCustomer}</td>
                <td className="p-3">{item.triggerCondition}</td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3 font-semibold">{item.conversionRate}</td>
                <td className="p-3">{item.reachedCustomers}</td>
                <td className="p-3">
                  <ActionButtons status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="text-[var(--text-secondary)]">显示 1 到 4 条, 共 8 条</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)] disabled:opacity-50">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-500)] text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationFunnelTable;