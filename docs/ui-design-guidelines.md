# 智赢·AI全域营销大师 UI设计规范

## 📋 概述

本文档为智赢·AI全域营销大师的Frontend-App应用建立完整的UI设计规范体系，确保整个产品在视觉表现和用户体验上的一致性。

---

## 🎨 色彩系统

### 主色彩 (Primary Colors)

**品牌主色 - 青绿色系**
```css
--color-primary-50:  #eff8ff  /* 极浅青绿 - 背景高亮 */
--color-primary-100: #dbeeff  /* 浅青绿 - 次级背景 */
--color-primary-500: #007A7A  /* 主青绿 - 主要品牌色 */
--color-primary-600: #006666  /* 深青绿 - 悬停状态 */
--color-primary-700: #008888  /* 更深青绿 - 强调元素 */
```

**使用场景**：
- `primary-50`: 卡片背景、按钮hover状态、高亮区域
- `primary-500`: 主要按钮、链接、品牌标识
- `primary-600`: 悬停状态、焦点状态

### 中性色彩 (Neutral Colors)

**文本色阶**
```css
--text-primary:   #1d1d1f  /* 主要文本 */
--text-secondary: #6e6e73  /* 次要文本 */
--text-tertiary:  #8e8e93  /* 辅助文本 */
```

**背景色阶**
```css
--bg-primary:   #ffffff  /* 主背景 */
--bg-secondary: #f5f5f7  /* 次级背景 */
--bg-tertiary:  #f9fafb  /* 第三级背景 */
```

**边框色阶**
```css
--border-primary:   #d2d2d7  /* 主要边框 */
--border-secondary: #e5e7eb  /* 次要边框 */
```

### 状态色彩 (Status Colors)

**信息状态**
```css
--color-info-50:  #eff8ff
--color-info-100: #dbeeff
--color-info-600: #0077ed
```

**成功状态**
```css
--color-success-50:  #f0fdf4
--color-success-100: #dcfce7
--color-success-600: #16a34a
```

**警告状态**
```css
--color-warning-50:  #fffbeb
--color-warning-100: #fef3c7
--color-warning-600: #d97706
```

**错误状态**
```css
--color-danger-600: #ef4444
```

---

## 📝 字体系统

### 字体族
```css
--font-sans: var(--font-noto-sans-sc), var(--font-spline-sans), sans-serif;
```

**主要字体**: Noto Sans SC (中文)
**备用字体**: Spline Sans (英文)
**降级方案**: 系统默认sans-serif

### 字体尺寸规范

| 用途 | 大小 | 行高 | 字重 | CSS类 |
|------|------|------|------|-------|
| 页面标题 | 24px | 1.2 | 700 | `text-2xl font-bold` |
| 卡片标题 | 18px | 1.3 | 600 | `text-lg font-semibold` |
| 普通文本 | 14px | 1.5 | 400 | `text-sm` |
| 辅助文本 | 12px | 1.4 | 400 | `text-xs` |
| 数据展示 | 30px | 1.1 | 700 | `text-3xl font-bold` |

---

## 📐 布局系统

### 间距规范

**基础间距单位**: 4px (0.25rem)

**常用间距值**:
```css
gap-1:  4px   /* 0.25rem */
gap-2:  8px   /* 0.5rem */
gap-3:  12px  /* 0.75rem */
gap-4:  16px  /* 1rem */
gap-6:  24px  /* 1.5rem */
gap-8:  32px  /* 2rem */
```

**页面布局间距**:
- 页面边距: `p-6 lg:p-8` (24px/32px)
- 组件间距: `gap-6` (24px)
- 卡片内边距: `p-5` (20px)

### 圆角系统
```css
--radius: 0.625rem;  /* 10px - 基础圆角 */
```

**圆角使用**:
- 卡片: `rounded-lg` (8px)
- 按钮: `rounded-lg` (8px)
- 输入框: `rounded-md` (6px)
- 头像: `rounded-full` (完全圆形)

### 阴影系统
```css
--shadow-elevation-low:    0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-elevation-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-elevation-high:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

**阴影使用**:
- 卡片: `shadow-sm` (low)
- 悬浮元素: `shadow-md` (medium)
- 模态框: `shadow-xl` (high)

---

## 🧩 组件规范

### 按钮 (Buttons)

**主要按钮**
```html
<button class="bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-semibold">
  主要操作
</button>
```

**次要按钮**
```html
<button class="bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-5 py-2.5 rounded-lg hover:bg-[var(--border-primary)] transition-colors text-sm font-semibold">
  次要操作
</button>
```

**图标按钮**
```html
<button class="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-primary-50)] hover:bg-[var(--border-primary)] transition-colors text-[var(--color-primary-500)]">
  <Icon className="w-4 h-4" aria-hidden="true" />
</button>
```

### 卡片 (Cards)

**标准卡片**
```html
<div class="bg-[var(--bg-primary)] p-6 rounded-lg shadow-sm">
  <h3 class="text-lg font-semibold text-[var(--text-primary)]">卡片标题</h3>
  <p class="text-sm text-[var(--text-secondary)] mt-1">卡片描述</p>
