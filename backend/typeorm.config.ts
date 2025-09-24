import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// 加载环境变量
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'xiaodashi',

  // Entity 路径
  entities: ['src/database/entities/*.entity{.ts,.js}'],

  // Migration 配置
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',

  // 开发模式配置
  synchronize: false, // Migration 模式下必须为 false
  logging: process.env.NODE_ENV === 'development',

  // SSL 配置
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});