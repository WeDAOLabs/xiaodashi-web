'use client';

import ChartLineIcon from '@/components/icons/ChartLineIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import FileTextIcon from '@/components/icons/FileTextIcon';
import GearIcon from '@/components/icons/GearIcon';
import HomeIcon from '@/components/icons/HomeIcon';
import PresentationChartIcon from '@/components/icons/PresentationChartIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import TrendingUpIcon from '@/components/icons/TrendingUpIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { AppSidebarProps } from './types';

interface MenuGroup {
  title: string;
  items: {
    name: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: {
      name: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

const menuGroups: MenuGroup[] = [
  {
    title: '战略与决策中枢',
    items: [
      { name: '智能业务与营销战略规划', href: '/strategic-planning', icon: PresentationChartIcon },
      { name: '智能市场洞察与竞品分析', href: '/market-intelligence', icon: PresentationChartIcon },
      { name: '智能营销效果评估与数据分析', href: '/marketing-analytics', icon: PresentationChartIcon },
    ],
  },
  {
    title: '品牌与创意资产',
    items: [
      { name: '智能品牌与IP资产管理', href: '/brand-management', icon: FileTextIcon },
      { name: '智能内容创作与素材中心', href: '/content-creation', icon: FileTextIcon },
    ],
  },
  {
    title: '增长与运营执行',
    items: [
      { name: '智能公域流量投放与优化', href: '/public-traffic', icon: ChartLineIcon },
      {
        name: '智能私域增长与运营',
        icon: ChartLineIcon,
        subItems: [
          { name: 'AI私域客户洞察中心', href: '/private-growth', icon: UsersIcon },
          { name: '产品与服务优化洞察', href: '/private-service-insights', icon: TrendingUpIcon }
        ]
      },
      { name: '智能电商运营与转化', href: '/ecommerce', icon: ChartLineIcon },
      { name: '智能销售赋能', href: '/sales-enablement', icon: ChartLineIcon },
    ],
  },
  {
    title: '赋能与效率提升',
    items: [
      { name: '智能知识库', href: '/knowledge-base', icon: UsersIcon },
      { name: '企业效率提升', href: '/efficiency-improvement', icon: UsersIcon },
    ],
  },
];

const bottomNavItems = [
    { name: '设置', icon: GearIcon, href: '/settings' },
    { name: '帮助与支持', icon: QuestionIcon, href: '/support' },
]

// 未实现的功能路由列表
const unimplementedRoutes = [
  '/strategic-planning',
  '/market-intelligence',
  '/marketing-analytics',
  '/brand-management',
  '/content-creation',
  '/public-traffic',
  '/ecommerce',
  '/sales-enablement',
  '/knowledge-base',
  '/efficiency-improvement',
  '/settings',
  '/support'
];

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();

  // 管理每个分组的展开/折叠状态
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(['战略与决策中枢', '增长与运营执行']) // 默认展开第一个分组和增长运营分组
  );

  // 管理每个子菜单的展开/折叠状态
  const [expandedSubMenus, setExpandedSubMenus] = React.useState<Set<string>>(
    new Set(['智能私域增长与运营']) // 默认展开私域子菜单
  );

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  };

  const toggleSubMenu = (itemName: string) => {
    setExpandedSubMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

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

          {/* 分组菜单 */}
          {menuGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.title);
            return (
              <div key={group.title} className="mt-4">
                {/* 分组标题 - 可点击折叠/展开 */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="sidebar-group-title sidebar-group-toggle"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="size-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRightIcon className="size-4 transition-transform duration-200" />
                    )}
                    <span>{group.title}</span>
                  </button>
                )}

                {/* 分组菜单项 - 带折叠动画 */}
                <div className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  !isCollapsed && isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  isCollapsed && "max-h-96 opacity-100" // 侧边栏折叠时始终显示所有项
                )}>
                  <div className="flex flex-col gap-1 mt-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      // 如果有子菜单
                      if (item.subItems) {
                        const isSubExpanded = expandedSubMenus.has(item.name);

                        return (
                          <div key={item.name}>
                            {/* 带子菜单的菜单项 */}
                            <button
                              onClick={() => toggleSubMenu(item.name)}
                              className="sidebar-link justify-start w-full"
                            >
                              <Icon className={cn(
                                "size-6 transition-all duration-200",
                                isSubExpanded && "transform rotate-90"
                              )} />
                              <p className={cn(isCollapsed && 'hidden', 'flex-1 text-left')}>{item.name}</p>
                            </button>

                            {/* 子菜单项 */}
                            <div className={cn(
                              "overflow-hidden transition-all duration-200 ease-in-out ml-4",
                              !isCollapsed && isSubExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0",
                              isCollapsed && "max-h-48 opacity-100"
                            )}>
                              <div className="flex flex-col gap-1 mt-1">
                                {item.subItems.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  const isActive = pathname === subItem.href;
                                  const isUnimplemented = unimplementedRoutes.includes(subItem.href);
                                  const href = isUnimplemented ? 'javascript:void(0)' : subItem.href;

                                  return (
                                    <Link
                                      key={subItem.name}
                                      href={href}
                                      className={cn(
                                        'sidebar-link justify-start text-sm',
                                        isActive && !isUnimplemented && 'sidebar-link-active',
                                        isUnimplemented && 'sidebar-link-disabled'
                                      )}
                                      title={isCollapsed ? subItem.name : undefined}
                                      onClick={isUnimplemented ? (e) => e.preventDefault() : undefined}
                                    >
                                      <SubIcon className="size-5" />
                                      <p className={cn(isCollapsed && 'hidden')}>{subItem.name}</p>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 没有子菜单的普通菜单项
                      const isActive = pathname === item.href;
                      const isUnimplemented = item.href ? unimplementedRoutes.includes(item.href) : false;
                      const href = item.href && !isUnimplemented ? item.href : 'javascript:void(0)';

                      return (
                        <Link
                          key={item.name}
                          href={href}
                          className={cn(
                            'sidebar-link justify-start',
                            isActive && !isUnimplemented && 'sidebar-link-active',
                            isUnimplemented && 'sidebar-link-disabled'
                          )}
                          title={isCollapsed ? item.name : undefined}
                          onClick={isUnimplemented ? (e) => e.preventDefault() : undefined}
                        >
                          <Icon className="size-6" />
                          <p className={cn(isCollapsed && 'hidden')}>{item.name}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部菜单 */}
        <div className="flex flex-col gap-2">
            {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isUnimplemented = unimplementedRoutes.includes(item.href);
                const href = isUnimplemented ? 'javascript:void(0)' : item.href;

                return (
                    <Link
                        key={item.name}
                        href={href}
                        className={cn(
                            'sidebar-link',
                            isActive && !isUnimplemented && 'sidebar-link-active',
                            isUnimplemented && 'sidebar-link-disabled'
                        )}
                        title={isCollapsed ? item.name : undefined}
                        onClick={isUnimplemented ? (e) => e.preventDefault() : undefined}
                    >
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