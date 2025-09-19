import React from 'react';

interface ActionItem {
  title: string;
  description: string;
  iconColor: string;
  bgColor: string;
  icon: React.ReactNode;
}

const ActionPlanCard: React.FC = () => {
  const actionItems: ActionItem[] = [
    {
      title: '配送服务优化',
      description: '优化配送路线算法, 高峰期增加临时配送人员, 引入保温箱和防压包装',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: '客服体系升级',
      description: '引入智能客服分流, 复杂问题快速转接人工, 增加客服培训提高专业度',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
    {
      title: '包装防压设计',
      description: '开发专用防压蛋糕盒, 内部增加固定装置, 解决运输损坏问题',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">服务优化行动计划</h2>
      </div>

      <div className="space-y-4 mt-4">
        {actionItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${item.bgColor} flex-shrink-0 flex items-center justify-center`}>
              <div className={item.iconColor}>{item.icon}</div>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
              <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlanCard;