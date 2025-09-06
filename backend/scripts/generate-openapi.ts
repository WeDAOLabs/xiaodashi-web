import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenApiSpec() {
  // 创建一个无日志输出的“无头”应用实例
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('智商180的AI全域营销大师 API')
    .setDescription('肖大师 Web 应用 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);

  // 定义输出路径为 backend/openapi.json
  const outputPath = path.resolve(process.cwd(), 'openapi.json');
  
  // 将文档对象写入文件
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`✅ OpenAPI specification generated at ${outputPath}`);
  
  // 关闭应用实例
  await app.close();
}

generateOpenApiSpec();
