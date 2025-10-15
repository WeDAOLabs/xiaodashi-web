'use client';

/**
 * 登录页面 - app/(auth)/login/page.tsx
 *
 * 完整的登录页面实现，集成 LoginForm 组件和 AuthProvider
 *
 * 功能特性：
 * 1. ✅ 表单提交和认证流程
 * 2. ✅ 响应式布局（桌面端）
 * 3. ✅ 加载状态和错误处理
 * 4. ✅ 已认证用户自动重定向
 * 5. ✅ 键盘导航支持
 * 6. ✅ 无障碍访问（ARIA 标签）
 * 7. ✅ 页面入场动画（Tailwind v4）
 * 8. ✅ SEO 优化元数据（通过 layout.tsx）
 * 9. ✅ 第三方登录支持（飞书）
 * 10. ✅ 遵循 Tailwind CSS v4 和 CSS 变量规范
 */

import LogoIcon from '@/components/icons/LogoIcon';
import { useAuth } from '@/components/layout/AuthContext';
import { SOCIAL_LOGIN_ENABLED } from '@/config/featureFlags';
import type { LoginRequest } from '@xiaodashi/shared';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LoginForm } from './_components/LoginForm';

/**
 * 登录页面组件
 */
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  // 已登录用户自动重定向到仪表板
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // 处理表单提交
  const handleSubmit = async (values: LoginRequest): Promise<boolean> => {
    setError(null);

    const success = await login(values);

    if (success) {
      // 登录成功，跳转到仪表板
      router.push('/dashboard');
    } else {
      // 登录失败，设置错误消息
      setError('登录失败，请检查邮箱和密码是否正确');
    }

    return success;
  };

  // 如果用户已登录，显示加载状态
  if (user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]"
        role="status"
        aria-live="polite"
        aria-label="正在跳转到仪表板"
      >
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full size-8 border-2 border-t-transparent border-[var(--primary-color)] mb-4"
            aria-hidden="true"
          />
          <p className="text-[var(--text-secondary)]">正在跳转到仪表板...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="max-w-md w-full space-y-8 p-10 bg-[var(--bg-primary)] shadow-xl rounded-2xl transition-all duration-500 starting:opacity-0 starting:scale-95"
        role="main"
        aria-labelledby="login-title"
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
            <h1
              id="login-title"
              className="text-3xl font-bold text-[var(--text-primary)] ml-3"
            >
              智赢
            </h1>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            智商180的AI全域营销大师
          </p>
        </div>

        {/* 登录表单区域 */}
        <div>
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* 第三方登录分隔线 */}
          {SOCIAL_LOGIN_ENABLED && (
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-primary)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                  或使用第三方登录
                </span>
              </div>
            </div>
          )}

          {/* 第三方登录按钮 */}
          {SOCIAL_LOGIN_ENABLED && (
            <div className="mt-6">
              <div className="flex justify-center">
                <Link
                  href="/auth/feishu"
                  className="inline-flex items-center justify-center p-3 border border-[var(--border-primary)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
                  aria-label="使用飞书登录"
                >
                  <Image
                    src="/images/feishu-logo.svg"
                    alt="飞书"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
              </div>
            </div>
          )}

          {/* 页脚链接 */}
          <div
            className="text-center text-xs text-[var(--text-secondary)] mt-8 pt-6 border-t border-[var(--border-primary)]"
            role="contentinfo"
          >
            <Link
              href="/privacy"
              className="hover:underline hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 rounded"
            >
              隐私政策
            </Link>
            <span className="mx-2" aria-hidden="true">|</span>
            <Link
              href="/terms"
              className="hover:underline hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 rounded"
            >
              用户协议
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
