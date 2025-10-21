import { registerAs } from '@nestjs/config';
import { parseCorsOrigins } from '../common/utils/cors.util';

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
    // 验证码配置
    captcha: {
      enabled: boolean; // 是否启用验证码
      triggerAttempts: number; // 触发验证码的失败次数阈值
      expireTime: number; // 验证码过期时间（分钟）
      maxAttempts: number; // 最大验证尝试次数
      cleanupInterval: number; // 清理间隔（分钟）
      complexity: number; // 验证码复杂度 1-5
      suspiciousIpThreshold: number; // 可疑IP阈值
    };
  };
}

export default registerAs('security', (): SecurityConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // 开发环境默认配置
  const devDefaults = 'http://localhost:3000,http://localhost:3001';

  // 生产环境默认配置（应该从环境变量读取）
  const prodDefaults = '';

  const defaultOrigins = nodeEnv === 'production' ? prodDefaults : devDefaults;

  return {
    cors: {
      origins: parseCorsOrigins(process.env.CORS_ORIGINS || defaultOrigins),
      credentials: process.env.CORS_CREDENTIALS !== 'false', // 默认 true
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
      // 验证码配置
      captcha: {
        enabled: process.env.CAPTCHA_ENABLED === 'true',
        triggerAttempts: parseInt(
          process.env.CAPTCHA_TRIGGER_ATTEMPTS || '2',
          10,
        ),
        expireTime: parseInt(process.env.CAPTCHA_EXPIRE_TIME || '5', 10), // 5分钟
        maxAttempts: parseInt(process.env.CAPTCHA_MAX_ATTEMPTS || '3', 10),
        cleanupInterval: parseInt(
          process.env.CAPTCHA_CLEANUP_INTERVAL || '60',
          10,
        ), // 60分钟
        complexity: parseInt(process.env.CAPTCHA_COMPLEXITY || '3', 10), // 复杂度3
        suspiciousIpThreshold: parseInt(
          process.env.CAPTCHA_SUSPICIOUS_IP_THRESHOLD || '5',
          10,
        ),
      },
    },
  };
});
