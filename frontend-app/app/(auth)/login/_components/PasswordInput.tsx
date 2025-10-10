'use client';

import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

/**
 * 密码强度等级枚举
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

/**
 * 密码强度指示器颜色映射（使用 CSS 变量）
 */
const strengthColors: Record<PasswordStrength, string> = {
  [PasswordStrength.WEAK]: 'var(--warning-color)',
  [PasswordStrength.MEDIUM]: 'var(--info-color)',
  [PasswordStrength.STRONG]: 'var(--success-color)',
};

/**
 * 密码强度文本映射
 */
const strengthText: Record<PasswordStrength, string> = {
  [PasswordStrength.WEAK]: '弱',
  [PasswordStrength.MEDIUM]: '中',
  [PasswordStrength.STRONG]: '强',
};

/**
 * 计算密码强度
 * 规则：
 * - 长度 < 8：弱
 * - 长度 >= 8 && 包含数字和字母：中
 * - 长度 >= 10 && 包含数字、字母和特殊字符：强
 */
export function calculatePasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;

  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < 8) {
    return PasswordStrength.WEAK;
  }

  if (password.length >= 10 && hasNumber && hasLetter && hasSpecialChar) {
    return PasswordStrength.STRONG;
  }

  if (password.length >= 8 && hasNumber && hasLetter) {
    return PasswordStrength.MEDIUM;
  }

  return PasswordStrength.WEAK;
}

/**
 * PasswordInput 组件 Props
 */
export interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  /** 是否显示密码强度指示器 */
  showStrengthIndicator?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 密码输入组件
 * 功能：
 * 1. 密码显示/隐藏切换
 * 2. 密码强度指示器（可选）
 * 3. 遵循 Tailwind CSS v4 语法
 * 4. 使用 CSS 变量进行主题化
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthIndicator = false, className, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState<PasswordStrength | null>(null);

    // 监听密码值变化，计算强度
    React.useEffect(() => {
      if (showStrengthIndicator && typeof value === 'string') {
        setStrength(calculatePasswordStrength(value));
      }
    }, [value, showStrengthIndicator]);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={className}
          {...props}
        />

        {/* 密码显示/隐藏按钮 */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={showPassword ? '隐藏密码' : '显示密码'}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>

        {/* 密码强度指示器 */}
        {showStrengthIndicator && strength && typeof value === 'string' && value.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width:
                    strength === PasswordStrength.WEAK
                      ? '33.33%'
                      : strength === PasswordStrength.MEDIUM
                      ? '66.66%'
                      : '100%',
                  backgroundColor: strengthColors[strength],
                }}
              />
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: strengthColors[strength] }}
            >
              {strengthText[strength]}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
