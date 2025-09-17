// 使用 sessionStorage 存储用户会话期间的偏好
const SIDEBAR_USER_GROUPS_KEY = 'sidebar_user_groups';
const SIDEBAR_USER_SUBMENUS_KEY = 'sidebar_user_submenus';

// 默认展开的菜单状态
const DEFAULT_EXPANDED_GROUPS = new Set<string>();
const DEFAULT_EXPANDED_SUBMENUS = new Set<string>();

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

// 路由菜单配置接口
interface RouteMenuConfig {
  group: string;
  subMenu?: string;
}

// 统一的路由配置 - 单一数据源
const ROUTE_MENU_CONFIG: Record<string, RouteMenuConfig> = {
  // 战略与决策中枢
  '/strategic-planning': { group: '战略与决策中枢' },
  '/market-intelligence': { group: '战略与决策中枢' },
  '/marketing-analytics': { group: '战略与决策中枢' },

  // 品牌与创意资产
  '/brand-management': { group: '品牌与创意资产' },
  '/content-creation': { group: '品牌与创意资产' },

  // 增长与运营执行
  '/public-traffic': { group: '增长与运营执行' },
  '/ecommerce': { group: '增长与运营执行' },

  // 增长与运营执行 - 智能私域增长与运营
  '/private-growth': { group: '增长与运营执行', subMenu: '智能私域增长与运营' },
  '/private-service-insights': { group: '增长与运营执行', subMenu: '智能私域增长与运营' },
  '/private-user-segmentation': { group: '增长与运营执行', subMenu: '智能私域增长与运营' },
  '/private-communication-strategy': { group: '增长与运营执行', subMenu: '智能私域增长与运营' },

  // 增长与运营执行 - 智能销售赋能
  '/sales-intelligent-agent-config': { group: '增长与运营执行', subMenu: '智能销售赋能' },
  '/sales-intelligent-operation-analytics': { group: '增长与运营执行', subMenu: '智能销售赋能' },
  '/sales-intelligent-conversation-qa': { group: '增长与运营执行', subMenu: '智能销售赋能' },
  '/sales-intelligent-training': { group: '增长与运营执行', subMenu: '智能销售赋能' },

  // 赋能与效率提升
  '/knowledge-base': { group: '赋能与效率提升' },
  '/efficiency-improvement': { group: '赋能与效率提升' },
};

export function getGroupForPath(pathname: string): string | null {
  return ROUTE_MENU_CONFIG[pathname]?.group || null;
}

export function getSubMenuForPath(pathname: string): string | null {
  return ROUTE_MENU_CONFIG[pathname]?.subMenu || null;
}

// 基于路径获取菜单状态（增量式展开）
export function getPathBasedMenuState(pathname: string): MenuState | null {
  const currentGroup = getGroupForPath(pathname);
  const currentSubMenu = getSubMenuForPath(pathname);

  if (!currentGroup) {
    return null;
  }

  // 🔧 关键改动：保持现有用户偏好，在此基础上增量展开
  const userPreferences = loadUserPreferences();
  const expandedGroups = new Set(userPreferences?.expandedGroups || DEFAULT_EXPANDED_GROUPS);
  const expandedSubMenus = new Set(userPreferences?.expandedSubMenus || DEFAULT_EXPANDED_SUBMENUS);

  // 确保当前路径对应的菜单被展开
  expandedGroups.add(currentGroup);
  if (currentSubMenu) {
    expandedSubMenus.add(currentSubMenu);
  }

  return {
    expandedGroups,
    expandedSubMenus
  };
}

// 核心状态决策函数 - 实现智能状态管理
export function determineMenuState(pathname: string): MenuState {
  // 1. 首页/默认页面：保持用户偏好，不强制清除
  if (isDefaultPage(pathname)) {
    const userPreferences = loadUserPreferences();
    return userPreferences || getDefaultMenuState();
  }

  // 2. 有对应菜单的页面：在用户偏好基础上增量展开
  const pathBasedState = getPathBasedMenuState(pathname);
  if (pathBasedState) {
    return pathBasedState;
  }

  // 3. 其他页面：使用用户偏好或默认状态
  const userPreferences = loadUserPreferences();
  return userPreferences || getDefaultMenuState();
}

// 检查当前状态是否应该被路径驱动
export function shouldOverrideUserPreferences(pathname: string): boolean {
  return !isDefaultPage(pathname) && (getGroupForPath(pathname) !== null);
}