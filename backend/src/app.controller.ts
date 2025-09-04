import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Default') // 在 Swagger UI 中为接口分组
@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: '获取问候语', description: '返回一个简单的 Hello World 信息。' })
  @ApiResponse({ status: 200, description: '成功返回问候语。' })
  getHello() {
    const helloData = this.appService.getHello();
    
    // 遵循 API 设计规范中的统一响应格式
    return {
      success: true,
      data: helloData,
      message: '操作成功',
      code: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
