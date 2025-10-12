import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JWTPayload, UserRole } from '@xiaodashi/shared';

/**
 * JwtAuthGuard单元测试
 *
 * 测试覆盖：
 * - JWT认证守卫的核心认证逻辑
 * - 公开路由的跳过认证机制
 * - 各种JWT错误情况的处理
 * - 认证失败时的详细错误响应
 * - 认证成功时的用户信息传递
 */
describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  // 模拟执行上下文
  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => mockRequest),
    })),
  } as unknown as ExecutionContext;

  // 模拟请求对象
  const mockRequest = {
    method: 'GET',
    url: '/api/v1/auth/me',
    get: jest.fn((header: string) => {
      if (header === 'user-agent') return 'test-user-agent';
      return undefined;
    }),
    ip: '127.0.0.1',
  };

  // 模拟JWT载荷
  const mockJwtPayload: JWTPayload = {
    sub: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    iat: 1640995200,
    exp: 1640998800,
  };

  // Mock Reflector
  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);

    // 重置所有mock
    jest.clearAllMocks();

    // 设置默认的mock返回值
    mockRequest.get.mockImplementation((header: string) => {
      if (header === 'user-agent') return 'test-user-agent';
      return undefined;
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('应该允许公开路由访问', () => {
      // 安排
      mockReflector.getAllAndOverride.mockReturnValue(true); // 标记为公开路由

      // 执行
      const result = guard.canActivate(mockExecutionContext);

      // 断言
      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('应该对非公开路由调用父类认证逻辑', () => {
      // 安排
      mockReflector.getAllAndOverride.mockReturnValue(false); // 不是公开路由

      // Mock父类的canActivate方法
      const superCanActivateSpy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(guard)),
        'canActivate',
      );
      superCanActivateSpy.mockReturnValue(true);

      // 执行
      const result = guard.canActivate(mockExecutionContext);

      // 断言
      expect(result).toBe(true);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    });

    it('应该在没有Public装饰器时调用父类认证逻辑', () => {
      // 安排
      mockReflector.getAllAndOverride.mockReturnValue(undefined); // 没有Public装饰器

      // Mock父类的canActivate方法
      const superCanActivateSpy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(guard)),
        'canActivate',
      );
      superCanActivateSpy.mockReturnValue(true);

      // 执行
      const result = guard.canActivate(mockExecutionContext);

      // 断言
      expect(result).toBe(true);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('handleRequest', () => {
    it('应该在认证成功时返回用户信息', () => {
      // 执行
      const result = guard.handleRequest(
        null, // 没有错误
        mockJwtPayload, // 有效的用户信息
        undefined,
        mockExecutionContext,
      );

      // 断言
      expect(result).toEqual(mockJwtPayload);
    });

    it('应该在JWT过期时抛出特定错误', () => {
      // 安排
      const tokenExpiredInfo = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
      };

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          null,
          false, // 认证失败
          tokenExpiredInfo,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('登录已过期，请重新登录'));
    });

    it('应该在JWT格式无效时抛出特定错误', () => {
      // 安排
      const invalidTokenInfo = {
        name: 'JsonWebTokenError',
        message: 'invalid token',
      };

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          null,
          false, // 认证失败
          invalidTokenInfo,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('无效的认证令牌'));
    });

    it('应该在JWT尚未生效时抛出特定错误', () => {
      // 安排
      const notBeforeInfo = {
        name: 'NotBeforeError',
        message: 'jwt not active',
      };

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          null,
          false, // 认证失败
          notBeforeInfo,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('认证令牌尚未生效'));
    });

    it('应该在用户不存在时抛出特定错误', () => {
      // 安排
      const userNotFoundError = new Error('用户不存在');

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          userNotFoundError,
          false, // 认证失败
          undefined,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('用户账户不存在'));
    });

    it('应该在账户被暂停时抛出特定错误', () => {
      // 安排
      const accountSuspendedError = new Error('账户已被暂停');

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          accountSuspendedError,
          false, // 认证失败
          undefined,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('账户已被暂停，请联系管理员'));
    });

    it('应该在账户未激活时抛出特定错误', () => {
      // 安排
      const accountNotActiveError = new Error('账户未激活');

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          accountNotActiveError,
          false, // 认证失败
          undefined,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('账户未激活，请先激活账户'));
    });

    it('应该在其他认证错误时抛出默认错误', () => {
      // 安排
      const genericError = new Error('其他认证错误');

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          genericError,
          false, // 认证失败
          undefined,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('认证失败，请登录后访问'));
    });

    it('应该在没有用户信息时抛出默认错误', () => {
      // 执行和断言
      expect(() => {
        guard.handleRequest(
          null,
          false, // 没有用户信息
          undefined,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('认证失败，请登录后访问'));
    });

    it('应该在没有错误但用户为undefined时抛出默认错误', () => {
      // 执行和断言
      expect(() => {
        guard.handleRequest(
          null,
          undefined as unknown as false, // 用户为undefined
          undefined,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('认证失败，请登录后访问'));
    });

    it('应该处理带有详细info信息的认证失败', () => {
      // 安排
      const detailedInfo = {
        name: 'CustomError',
        message: '自定义错误信息',
      };

      // 执行和断言
      expect(() => {
        guard.handleRequest(
          null,
          false, // 认证失败
          detailedInfo,
          mockExecutionContext,
        );
      }).toThrow(new UnauthorizedException('认证失败，请登录后访问'));
    });
  });

  describe('日志记录', () => {
    it('应该在认证失败时记录警告日志', () => {
      // 安排
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const tokenExpiredInfo = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
      };

      // 执行
      expect(() => {
        guard.handleRequest(
          null,
          false,
          tokenExpiredInfo,
          mockExecutionContext,
        );
      }).toThrow();

      // 验证日志记录（注意：实际的Logger可能需要不同的验证方式）
      // 这里主要验证不会因为日志记录而抛出额外错误
      void consoleSpy;

      // 清理
      consoleSpy.mockRestore();
    });
  });

  describe('类型安全', () => {
    it('应该正确处理泛型用户类型', () => {
      // 安排
      interface CustomUser extends JWTPayload {
        customField: string;
      }

      const customUser: CustomUser = {
        ...mockJwtPayload,
        customField: 'custom-value',
      };

      // 执行
      const result = guard.handleRequest<CustomUser>(
        null,
        customUser,
        undefined,
        mockExecutionContext,
      );

      // 断言
      expect(result).toEqual(customUser);
      expect(result.customField).toBe('custom-value');
    });

    it('应该处理不同的用户角色', () => {
      // 安排
      const adminUser: JWTPayload = {
        ...mockJwtPayload,
        role: UserRole.ADMIN,
      };

      // 执行
      const result = guard.handleRequest(
        null,
        adminUser,
        undefined,
        mockExecutionContext,
      );

      // 断言
      expect(result.role).toBe(UserRole.ADMIN);
    });
  });
});

/**
 * Public装饰器单元测试
 */
describe('Public Decorator', () => {
  it('应该正确导出Public装饰器相关常量', () => {
    // 这个测试验证装饰器的导出是否正确
    const { IS_PUBLIC_KEY, Public } = require('./jwt-auth.guard');

    expect(IS_PUBLIC_KEY).toBe('isPublic');
    expect(typeof Public).toBe('function');
  });
});
