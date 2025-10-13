/**
 * Security域实体导出
 *
 * 包含IP黑名单、白名单、频率限制和访问日志实体
 */

import { IPBlacklist } from './ip-blacklist.entity';
import { IPWhitelist } from './ip-whitelist.entity';
import { IPRateLimit } from './ip-rate-limit.entity';
import { IPAccessLog } from './ip-access-log.entity';

// 导出实体类
export { IPBlacklist } from './ip-blacklist.entity';
export { IPWhitelist } from './ip-whitelist.entity';
export { IPRateLimit } from './ip-rate-limit.entity';
export { IPAccessLog } from './ip-access-log.entity';

// 安全域实体数组
export const securityEntities = [
  IPBlacklist,
  IPWhitelist,
  IPRateLimit,
  IPAccessLog,
];
