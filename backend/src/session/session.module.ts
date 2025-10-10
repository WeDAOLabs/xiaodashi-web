import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { UserSession } from '../database/entities/user/user-session.entity';

/**
 * SessionModule - 会话管理模块
 *
 * 提供用户会话管理功能：
 * - SessionService: 核心业务逻辑服务
 * - SessionController: HTTP API接口
 * - UserSession实体: 会话数据模型
 *
 * 支持功能：
 * - 多设备会话管理
 * - 会话创建和撤销
 * - 定时清理过期会话
 * - 设备限制和可疑登录检测
 */
@Module({
  imports: [
    // 注册UserSession实体供SessionService使用
    TypeOrmModule.forFeature([UserSession]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [
    // 导出SessionService供其他模块使用（如AuthModule）
    SessionService,
  ],
})
export class SessionModule {}
