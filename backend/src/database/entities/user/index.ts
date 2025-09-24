/**
 * 用户域实体导出
 * 包含用户相关的所有数据实体
 */

// 导入实体类
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UserSession } from './user-session.entity';
import { UserLoginLog } from './user-login-log.entity';

// 用户基础实体
export { User } from './user.entity';
export { UserProfile } from './user-profile.entity';

// 用户会话和日志实体
export { UserSession } from './user-session.entity';
export { UserLoginLog } from './user-login-log.entity';

// 用户域实体数组，用于 TypeORM 配置
export const userEntities = [User, UserProfile, UserSession, UserLoginLog];
