# CSS 命名规范和变量分组策略

## 1. CSS变量命名规范

### 1.1 主色系 (Primary Colors)
```css
--primary-color: #0071e3          /* 主品牌色 */
--primary-hover: #005bb8          /* 主色悬停状态 */
--primary-light: #1a7ef3          /* 主色浅色版 */
--primary-50: #eff8ff             /* 主色超浅背景 */
--primary-100: #dbeeff            /* 主色浅背景 */
--accent-color: #0077ed           /* 强调色 */
```

### 1.2 中性色系 (Neutral Colors)
```css
--neutral-white: #ffffff          /* 纯白 */
--neutral-50: #f9fafb            /* 最浅灰 */
--neutral-100: #f3f4f6           /* 浅灰 */
--neutral-200: #e5e7eb           /* 边框灰 */
--neutral-300: #d1d5db           /* 分割线灰 */
--neutral-400: #9ca3af           /* 占位符灰 */
--neutral-500: #6b7280           /* 次要文本灰 */
--neutral-600: #4b5563           /* 深次要文本灰 */
--neutral-700: #374151           /* 标题灰 */
--neutral-800: #1f2937           /* 深标题灰 */
--neutral-900: #111827           /* 最深灰 */
```

### 1.3 文本色系 (Text Colors)
```css
--text-primary: #1d1d1f          /* 主文本色 */
--text-secondary: #6e6e73        /* 次要文本色 */
--text-tertiary: #8e8e93         /* 三级文本色 */
--text-inverse: #ffffff          /* 反色文本 */
```

### 1.4 背景色系 (Background Colors)
```css
--bg-primary: #ffffff            /* 主背景色 */
--bg-secondary: #f5f5f7          /* 次要背景色 */
--bg-tertiary: #f9fafb           /* 三级背景色 */
--bg-overlay: rgba(0, 0, 0, 0.25) /* 遮罩背景 */
```

### 1.5 边框色系 (Border Colors)
```css
--border-primary: #d2d2d7        /* 主边框色 */
--border-secondary: #e5e7eb      /* 次要边框色 */
--border-focus: var(--primary-color) /* 焦点边框色 */
```

### 1.6 系统色系 (System Colors)
```css
--success-color: #10b981         /* 成功状态色 */
--warning-color: #f59e0b         /* 警告状态色 */
--error-color: #ef4444           /* 错误状态色 */
--info-color: var(--primary-color) /* 信息状态色 */
```

## 2. CSS类命名规范

### 2.1 布局组件 (Layout Components)
- **前缀**: `layout-`
- **用途**: 页面布局、容器、栅格系统
- **示例**:
  ```css
  .layout-section      /* 页面区块容器 */
  .layout-container    /* 内容容器 */
  .layout-grid         /* 栅格布局 */
  .layout-flex         /* 弹性布局 */
  ```

### 2.2 按钮组件 (Button Components)
- **前缀**: `btn-`
- **用途**: 各种按钮样式
- **示例**:
  ```css
  .btn-primary         /* 主要按钮 */
  .btn-secondary       /* 次要按钮 */
  .btn-gradient-primary /* 渐变主按钮 */
  .btn-outline         /* 描边按钮 */
  ```

### 2.3 文本组件 (Text Components)
- **前缀**: `text-`
- **用途**: 文本样式、排版
- **示例**:
  ```css
  .text-label          /* 标签文本 */
  .text-heading-primary /* 主标题 */
  .text-heading-secondary /* 次标题 */
  .text-body-primary   /* 主体文本 */
  .text-body-secondary /* 次要文本 */
  ```

### 2.4 卡片组件 (Card Components)
- **前缀**: `card-`
- **用途**: 卡片容器、信息展示
- **示例**:
  ```css
  .card-base           /* 基础卡片 */
  .card-elevated       /* 带阴影卡片 */
  .card-feature        /* 功能卡片 */
  .card-pricing        /* 价格卡片 */
  ```

### 2.5 工具类 (Utility Classes)
- **前缀**: 无特定前缀
- **用途**: 通用工具样式
- **示例**:
  ```css
  .apple-link          /* Apple风格链接 */
  .glass-effect        /* 玻璃效果 */
  .shadow-custom       /* 自定义阴影 */
  ```

## 3. 命名原则

### 3.1 语义化命名
- ✅ **好的命名**: `text-heading-primary`, `btn-gradient-primary`, `card-feature`
- ❌ **避免**: `text-big`, `btn-blue`, `card-1`

### 3.2 层级化命名
- **主要**: `primary`, `secondary`, `tertiary`
- **状态**: `hover`, `active`, `disabled`, `focus`
- **尺寸**: `sm`, `md`, `lg`, `xl`, `xxl`

### 3.3 模块化组织
- **按功能分组**: 颜色、布局、组件、工具
- **按层级分组**: 基础、组件、页面、工具
- **清晰的注释**: 使用中英文对照注释

### 3.4 向后兼容
- 保留 `legacy` 类作为过渡
- 渐进式迁移策略
- 版本控制和文档更新

## 4. 使用示例

### 4.1 典型页面区块
```html
<section class="layout-section">
  <div class="layout-container">
    <h2 class="text-heading-primary">标题</h2>
    <p class="text-body-secondary">描述文本</p>
  </div>
</section>
```

### 4.2 功能卡片
```html
<div class="card-feature">
  <h3 class="text-heading-secondary">功能标题</h3>
  <p class="text-body-secondary">功能描述</p>
</div>
```

### 4.3 按钮组合
```html
<button class="btn-gradient-primary">主要操作</button>
<button class="btn-secondary">次要操作</button>
```

## 5. 迁移策略

### 5.1 分阶段迁移
1. **第一阶段**: 建立新的变量系统，保持旧变量兼容
2. **第二阶段**: 逐步替换组件中的类名
3. **第三阶段**: 移除已弃用的旧类名

### 5.2 兼容性考虑
- 使用 CSS 变量引用保持向后兼容
- 渐进式替换，避免破坏性变更
- 完善的文档和示例

这套命名规范遵循KISS原则，具有高内聚、低耦合的特点，便于维护和扩展。