'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from '@/lib/utils';
import React from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import BreadcrumbNav from './BreadcrumbNav';
import ErrorBoundary from './ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';
import { DashboardLayoutProps } from './types';

const DashboardLayout = React.memo<DashboardLayoutProps>(({ 
  children, 
  title, 
  breadcrumbs,
  className 
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white">
          <AppHeader />
        </div>
        
        <div className="flex flex-1 pt-[76px]">
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
              className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
            >
              <AppSidebar isCollapsed={isCollapsed} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80} className="flex flex-col">
              {/* Scrollable Main Content */}
              <main className="flex-1 overflow-y-auto">
                <div className={cn("page-container", className)}>
                  {/* Breadcrumb Navigation */}
                  {breadcrumbs && breadcrumbs.length > 0 && (
                    <BreadcrumbNav items={breadcrumbs} />
                  )}
                  
                  {/* Page Title */}
                  {title && (
                    <h1 className="dashboard-section-title">{title}</h1>
                  )}
                  
                  {/* Page Content */}
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ProtectedRoute>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;