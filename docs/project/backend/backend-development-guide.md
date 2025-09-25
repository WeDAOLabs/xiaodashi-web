# 后端编码规范

## 模块导入规范

### ✅ 必须使用 ES6 Import
```typescript
// 正确
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
```

### ❌ 禁止使用 CommonJS Require
```typescript
// 错误 - 会导致 lint 检查失败
const { Injectable } = require('@nestjs/common');
const bcrypt = require('bcrypt');
```

## 类型安全要求

### 函数签名必须显式声明类型
```typescript
// 正确
async createUser(userData: CreateUserDto): Promise<User> {
  return this.userRepository.save(userData);
}

// 错误 - 隐式 any 类型
async createUser(userData) {
  return this.userRepository.save(userData);
}
```

## Entity 规范

### 必须包含 comment 字段
```typescript
@Entity('users', { comment: '用户基础信息表' })
export class User {
  @Column({ type: 'varchar', length: 50, comment: '用户姓名' })
  name: string;
}
```

## API 验证规范

### 所有输入必须通过 DTO 验证
```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '用户姓名' })
  name: string;
}
```

## 错误处理

### 使用 NestJS 标准异常
```typescript
if (!user) {
  throw new NotFoundException(`用户 ID ${id} 不存在`);
}
```