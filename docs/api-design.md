# API 设计规范

## API 设计原则

本项目遵循 RESTful API 设计原则，确保 API 的一致性、可预测性和易用性。

### 核心原则

1. **RESTful 设计**: 遵循 REST 架构风格
2. **统一响应格式**: 所有 API 使用统一的响应结构
3. **版本控制**: 支持 API 版本管理
4. **错误处理**: 统一的错误响应格式
5. **安全性**: 适当的认证和授权机制
6. **文档化**: 完整的 API 文档

## 基础 URL 结构

```
https://api.xiaodashi.com/v1/
```

### 版本控制

- 使用 URL 路径进行版本控制: `/v1/`, `/v2/`
- 向后兼容，新版本不破坏旧版本
- 版本号使用语义化版本控制

## HTTP 方法使用

### GET
- 用于获取资源
- 幂等操作
- 不应修改服务器状态

```http
GET /v1/users
GET /v1/users/123
```

### POST
- 用于创建新资源
- 非幂等操作
- 请求体包含要创建的数据

```http
POST /v1/users
POST /v1/auth/login
```

### PUT
- 用于完整更新资源
- 幂等操作
- 请求体包含完整的资源数据

```http
PUT /v1/users/123
```

### PATCH
- 用于部分更新资源
- 非幂等操作
- 请求体只包含要更新的字段

```http
PATCH /v1/users/123
```

### DELETE
- 用于删除资源
- 幂等操作
- 通常不需要请求体

```http
DELETE /v1/users/123
```

## 统一响应格式

### 成功响应

```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功",
  "code": 200,
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456789"
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456789"
}
```

### 分页响应

```json
{
  "success": true,
  "data": {
    "items": [
      // 数据列表
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "获取成功",
  "code": 200,
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "req_123456789"
}
```

## HTTP 状态码

### 成功状态码

- **200 OK**: 请求成功
- **201 Created**: 资源创建成功
- **204 No Content**: 请求成功，无返回内容

### 客户端错误状态码

- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 未认证
- **403 Forbidden**: 无权限
- **404 Not Found**: 资源不存在
- **409 Conflict**: 资源冲突
- **422 Unprocessable Entity**: 参数验证失败
- **429 Too Many Requests**: 请求过于频繁

### 服务器错误状态码

- **500 Internal Server Error**: 服务器内部错误
- **502 Bad Gateway**: 网关错误
- **503 Service Unavailable**: 服务不可用

## 错误代码规范

### 错误代码格式

使用大写字母和下划线，按模块分类：

```
MODULE_ERROR_TYPE
```

### 常见错误代码

#### 认证相关 (AUTH_*)
- `AUTH_INVALID_TOKEN`: Token 无效
- `AUTH_TOKEN_EXPIRED`: Token 已过期
- `AUTH_INVALID_CREDENTIALS`: 认证凭据无效
- `AUTH_ACCESS_DENIED`: 访问被拒绝

#### 验证相关 (VALIDATION_*)
- `VALIDATION_ERROR`: 参数验证失败
- `VALIDATION_REQUIRED`: 必填字段缺失
- `VALIDATION_FORMAT`: 格式不正确

#### 资源相关 (RESOURCE_*)
- `RESOURCE_NOT_FOUND`: 资源不存在
- `RESOURCE_ALREADY_EXISTS`: 资源已存在
- `RESOURCE_CONFLICT`: 资源冲突

#### 系统相关 (SYSTEM_*)
- `SYSTEM_ERROR`: 系统错误
- `SYSTEM_MAINTENANCE`: 系统维护中
- `SYSTEM_RATE_LIMIT`: 请求频率限制

## 请求参数规范

### URL 参数

#### 路径参数
```http
GET /v1/users/{userId}
GET /v1/users/{userId}/posts/{postId}
```

#### 查询参数
```http
GET /v1/users?page=1&limit=20&sort=created_at&order=desc
GET /v1/users?search=john&status=active
```

### 请求体参数

#### JSON 格式
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

#### 表单数据
```http
Content-Type: application/x-www-form-urlencoded

name=John+Doe&email=john%40example.com&age=30
```

#### 文件上传
```http
Content-Type: multipart/form-data

name=John+Doe&avatar=@/path/to/file.jpg
```

## 认证和授权

### JWT Token 认证

#### 请求头
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Token 结构
```json
{
  "sub": "user_id",
  "iat": 1640995200,
  "exp": 1641081600,
  "role": "user",
  "permissions": ["read", "write"]
}
```

### API Key 认证

```http
X-API-Key: your_api_key_here
```

## 数据验证

### 请求参数验证

#### 必填字段
```json
{
  "name": {
    "type": "string",
    "required": true,
    "minLength": 1,
    "maxLength": 100
  }
}
```

#### 可选字段
```json
{
  "description": {
    "type": "string",
    "required": false,
    "maxLength": 500
  }
}
```

