'use client';

import { PHONE_LOGIN_ENABLED } from '@/config/featureFlags';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginRequest } from '@xiaodashi/shared';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { EmailInput } from './EmailInput';
import { loginFormSchema, type LoginFormValues } from './loginFormSchema';
import { PasswordInput } from './PasswordInput';

/**
 * LoginForm 组件 Props
 */
export interface LoginFormProps {
  /** 表单提交处理函数 - 返回 boolean 表示登录是否成功 */
  onSubmit: (values: LoginRequest) => Promise<boolean>;
  /** 是否正在加载 */
  isLoading?: boolean;
  /** 错误消息 */
  error?: string | null;
}

/**
 * 登录表单组件
 *
 * 功能特性：
 * 1. 基于 react-hook-form + zod 的表单验证
 * 2. 集成 shadcn/ui Form 组件
 * 3. 邮箱输入 + 密码显示/隐藏 + 密码强度指示器
 * 4. 记住我功能
 * 5. 完整的错误处理和 Loading 状态
 * 6. 遵循 Tailwind CSS v4 语法和 CSS 变量规范
 * 7. 响应式设计支持
 */
export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  // 初始化表单
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onBlur', // 失焦时触发验证
  });

  // 表单提交处理
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      // 错误由父组件处理
      console.error('Login form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 全局错误消息 */}
        {error && (
          <div className="rounded-md bg-[var(--warning-bg)] border border-[var(--warning-border)] p-4">
            <div className="text-sm text-[var(--warning-color)] font-medium">
              {error}
            </div>
          </div>
        )}

        {/* 邮箱字段 */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱地址</FormLabel>
              <FormControl>
                <EmailInput
                  placeholder="请输入邮箱地址"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 密码字段 */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="请输入密码"
                  showStrengthIndicator={false}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 记住我 + 忘记密码 */}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  记住我
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)] transition-colors"
            >
              忘记密码?
            </Link>
            {PHONE_LOGIN_ENABLED && (
              <>
                <span className="text-[var(--text-secondary)] mx-2">/</span>
                <Link
                  href="/phone-login"
                  className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)] transition-colors"
                >
                  手机验证码登录
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 登录按钮 */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </Button>

        {/* 注册链接 */}
        <div className="text-sm text-center">
          <span className="text-[var(--text-secondary)]">没有账号?</span>
          <Link
            href="/register"
            className="ml-2 font-medium text-[var(--primary-color)] hover:text-[var(--primary-hover)] transition-colors"
          >
            立即注册
          </Link>
        </div>
      </form>
    </Form>
  );
}
