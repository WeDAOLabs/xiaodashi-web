import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
    issuer: string;
    audience: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  session: {
    secret: string;
    maxAge: number;
  };
}

/**
 * 获取JWT访问密钥，生产环境强制要求配置
 */
function getJwtAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_ACCESS_SECRET is required in production environment');
  }
  return secret || 'dev-access-secret-change-in-production';
}

/**
 * 获取JWT刷新密钥，生产环境强制要求配置
 */
function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET is required in production environment');
  }
  return secret || 'dev-refresh-secret-change-in-production';
}

/**
 * 获取会话密钥，生产环境强制要求配置
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production environment');
  }
  return secret || 'dev-session-secret-change-in-production';
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      accessSecret: getJwtAccessSecret(),
      refreshSecret: getJwtRefreshSecret(),
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      issuer: process.env.JWT_ISSUER || 'xiaodashi-web',
      audience: process.env.JWT_AUDIENCE || 'xiaodashi-users',
    },
    bcrypt: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    },
    session: {
      secret: getSessionSecret(),
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
    },
  }),
);
