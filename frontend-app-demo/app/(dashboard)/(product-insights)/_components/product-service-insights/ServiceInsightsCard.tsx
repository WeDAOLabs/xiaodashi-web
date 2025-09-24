import React from 'react';

const ServiceInsightsCard: React.FC = () => {
  const painPoints = [
    '配送超时导致生日惊喜延误, 尤其周末高峰期',
    '高峰期客服等待时间长, 智能客服无法解决复杂问题',
    '蛋糕运输过程中有轻微损坏, 影响外观和心情',
  ];

  const highlights = [
    '配送员电话提前确认, 态度友好, 服务周到',
    '客服耐心解决售后问题, 主动提出赔偿方案',
    '生日蛋糕附赠精美贺卡, 手写祝福语很暖心',
  ];

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">服务痛点/亮点提取</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-4 text-sm">
        {/* 服务痛点 */}
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            服务痛点
          </h3>
          <ul className="list-disc list-inside mt-2 space-y-2 text-[var(--text-secondary)] pl-2">
            {painPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* 服务亮点 */}
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            服务亮点
          </h3>
          <ul className="list-disc list-inside mt-2 space-y-2 text-[var(--text-secondary)] pl-2">
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceInsightsCard;