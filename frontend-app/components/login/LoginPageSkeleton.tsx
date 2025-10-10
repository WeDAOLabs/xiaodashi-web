/**
 * LoginPageSkeleton 组件
 *
 * 登录页面的骨架屏，用于 loading.tsx 的 Suspense 回退 UI
 *
 * 功能特性：
 * - 模拟登录页面的真实布局
 * - 使用 shadcn/ui Skeleton 组件
 * - 与实际登录页面视觉一致
 * - 遵循 Tailwind CSS v4 语法
 *
 * @example
 * ```tsx
 * // 在 app/(auth)/login/loading.tsx 中使用
 * <LoginPageSkeleton />
 * ```
 */

import LogoIcon from '@/components/icons/LogoIcon';
import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

/**
 * LoginPageSkeleton 组件
 */
export function LoginPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--bg-primary)] shadow-xl rounded-2xl">
        {/* Logo 和品牌信息 */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-12 h-12 text-[var(--primary-color)] opacity-50"
              aria-label="加载中"
            >
              <LogoIcon />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] ml-3 opacity-50">
              智赢
            </h1>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] opacity-50">
            智商180的AI全域营销大师
          </p>
        </div>

        {/* 表单骨架 */}
        <div className="space-y-6">
          {/* 邮箱输入框骨架 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* 密码输入框骨架 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* 记住我和忘记密码骨架 */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* 登录按钮骨架 */}
          <Skeleton className="h-10 w-full" />

          {/* 注册链接骨架 */}
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* 第三方登录分隔线骨架 */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-primary)]" />
          </div>
          <div className="relative flex justify-center">
            <Skeleton className="h-4 w-32 bg-[var(--bg-primary)]" />
          </div>
        </div>

        {/* 第三方登录按钮骨架 */}
        <div className="mt-6">
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>

        {/* 页脚链接骨架 */}
        <div className="text-center text-xs mt-8 flex items-center justify-center gap-2">
          <Skeleton className="h-3 w-16" />
          <span className="text-[var(--text-secondary)]">|</span>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export default LoginPageSkeleton;
