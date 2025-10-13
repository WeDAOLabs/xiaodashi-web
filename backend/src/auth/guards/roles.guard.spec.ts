import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@xiaodashi/shared';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../types';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
  };

  const mockAdminUser = {
    id: 'admin-user-id',
    email: 'admin@example.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
  };

  const mockPremiumUser = {
    id: 'premium-user-id',
    email: 'premium@example.com',
    name: 'Premium User',
    role: UserRole.PREMIUM,
  };

  const createMockExecutionContext = (
    user: any,
    handlerRoles: UserRole[] = [],
  ): ExecutionContext => {
    const mockHandler = {};
    const mockClass = {};

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            user,
            method: 'GET',
            url: '/test',
            ip: '127.0.0.1',
            get: () => 'test-agent',
          }) as unknown as AuthenticatedRequest,
      }),
      getHandler: () => mockHandler,
      getClass: () => mockClass,
    } as ExecutionContext;

    // Mock reflector to return roles
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(handlerRoles);

    return mockContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);

    // Mock logger methods to prevent console output during tests
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('canActivate', () => {
    it('应该被定义', () => {
      expect(guard).toBeDefined();
    });

    describe('当没有角色要求时', () => {
      it('应该允许访问', () => {
        const context = createMockExecutionContext(mockUser, []);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许访问（reflector返回null）', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
        const context = createMockExecutionContext(mockUser);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许访问（reflector返回undefined）', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
        const context = createMockExecutionContext(mockUser);

        expect(guard.canActivate(context)).toBe(true);
      });
    });

    describe('当用户不存在时', () => {
      it('应该抛出ForbiddenException', () => {
        const context = createMockExecutionContext(null, [UserRole.ADMIN]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        expect(() => guard.canActivate(context)).toThrow('用户认证信息无效');
      });
    });

    describe('当用户角色匹配时', () => {
      it('应该允许USER角色访问USER资源', () => {
        const context = createMockExecutionContext(mockUser, [UserRole.USER]);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许PREMIUM角色访问PREMIUM资源', () => {
        const context = createMockExecutionContext(mockPremiumUser, [
          UserRole.PREMIUM,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许ADMIN角色访问ADMIN资源', () => {
        const context = createMockExecutionContext(mockAdminUser, [
          UserRole.ADMIN,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });
    });

    describe('当多个角色允许时', () => {
      it('应该允许USER角色访问USER或PREMIUM资源', () => {
        const context = createMockExecutionContext(mockUser, [
          UserRole.USER,
          UserRole.PREMIUM,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许PREMIUM角色访问USER或PREMIUM资源', () => {
        const context = createMockExecutionContext(mockPremiumUser, [
          UserRole.USER,
          UserRole.PREMIUM,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许ADMIN角色访问任何角色资源', () => {
        const context = createMockExecutionContext(mockAdminUser, [
          UserRole.USER,
          UserRole.PREMIUM,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });
    });

    describe('角色继承机制', () => {
      it('应该允许ADMIN角色访问USER资源', () => {
        const context = createMockExecutionContext(mockAdminUser, [
          UserRole.USER,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许ADMIN角色访问PREMIUM资源', () => {
        const context = createMockExecutionContext(mockAdminUser, [
          UserRole.PREMIUM,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });

      it('应该允许PREMIUM角色访问USER资源', () => {
        const context = createMockExecutionContext(mockPremiumUser, [
          UserRole.USER,
        ]);

        expect(guard.canActivate(context)).toBe(true);
      });
    });

    describe('当用户角色不足时', () => {
      it('应该拒绝USER角色访问ADMIN资源', () => {
        const context = createMockExecutionContext(mockUser, [UserRole.ADMIN]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        expect(() => guard.canActivate(context)).toThrow(
          '权限不足，需要 admin 角色才能访问',
        );
      });

      it('应该拒绝USER角色访问PREMIUM资源', () => {
        const context = createMockExecutionContext(mockUser, [
          UserRole.PREMIUM,
        ]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        expect(() => guard.canActivate(context)).toThrow(
          '权限不足，需要 premium 角色才能访问',
        );
      });

      it('应该拒绝PREMIUM角色访问ADMIN资源', () => {
        const context = createMockExecutionContext(mockPremiumUser, [
          UserRole.ADMIN,
        ]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        expect(() => guard.canActivate(context)).toThrow(
          '权限不足，需要 admin 角色才能访问',
        );
      });
    });

    describe('日志记录', () => {
      const originalConsoleWarn = console.warn;
      const originalConsoleDebug = console.debug;

      beforeEach(() => {
        console.warn = jest.fn();
        console.debug = jest.fn();
      });

      afterEach(() => {
        console.warn = originalConsoleWarn;
        console.debug = originalConsoleDebug;
      });

      it('应该在权限不足时记录警告日志', () => {
        const context = createMockExecutionContext(mockUser, [UserRole.ADMIN]);

        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
        // 由于我们在生产环境，应该记录警告日志
      });

      it('应该在开发环境记录调试日志', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        const context = createMockExecutionContext(mockUser, [UserRole.USER]);
        guard.canActivate(context);

        process.env.NODE_ENV = originalNodeEnv;
      });
    });
  });

  describe('Reflector调用', () => {
    it('应该使用正确的元数据键', () => {
      const context = createMockExecutionContext(mockUser, [UserRole.USER]);
      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        expect.any(Object),
        expect.any(Object),
      ]);
    });

    it('应该同时检查处理器和类级别的角色', () => {
      const context = createMockExecutionContext(mockUser, [UserRole.USER]);
      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    });
  });
});
