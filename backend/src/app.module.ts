import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
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

    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
