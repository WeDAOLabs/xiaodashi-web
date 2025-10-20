import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// 加载环境变量
config();

// 主数据源配置（当前单数据库架构）
// 为未来多数据库扩展预留命名和结构
export default new DataSource({
  name: 'default', // 为多数据源预留命名
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'xiaodashi',

  // Entity 路径 - 按域组织（为未来多数据库拆分做准备）
  entities: [
    'src/database/entities/user/*.entity{.ts,.js}',     // 用户域实体
    'src/database/entities/auth/*.entity{.ts,.js}',     // 认证域实体
    'src/database/entities/security/*.entity{.ts,.js}', // 安全域实体
    // 未来可以轻松拆分到不同数据源：
    // 'src/database/entities/business/*.entity{.ts,.js}', // 业务域实体
    // 'src/database/entities/analytics/*.entity{.ts,.js}', // 分析域实体
  ],

  // Migration 配置
  // 生产环境使用编译后的 .js，开发环境使用 .ts
  migrations: process.env.NODE_ENV === 'production'
    ? ['backend/dist/src/database/migrations/*.js']
    : ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',

  // 开发模式配置
  synchronize: false, // Migration 模式下必须为 false
  logging: process.env.NODE_ENV === 'development',

  // SSL 配置 - 根据 DB_SSL 环境变量决定
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
  } : false,
});

// 预留多数据源配置结构（未来使用时取消注释）
/*
export const UserDataSource = new DataSource({
  name: 'user',
  type: 'postgres',
  host: process.env.USER_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.USER_DB_NAME || 'xiaodashi_users',
  entities: ['src/database/entities/user/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/user/*{.ts,.js}'],
  migrationsTableName: 'user_migrations',
  // ... 其他配置
});

export const AuthDataSource = new DataSource({
  name: 'auth',
  type: 'postgres',
  host: process.env.AUTH_DB_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.AUTH_DB_NAME || 'xiaodashi_auth',
  entities: ['src/database/entities/auth/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/auth/*{.ts,.js}'],
  migrationsTableName: 'auth_migrations',
  // ... 其他配置
});

export const DataSources = {
  default: AppDataSource,
  user: UserDataSource,
  auth: AuthDataSource,
};
*/