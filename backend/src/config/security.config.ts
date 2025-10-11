import { registerAs } from '@nestjs/config';

export interface SecurityConfig {
  cors: {
    origins: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  loginRateLimit: {
    windowMs: number;
    maxAttempts: number;
  };
  security: {
    maxLoginAttempts: number;
    accountLockoutTime: number;
    minUsernameLength: number;
    minPasswordLength: number;
    // 渐进式锁定策略配置
    progressiveLockout: {
      levels: Array<{
        attempts: number; // 失败尝试次数阈值
        duration: number; // 锁定时长（分钟）
      }>;
      resetPeriod: number; // 重置周期（小时）
    };
  };
}

export default registerAs(
  'security',
  (): SecurityConfig => ({
    cors: {
      origins: (
        process.env.CORS_ORIGINS ||
        'http://localhost:3000,http://localhost:3001'
      )
        .split(',')
        .map((origin) => origin.trim()),
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    loginRateLimit: {
      windowMs: parseInt(
        process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000',
        10,
      ),
      maxAttempts: parseInt(
        process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS || '5',
        10,
      ),
    },
    security: {
      maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
      accountLockoutTime:
        parseInt(process.env.ACCOUNT_LOCKOUT_TIME || '15', 10) * 60 * 1000, // 转换为毫秒
      minUsernameLength: parseInt(process.env.MIN_USERNAME_LENGTH || '2', 10),
      minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH || '8', 10),
      // 渐进式锁定策略配置
      progressiveLockout: {
        levels: [
          { attempts: 3, duration: 5 }, // 3次失败 - 锁定5分钟
          { attempts: 5, duration: 15 }, // 5次失败 - 锁定15分钟
          { attempts: 10, duration: 60 }, // 10次失败 - 锁定1小时
        ],
        resetPeriod: parseInt(
          process.env.LOCKOUT_RESET_PERIOD_HOURS || '24',
          10,
        ), // 24小时重置周期
      },
    },
  }),
);
