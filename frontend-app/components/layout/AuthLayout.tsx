/**
 * AuthLayout 组件
 *
 * 认证页面（登录、注册、忘记密码等）的通用布局容器
 *
 * 功能特性：
 * - 全屏居中布局
 * - 品牌 Logo 和标题展示
 * - 响应式卡片容器
 * - 页脚链接支持
 * - 遵循 Tailwind CSS v4 语法和 CSS 变量规范
 *
 * @example
 * ```tsx
 * <AuthLayout
 *   title="登录"
 *   subtitle="欢迎回来"
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */

import LogoIcon from '@/components/icons/LogoIcon';
import Link from 'next/link';
import * as React from 'react';

/**
 * AuthLayout 组件 Props
 */
export interface AuthLayoutProps {
  /** 页面标题 */
  title?: string;
  /** 副标题或描述 */
  subtitle?: string;
  /** 子内容（表单等） */
  children: React.ReactNode;
  /** 是否显示页脚链接 */
  showFooter?: boolean;
  /** 自定义页脚链接 */
  footerLinks?: Array<{ href: string; label: string }>;
}

/**
 * 默认页脚链接
 */
const defaultFooterLinks = [
  { href: '/privacy', label: '隐私政策' },
  { href: '/terms', label: '用户协议' },
];

/**
 * AuthLayout 组件
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  showFooter = true,
  footerLinks = defaultFooterLinks,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-md w-full space-y-8 p-10 bg-[var(--bg-primary)] shadow-xl rounded-2xl transition-all duration-500 starting:opacity-0 starting:scale-95"
        role="main"
      >
        {/* Logo 和品牌信息 */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-12 h-12 text-[var(--primary-color)]"
              aria-label="智赢 AI 营销平台 Logo"
            >
              <LogoIcon />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] ml-3">
              智赢
            </h1>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            智商180的AI全域营销大师
          </p>
        </div>

        {/* 页面标题和描述 */}
        {(title || subtitle) && (
          <div className="text-center space-y-2 pb-4">
            {title && (
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* 主要内容区域 */}
        <div>{children}</div>

        {/* 页脚链接 */}
        {showFooter && footerLinks.length > 0 && (
          <div className="text-center text-xs text-[var(--text-secondary)] mt-8 pt-6 border-t border-[var(--border-primary)]">
            {footerLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                {index > 0 && <span className="mx-2">|</span>}
                <Link
                  href={link.href}
                  className="hover:underline hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;
