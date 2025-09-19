import React from 'react';

interface ServiceSatisfactionItem {
  name: string;
  score: number;
  percentage: number;
}

const ServiceSatisfactionCard: React.FC = () => {
  const satisfactionData: ServiceSatisfactionItem[] = [
    { name: '配送服务', score: 8.5, percentage: 85 },
    { name: '客服响应', score: 9.0, percentage: 90 },
    { name: '售后处理', score: 7.8, percentage: 78 },
    { name: '包装体验', score: 8.2, percentage: 82 },
  ];

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">服务体验满意度</h2>
      </div>

      <div className="space-y-4 mt-4">
        {satisfactionData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center text-sm mb-1.5">
              <span className="text-[var(--text-secondary)]">{item.name}</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {item.score} / 10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-400 h-2.5 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSatisfactionCard;