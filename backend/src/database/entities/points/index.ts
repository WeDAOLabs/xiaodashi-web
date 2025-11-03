/**
 * 积分域实体导出
 * 管理积分相关的所有实体定义
 */

import { TeamPoint } from './team-point.entity';
import { PointTransaction } from './point-transaction.entity';

// 导出积分域实体
export { TeamPoint } from './team-point.entity';
export { PointTransaction } from './point-transaction.entity';

// 积分域实体数组，用于TypeORM配置
export const pointsEntities = [TeamPoint, PointTransaction];
