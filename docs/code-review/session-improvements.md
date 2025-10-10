# 会话管理系统改进方案

## 问题#1: SessionId传递机制实现

### 1. 修改JwtUser接口（auth.service.ts）

```typescript
// 在 auth.service.ts 或 shared/types/auth.ts 中
interface JwtUser {
  sub: string;
  email: string;
  name: string;
  role: string;
  sessionId?: string; // 新增：会话ID
}
```

### 2. 修改token生成逻辑（auth.service.ts）

```typescript
// 修改 generateTokens 方法签名
generateTokens(user: User, sessionId?: string): AuthToken {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    sessionId, // 包含会话ID
  };

  // ... 其余代码不变
}
```

### 3. 调整登录流程（auth.service.ts）

```typescript
async login(
  loginRequest: LoginRequest,
  request?: Request,
): Promise<LoginResponse> {
  const { email, password } = loginRequest;

  // ... 用户验证代码 ...

  // 解析设备信息
  const parsedDeviceInfo: DeviceInfo = {
    ...this.parseDeviceInfo(deviceInfo.userAgent),
    location: deviceInfo.location,
  };

  // 先创建临时session（不含token）
  const tempSession = await this.sessionService.createSession(
    user.id,
    parsedDeviceInfo,
    '', // 临时占位
    deviceInfo.ipAddress,
    deviceInfo.userAgent,
  );

  // 生成包含sessionId的tokens
  const tokens = this.generateTokens(user, tempSession.id);

  // 更新session的refreshTokenHash
  await this.sessionService.updateRefreshToken(
    tempSession.id,
    tokens.refreshToken,
  );

  // ... 其余代码 ...
}
```

### 4. 在SessionService中添加更新方法

```typescript
// session.service.ts
async updateRefreshToken(
  sessionId: string,
  refreshToken: string,
): Promise<void> {
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await this.sessionRepository.update(sessionId, { refreshTokenHash });
}
```

### 5. 修改Controller获取sessionId（session.controller.ts）

```typescript
async revokeAllSessions(
  @Request() req: AuthenticatedRequest,
  @Body() revokeAllDto?: RevokeAllSessionsDto,
): Promise<RevokeAllSessionsResponse> {
  const userId = req.user.sub;
  const currentSessionId = req.user.sessionId; // ✅ 从JWT中获取

  return this.sessionService.revokeAllSessions(
    userId,
    revokeAllDto?.exceptCurrentSession,
    currentSessionId,
  );
}
```

---

## 问题#2: 会话撤销后Token立即失效

### 在JwtStrategy中验证会话状态

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService, // 注入SessionService
  ) {
    const authConfig = configService.get<AuthConfig>('auth')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.accessSecret,
      issuer: authConfig.jwt.issuer,
      audience: authConfig.jwt.audience,
    });
  }

  async validate(payload: JWTPayload) {
    // 验证会话是否仍然活跃
    if (payload.sessionId) {
      const session = await this.sessionService.findActiveSession(
        payload.sessionId,
      );

      if (!session) {
        throw new UnauthorizedException('会话已失效，请重新登录');
      }
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  }
}
```

### 在SessionService中添加方法

```typescript
// session.service.ts
async findActiveSession(sessionId: string): Promise<UserSession | null> {
  return this.sessionRepository.findOne({
    where: { id: sessionId, isActive: true },
  });
}
```

---

## 问题#3: 优化Refresh Token查找

### 方案：使用sessionId直接定位

```typescript
// session.service.ts
async validateRefreshToken(
  sessionId: string,
  refreshToken: string,
): Promise<boolean> {
  const session = await this.sessionRepository.findOne({
    where: { id: sessionId, isActive: true },
  });

  if (!session) {
    return false;
  }

  // 单次bcrypt比对
  return bcrypt.compare(refreshToken, session.refreshTokenHash);
}

