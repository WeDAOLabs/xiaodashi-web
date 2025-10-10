/**
 * Next.js 中间件
 *
 * 提供服务端路由保护（SSR）
 * 在用户访问受保护路由时验证 JWT Token
 *
 * ⚠️ 此文件在服务端执行
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

/**
 * 中间件函数
 * 拦截所有匹配的路由请求，进行认证检查
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否为受保护的路由
  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (isProtectedRoute) {
    // 尝试从 Cookie 获取 Token
    let token = request.cookies.get('accessToken')?.value;

    // 如果 Cookie 中没有，尝试从 Authorization header 获取
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // 如果没有 Token，重定向到登录页
    if (!token) {
      console.log(`🔒 未认证访问: ${pathname} - 重定向到登录页`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 验证 Token (异步)
    const payload = await verifyToken(token);

    if (!payload) {
      console.log(`🔒 Token 无效: ${pathname} - 重定向到登录页`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token 有效，允许访问
    console.log(`✅ 认证通过: ${payload.name} 访问 ${pathname}`);

    // 可以在响应头中添加用户信息（可选）
    const response = NextResponse.next();
    response.headers.set('X-User-Id', payload.sub);
    response.headers.set('X-User-Role', payload.role);

    return response;
  }

  // 非受保护路由，直接放行
  return NextResponse.next();
}

/**
 * 中间件配置
 * 定义需要应用中间件的路由规则
 */
export const config = {
  // 匹配所有 /dashboard 及其子路由
  matcher: [
    '/dashboard/:path*',
    // 可以添加更多需要保护的路由
    // '/settings/:path*',
    // '/profile/:path*',
  ],
};
