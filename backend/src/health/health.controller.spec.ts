import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('getHealth', () => {
    it('should return a success response with health data', () => {
      const result = healthController.getHealth();
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ message: 'OK' });
      expect(result.message).toBe('操作成功');
      expect(result.code).toBe(200);
      expect(typeof result.timestamp).toBe('string');
    });
  });
});
