import React from 'react';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <div className="private-module">
      {/* 私域运营模块容器 */}
      <div className="flex flex-col min-h-screen">
        {/* 私域运营专用头部导航区域 - 后续可扩展 */}
        <div className="private-header">
          {/* 预留私域运营模块专用导航 */}
        </div>

        {/* 主内容区域 */}
        <div className="flex flex-1">
          {/* 私域运营侧边栏 - 后续可扩展 */}
          <aside className="private-sidebar">
            {/* 预留私域运营功能导航 */}
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

export default PrivateLayout;