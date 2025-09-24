/**
 * 工具聚合页面的类型定义
 */

import type { LucideIcon } from 'lucide-react';

/**
 * 工具项接口定义
 */
export interface ToolItem {
  /** 工具唯一标识 */
  id: string;
  /** 工具标题 */
  title: string;
  /** 工具图标组件 */
  icon: LucideIcon;
  /** 解决的痛点描述 */
  painPoint: string;
  /** 用户价值描述 */
  userValue: string;
  /** 功能特点列表 */
  features: string[];
  /** 是否已收藏 */
  isFavorite?: boolean;
  /** 工具操作链接 */
  actionUrl?: string;
}

/**
 * 工具卡片组件的 Props
 */
export interface ToolCardProps {
  /** 工具信息 */
  tool: ToolItem;
  /** 点击立即使用按钮的回调 */
  onActionClick?: (tool: ToolItem) => void;
  /** 点击收藏按钮的回调 */
  onToggleFavorite?: (toolId: string, isFavorite: boolean) => void;
  /** 自定义 CSS 类名 */
  className?: string;
}

/**
 * 工具网格组件的 Props
 */
export interface ToolGridProps {
  /** 工具列表 */
  tools: ToolItem[];
  /** 点击立即使用按钮的回调 */
  onActionClick?: (tool: ToolItem) => void;
  /** 点击收藏按钮的回调 */
  onToggleFavorite?: (toolId: string, isFavorite: boolean) => void;
  /** 自定义 CSS 类名 */
  className?: string;
}