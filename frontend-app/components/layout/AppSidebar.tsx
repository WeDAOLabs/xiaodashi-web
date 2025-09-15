'use client';

import ChartLineIcon from '@/components/icons/ChartLineIcon';
import FileTextIcon from '@/components/icons/FileTextIcon';
import GearIcon from '@/components/icons/GearIcon';
import HomeIcon from '@/components/icons/HomeIcon';
import PresentationChartIcon from '@/components/icons/PresentationChartIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppSidebarProps } from './types';

const navItems = [
  {
    name: '战略与决策中枢',
    icon: PresentationChartIcon,
    subItems: [
      { name: '智能业务与营销战略规划', href: '/strategic-planning' },
      { name: '智能市场洞察与竞品分析', href: '/market-intelligence' },
      { name: '智能营销效果评估与数据分析', href: '/marketing-analytics' },
    ],
  },
  {
    name: '品牌与创意资产',
    icon: FileTextIcon,
    subItems: [
      { name: '智能品牌与IP资产管理', href: '/brand-management' },
      { name: '智能内容创作与素材中心', href: '/content-creation' },
    ],
  },
  {
    name: '增长与运营执行',
    icon: ChartLineIcon,
    subItems: [
      { name: '智能公域流量投放与优化', href: '/public-traffic' },
      { name: '智能私域增长与运营', href: '/private-growth' },
      { name: '智能电商运营与转化', href: '/ecommerce' },
      { name: '智能销售赋能', href: '/sales-enablement' },
    ],
  },
  {
    name: '赋能与效率提升',
    icon: UsersIcon,
    subItems: [
      { name: '智能知识库', href: '/knowledge-base' },
      { name: '企业效率提升', href: '/efficiency-improvement' },
    ],
  },
];

const bottomNavItems = [
    { name: '设置', icon: GearIcon, href: '/settings' },
    { name: '帮助与支持', icon: QuestionIcon, href: '/support' },
]

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
        <div className="flex flex-col gap-2">
          {/* 首页选项 */}
          <Link
            href="/dashboard"
            className={cn(
              'sidebar-link justify-start',
              pathname === '/dashboard' && 'sidebar-link-active'
            )}
          >
            <HomeIcon className="size-6" />
            <p className={cn(isCollapsed && 'hidden')}>首页</p>
          </Link>

          <Accordion type="multiple" className="w-full" defaultValue={['战略与决策中枢']}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <AccordionItem value={item.name} key={item.name}>
                  <AccordionTrigger className="sidebar-link justify-start">
                    <Icon className="size-6" />
                    <p className={cn(isCollapsed && 'hidden')}>{item.name}</p>
                  </AccordionTrigger>
                  <AccordionContent className="">
                    {item.subItems.map((subItem) => {
                      const isActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            'sidebar-link justify-start',
                            isActive && 'sidebar-link-active'
                          )}
                        >
                          <span className="size-6" />
                          <p className={cn(isCollapsed && 'hidden')}>{subItem.name}</p>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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
                        <p className={cn(isCollapsed && 'hidden')}>{item.name}</p>
                    </Link>
                );
            })}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;