import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../database/entities/user/user.entity';
import { AuthConfig } from '../config/auth.config';

/**
 * 认证模块
 *
 * 提供完整的JWT双token认证功能模块，包含：
 * - JWT token生成、验证和管理服务
 * - bcrypt密码加密和验证功能
 * - Passport JWT认证策略
 * - JWT认证守卫和权限控制
 * - 用户登录验证和token刷新机制
 *
 * 该模块可被其他模块导入使用，提供统一的认证服务
 */
@Module({
  imports: [
    // 配置模块 - 用于获取认证相关配置
    ConfigModule,

    // Passport模块 - 提供认证策略基础设施
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),

    // JWT模块 - 动态配置JWT相关参数
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const authConfig = configService.get<AuthConfig>('auth')!;

        return {
          // 这里使用access token的配置作为默认配置
          // 实际使用中，refresh token会在AuthService中单独处理
          secret: authConfig.jwt.accessSecret,
          signOptions: {
            expiresIn: authConfig.jwt.accessExpiresIn,
            issuer: authConfig.jwt.issuer,
            audience: authConfig.jwt.audience,
          },
        };
      },
      inject: [ConfigService],
    }),

    // TypeORM模块 - 注册User实体以供AuthService使用
    TypeOrmModule.forFeature([User]),
  ],

  providers: [
    // 认证服务 - 提供核心的JWT和密码处理功能
    AuthService,

    // JWT认证策略 - 定义如何验证JWT token
    JwtStrategy,

    // JWT认证守卫 - 保护路由的守卫类
    JwtAuthGuard,
  ],

  exports: [
    // 导出认证服务供其他模块使用
    AuthService,

    // 导出JWT认证守卫供其他模块使用
    JwtAuthGuard,

    // 导出JWT模块供其他模块使用
    JwtModule,

    // 导出Passport模块供其他模块使用
    PassportModule,
  ],
})
export class AuthModule {}