#### 数据类型验证
```json
{
  "age": {
    "type": "number",
    "minimum": 0,
    "maximum": 150
  },
  "email": {
    "type": "string",
    "format": "email"
  },
  "isActive": {
    "type": "boolean"
  }
}
```

## 分页和排序

### 分页参数

```http
GET /v1/users?page=1&limit=20
```

- `page`: 页码，从 1 开始
- `limit`: 每页数量，默认 20，最大 100

### 排序参数

```http
GET /v1/users?sort=created_at&order=desc
```

- `sort`: 排序字段
- `order`: 排序方向 (`asc` 或 `desc`)

### 多字段排序

```http
GET /v1/users?sort=name,created_at&order=asc,desc
```

## 过滤和搜索

### 精确匹配

```http
GET /v1/users?status=active&role=admin
```

### 模糊搜索

```http
GET /v1/users?search=john
```

### 范围查询

```http
GET /v1/users?age_min=18&age_max=65
GET /v1/users?created_after=2024-01-01&created_before=2024-12-31
```

### 包含查询

```http
GET /v1/users?tags=javascript,react
```

## 字段选择

### 指定返回字段

```http
GET /v1/users?fields=id,name,email
```

### 排除字段

```http
GET /v1/users?exclude=password,secret
```

## 缓存策略

### 缓存头

```http
Cache-Control: public, max-age=3600
ETag: "1234567890"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

### 条件请求

```http
If-None-Match: "1234567890"
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

## 限流和配额

### 限流头

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### 配额头

```http
X-Quota-Limit: 10000
X-Quota-Remaining: 9999
X-Quota-Reset: 1640995200
```

## API 文档规范

### OpenAPI 3.0 规范

```yaml
openapi: 3.0.0
info:
  title: 肖大师 API
  version: 1.0.0
  description: 肖大师 Web 应用 API 文档
servers:
  - url: https://api.xiaodashi.com/v1
    description: 生产环境
  - url: https://api-dev.xiaodashi.com/v1
    description: 开发环境
paths:
  /users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 成功获取用户列表
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
```

## 安全规范

### HTTPS 强制使用

所有 API 请求必须使用 HTTPS：

```
https://api.xiaodashi.com/v1/users
```

### CORS 配置

```javascript
{
  "origin": ["https://xiaodashi.com", "https://www.xiaodashi.com"],
  "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
  "allowedHeaders": ["Content-Type", "Authorization", "X-API-Key"],
  "credentials": true
}
```

### 输入验证

- 所有输入参数必须验证
- 使用白名单验证
- 防止 SQL 注入和 XSS 攻击
- 限制请求体大小

### 敏感信息保护

- 不在 URL 中传递敏感信息
- 密码等敏感字段不在响应中返回
- 使用适当的加密算法

## 性能优化

### 响应压缩

```http
Content-Encoding: gzip
```

### 连接复用

```http
Connection: keep-alive
```

### 预加载提示

```http
Link: </v1/users?page=2>; rel="next"
```

## 监控和日志

### 请求日志

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "method": "GET",
  "url": "/v1/users",
  "status": 200,
  "responseTime": 150,
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "userId": "user_123"
}
```

### 错误日志

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "error",
  "message": "Database connection failed",
  "error": {
    "code": "DB_CONNECTION_ERROR",
    "stack": "..."
  },
  "requestId": "req_123456789"
}
```

## API 版本管理

### 版本策略

1. **向后兼容**: 新版本不破坏旧版本
2. **渐进式升级**: 支持多版本并存
3. **废弃通知**: 提前通知 API 废弃
4. **迁移指南**: 提供版本迁移文档

### 版本标识

```http
GET /v1/users          # 当前版本
GET /v2/users          # 新版本
GET /v1/users          # 旧版本（仍支持）
```

## 测试规范

### 单元测试

```javascript
describe('User API', () => {
  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    const response = await request(app)
      .post('/v1/users')
      .send(userData)
      .expect(201);
      
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(userData.name);
  });
});
```

### 集成测试

```javascript
describe('User Integration Tests', () => {
  it('should handle complete user flow', async () => {
    // 创建用户
    const createResponse = await createUser(userData);
    
    // 获取用户
    const getResponse = await getUser(createResponse.body.data.id);
    
    // 更新用户
    const updateResponse = await updateUser(createResponse.body.data.id, updateData);
    
    // 删除用户
    const deleteResponse = await deleteUser(createResponse.body.data.id);
    
    expect(deleteResponse.status).toBe(204);
  });
});
```

## 总结

本 API 设计规范遵循 RESTful 原则，提供了：

1. **统一的响应格式**: 确保 API 的一致性
2. **完善的错误处理**: 提供清晰的错误信息
3. **灵活的查询参数**: 支持分页、排序、过滤等
4. **安全的认证机制**: JWT Token 和 API Key 支持
5. **完整的文档规范**: OpenAPI 3.0 标准
6. **性能优化**: 缓存、压缩、连接复用
7. **监控和日志**: 完整的请求和错误追踪

通过遵循这些规范，我们可以构建一个高质量、易维护、用户友好的 API 系统。
