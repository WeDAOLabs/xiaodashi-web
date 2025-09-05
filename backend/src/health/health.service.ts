import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth(): { message: string } {
    return { message: 'OK' };
  }
}
