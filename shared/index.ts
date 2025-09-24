/**
 * @xiaodashi/shared 包主入口文件
 * 导出所有共享类型和工具
 * 支持按域命名空间导出，为未来多数据库架构预留扩展空间
 */

// 导出所有类型定义（保持向后兼容）
export * from './types';

// 导出域命名空间（为未来多数据库扩展预留）
export {
  UserDomain,
  AuthDomain,
  ApiTypes,
  DomainTypes
} from './types';

// 导出数据库相关（如果需要的话，可以在这里添加数据库工具函数）
// 当前只有SQL文件，不需要导出

// 版本信息
export const SHARED_VERSION = '1.0.0';

// 预留常量
export const DOMAIN_CONFIG = {
  SUPPORTED_DOMAINS: ['user', 'auth'] as const,
  // 未来扩展：
  // SUPPORTED_DOMAINS: ['user', 'auth', 'business', 'analytics'] as const,
} as const;