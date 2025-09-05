import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health') // 在 Swagger UI 中为接口分组
@Controller('api/v1/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: '获取健康状态', description: '返回一个简单的健康信息。' })
  @ApiResponse({ status: 200, description: '成功返回健康信息。' })
  getHealth() {
    const healthData = this.healthService.getHealth();
    
    // 遵循 API 设计规范中的统一响应格式
    return {
      success: true,
      data: healthData,
      message: '操作成功',
      code: 200,
      timestamp: new Date().toISOString(),
    };
  }
}
