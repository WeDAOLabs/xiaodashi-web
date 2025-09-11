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
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white overflow-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white">
          <AppHeader />
        </div>
        
        <div className="flex flex-1 pt-[76px]">
          {/* Fixed Sidebar */}
          <div className="fixed left-0 top-[76px] bottom-0 z-10 bg-white">
            <AppSidebar />
          </div>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 ml-80 overflow-y-auto">
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
        </div>
      </div>
    </ProtectedRoute>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;