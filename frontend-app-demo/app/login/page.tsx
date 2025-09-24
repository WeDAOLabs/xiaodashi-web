'use client';

import LogoIcon from '@/components/icons/LogoIcon';
import { useAuth } from '@/components/layout/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const success = await login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });
    
    if (success) {
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } else {
      // Set error message for failed login
      setError('登录失败，请检查用户名和密码');
    }
  };

  // Don't render the login form if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)] mb-4"></div>
          <p className="text-gray-600">正在跳转到仪表板...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
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
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input name="remember" type="hidden" value="true" />
            {/* Display error message if exists */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}
            
            {/* Username/Phone/Email and password input fields */}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Label htmlFor="email" className="sr-only">
                  用户名/手机号/邮箱
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="用户名/手机号/邮箱"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  密码
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[var(--primary-color-focus-ring)] focus:border-[var(--primary-color)] focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox 
                  id="remember-me"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color-focus-ring)] border-gray-300 rounded"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  记住我
                </Label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
                >
                  忘记密码?
                </Link>
                <span className="text-gray-500">/</span>
                <Link
                  href="/phone-login"
                  className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
                >
                  手机验证码登录
                </Link>
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color-focus-ring)]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>

            {/* Registration link */}
            <div className="text-sm text-center">
              <span className="text-gray-600">没有账号?</span>
              <Link
                href="/register"
                className="ml-2 font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)]"
              >
                立即注册
              </Link>
            </div>
          </form>

          {/* Third-party login separator */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                或使用第三方登录
              </span>
            </div>
          </div>

          {/* Third-party login buttons */}
          <div className="mt-6">
            <div className="flex justify-center">
              <a className="inline-flex items-center justify-center p-3 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-100" href="#">
                <Image
                  src="/images/feishu-logo.svg"
                  alt="飞书登录"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>

          {/* Footer links */}
          <div className="text-center text-xs text-gray-500 mt-8">
            <Link href="/privacy" className="hover:underline">
              隐私政策
            </Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:underline">
              用户协议
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;