import { ValidationArguments } from 'class-validator';
import { MatchConstraint } from './match.validator';
import { Match as MatchDecorator } from './match.validator';

/**
 * Match验证器单元测试
 *
 * 测试覆盖：
 * - 字段匹配验证逻辑
 * - 错误消息生成
 * - 装饰器注册功能
 * - 边界情况和异常处理
 */
describe('MatchConstraint', () => {
  let constraint: MatchConstraint;

  beforeEach(() => {
    constraint = new MatchConstraint();
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
  });

  describe('validate', () => {
    it('应该在两个字段值匹配时返回true', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 'password123',
        constraints: ['password'],
        targetName: 'TestDto',
        object: {
          password: 'password123',
          confirmPassword: 'password123',
        },
        property: 'confirmPassword',
      };

      // 执行
      const result = constraint.validate('password123', mockArgs);

      // 断言
      expect(result).toBe(true);
    });

    it('应该在两个字段值不匹配时返回false', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 'password123',
        constraints: ['password'],
        targetName: 'TestDto',
        object: {
          password: 'password123',
          confirmPassword: 'differentpassword',
        },
        property: 'confirmPassword',
      };

      // 执行
      const result = constraint.validate('differentpassword', mockArgs);

      // 断言
      expect(result).toBe(false);
    });

    it('应该正确处理null和undefined值', () => {
      // 安排 - 两个都是null
      const mockArgsNull: ValidationArguments = {
        value: null,
        constraints: ['password'],
        targetName: 'TestDto',
        object: {
          password: null,
          confirmPassword: null,
        },
        property: 'confirmPassword',
      };

      // 执行
      const resultNull = constraint.validate(null, mockArgsNull);

      // 断言
      expect(resultNull).toBe(true);

      // 安排 - 两个都是undefined
      const mockArgsUndefined: ValidationArguments = {
        value: undefined,
        constraints: ['password'],
        targetName: 'TestDto',
        object: {
          password: undefined,
          confirmPassword: undefined,
        },
        property: 'confirmPassword',
      };

      // 执行
      const resultUndefined = constraint.validate(undefined, mockArgsUndefined);

      // 断言
      expect(resultUndefined).toBe(true);
    });

    it('应该在一个为null另一个为undefined时返回false', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: null,
        constraints: ['password'],
        targetName: 'TestDto',
        object: {
          password: undefined,
          confirmPassword: null,
        },
        property: 'confirmPassword',
      };

      // 执行
      const result = constraint.validate(null, mockArgs);

      // 断言
      expect(result).toBe(false);
    });

    it('应该正确处理数字类型的字段匹配', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 123,
        constraints: ['originalNumber'],
        targetName: 'TestDto',
        object: {
          originalNumber: 123,
          confirmNumber: 123,
        },
        property: 'confirmNumber',
      };

      // 执行
      const result = constraint.validate(123, mockArgs);

      // 断言
      expect(result).toBe(true);
    });

    it('应该正确处理布尔类型的字段匹配', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: true,
        constraints: ['originalFlag'],
        targetName: 'TestDto',
        object: {
          originalFlag: true,
          confirmFlag: true,
        },
        property: 'confirmFlag',
      };

      // 执行
      const result = constraint.validate(true, mockArgs);

      // 断言
      expect(result).toBe(true);
    });

    it('应该在对象类型比较时使用引用比较', () => {
      // 安排
      const obj1 = { key: 'value' };
      const obj2 = { key: 'value' };

      const mockArgs: ValidationArguments = {
        value: obj1,
        constraints: ['originalObject'],
        targetName: 'TestDto',
        object: {
          originalObject: obj2, // 不同的对象引用
          confirmObject: obj1,
        },
        property: 'confirmObject',
      };

      // 执行
      const result = constraint.validate(obj1, mockArgs);

      // 断言
      expect(result).toBe(false); // 应该返回false，因为是不同的对象引用
    });

    it('应该处理不存在的属性', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 'test',
        constraints: ['nonExistentProperty'],
        targetName: 'TestDto',
        object: {
          existingProperty: 'value',
        },
        property: 'confirmProperty',
      };

      // 执行
      const result = constraint.validate('test', mockArgs);

      // 断言
      expect(result).toBe(false); // nonExistentProperty是undefined，与'test'不匹配
    });
  });

  describe('defaultMessage', () => {
    it('应该生成正确的默认错误消息', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 'password123',
        constraints: ['password'],
        targetName: 'TestDto',
        object: {},
        property: 'confirmPassword',
      };

      // 执行
      const message = constraint.defaultMessage(mockArgs);

      // 断言
      expect(message).toBe('confirmPassword 必须与 password 匹配');
    });

    it('应该正确处理不同的属性名', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 'email@test.com',
        constraints: ['email'],
        targetName: 'TestDto',
        object: {},
        property: 'confirmEmail',
      };

      // 执行
      const message = constraint.defaultMessage(mockArgs);

      // 断言
      expect(message).toBe('confirmEmail 必须与 email 匹配');
    });

    it('应该处理复杂的属性名', () => {
      // 安排
      const mockArgs: ValidationArguments = {
        value: 'value',
        constraints: ['user.profile.name'],
        targetName: 'TestDto',
        object: {},
        property: 'confirmUserProfileName',
      };

      // 执行
      const message = constraint.defaultMessage(mockArgs);

      // 断言
      expect(message).toBe(
        'confirmUserProfileName 必须与 user.profile.name 匹配',
      );
    });
  });
});

/**
 * Match装饰器单元测试
 */
describe('Match Decorator', () => {
  it('应该正确导出装饰器函数', () => {
    // 验证装饰器函数的基本功能
    const property = 'password';
    const validationOptions = { message: '自定义错误消息' };

    const decorator = MatchDecorator(property, validationOptions);
    expect(typeof decorator).toBe('function');
  });
});

/**
 * 集成测试 - 模拟实际使用场景
 */
describe('Match Validator Integration', () => {
  it('应该在实际使用场景中正确验证', () => {
    // 安排
    const constraint = new MatchConstraint();
    const testObject = {
      password: 'test123',
      confirmPassword: 'test123',
    };

    const mockArgs: ValidationArguments = {
      value: 'test123',
      constraints: ['password'],
      targetName: 'TestDto',
      object: testObject,
      property: 'confirmPassword',
    };

    // 执行
    const isValid = constraint.validate('test123', mockArgs);

    // 断言
    expect(isValid).toBe(true);
  });

  it('应该在实际使用场景中正确处理验证失败', () => {
    // 安排
    const constraint = new MatchConstraint();
    const testObject = {
      password: 'test123',
      confirmPassword: 'different456',
    };

    const mockArgs: ValidationArguments = {
      value: 'different456',
      constraints: ['password'],
      targetName: 'TestDto',
      object: testObject,
      property: 'confirmPassword',
    };

    // 执行
    const isValid = constraint.validate('different456', mockArgs);
    const errorMessage = constraint.defaultMessage(mockArgs);

    // 断言
    expect(isValid).toBe(false);
    expect(errorMessage).toBe('confirmPassword 必须与 password 匹配');
  });
});
