# API 安全调用架构设计

> 本文档描述了 xiaodashi-web 项目中 frontend-app 的 API 安全调用架构设计方案

## 🏗️ 架构概述

### 核心设计理念

基于 **JWT 统一认证 + 分层API调用** 的安全架构，实现：
- **backend 项目**：负责用户认证和业务数据管理
- **frontend-app Next.js API Routes**：代理第三方 API 调用，保护 API 密钥
- **统一 JWT 认证**：确保权限控制的一致性和安全性

### 网络拓扑图

```
┌─────────────┐    JWT登录/用户数据    ┌─────────────┐
│             │ ──────────────────→  │             │
│ frontend-app│                      │   backend   │
│             │ ←──────────────────  │             │
└─────────────┘                      └─────────────┘
       │
       │ 第三方API调用
       │ (JWT验证后代理)
       ↓
┌─────────────┐
│  第三方 API │
│ (OpenAI等)  │
└─────────────┘
```

## 🔐 JWT 认证机制

### JWT 工作原理

JWT (JSON Web Token) 是一种自包含的认证令牌，结构为：
```
header.payload.signature
```

### 防伪造安全机制

JWT 通过 **HMAC-SHA256 数字签名** 防止伪造：

```typescript
// backend 生成 JWT 时
const secret = process.env.JWT_SECRET; // 只有服务端知道
const token = jwt.sign({
  userId: 123,
  name: '用户名',
  permissions: ['read', 'write']
}, secret, { expiresIn: '1h' });

// frontend-app 验证时
try {
  const decoded = jwt.verify(token, secret); // 使用相同密钥验证
  // 验证成功 - token 未被篡改
} catch (error) {
  // 验证失败 - token 被篡改或无效
}
```

**安全保障：**
- 攻击者无法获得 `secret` 密钥
- 修改 payload 后无法生成正确的 signature
- 暴力破解 HMAC-SHA256 几乎不可能

### Token 刷新策略

采用 **双Token机制** 应对权限变更：

```typescript
// 短期 Access Token（15分钟）
const accessToken = jwt.sign({
  userId: user.id,
  permissions: currentPermissions
}, JWT_SECRET, { expiresIn: '15m' });

// 长期 Refresh Token（7天）
const refreshToken = jwt.sign({
  userId: user.id,
  type: 'refresh'
}, JWT_SECRET, { expiresIn: '7d' });
```

## 📡 网络调用流程

### 1. 用户登录流程

```
1. 用户输入账密
   frontend-app → backend/auth/login

2. backend 验证账密
   backend → 数据库验证 → 生成 JWT

3. 返回认证信息
   backend → frontend-app: { token, user }

4. 存储认证状态
   frontend-app → localStorage/cookie 存储 JWT
```

### 2. 第三方 API 调用流程

```
1. 前端发起请求
   frontend-app → /api/openai/chat
   Headers: Authorization: Bearer <JWT_TOKEN>

2. Next.js API Routes 验证
   验证 JWT → 检查权限 → 调用外部 API

3. 代理外部请求
   Next.js API Routes → https://api.openai.com/v1/chat/completions
   Headers: Authorization: Bearer <OPENAI_API_KEY>

4. 返回结果
   OpenAI → Next.js API Routes → frontend-app
```

**代码示例：**

```typescript
// frontend-app/app/api/openai/chat/route.ts
export async function POST(request: Request) {
  // 1. 验证用户的 JWT
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. 检查权限
    if (!decoded.permissions?.includes('ai:generate')) {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // 3. 调用外部 API
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(await request.json())
    });

    return Response.json(await aiResponse.json());
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### 3. 用户数据查询流程

```
1. 前端发起请求
   frontend-app → backend/api/user/points
   Headers: Authorization: Bearer <JWT_TOKEN>

2. backend 验证 JWT
   backend → jwt.verify(token, JWT_SECRET)

3. 查询业务数据
   backend → 数据库查询 → 返回最新数据

4. 返回结果
   backend → frontend-app: { points: 1250 }
