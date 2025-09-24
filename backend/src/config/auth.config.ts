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

export default registerAs('auth', (): AuthConfig => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'xiaodashi-web',
    audience: process.env.JWT_AUDIENCE || 'xiaodashi-users',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  },
}));