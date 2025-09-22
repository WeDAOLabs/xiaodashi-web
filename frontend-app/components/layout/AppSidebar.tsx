'use client';

import CalendarIcon from '@/components/icons/CalendarIcon';
import ChartLineIcon from '@/components/icons/ChartLineIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import FileTextIcon from '@/components/icons/FileTextIcon';
import GearIcon from '@/components/icons/GearIcon';
import HomeIcon from '@/components/icons/HomeIcon';
import LogoIcon from '@/components/icons/LogoIcon';
import MegaphoneIcon from '@/components/icons/MegaphoneIcon';
import PresentationChartIcon from '@/components/icons/PresentationChartIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import TargetIcon from '@/components/icons/TargetIcon';
import TrendingUpIcon from '@/components/icons/TrendingUpIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import UsersThreeIcon from '@/components/icons/UsersThreeIcon';
import { useAuth } from '@/components/layout/AuthContext';
import {
  getDefaultMenuState,
  loadUserPreferences,
  saveUserPreferences,
  type MenuState
} from '@/lib/sidebarState';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
      {
        name: '智能业务与营销战略规划',
        icon: PresentationChartIcon,
        subItems: [
          { name: '战略制定和宏观分析', href: '/strategic-planning-analysis', icon: ChartLineIcon },
          { name: '年度营销规划', href: '/strategic-planning-annual-planning', icon: CalendarIcon },
          { name: '营销目标拆解与策略规划', href: '/strategic-planning-marketing-goal-decomposition', icon: TargetIcon },
          { name: '产品策略与创新', href: '/strategic-planning-business-marketing-strategy', icon: TrendingUpIcon },
          { name: '高层决策支持与会议报告', href: '/strategic-planning-executive-reporting', icon: PresentationChartIcon },
          { name: '营销活动方案与管理', href: '/strategic-planning-campaign-management', icon: MegaphoneIcon },
        ]
      },
      {
        name: '智能市场洞察与竞品分析',
        icon: PresentationChartIcon,
        subItems: [
          { name: '宏观环境监测', href: '/market-intelligence-macro-monitoring', icon: ChartLineIcon },
          { name: '竞品深度分析', href: '/market-intelligence-competitor-analysis', icon: TargetIcon },
          { name: '消费者洞察与细分', href: '/market-intelligence-consumer-insights', icon: UsersIcon },
          { name: '预测与预警概览', href: '/market-intelligence-prediction-overview', icon: TrendingUpIcon },
          { name: '市场与竞品洞察项目管理', href: '/market-intelligence-project-management', icon: FileTextIcon },
        ]
      },
      {
        name: '智能营销效果评估与数据分析',
        icon: PresentationChartIcon,
        subItems: [
          { name: '智能营销效果总览', href: '/marketing-analytics/overview', icon: ChartLineIcon },
        ]
      },
    ],
  },
  {
    title: '品牌与创意资产',
    items: [
      {
        name: '智能品牌与IP资产管理',
        icon: FileTextIcon,
        subItems: [
          { name: '品牌健康度持续监测与提升', href: '/brand-management-health-monitoring', icon: ChartLineIcon },
          { name: 'IP资产智能评估与商业化孵化', href: '/brand-management-ip-evaluation', icon: TargetIcon },
          { name: '品牌/IP危机预警与舆情管理', href: '/brand-management-crisis-management', icon: MegaphoneIcon },
          { name: 'IP打造与定位', href: '/brand-management-ip-creation', icon: FileTextIcon }
        ]
      },
      {
        name: '智能内容创作与素材中心',
        icon: FileTextIcon,
        subItems: [
          { name: '营销文案智能创作与优化', href: '/content-creation-copywriting', icon: FileTextIcon },
          { name: 'AI文案生成与编辑', href: '/content-creation-ai-editor', icon: FileTextIcon },
          { name: '朋友圈内容日历与管理', href: '/content-creation-social-calendar', icon: CalendarIcon },
          { name: '视觉内容智能生成与编辑', href: '/content-creation-visual-generation', icon: FileTextIcon },
          { name: '听觉内容智能创作与编辑', href: '/content-creation-audio-center', icon: FileTextIcon },
          { name: '智能素材资产管理与协同', href: '/content-creation-material-center', icon: FileTextIcon }
        ]
      },
    ],
  },
  {
    title: '增长与运营执行',
    items: [
      {
        name: '智能公域流量投放与优化',
        icon: ChartLineIcon,
        subItems: [
          { name: '投放平台数据概览', href: '/public-traffic/overview', icon: PresentationChartIcon }
        ]
      },
      {
        name: '智能私域增长与运营',
        icon: ChartLineIcon,
        subItems: [
          { name: 'AI私域客户洞察中心', href: '/private-growth', icon: UsersIcon },
          { name: '产品与服务优化洞察', href: '/private-service-insights', icon: TrendingUpIcon },
          { name: '用户分层与自动化标签中心', href: '/private-user-segmentation', icon: UsersThreeIcon },
          { name: '智能沟通话术与策略中心', href: '/private-communication-strategy', icon: MegaphoneIcon }
        ]
      },
      { name: '智能电商运营与转化', href: '/ecommerce', icon: ChartLineIcon },
      {
        name: '智能销售赋能',
        icon: ChartLineIcon,
        subItems: [
          { name: '智能销售员设置与策略配置', href: '/sales-intelligent-agent-config', icon: GearIcon },
          { name: '销售运营数据与分析', href: '/sales-intelligent-operation-analytics', icon: ChartLineIcon },
          { name: '对话质检与优化', href: '/sales-intelligent-conversation-qa', icon: MegaphoneIcon },
          { name: '销售陪练', href: '/sales-intelligent-training', icon: UsersIcon }
        ]
      },
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

// 区域3: 工具栏导航项
const utilityNavItems = [
    { name: '设置', icon: GearIcon, href: '/settings' },
    { name: '帮助与支持', icon: QuestionIcon, href: '/support' },
]

// 未实现的功能路由列表
const unimplementedRoutes = [
  '/brand-management',
  '/ecommerce',
  '/sales-enablement',
  '/knowledge-base',
  '/efficiency-improvement',
  '/settings',
  '/support',
];

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // 简化的状态管理 - 由于组件不再重新挂载，状态会自然保持
  const [menuState, setMenuState] = React.useState<MenuState>(() => {
    // 初始化时从 sessionStorage 加载用户偏好，如果没有则使用默认状态
    return loadUserPreferences() || getDefaultMenuState();
  });

  const { expandedGroups, expandedSubMenus } = menuState;

  // 自动保存用户操作到 sessionStorage
  React.useEffect(() => {
    saveUserPreferences(menuState);
  }, [menuState]);

  const toggleGroup = (groupTitle: string) => {
    setMenuState(prev => {
      const newExpandedGroups = new Set(prev.expandedGroups);
      if (newExpandedGroups.has(groupTitle)) {
        newExpandedGroups.delete(groupTitle);
      } else {
        newExpandedGroups.add(groupTitle);
      }
      return {
        ...prev,
        expandedGroups: newExpandedGroups
      };
    });
  };

  const toggleSubMenu = (itemName: string) => {
    setMenuState(prev => {
      const newExpandedSubMenus = new Set(prev.expandedSubMenus);
      if (newExpandedSubMenus.has(itemName)) {
        newExpandedSubMenus.delete(itemName);
      } else {
        newExpandedSubMenus.add(itemName);
      }
      return {
        ...prev,
        expandedSubMenus: newExpandedSubMenus
      };
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // 即使登出失败也跳转到登录页
      router.push('/login');
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="flex h-full min-h-[700px] flex-col bg-[var(--bg-primary)]">
        {/* 区域0: 顶部 Logo */}
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <div className={cn(
            "flex items-center gap-4 p-3 rounded-lg",
            isCollapsed && "justify-center"
          )}>
            <div className="size-8">
              <LogoIcon />
            </div>
            {!isCollapsed && (
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[var(--text-primary)]">
                智赢
              </h2>
            )}
          </div>
        </div>

        {/* 区域1: 首页导航 */}
        <div className="px-4 py-3">
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
        </div>

        {/* 区域2: 主要菜单区域 */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="flex flex-col gap-1">
            {/* 分组菜单 */}
            {menuGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.title);
              return (
                <div key={group.title} className="mt-3 first:mt-0">
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
                    !isCollapsed && isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0",
                    isCollapsed && "max-h-none opacity-100" // 侧边栏折叠时始终显示所有项
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
                                !isCollapsed && isSubExpanded ? "max-h-[calc(6*3rem)] opacity-100" : "max-h-0 opacity-0",
                                isCollapsed && "max-h-[calc(6*3rem)] opacity-100"
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
        </div>

        {/* 区域3: 工具栏 */}
        <div className="px-4 py-3">
          <div className="flex flex-col gap-1">
            {utilityNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isUnimplemented = unimplementedRoutes.includes(item.href);
              const href = isUnimplemented ? 'javascript:void(0)' : item.href;

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

        {/* 区域4: 用户信息 */}
        <div className="px-4 py-3 border-t border-[var(--border-secondary)]">
          {user ? (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-lg",
              isCollapsed && "justify-center"
            )}>
              <div className="relative size-8">
                <Image
                  src={user.avatar || "/images/dashboard/avatar.png"}
                  alt="User Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-lg",
              isCollapsed && "justify-center"
            )}>
              <div className="relative size-8">
                <Image
                  src="/images/dashboard/avatar.png"
                  alt="User Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;