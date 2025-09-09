import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());

  // 仅在非生产环境启用 Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('智赢 API')
      .setDescription('智商180的AI全域营销大师 Web 应用 API 文档')
      .setVersion('1.0')
      .addBearerAuth() // 支持 JWT Bearer Token
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // 文档访问路径为 /api-docs
  }

  app.enableCors(); // 启用 CORS
  await app.listen(process.env.PORT ?? 2900);
}
bootstrap();
