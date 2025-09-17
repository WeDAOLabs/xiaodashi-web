// 使用 sessionStorage 存储用户会话期间的偏好
const SIDEBAR_USER_GROUPS_KEY = 'sidebar_user_groups';
const SIDEBAR_USER_SUBMENUS_KEY = 'sidebar_user_submenus';

// 默认展开的菜单状态
const DEFAULT_EXPANDED_GROUPS = new Set(['战略与决策中枢', '增长与运营执行']);
const DEFAULT_EXPANDED_SUBMENUS = new Set(['智能私域增长与运营']);

// 菜单状态接口
export interface MenuState {
  expandedGroups: Set<string>;
  expandedSubMenus: Set<string>;
}

// 判断是否为默认页面（首页等）
export function isDefaultPage(pathname: string): boolean {
  return pathname === '/dashboard' || pathname === '/' || pathname === '';
}

// 获取默认菜单状态
export function getDefaultMenuState(): MenuState {
  return {
    expandedGroups: new Set(DEFAULT_EXPANDED_GROUPS),
    expandedSubMenus: new Set(DEFAULT_EXPANDED_SUBMENUS)
  };
}

// 保存用户偏好状态（会话级）
export function saveUserPreferences(menuState: MenuState): void {
  try {
    sessionStorage.setItem(SIDEBAR_USER_GROUPS_KEY, JSON.stringify(Array.from(menuState.expandedGroups)));
    sessionStorage.setItem(SIDEBAR_USER_SUBMENUS_KEY, JSON.stringify(Array.from(menuState.expandedSubMenus)));
  } catch (error) {
    console.warn('Failed to save user menu preferences:', error);
  }
}

// 加载用户偏好状态
export function loadUserPreferences(): MenuState | null {
  try {
    const groupsData = sessionStorage.getItem(SIDEBAR_USER_GROUPS_KEY);
    const subMenusData = sessionStorage.getItem(SIDEBAR_USER_SUBMENUS_KEY);

    if (groupsData && subMenusData) {
      return {
        expandedGroups: new Set(JSON.parse(groupsData)),
        expandedSubMenus: new Set(JSON.parse(subMenusData))
      };
    }
  } catch (error) {
    console.warn('Failed to load user menu preferences:', error);
  }

  return null;
}

// 清除用户偏好状态
export function clearUserPreferences(): void {
  try {
    sessionStorage.removeItem(SIDEBAR_USER_GROUPS_KEY);
    sessionStorage.removeItem(SIDEBAR_USER_SUBMENUS_KEY);
  } catch (error) {
    console.warn('Failed to clear user menu preferences:', error);
  }
}

export function getGroupForPath(pathname: string): string | null {
  const pathToGroupMap: Record<string, string> = {
    '/strategic-planning': '战略与决策中枢',
    '/market-intelligence': '战略与决策中枢',
    '/marketing-analytics': '战略与决策中枢',
    '/brand-management': '品牌与创意资产',
    '/content-creation': '品牌与创意资产',
    '/public-traffic': '增长与运营执行',
    '/private-growth': '增长与运营执行',
    '/private-service-insights': '增长与运营执行',
    '/private-user-segmentation': '增长与运营执行',
    '/private-communication-strategy': '增长与运营执行',
    '/ecommerce': '增长与运营执行',
    '/sales-intelligent-agent-config': '增长与运营执行',
    '/knowledge-base': '赋能与效率提升',
    '/efficiency-improvement': '赋能与效率提升',
  };

  return pathToGroupMap[pathname] || null;
}

export function getSubMenuForPath(pathname: string): string | null {
  const pathToSubMenuMap: Record<string, string> = {
    '/private-growth': '智能私域增长与运营',
    '/private-service-insights': '智能私域增长与运营',
    '/private-user-segmentation': '智能私域增长与运营',
    '/private-communication-strategy': '智能私域增长与运营',
    '/sales-intelligent-agent-config': '智能销售赋能',
  };

  return pathToSubMenuMap[pathname] || null;
}

// 基于路径获取强制展开的菜单状态
export function getPathBasedMenuState(pathname: string): MenuState | null {
  const currentGroup = getGroupForPath(pathname);
  const currentSubMenu = getSubMenuForPath(pathname);

  if (!currentGroup) {
    return null;
  }

  const expandedGroups = new Set(DEFAULT_EXPANDED_GROUPS);
  const expandedSubMenus = new Set(DEFAULT_EXPANDED_SUBMENUS);

  // 强制展开当前路径对应的分组
  expandedGroups.add(currentGroup);

  // 如果有子菜单，强制展开
  if (currentSubMenu) {
    expandedSubMenus.add(currentSubMenu);
  }

  return {
    expandedGroups,
    expandedSubMenus
  };
}

// 核心状态决策函数 - 实现分层状态管理
export function determineMenuState(pathname: string): MenuState {
  // 1. 首页/默认页面：清除用户偏好，使用默认状态
  if (isDefaultPage(pathname)) {
    clearUserPreferences();
    return getDefaultMenuState();
  }

  // 2. 有对应菜单的页面：使用路径驱动状态（忽略用户偏好）
  const pathBasedState = getPathBasedMenuState(pathname);
  if (pathBasedState) {
    return pathBasedState;
  }

  // 3. 其他页面：尝试使用用户偏好，否则使用默认状态
  const userPreferences = loadUserPreferences();
  return userPreferences || getDefaultMenuState();
}

// 检查当前状态是否应该被路径驱动
export function shouldOverrideUserPreferences(pathname: string): boolean {
  return !isDefaultPage(pathname) && (getGroupForPath(pathname) !== null);
}