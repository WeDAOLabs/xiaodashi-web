/**
 * API 客户端
 *
 * 用于客户端向 Backend 发送 HTTP 请求
 * 自动附加 Authorization header，统一处理错误
 *
 * ⚠️ 此文件在客户端组件中使用
 */

'use client';

import { publicConfig } from '@/lib/config';
import type { ApiErrorResponse, ApiResponse } from '@xiaodashi/shared';

/**
 * API 客户端类
 * 封装 fetch 请求，提供统一的错误处理和 Token 管理
 */
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = publicConfig.backendUrl;
  }

  /**
   * 获取存储的 Access Token
   * @returns Access Token 或 null
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // 优先从 localStorage 获取（rememberMe 用户）
    const token = localStorage.getItem('accessToken');
    if (token) {
      return token;
    }

    // 其次从 sessionStorage 获取
    return sessionStorage.getItem('accessToken');
  }

  /**
   * 发送 HTTP 请求
   * @param endpoint - API 端点路径（如 '/auth/login'）
   * @param options - Fetch 选项
   * @returns Promise<T>
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // 自动附加 Authorization header
    const token = this.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // 处理 401 未授权
      if (response.status === 401) {
        // Token 过期或无效
        // 这里可以触发 Token 刷新逻辑
        throw new ApiError('未授权，请重新登录', 401, 'UNAUTHORIZED');
      }

      // 处理 403 权限不足
      if (response.status === 403) {
        throw new ApiError('权限不足', 403, 'FORBIDDEN');
      }

      // 处理其他错误状态码
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({
            success: false as const,
            error: {
              code: 'UNKNOWN_ERROR',
              message: '请求失败',
            },
            timestamp: new Date().toISOString(),
          }));

        throw new ApiError(
          errorData.error.message || '请求失败',
          response.status,
          errorData.error.code
        );
      }

      // 解析响应数据
      const data = await response.json();

      if (process.env.NODE_ENV === 'development') {
        console.log('[ApiClient Debug] Raw response:', data);
      }

      // 检查是否为标准 ApiResponse 格式
      if ('success' in data) {
        if (!data.success) {
          // 错误响应
          const errorData = data as ApiErrorResponse;
          throw new ApiError(
            errorData.error.message || '操作失败',
            response.status,
            errorData.error.code
          );
        }

        // 成功响应，验证并返回 data 字段
        const successData = data as ApiResponse<T>;

        if (process.env.NODE_ENV === 'development') {
          console.log('[ApiClient Debug] Has data field:', 'data' in successData);
          console.log('[ApiClient Debug] Data value:', successData.data);
        }

        if ('data' in successData && successData.data !== undefined) {
          const unwrapped = successData.data;
          if (process.env.NODE_ENV === 'development') {
            console.log('[ApiClient] Returning unwrapped data:', unwrapped);
          }
          return unwrapped;
        }
      }

      // 兜底：如果不是标准格式，直接返回原始数据
      if (process.env.NODE_ENV === 'development') {
        console.log('[ApiClient Debug] Returning raw data (fallback)');
      }
      return data as T;
    } catch (error) {
      // 网络错误或其他异常
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(
          `网络请求失败: ${error.message}`,
          0,
          'NETWORK_ERROR'
        );
      }

      throw new ApiError('未知错误', 0, 'UNKNOWN_ERROR');
    }
  }

  /**
   * GET 请求
   * @param endpoint - API 端点路径
   * @returns Promise<T>
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST 请求
   * @param endpoint - API 端点路径
   * @param data - 请求体数据
   * @returns Promise<T>
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT 请求
   * @param endpoint - API 端点路径
   * @param data - 请求体数据
   * @returns Promise<T>
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH 请求
   * @param endpoint - API 端点路径
   * @param data - 请求体数据
   * @returns Promise<T>
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE 请求
   * @param endpoint - API 端点路径
   * @returns Promise<T>
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/**
 * API 错误类
 * 封装 API 请求错误信息
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 导出单例实例
export const apiClient = new ApiClient();
