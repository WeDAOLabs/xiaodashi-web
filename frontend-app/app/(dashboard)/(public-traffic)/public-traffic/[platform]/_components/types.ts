// 平台类型定义
export type PlatformType = 'douyin' | 'wechat' | 'baidu' | 'xiaohongshu';

// 基础组件Props
export interface BaseTabProps {
  platform: PlatformType;
}

// KPI卡片组件Props
export interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle?: string;
  chart?: React.ReactNode;
}

// AI预警组件Props
export interface AIAlertProps {
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  actions: string[];
}

// 趋势图表组件Props
export interface TrendChartProps {
  data: Array<{ month: string; value: number }>;
  color: string;
  dataKey: string;
  label: string;
  formatValue?: (value: number) => string;
}

// 数据表格列定义
export interface DataTableColumn {
  key: string;
  title: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
}

// 投放计划数据类型
export interface CampaignData {
  id: string;
  name: string;
  parentId?: string;
  type: 'advertiser' | 'campaign';
  aiStatus?: 'high-potential' | 'low-efficiency' | 'optimization-needed' | 'budget-warning';
  status: 'active' | 'paused' | 'ended';
  budget: number;
  todaySpend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  children?: CampaignData[];
  isExpanded?: boolean; // 折叠状态
}

// 创意素材数据类型
export interface CreativeData {
  id: string;
  name: string;
  imageUrl: string;
  ctr: number;
  cvr: number;
  usageCount: number;
  aiScore: number;
}

// 受众数据类型
export interface AudienceData {
  id: string;
  name: string;
  status: 'high-potential' | 'stable' | 'needs-optimization';
  userCount: number;
  createdAt: string;
  usageCount: number;
}

// 预算分配数据类型
export interface BudgetAllocationData {
  campaignName: string;
  spent: number;
  budget: number;
  percentage: number;
  color: string;
}

// AI用户画像数据类型
export interface UserPortraitData {
  ageGroup: string;
  interests: string[];
  activeTime: string;
  location: string[];
}

// AI优化建议数据类型
export interface OptimizationSuggestion {
  type: 'budget' | 'bidding' | 'creative' | 'audience';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

// 图表配置类型
export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

// 折叠状态管理类型
export interface CollapsibleState {
  [key: string]: boolean;
}

// 投放计划管理组件状态
export interface CampaignManagementState {
  expandedItems: CollapsibleState;
  selectedItems: string[];
  allExpanded: boolean;
}