```

## 📊 数据分层策略

### JWT 中存储的静态数据

**适合放在 JWT 中：**
- ✅ 用户ID（永不改变）
- ✅ 姓名、邮箱（基本不变）
- ✅ 基础角色（相对稳定）
- ✅ 基础权限（不常变化）

```typescript
interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'premium' | 'user';
  basePermissions: string[];
  iat: number;  // 发布时间
  exp: number;  // 过期时间
}
```

### 实时查询的动态数据

**不适合放在 JWT 中：**
- ❌ 积分、余额（实时变化）
- ❌ 头像URL（可能频繁更新）
- ❌ 最后登录时间（每次都变）
- ❌ 会员到期时间（需要实时验证）
- ❌ 敏感信息（隐私数据）

### 权限变更处理方案

#### 场景：用户会员到期

**问题：** JWT 一旦签发，在过期前无法"撤回"或"更新"

**解决方案：**

1. **短期Token策略**
```typescript
// 会员权限使用短期Token（5分钟）
const premiumToken = jwt.sign({
  userId: user.id,
  premiumFeatures: ['ai_unlimited', 'export_pdf'],
  validUntil: user.premiumExpiresAt
}, JWT_SECRET, { expiresIn: '5m' });
```

2. **混合验证策略**
```typescript
// 关键操作时实时验证权限
export async function POST(request: Request) {
  const decoded = jwt.verify(token, JWT_SECRET);

  // 对于敏感操作，实时验证权限
  if (isPremiumFeature) {
    const user = await fetch(`${BACKEND_URL}/user/${decoded.userId}/status`);
    if (!user.isPremium) {
      return Response.json({
        error: '会员已过期，请续费',
        code: 'PREMIUM_EXPIRED'
      }, { status: 402 });
    }
  }
}
```

## 🛡️ 安全最佳实践

### Token 存储方式

```typescript
// ✅ 推荐：HttpOnly Cookie + CSRF保护
res.setHeader('Set-Cookie', [
  `accessToken=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=900`,
  `csrfToken=${csrfToken}; Secure; SameSite=Strict; Max-Age=900`
]);

// ⚠️ 备选：localStorage + XSS保护
localStorage.setItem('accessToken', token);
// 需要额外的 XSS 防护措施
```

### 环境变量配置

```env
# frontend-app/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
JWT_SECRET=your-super-secret-key-at-least-32-chars
OPENAI_API_KEY=sk-your-openai-key
CLAUDE_API_KEY=your-claude-key

# backend/.env
JWT_SECRET=your-super-secret-key-at-least-32-chars  # 与前端保持一致
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
```

### 错误处理机制

```typescript
// 统一的错误处理
export class ApiClient {
  static async request(url: string, options = {}) {
    const token = this.getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token 过期或无效
      this.redirectToLogin();
      throw new Error('Authentication required');
    }

    if (response.status === 403) {
      // 权限不足
      throw new Error('Insufficient permissions');
    }

    if (response.status === 402) {
      // 会员过期
      this.showRenewalDialog();
      throw new Error('Premium subscription required');
    }

    return response.json();
  }
}
```

## 🚀 部署配置

### Vercel 部署设置

```json
// vercel.json
{
  "functions": {
    "frontend-app/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "JWT_SECRET": "@jwt-secret",
    "OPENAI_API_KEY": "@openai-api-key",
    "CLAUDE_API_KEY": "@claude-api-key"
  }
}
```

### 开发/生产环境区分

```typescript
// frontend-app/lib/config.ts
const config = {
  development: {
    backendUrl: 'http://localhost:3001',
    apiProxy: false, // 开发时可直接调用第三方API
  },
  production: {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    apiProxy: true, // 生产环境强制使用API代理
  }
};

export default config[process.env.NODE_ENV];
```

## 🔄 完整示例

### 登录 + API调用的完整流程

```typescript
// 1. 用户登录
async function login(credentials) {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const { token, user } = await response.json();
  localStorage.setItem('accessToken', token);
  return { token, user };
}

// 2. 调用AI生成内容
async function generateContent(prompt) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('/api/openai/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (response.status === 401) {
    // Token过期，重新登录
    window.location.href = '/login';
    return;
  }

  return response.json();
}

// 3. 查询用户积分
async function getUserPoints() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${BACKEND_URL}/api/user/points`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
}
```

## 🎯 架构优势

1. **安全性**
   - JWT 数字签名防篡改
   - API 密钥服务端隐藏
   - 分层权限控制

2. **性能**
   - 无状态认证，减少数据库查询
   - 静态数据本地缓存
   - 动态数据实时获取

3. **扩展性**
   - 微服务友好架构
   - 水平扩展容易
   - 新服务只需共享JWT密钥

4. **维护性**
   - 职责分离清晰
   - 错误处理统一
   - 部署配置简单

## ❓ 常见问题

### Q: 为什么不直接在前端调用第三方API？
A: 直接调用会暴露API密钥，存在安全风险。通过Next.js API Routes代理可以隐藏密钥。

### Q: JWT过期了怎么办？
A: 实现自动刷新机制，或者引导用户重新登录。

### Q: 如何处理用户权限变更？
A: 使用短期Token + 实时验证的混合策略，确保权限变更的及时性。

### Q: 这种架构的部署成本如何？
A: Vercel 自动处理 Serverless Functions，无需额外服务器成本。

---

*最后更新：2025-09-21*
*作者：Pluto*