'use client';

import LogoIcon from '@/components/icons/LogoIcon';
import { useAuth } from '@/components/layout/AuthContext';
import type { LoginRequest } from '@xiaodashi/shared';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoginForm } from './_components/LoginForm';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already logged in
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
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } else {
      // Set error message for failed login
      setError('登录失败，请检查用户名和密码');
    }

    return success;
  };

  // Don't render the login form if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)] mb-4"></div>
          <p className="text-[var(--text-secondary)]">正在跳转到仪表板...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-[var(--bg-primary)] shadow-xl rounded-2xl">
        <div className="text-center pb-8">
          {/* Logo and brand info */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 text-[var(--primary-color)]">
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

        <div>
          {/* 使用新的 LoginForm 组件 */}
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Third-party login separator */}
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

          {/* Third-party login buttons */}
          <div className="mt-6">
            <div className="flex justify-center">
              <Link
                href="/auth/feishu"
                className="inline-flex items-center justify-center p-3 border border-[var(--border-primary)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
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

          {/* Footer links */}
          <div className="text-center text-xs text-[var(--text-secondary)] mt-8">
            <Link href="/privacy" className="hover:underline hover:text-[var(--text-primary)] transition-colors">
              隐私政策
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:underline hover:text-[var(--text-primary)] transition-colors">
              用户协议
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;