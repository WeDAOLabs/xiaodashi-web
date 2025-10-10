/**
 * 登录表单验证模式
 * 使用 Zod 进行客户端表单验证
 */

import { z } from 'zod';

/**
 * 登录表单验证 Schema
 * 遵循 @xiaodashi/shared 中的 LoginRequest 类型定义
 */
export const loginFormSchema = z.object({
  // 邮箱验证：必填 + 格式验证
  email: z
    .string()
    .min(1, { message: '请输入邮箱地址' })
    .email({ message: '请输入有效的邮箱地址' }),

  // 密码验证：必填 + 最小长度
  password: z
    .string()
    .min(1, { message: '请输入密码' })
    .min(6, { message: '密码长度至少为 6 个字符' }),

  // 记住我：可选布尔字段（与 shared 类型保持一致）
  rememberMe: z.boolean().optional(),
});

/**
 * 从 Zod Schema 推断 TypeScript 类型
 * 这个类型会自动与 @xiaodashi/shared 的 LoginRequest 保持一致
 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;
