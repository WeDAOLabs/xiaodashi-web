// 修复 @nestjs/typeorm@11.0.0 bug: crypto 未导入
// 仅在 Docker 等环境中 crypto 不存在时注入（本地 Node.js v23+ 已内置）
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (!(globalThis as any).crypto) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (globalThis as any).crypto = crypto;
}

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { isOriginAllowed } from './common/utils/cors.util';
import type { AppConfig } from './config/app.config';
import type { SecurityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 获取配置
  const appConfig = configService.get<AppConfig>('app');
  const securityConfig = configService.get<SecurityConfig>('security');

  // 验证必要的环境变量
  validateEnvironment();

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor(configService));

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API路径前缀
  if (appConfig?.apiPrefix) {
    app.setGlobalPrefix(appConfig.apiPrefix);
  }

  // 信任反向代理（阿里云 SLB/ALB、Cloudflare 等）
  // 确保 request.ip 能正确获取客户端真实 IP，而非代理内网 IP
  app.set('trust proxy', true);

  // CORS配置 - 使用动态验证
  app.enableCors({
    origin: (origin, callback) => {
      // 处理非浏览器请求（如 Postman、curl）
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = securityConfig?.cors.origins || [];

      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
      } else {
        logger.warn(`CORS 拒绝来自 ${origin} 的请求`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: securityConfig?.cors.credentials || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Swagger文档配置
  if (appConfig?.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(`${appConfig.name} API`)
      .setDescription('智商180的AI全域营销大师 Web 应用 API 文档')
      .setVersion(appConfig.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appConfig.swagger.path, app, document);
    logger.log(
      `Swagger文档已启用: http://localhost:${appConfig.port}/${appConfig.swagger.path}`,
    );
  }

  // 启动应用
  await app.listen(appConfig?.port || 2999);

  logger.log(`🚀 应用启动成功！`);
  logger.log(`📦 服务版本: ${appConfig?.version || 'unknown'}`);
  logger.log(`🌐 服务地址: http://localhost:${appConfig?.port || 2999}`);
  logger.log(`🔧 运行环境: ${appConfig?.env || 'development'}`);
}

function validateEnvironment() {
  const requiredEnvVars = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `缺少必要的环境变量: ${missingEnvVars.join(', ')}\n` +
        `请检查 .env 文件或设置相应的环境变量。`,
    );
  }
}

void bootstrap();
