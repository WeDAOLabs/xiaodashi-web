import React from 'react';
import Link from 'next/link';
import LayoutIcon from '@/components/icons/LayoutIcon';
import PresentationChartIcon from '@/components/icons/PresentationChartIcon';
import FileTextIcon from '@/components/icons/FileTextIcon';
import ImageIcon from '@/components/icons/ImageIcon';
import VideoIcon from '@/components/icons/VideoIcon';
import ChartLineIcon from '@/components/icons/ChartLineIcon';
import MegaphoneIcon from '@/components/icons/MegaphoneIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import UsersThreeIcon from '@/components/icons/UsersThreeIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';
import MagnifyingGlassIcon from '@/components/icons/MagnifyingGlassIcon';
import GearIcon from '@/components/icons/GearIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import { cn } from '@/lib/utils';

const sidebarNavItems = [
  { name: '概览/仪表盘', icon: LayoutIcon, href: '#', current: false },
  { name: '数据报告', icon: PresentationChartIcon, href: '#', current: false },
  { name: '文案', icon: FileTextIcon, href: '#', current: true },
  { name: '生图', icon: ImageIcon, href: '#', current: false },
  { name: '生视频', icon: VideoIcon, href: '#', current: false },
  { name: '数据分析', icon: ChartLineIcon, href: '#', current: false },
  { name: '广告管理', icon: MegaphoneIcon, href: '#', current: false },
  { name: '社交媒体管理', icon: UsersIcon, href: '#', current: false },
  { name: '客户关系管理', icon: UsersThreeIcon, href: '#', current: false },
  { name: '内容计划', icon: CalendarIcon, href: '#', current: false },
  { name: '品牌监测', icon: MagnifyingGlassIcon, href: '#', current: false },
  { name: '市场调研', icon: PresentationChartIcon, href: '#', current: false },
];

const bottomNavItems = [
    { name: '设置', icon: GearIcon, href: '#' },
    { name: '帮助与支持', icon: QuestionIcon, href: '#' },
]

const AppSidebar: React.FC = () => {
  return (
    <aside className="app-sidebar">
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
        <div className="flex flex-col gap-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn('sidebar-link', item.current && 'sidebar-link-active')}>
                <Icon className="size-6" />
                <p>{item.name}</p>
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
            {bottomNavItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="sidebar-link">
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