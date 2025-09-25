import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * 自定义验证约束 - 检查两个字段值是否匹配
 */
@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const relatedPropertyName = args.constraints[0] as string;
    if (typeof relatedPropertyName !== 'string') {
      return false;
    }

    const targetObject = args.object as Record<string, unknown>;
    const relatedValue = targetObject[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const relatedPropertyName = args.constraints[0] as string;
    return `${args.property} 必须与 ${relatedPropertyName} 匹配`;
  }
}

/**
 * 自定义装饰器 - 验证字段值与另一个字段匹配
 *
 * @param property - 要匹配的字段名
 * @param validationOptions - 验证选项
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
