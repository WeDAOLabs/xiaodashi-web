import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import type { AppConfig } from './config/app.config';
import type { SecurityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 获取配置
  const appConfig = configService.get<AppConfig>('app');
  const securityConfig = configService.get<SecurityConfig>('security');

  // 验证必要的环境变量
  validateEnvironment();

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

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

  // CORS配置
  app.enableCors({
    origin: securityConfig?.cors.origins || ['http://localhost:3000'],
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

bootstrap();
