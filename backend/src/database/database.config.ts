import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'xiaodashi',

    // Entity 配置
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],

    // Migration 配置
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false, // 生产环境建议手动运行

    // 开发环境配置
    synchronize: process.env.NODE_ENV === 'development', // 生产环境必须为 false
    logging:
      process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],

    // 连接池配置
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
    },

    // SSL 配置（生产环境）
    ssl:
      process.env.DB_SSL === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  }),
);
