/**
 * 存储管理器
 *
 * 提供类型安全的 localStorage/sessionStorage 封装
 * 支持多标签页状态同步
 *
 * ⚠️ 仅在客户端使用
 */

'use client';

/**
 * 存储管理器类
 */
export class StorageManager {
  /**
   * 设置存储项
   * @param key - 存储键
   * @param value - 存储值（自动序列化为 JSON）
   * @param useLocalStorage - 是否使用 localStorage（默认 true）
   */
  static setItem<T>(
    key: string,
    value: T,
    useLocalStorage: boolean = true
  ): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storage = useLocalStorage ? localStorage : sessionStorage;
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
    } catch (error) {
      console.error(`存储项失败 [${key}]:`, error);
    }
  }

  /**
   * 获取存储项
   * @param key - 存储键
   * @param useLocalStorage - 是否使用 localStorage（默认 true）
   * @returns 存储值或 null
   */
  static getItem<T>(key: string, useLocalStorage: boolean = true): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const storage = useLocalStorage ? localStorage : sessionStorage;
      const item = storage.getItem(key);

      if (!item) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`读取存储项失败 [${key}]:`, error);
      return null;
    }
  }

  /**
   * 移除存储项
   * @param key - 存储键
   * @param removeFromBoth - 是否同时从 localStorage 和 sessionStorage 移除
   */
  static removeItem(key: string, removeFromBoth: boolean = true): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (removeFromBoth) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } else {
        // 优先从 localStorage 移除
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        } else {
          sessionStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`移除存储项失败 [${key}]:`, error);
    }
  }

  /**
   * 清除所有存储项
   * @param clearBoth - 是否同时清除 localStorage 和 sessionStorage
   */
  static clearAll(clearBoth: boolean = false): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      sessionStorage.clear();

      if (clearBoth) {
        localStorage.clear();
      }
    } catch (error) {
      console.error('清除存储失败:', error);
    }
  }

  /**
   * 监听存储变化（用于多标签页同步）
   * @param key - 要监听的存储键
   * @param callback - 存储变化时的回调函数
   * @returns 取消监听的函数
   *
   * @example
   * ```ts
   * const unsubscribe = StorageManager.onStorageChange('user', (newValue) => {
   *   console.log('用户信息变更:', newValue);
   * });
   *
   * // 取消监听
   * unsubscribe();
   * ```
   */
  static onStorageChange<T>(
    key: string,
    callback: (newValue: T | null) => void
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleStorageChange = (event: StorageEvent) => {
      // 只处理指定 key 的变化
      if (event.key !== key) {
        return;
      }

      try {
        const newValue = event.newValue ? (JSON.parse(event.newValue) as T) : null;
        callback(newValue);
      } catch (error) {
        console.error(`处理存储变化失败 [${key}]:`, error);
        callback(null);
      }
    };

    // 添加事件监听
    window.addEventListener('storage', handleStorageChange);

    // 返回取消监听函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }

  /**
   * 检查存储项是否存在
   * @param key - 存储键
   * @param checkBoth - 是否同时检查 localStorage 和 sessionStorage
   * @returns 是否存在
   */
  static hasItem(key: string, checkBoth: boolean = true): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    if (checkBoth) {
      return !!(localStorage.getItem(key) || sessionStorage.getItem(key));
    }

    return !!localStorage.getItem(key);
  }

  /**
   * 获取存储大小（估算，单位：字节）
   * @param useLocalStorage - 是否检查 localStorage（默认 true）
   * @returns 存储大小（字节）
   */
  static getStorageSize(useLocalStorage: boolean = true): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    try {
      const storage = useLocalStorage ? localStorage : sessionStorage;
      let size = 0;

      for (const key in storage) {
        if (storage.hasOwnProperty(key)) {
          const value = storage.getItem(key) || '';
          size += key.length + value.length;
        }
      }

      return size * 2; // Unicode 字符占 2 字节
    } catch (error) {
      console.error('计算存储大小失败:', error);
      return 0;
    }
  }
}
