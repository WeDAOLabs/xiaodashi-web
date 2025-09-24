import appConfig from './app.config';
import authConfig from './auth.config';
import databaseConfig from '../database/database.config';
import securityConfig from './security.config';

export const configs = [appConfig, authConfig, databaseConfig, securityConfig];

export { appConfig, authConfig, databaseConfig, securityConfig };
