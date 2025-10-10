/**
 * LoadingSpinner 组件
 *
 * 通用的加载动画指示器，用于全局加载状态展示
 *
 * 功能特性：
 * - 可配置大小（sm、md、lg）
 * - 可配置颜色（使用 CSS 变量）
 * - 可选的文字提示
 * - 响应式设计
 * - 遵循 Tailwind CSS v4 语法
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" text="加载中..." />
 * ```
 */

import { Loader2 } from 'lucide-react';
import * as React from 'react';

/**
 * LoadingSpinner 组件 Props
 */
export interface LoadingSpinnerProps {
  /** 加载动画大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 可选的文字提示 */
  text?: string;
  /** 是否为全屏加载（居中显示） */
  fullScreen?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 尺寸映射
 */
const sizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
} as const;

/**
 * LoadingSpinner 组件
 */
export function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2
        className={`${sizeMap[size]} animate-spin text-[var(--primary-color)]`}
        aria-label="加载中"
      />
      {text && (
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]"
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite">
      {content}
    </div>
  );
}

export default LoadingSpinner;
