# Dashboard开发框架使用指南

## 概述

本文档介绍基于现有dashboard页面结构创建的可复用开发框架，旨在为后续页面开发提供标准化的布局模板、组件体系和开发规范。

## 框架特点

- **KISS原则**：保持简单直接的设计理念
- **模块化组件**：高内聚、低耦合的组件架构
- **shadcn/ui优先**：优先使用shadcn/ui组件确保设计一致性
- **CSS变量主题化**：所有颜色通过CSS变量管理
- **TypeScript类型安全**：严格的类型检查确保代码质量

## 核心组件

### 1. DashboardLayout

主要的布局容器组件，提供统一的页面结构。

```tsx
import DashboardLayout from '@/components/layout/DashboardLayout';

const MyPage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '/dashboard' },
    { label: '当前页面', href: '/current', current: true }
  ];

  return (
    <DashboardLayout 
      title="页面标题" 
      breadcrumbs={breadcrumbs}
    >
      {/* 页面内容 */}
    </DashboardLayout>
  );
};
```

**Props：**
- `children`: React.ReactNode - 页面内容
- `title?`: string - 页面标题
- `breadcrumbs?`: BreadcrumbItem[] - 面包屑导航
- `className?`: string - 额外CSS类名

### 2. BreadcrumbNav

面包屑导航组件，用于显示页面层级关系。

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
```

### 3. PageCard系列组件

基于shadcn/ui Card的扩展组件，提供多种变体。

```tsx
import { PageCard, PageCardHeader, PageCardTitle, PageCardDescription, PageCardContent } from '@/components/ui/page-card';

<PageCard variant="feature" size="lg">
  <PageCardHeader>
    <PageCardTitle>标题</PageCardTitle>
    <PageCardDescription>描述</PageCardDescription>
  </PageCardHeader>
  <PageCardContent>
    {/* 内容 */}
  </PageCardContent>
</PageCard>
```

**变体选项：**
- `variant`: "default" | "feature" | "info" | "warning" | "success"
- `size`: "default" | "sm" | "lg" | "xl"

## 样式系统

### CSS类名规范

```css
/* 页面容器 */
.page-container {
  max-width: 96rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 95%;
}

/* 功能网格 */
.feature-grid {
  display: grid;
  gap: 1.5rem;
  padding: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* 内容区块 */
.content-section {
  margin-bottom: 2rem;
}

/* 标题样式 */
.section-header        /* 主标题 */
.subsection-header     /* 副标题 */
```

### 颜色系统

使用CSS变量确保主题一致性：

```css
/* 文本颜色 */
--text-primary: #1d1d1f;
--text-secondary: #6e6e73;
--text-tertiary: #8e8e93;

/* 背景颜色 */
--bg-primary: #ffffff;
--bg-secondary: #f5f5f7;

/* 主色调 */
--primary-color: var(--color-primary-500);
--primary-hover: var(--color-primary-600);
```

## 目录结构规范

### 页面结构
```
frontend-app/app/
├── dashboard/              # 仪表盘主页
├── copywriting/           # 文案工具
│   ├── page.tsx          # 工具集主页
│   └── generator/        # 子功能页面
├── image-generation/     # 图像生成
└── video-generation/     # 视频生成
```

### 组件结构
```
frontend-app/components/
├── layout/               # 布局组件
│   ├── DashboardLayout.tsx
│   ├── BreadcrumbNav.tsx
│   └── types.ts
├── ui/                   # 通用UI组件
│   └── page-card.tsx
├── copywriting/          # 功能特定组件
├── image-generation/
└── video-generation/
```

## 开发工作流

### 1. 创建新页面

```bash
# 1. 创建页面目录
mkdir -p frontend-app/app/new-feature

# 2. 创建组件目录（如需要）
mkdir -p frontend-app/components/new-feature
```

### 2. 页面模板

```tsx
'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageCard, PageCardHeader, PageCardTitle, PageCardDescription, PageCardContent } from '@/components/ui/page-card';
import { Button } from '@/components/ui/button';

const NewFeaturePage: React.FC = () => {
  const breadcrumbs = [
    { label: '产品工具集', href: '/dashboard' },
    { label: '新功能', href: '/new-feature', current: true }
  ];

  return (
    <DashboardLayout 
      title="新功能页面" 
      breadcrumbs={breadcrumbs}
    >
      <div className="content-section">
        <p className="text-[var(--text-secondary)] text-base mb-6 px-4">
          页面描述文字
        </p>
        
        <div className="feature-grid">
          {/* 功能卡片 */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewFeaturePage;
```

### 3. 添加依赖

```bash
# 为frontend-app工作区安装依赖
npm install <package-name> --workspace=frontend-app
```

### 4. 更新导航

在`AppSidebar.tsx`中添加新的导航项：

```tsx
const sidebarNavItems = [
  // ... 现有项目
  { name: '新功能', icon: NewIcon, href: '/new-feature' },
];
```

## 组件通信规范

### 回调模式

组件间通过明确定义的回调进行通信：

```tsx
interface ToolCardProps {
  title: string;
  description: string;
  onSelect?: (toolId: string) => void;  // 回调函数
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, onSelect }) => {
  return (
    <PageCard onClick={() => onSelect?.(title)}>
      {/* 组件内容 */}
    </PageCard>
  );
};
```

### 状态提升

将共享状态提升到共同的父组件中：

```tsx
const ParentComponent: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div>
      <ToolList onToolSelect={setSelectedTool} />
      <ToolDetail selectedTool={selectedTool} />
    </div>
  );
};
```

## 最佳实践

### 1. 组件设计原则

- **单一职责**：每个组件只负责一个功能
- **可复用性**：设计通用的组件接口
- **类型安全**：所有Props必须明确类型定义

### 2. 性能优化

- 使用`React.memo`避免不必要的重渲染
- 合理使用`useMemo`和`useCallback`
- 组件懒加载对于大型页面

### 3. 代码质量

- 遵循ESLint规则
- 编写组件文档和PropTypes
- 保持代码简洁和可读性

## 故障排除

### 常见问题

1. **样式不生效**：检查CSS变量是否正确引用
2. **路由不高亮**：确认href路径与实际路由匹配
3. **类型错误**：检查Props接口定义是否完整
4. **构建失败**：确保所有组件Props都有明确类型

### 调试技巧

1. 使用浏览器开发者工具检查CSS
2. 在组件中添加console.log调试状态
3. 使用React Developer Tools查看组件树
4. 检查Network面板确认资源加载

---

通过遵循本框架的设计原则和开发规范，可以确保项目的可维护性、可扩展性和代码质量。