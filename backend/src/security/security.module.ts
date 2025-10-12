import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from '../database/entities/user/user.entity';
import { CaptchaSession } from '../database/entities/user/captcha-session.entity';
import { UserLoginLog } from '../database/entities/user/user-login-log.entity';
import { AccountLockoutService } from './services/account-lockout.service';
import { CaptchaService } from './services/captcha.service';
import { LoginRiskAssessmentService } from './services/login-risk-assessment.service';
import { CaptchaGuard } from './guards/captcha.guard';
import { SecurityController } from './controllers/security.controller';

/**
 * 安全模块
 *
 * 负责处理系统的安全相关功能，包括：
 * - 账户锁定机制
 * - 验证码生成和验证
 * - 登录失败处理
 * - 安全策略管理
 * - 管理员安全操作
 * - 智能安全防护
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, CaptchaSession, UserLoginLog]),
    ConfigModule,
    ScheduleModule, // 支持定时任务，用于清理过期锁定和验证码
  ],
  controllers: [SecurityController],
  providers: [
    AccountLockoutService,
    CaptchaService,
    LoginRiskAssessmentService,
    CaptchaGuard,
  ],
  exports: [
    AccountLockoutService,
    CaptchaService,
    LoginRiskAssessmentService,
    CaptchaGuard,
  ], // 导出服务供其他模块使用
})
export class SecurityModule {}
