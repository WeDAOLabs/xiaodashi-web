import React from 'react';

interface SalesIntelligentLayoutProps {
  children: React.ReactNode;
}

const SalesIntelligentLayout: React.FC<SalesIntelligentLayoutProps> = ({ children }) => {
  return (
    <div className="sales-intelligent-module">
      {/* 销售智能模块容器 */}
      <div className="flex flex-col min-h-screen">
        {/* 销售智能专用头部导航区域 - 后续可扩展 */}
        <div className="sales-intelligent-header">
          {/* 预留销售智能模块专用导航 */}
        </div>

        {/* 主内容区域 */}
        <div className="flex flex-1">
          {/* 销售智能侧边栏 - 后续可扩展 */}
          <aside className="sales-intelligent-sidebar">
            {/* 预留销售智能功能导航 */}
          </aside>

          {/* 页面内容区域 */}
          <main className="flex-1 bg-[var(--bg-secondary)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SalesIntelligentLayout;