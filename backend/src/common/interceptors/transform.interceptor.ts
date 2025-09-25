import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

export interface Response<T> {
  data: T;
  success: boolean;
  message: string;
  code: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const response = context.switchToHttp().getResponse<ExpressResponse>();
        return {
          success: true,
          message: '操作成功',
          code: response.statusCode,
          timestamp: new Date().toISOString(),
          data,
        };
      }),
    );
  }
}
