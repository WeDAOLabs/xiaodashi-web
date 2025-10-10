'use client';

import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import * as React from 'react';

/**
 * EmailInput 组件 Props
 */
export interface EmailInputProps extends React.ComponentProps<'input'> {
  /** 是否显示邮箱图标 */
  showIcon?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 邮箱输入组件
 * 功能：
 * 1. 标准邮箱输入框
 * 2. 可选的邮箱图标
 * 3. 遵循 Tailwind CSS v4 语法
 * 4. 使用 CSS 变量进行主题化
 * 5. 支持 user-invalid 验证变体（v4 新特性）
 */
export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ showIcon = true, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* 邮箱图标（可选） */}
        {showIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            <Mail className="size-4" />
          </div>
        )}

        {/* 邮箱输入框 */}
        <Input
          ref={ref}
          type="email"
          autoComplete="email"
          className={`${showIcon ? 'pl-10' : ''} ${className || ''}`}
          {...props}
        />
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';
