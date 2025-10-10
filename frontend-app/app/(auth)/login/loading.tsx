/**
 * 登录页面加载状态 - app/(auth)/login/loading.tsx
 *
 * Next.js 15 Suspense 回退 UI，在登录页面加载时显示
 *
 * 功能特性：
 * - 使用 LoginPageSkeleton 组件
 * - 与实际登录页面布局一致
 * - 提供良好的加载体验
 */

import { LoginPageSkeleton } from '@/components/login/LoginPageSkeleton';

/**
 * 登录加载页面
 */
export default function LoginLoading() {
  return <LoginPageSkeleton />;
}
