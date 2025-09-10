'use client';

import CalendarIcon from '@/components/icons/CalendarIcon';
import ChartLineIcon from '@/components/icons/ChartLineIcon';
import FileTextIcon from '@/components/icons/FileTextIcon';
import GearIcon from '@/components/icons/GearIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import LayoutIcon from '@/components/icons/LayoutIcon';
import MagnifyingGlassIcon from '@/components/icons/MagnifyingGlassIcon';
import MegaphoneIcon from '@/components/icons/MegaphoneIcon';
import PresentationChartIcon from '@/components/icons/PresentationChartIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import UsersThreeIcon from '@/components/icons/UsersThreeIcon';
import VideoIcon from '@/components/icons/VideoIcon';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const sidebarNavItems = [
  { name: '概览/仪表盘', icon: LayoutIcon, href: '/dashboard' },
  { name: '数据报告', icon: PresentationChartIcon, href: '/reports' },
  { name: '文案', icon: FileTextIcon, href: '/copywriting' },
  { name: '生图', icon: ImageIcon, href: '/image-generation' },
  { name: '生视频', icon: VideoIcon, href: '/video-generation' },
  { name: '数据分析', icon: ChartLineIcon, href: '/analytics' },
  { name: '广告管理', icon: MegaphoneIcon, href: '/advertising' },
  { name: '社交媒体管理', icon: UsersIcon, href: '/social-media' },
  { name: '客户关系管理', icon: UsersThreeIcon, href: '/crm' },
  { name: '内容计划', icon: CalendarIcon, href: '/content-planning' },
  { name: '品牌监测', icon: MagnifyingGlassIcon, href: '/brand-monitoring' },
  { name: '市场调研', icon: PresentationChartIcon, href: '/market-research' },
];

const bottomNavItems = [
    { name: '设置', icon: GearIcon, href: '/settings' },
    { name: '帮助与支持', icon: QuestionIcon, href: '/support' },
]

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <aside className="app-sidebar">
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
        <div className="flex flex-col gap-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn('sidebar-link', isActive && 'sidebar-link-active')}>
                <Icon className="size-6" />
                <p>{item.name}</p>
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
            {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn('sidebar-link', isActive && 'sidebar-link-active')}>
                        <Icon className="size-6" />
                        <p>{item.name}</p>
                    </Link>
                );
            })}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;