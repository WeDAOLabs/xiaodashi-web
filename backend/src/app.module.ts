import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { SecurityModule } from './security/security.module';
import { configs } from './config';
import { entities } from './database/entities';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.local', '.env'],
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database') as Record<
          string,
          unknown
        >;
        return {
          ...databaseConfig,
          entities,
        };
      },
      inject: [ConfigService],
    }),

    // 定时任务模块
    ScheduleModule.forRoot(),

    // 限流模块
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 时间窗口：60秒
        limit: 10, // 默认限制：每分钟10次请求
      },
    ]),

    HealthModule,
    AuthModule,
    SessionModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
