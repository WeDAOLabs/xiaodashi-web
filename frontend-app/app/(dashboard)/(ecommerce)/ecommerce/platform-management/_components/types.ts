// 平台类型定义
export interface Platform {
  id: string;
  name: string;
  status: 'authorized' | 'unauthorized';
  logo: React.ReactNode;
  stats?: {
    averageSales: string;
    conversionRate: string;
    issues: number;
  };
  aiInsight: string;
}

// 店铺类型定义
export interface Store {
  id: string;
  name: string;
  storeId: string;
  platform: string;
  gmv: string;
  orders: number;
  conversionRate: string;
  hotProduct: string;
  riskLevel: 'low' | 'medium' | 'high';
  aiInsight: string;
}

// 集成工具类型定义
export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  avatar: string;
  color: string;
}

// 表格选择状态
export interface TableSelection {
  selectedStores: string[];
  allSelected: boolean;
}