/**
 * 服务端 JWT 验证工具
 *
 * ⚠️ 重要：此文件仅在服务端使用
 * - Next.js API Routes
 * - Server Components
 * - Server Actions
 * - Middleware (Edge Runtime)
 *
 * 不要在客户端组件中导入此文件
 *
 * 使用 jose 库以兼容 Edge Runtime
 */

import { jwtVerify } from 'jose';
import { serverConfig } from './config';
import type { JWTPayload, PermissionAction } from '@xiaodashi/shared';

/**
 * 验证 JWT Token
 * @param token - JWT Token 字符串
 * @returns JWT Payload 或 null（验证失败）
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // jose 需要 Uint8Array 格式的 secret
    const secret = new TextEncoder().encode(serverConfig.jwtSecret);

    // 验证 JWT
    const { payload } = await jwtVerify(token, secret);

    return payload as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        console.warn('JWT Token 已过期');
      } else {
        console.error('JWT Token 验证失败:', error.message);
      }
    } else {
      console.error('JWT 验证失败:', error);
    }
    return null;
  }
}

/**
 * 从 HTTP 请求头中提取并验证 Token
 * @param request - Next.js Request 对象
 * @returns JWT Payload 或 null（Token 不存在或验证失败）
 *
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const payload = await verifyTokenFromRequest(request);
 *   if (!payload) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   // 继续处理请求...
 * }
 * ```
 */
export async function verifyTokenFromRequest(request: Request): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return null;
  }

  // 检查是否为 Bearer Token 格式
  if (!authHeader.startsWith('Bearer ')) {
    console.warn('Authorization header 格式错误，应为: Bearer <token>');
    return null;
  }

  // 提取 Token（移除 "Bearer " 前缀）
  const token = authHeader.substring(7);

  return await verifyToken(token);
}

/**
 * 检查用户是否有特定权限
 * @param payload - JWT Payload
 * @param resource - 资源名称（如 'user', 'order', 'product'）
 * @param action - 操作类型（如 'create', 'read', 'update', 'delete'）
 * @returns 是否有权限
 *
 * @example
 * ```ts
 * if (!hasPermission(payload, 'ai', 'generate')) {
 *   return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
 * }
 * ```
 */
export function hasPermission(
  payload: JWTPayload,
  resource: string,
  action: PermissionAction
): boolean {
  // TODO: 根据项目实际的权限系统实现
  // 这里提供一个基础实现示例

  // 方案 1: 如果权限存储在 JWT 的 permissions 数组中
  // const permissionString = `${resource}:${action}`;
  // return payload.permissions?.includes(permissionString) || false;

  // 方案 2: 如果基于角色进行权限控制
  // Admin 拥有所有权限
  if (payload.role === 'admin') {
    return true;
  }

  // Premium 用户拥有部分权限
  if (payload.role === 'premium') {
    // 可以访问 AI 相关功能
    if (resource === 'ai') {
      return true;
    }
  }

  // 普通用户默认权限
  if (action === 'read') {
    return true;
  }

  return false;
}

/**
 * 解码 JWT Token（不验证签名）
 * ⚠️ 注意：此方法不验证 Token 的有效性，仅用于读取 Payload 内容
 * @param token - JWT Token 字符串
 * @returns JWT Payload 或 null（解码失败）
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    // JWT 格式: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // 解码 payload (Base64URL)
    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );

    return decoded as JWTPayload;
  } catch (error) {
    console.error('JWT 解码失败:', error);
    return null;
  }
}

/**
 * 检查 Token 是否已过期
 * @param token - JWT Token 字符串
 * @returns 是否已过期
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp 是 Unix 时间戳（秒）
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}