// 移除旧的 findSessionByRefreshToken 方法，不再需要
```

### 修改auth.service.ts中的logout方法

```typescript
async logout(
  userId: string,
  sessionId?: string, // 从JWT中获取
  logoutRequest?: LogoutRequest,
): Promise<LogoutResponse> {
  const allDevices = logoutRequest?.allDevices || false;

  if (allDevices) {
    await this.sessionService.revokeAllSessions(userId);
  } else if (sessionId) {
    // 直接使用sessionId撤销当前会话
    await this.sessionService.revokeSession(sessionId, userId);
  }

  // ...
}
```

---

## 问题#4: 批量操作性能优化

### 优化revokeAllSessions

```typescript
// session.service.ts
async revokeAllSessions(
  userId: string,
  exceptCurrentSession = false,
  currentSessionId?: string,
): Promise<RevokeAllSessionsResponse> {
  let revokedCount = 0;

  if (exceptCurrentSession && currentSessionId) {
    // 使用SQL直接更新，排除当前会话
    const result = await this.sessionRepository
      .createQueryBuilder()
      .update(UserSession)
      .set({ isActive: false })
      .where('userId = :userId', { userId })
      .andWhere('isActive = :isActive', { isActive: true })
      .andWhere('id != :currentSessionId', { currentSessionId })
      .execute();

    revokedCount = result.affected || 0;
  } else {
    // 撤销所有会话
    const result = await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );

    revokedCount = result.affected || 0;
  }

  this.logger.log(
    `用户 ${userId} 撤销 ${revokedCount} 个会话${exceptCurrentSession ? '（保留当前会话）' : ''}`,
  );

  return {
    message: exceptCurrentSession
      ? '已撤销所有其他设备的会话'
      : '已撤销所有会话',
    success: true,
    revokedCount,
  };
}
```

### 优化定时清理任务

```typescript
@Cron(CronExpression.EVERY_HOUR)
async cleanExpiredSessions(): Promise<void> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    // 1. 批量标记过期会话为非活跃
    const expiredResult = await this.sessionRepository.update(
      { expiresAt: LessThan(now), isActive: true },
      { isActive: false },
    );

    if (expiredResult.affected && expiredResult.affected > 0) {
      this.logger.log(`清理了 ${expiredResult.affected} 个过期会话`);
    }

    // 2. 批量删除已过期超过30天的会话记录
    const deleteResult = await this.sessionRepository.delete({
      expiresAt: LessThan(thirtyDaysAgo),
      isActive: false,
    });

    if (deleteResult.affected && deleteResult.affected > 0) {
      this.logger.log(`永久删除了 ${deleteResult.affected} 个旧会话记录`);
    }
  } catch (error) {
    this.logger.error('清理过期会话失败', error);
  }
}
```

---

## 问题#5: 改进可疑登录检测

```typescript
// session.service.ts
async detectSuspiciousLogin(
  userId: string,
  deviceInfo: DeviceInfo,
  ipAddress?: string,
): Promise<SuspiciousLoginWarning | null> {
  const recentSessions = await this.sessionRepository.find({
    where: {
      userId,
      createdAt: MoreThan(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    },
    order: { createdAt: 'DESC' },
    take: 10,
  });

  if (recentSessions.length === 0) {
    return null; // 首次登录
  }

  // 1. 检查新设备
  const isNewDevice = !recentSessions.some(
    (session) => session.deviceId === deviceInfo.deviceId,
  );

  if (isNewDevice) {
    return {
      type: 'new_device',
      message: '检测到新设备登录',
      deviceInfo,
      timestamp: new Date().toISOString(),
    };
  }

  // 2. 改进的IP地址检测（检查IP段而非精确匹配）
  if (ipAddress) {
    const currentIPPrefix = ipAddress.split('.').slice(0, 2).join('.');
    const hasMatchingIPSegment = recentSessions.some(
      (session) =>
        session.ipAddress &&
        session.ipAddress.split('.').slice(0, 2).join('.') === currentIPPrefix
    );

    if (!hasMatchingIPSegment) {
      return {
        type: 'new_location',
        message: '检测到异常IP地址登录',
        deviceInfo,
        previousLocation: recentSessions[0]?.location,
        currentLocation: deviceInfo.location,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 3. 检查异常登录时间（深夜2-5点登录）
  const currentHour = new Date().getHours();
  const recentLogins = recentSessions.filter(
    s => s.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const hasNormalTimeLogin = recentLogins.some(s => {
    const hour = new Date(s.createdAt).getHours();
    return hour >= 6 && hour <= 23;
  });

  if (currentHour >= 2 && currentHour <= 5 && hasNormalTimeLogin) {
    return {
      type: 'unusual_time',
      message: '检测到异常时间登录（深夜）',
      deviceInfo,
      timestamp: new Date().toISOString(),
    };
  }

  return null;
}
```

---

## 问题#6: 补充类型定义

```typescript
// session.service.ts
import type { SessionInfo } from '@xiaodashi/shared';

private toSessionInfo(session: UserSession): SessionInfo {
  return {
    id: session.id,
    userId: session.userId,
    deviceId: session.deviceId,
    deviceName: session.deviceName,
    deviceType: session.deviceType,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    location: session.location,
    isActive: session.isActive,
    expiresAt: session.expiresAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
    lastActiveAt: session.lastActiveAt.toISOString(),
  };
}
```

---

## 问题#7: 增强DTO验证

```typescript
// dto/device-info.dto.ts
import { IsString, IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { DeviceType } from '@xiaodashi/shared';

export class DeviceInfoDto {
  @ApiProperty({
    description: '设备唯一标识（前端生成并持久化）',
    example: 'device_abc123xyz',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '设备ID长度不能超过100个字符' })
  deviceId?: string;

  @ApiProperty({
    description: '设备名称',
    example: 'iPhone 15 Pro',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '设备名称不能为空' })
  @MaxLength(100, { message: '设备名称长度不能超过100个字符' })
  deviceName?: string;

  @ApiProperty({
    description: '设备类型',
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    example: 'mobile',
  })
  @IsEnum(['mobile', 'tablet', 'desktop', 'unknown'], {
    message: 'deviceType must be one of: mobile, tablet, desktop, unknown',
  })
  deviceType!: DeviceType;

  @ApiProperty({
    description: '操作系统',
    example: 'iOS 17.1',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '操作系统信息长度不能超过50个字符' })
  os?: string;

  @ApiProperty({
    description: '浏览器',
    example: 'Safari 17.0',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '浏览器信息长度不能超过50个字符' })
  browser?: string;

  @ApiProperty({
    description: '地理位置',
    example: '北京市 朝阳区',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '地理位置信息长度不能超过100个字符' })
  location?: string;
}
```

---

## 实施建议

### 第一阶段（本周）- 功能修复
1. 实现问题#1：SessionId传递机制
2. 实现问题#2：会话撤销后Token立即失效

### 第二阶段（下周）- 性能优化
3. 实现问题#3：优化Refresh Token查找
4. 实现问题#4：批量操作性能优化

### 第三阶段（下次迭代）- 质量提升
5. 实现问题#5：改进可疑登录检测
6. 实现问题#6：补充类型定义
7. 实现问题#7：增强DTO验证

---

## 测试建议

### 单元测试覆盖
- [ ] SessionService.createSession
- [ ] SessionService.revokeSession
- [ ] SessionService.revokeAllSessions (保留当前会话)
- [ ] SessionService.cleanExpiredSessions
- [ ] SessionService.detectSuspiciousLogin

### 集成测试
- [ ] 完整登录-撤销流程
- [ ] 多设备限制（第6台设备登录）
- [ ] 可疑登录警告触发
- [ ] 定时任务执行

### 性能测试
- [ ] 1000个会话批量清理性能
- [ ] 并发refresh token验证
- [ ] 高频会话创建压力测试
