import React from 'react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

export interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

export interface AppSidebarProps {
    isCollapsed: boolean;
}