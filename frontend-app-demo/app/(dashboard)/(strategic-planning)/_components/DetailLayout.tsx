'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbItem } from '@/components/layout/types';

interface DetailLayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  showBackButton?: boolean;
  backButtonText?: string;
  backUrl?: string;
  className?: string;
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  children,
  breadcrumbs,
  showBackButton = true,
  backButtonText = "返回营销规划日历",
  backUrl = "/strategic-planning-annual-planning",
  className
}) => {
  const router = useRouter();

  return (
    <ToolPageLayout
      title=""
      description=""
      breadcrumbs={breadcrumbs}
      className={className}
    >
      {showBackButton && (
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-0"
            onClick={() => router.push(backUrl)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {backButtonText}
          </Button>
        </div>
      )}
      {children}
    </ToolPageLayout>
  );
};

export default DetailLayout;