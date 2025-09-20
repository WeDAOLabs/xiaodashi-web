import React from 'react';
import BreadcrumbNav from './BreadcrumbNav';
import ErrorBoundary from './ErrorBoundary';
import { BreadcrumbItem } from './types';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  title,
  description,
  children,
  breadcrumbs,
  actions,
  className
}) => {
  return (
    <div className="page-container">
      {/* Breadcrumb Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbNav items={breadcrumbs} />
      )}

      {/* Page Title */}
      {title && (
        <h1 className="dashboard-section-title">{title}</h1>
      )}

      {/* Tool Page Content */}
      <ErrorBoundary>
        <div className="p-6 lg:p-8 flex-1">
          <div className="mb-6">
            <p className="text-[var(--text-secondary)]">{description}</p>
            {actions && <div className="mt-4">{actions}</div>}
          </div>
          <div className={className}>
            {children}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default ToolPageLayout;