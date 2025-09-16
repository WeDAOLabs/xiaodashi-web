import React from 'react';
import DashboardLayout from './DashboardLayout';
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
    <DashboardLayout title={title} breadcrumbs={breadcrumbs}>
      <div className="p-6 lg:p-8 flex-1">
        <div className="mb-6">
          <p className="text-[var(--text-secondary)]">{description}</p>
          {actions && <div className="mt-4">{actions}</div>}
        </div>
        <div className={className}>
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ToolPageLayout;