'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from '@/lib/utils';
import React from 'react';
import AppSidebar from '@/components/layout/AppSidebar';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

interface DashboardRootLayoutProps {
  children: React.ReactNode;
}

const DashboardRootLayout: React.FC<DashboardRootLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
          }}
        >
          <ResizablePanel
            defaultSize={14}
            minSize={5}
            maxSize={25}
            collapsible={true}
            collapsedSize={5}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn("bg-white", isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
          >
            <AppSidebar isCollapsed={isCollapsed} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80} className="flex flex-col">
            {/* 主内容区域 - 只有这部分在路由切换时更新 */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardRootLayout;