// 知识生命周期管理相关类型定义

export interface StatCardData {
  title: string;
  value: string;
  change?: string;
  subtitle?: string;
  isPositive?: boolean;
}

export interface KnowledgeStorageData {
  core: number;
  edge: number;
  overall: number;
  deficiencies: string[];
}

export interface AIInsight {
  type: 'info' | 'warning' | 'success';
  title: string;
  content: string;
}

export interface KnowledgeStatus {
  id: string;
  color: 'green' | 'yellow' | 'red';
  label: '已发布' | '待审核' | '已过期';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  version: string;
  references: number;
  lastUpdated: string;
  status: KnowledgeStatus;
  isHighFrequency?: boolean;
}

export interface KnowledgeDetailTab {
  id: string;
  label: string;
  active?: boolean;
}

export interface MarketingTag {
  id: string;
  label: string;
  removable?: boolean;
}

export interface KnowledgeDetail {
  id: string;
  title: string;
  version: string;
  status: string;
  content: string;
  tags: MarketingTag[];
}