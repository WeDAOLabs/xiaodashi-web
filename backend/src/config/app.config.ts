import { registerAs } from '@nestjs/config';
import { version } from '../../package.json';

export interface AppConfig {
  name: string;
  version: string;
  env: string;
  port: number;
  apiPrefix: string;
  frontendUrl: string;
  frontendAppUrl: string;
  features: {
    userRegistration: boolean;
    emailVerification: boolean;
    twoFactor: boolean;
    socialLogin: boolean;
  };
  swagger: {
    enabled: boolean;
    path: string;
  };
  health: {
    enabled: boolean;
    path: string;
  };
}

export default registerAs(
  'app',
  (): AppConfig => ({
    name: process.env.APP_NAME || 'xiaodashi-web',
    version: process.env.APP_VERSION || version,
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '2999', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    frontendAppUrl: process.env.FRONTEND_APP_URL || 'http://localhost:3001',
    features: {
      userRegistration: process.env.ENABLE_USER_REGISTRATION === 'true',
      emailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
      twoFactor: process.env.ENABLE_2FA === 'true',
      socialLogin: process.env.ENABLE_SOCIAL_LOGIN === 'true',
    },
    swagger: {
      enabled: process.env.SWAGGER_ENABLED === 'true',
      path: process.env.SWAGGER_PATH || 'api-docs',
    },
    health: {
      enabled: process.env.HEALTH_CHECK_ENABLED === 'true',
      path: process.env.HEALTH_CHECK_PATH || 'health',
    },
  }),
);
