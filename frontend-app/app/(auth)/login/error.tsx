/**
 * 登录页面错误处理 - app/(auth)/login/error.tsx
 *
 * Next.js 15 错误边界，捕获登录页面的错误
 *
 * 功能特性：
 * - 友好的错误提示
 * - 重试按钮
 * - 返回首页链接
 * - 错误日志记录
 * - 遵循 Tailwind CSS v4 语法
 */

'use client';

import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

/**
 * 错误页面 Props
 */
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 登录错误页面
 */
export default function LoginError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 记录错误到控制台（生产环境应发送到错误追踪服务）
    console.error('登录页面错误:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--bg-primary)] shadow-xl rounded-2xl">
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

        {/* 错误信息 */}
        <div
          className="rounded-lg bg-[var(--warning-bg)] border border-[var(--warning-border)] p-6"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="size-5 text-[var(--warning-color)] flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--warning-color)] mb-2">
                页面加载出错
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                抱歉，登录页面加载时遇到了问题。请尝试刷新页面或稍后再试。
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="text-xs text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-secondary)]">
                    技术详情（仅开发环境）
                  </summary>
                  <pre className="mt-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] p-3 rounded overflow-auto max-h-32">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
            aria-label="重试加载登录页面"
          >
            重试
          </Button>

          <Link href="/" className="block">
            <Button
              variant="outline"
              className="w-full"
              aria-label="返回首页"
            >
              返回首页
            </Button>
          </Link>
        </div>

        {/* 帮助信息 */}
        <div className="text-center text-xs text-[var(--text-secondary)] mt-6 pt-6 border-t border-[var(--border-primary)]">
          <p>
            如果问题持续存在，请
            <Link
              href="/support"
              className="text-[var(--primary-color)] hover:underline ml-1"
            >
              联系技术支持
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