</div>
```

**统计卡片**
```html
<div class="bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm relative group">
  <p class="text-sm text-[var(--text-secondary)] font-medium">指标名称</p>
  <p class="text-3xl font-bold text-[var(--text-primary)] mt-2">数值</p>
  <div class="flex items-center text-sm mt-1">
    <span class="text-green-600 font-semibold">+25%</span>
    <span class="text-[var(--text-secondary)] ml-1.5">环比</span>
  </div>
</div>
```

### 表单元素 (Form Elements)

**输入框**
```html
<input class="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent" />
```

**标签**
```html
<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-500)]">
  标签文本
</span>
```

### 导航组件

**面包屑**
```html
<nav class="flex text-sm">
  <span class="text-[var(--text-secondary)]">产品工具集 / </span>
  <span class="text-[var(--text-primary)] font-medium">当前页面</span>
</nav>
```

**分页**
```html
<div class="flex items-center gap-1">
  <button class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[var(--primary-color)] text-white">1</button>
  <button class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]">2</button>
</div>
```

---

## 📊 数据可视化

### 图表色彩
```css
--chart-primary:   #10b981  /* 绿色 - 正向趋势 */
--chart-secondary: #3b82f6  /* 蓝色 - 中性数据 */
--chart-accent:    #8b5cf6  /* 紫色 - 特殊指标 */
--chart-warning:   #f59e0b  /* 橙色 - 预警数据 */
--chart-danger:    #ef4444  /* 红色 - 负向趋势 */
```

### 图表组件规范

**趋势图表**
- 使用shadcn/ui的ChartContainer
- 基于recharts实现
- 统一的tooltip样式
- 2.5px线条粗细

**柱状图**
- 圆角顶部: `rounded-t-sm`
- 统一宽度: `w-8`
- 渐变高度表示数据比例

---

## 🎭 状态系统

### 反馈状态

**成功状态**
```html
<div class="flex items-center text-green-600">
  <CheckCircle class="w-5 h-5" />
  <span>操作成功</span>
</div>
```

**警告状态**
```html
<div class="bg-[var(--color-warning-50)] border border-[var(--color-warning-100)] p-4 rounded-md text-[var(--color-warning-600)]">
  <div class="flex items-start gap-3">
    <AlertTriangle class="w-5 h-5 flex-shrink-0" />
    <div>警告信息</div>
  </div>
</div>
```

**错误状态**
```html
<div class="flex items-center text-red-500">
  <XCircle class="w-5 h-5" />
  <span>错误信息</span>
</div>
```

### 加载状态

**骨架屏**
```html
<div class="animate-pulse">
  <div class="h-4 bg-[var(--bg-secondary)] rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-[var(--bg-secondary)] rounded w-1/2"></div>
</div>
```

---

## ♿ 无障碍性规范

### ARIA标签
- 所有交互元素必须有`aria-label`
- 装饰性图标使用`aria-hidden="true"`
- 表单元素关联相应标签

### 键盘导航
- 所有交互元素支持Tab导航
- 焦点状态清晰可见
- 支持Enter和Space激活

### 颜色对比度
- 正文文本对比度 ≥ 4.5:1
- 大文本对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

---

## 📱 响应式设计

### 断点系统
```css
sm:  640px   /* 小屏幕 */
md:  768px   /* 中等屏幕 */
lg:  1024px  /* 大屏幕 */
xl:  1280px  /* 超大屏幕 */
3xl: 1920px  /* 自定义断点 */
```

### 布局适配

**网格布局**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- 卡片内容 -->
</div>
```

**间距适配**
```html
<div class="p-6 lg:p-8">  <!-- 移动端24px，桌面端32px -->
```

---

## 🎨 主题扩展

### 深色模式预留
系统已预留深色模式支持，使用CSS变量便于主题切换。

### 定制化支持
- 所有颜色值使用CSS变量
- 支持品牌色定制
- 组件样式可通过variant扩展

---

## 📋 设计原则

### 一致性 (Consistency)
- 统一的视觉语言
- 一致的交互模式
- 标准化的组件使用

### 清晰性 (Clarity)
- 明确的视觉层次
- 直观的信息架构
- 易懂的交互反馈

### 效率性 (Efficiency)
- 减少用户认知负担
- 快速的操作响应
- 智能的默认设置

### 包容性 (Inclusivity)
- 无障碍设计
- 多设备适配
- 国际化支持

---

## 🛠 开发实施

### CSS变量使用
```css
/* ✅ 推荐 */
color: var(--text-primary);
background-color: var(--color-primary-50);

/* ❌ 避免 */
color: #1d1d1f;
background-color: #eff8ff;
```

### 组件开发规范
1. 优先使用shadcn/ui组件
2. 扩展通过variant实现
3. 保持TypeScript类型安全
4. 遵循React最佳实践

### 图标使用
- 统一使用Lucide React图标库
- 标准尺寸: 16px (w-4 h-4), 20px (w-5 h-5)
- 颜色使用CSS变量

---

## 📝 更新日志

### v1.0.0 (2025-01-16)
- 建立完整的色彩系统
- 定义字体和布局规范
- 制定组件设计标准
- 确立无障碍性要求
- 完善响应式设计规范

---

**维护人员**: Frontend Team
**最后更新**: 2025年1月16日
**版本**: v1.0.0