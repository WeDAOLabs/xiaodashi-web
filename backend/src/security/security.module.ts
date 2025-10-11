import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from '../database/entities/user/user.entity';
import { AccountLockoutService } from './services/account-lockout.service';
import { SecurityController } from './controllers/security.controller';

/**
 * 安全模块
 *
 * 负责处理系统的安全相关功能，包括：
 * - 账户锁定机制
 * - 登录失败处理
 * - 安全策略管理
 * - 管理员安全操作
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    ScheduleModule, // 支持定时任务，用于清理过期锁定
  ],
  controllers: [SecurityController],
  providers: [AccountLockoutService],
  exports: [AccountLockoutService], // 导出服务供其他模块使用
})
export class SecurityModule {}
