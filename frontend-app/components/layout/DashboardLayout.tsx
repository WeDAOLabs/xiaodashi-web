import { cn } from '@/lib/utils';
import React from 'react';
import BreadcrumbNav from './BreadcrumbNav';
import ErrorBoundary from './ErrorBoundary';
import { DashboardLayoutProps } from './types';

const DashboardLayout = React.memo<DashboardLayoutProps>(({
  children,
  title,
  breadcrumbs,
  className
}) => {
  return (
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
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;