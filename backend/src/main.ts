import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 仅在非生产环境启用 Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('肖大师 API')
      .setDescription('肖大师 Web 应用 API 文档')
      .setVersion('1.0')
      .addBearerAuth() // 支持 JWT Bearer Token
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // 文档访问路径为 /api-docs
  }

  app.enableCors(); // 启用 CORS
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
