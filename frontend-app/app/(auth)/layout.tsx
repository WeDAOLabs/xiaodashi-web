/**
 * 认证路由组布局 - (auth)/layout.tsx
 *
 * 为所有认证相关页面（登录、注册、忘记密码等）提供统一的布局和元数据
 *
 * 功能特性：
 * - 全屏布局（不包含导航栏等）
 * - 统一的 SEO 元数据
 * - 已认证用户自动重定向（在客户端组件中处理）
 * - 响应式背景设计
 *
 * 路由组特性：
 * - 使用 (auth) 命名不会影响 URL 路径
 * - 可以为认证页面提供独立的布局结构
 */

import type { Metadata } from 'next';

/**
 * 认证页面统一元数据
 */
export const metadata: Metadata = {
  title: {
    template: '%s | 智赢 AI 营销平台',
    default: '登录 | 智赢 AI 营销平台',
  },
  description: '智赢 AI 全域营销大师 - 智能营销解决方案',
  openGraph: {
    title: '智赢 AI 营销平台',
    description: '智能营销解决方案，助力企业数字化转型',
    type: 'website',
  },
  robots: {
    index: false, // 认证页面不索引
    follow: true,
  },
};

/**
 * 认证布局 Props
 */
interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * 认证布局组件
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[var(--bg-secondary)]">
      {/* 装饰性背景渐变 */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* 主要内容区域 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
