# Tailwind CSS v4 语法迁移指南

## 🚨 重要提醒
**在 xiaodashi-web/frontend-app 项目中，我们使用 Tailwind CSS v4 语法！严禁使用 v3 语法！**

## 核心语法变化

### 1. 不透明度语法 (最常见错误)
```html

<!-- ✅ v4 语法 (正确) -->
<div class="bg-blue-500/50 text-white/80">
```

### 2. 新的伪类变体

#### @starting-style 变体 (元素入场动画)
```html
<!-- v4 新功能：元素首次显示时的过渡效果 -->
<div popover class="transition-discrete starting:open:opacity-0">
  <!-- 弹窗内容 -->
</div>
```

#### 表单验证变体 (推荐使用)
```html
<!-- ❌ v3 语法 -->
<input class="border invalid:border-red-500 valid:border-green-500" />

<!-- ✅ v4 推荐语法 (用户交互后才显示验证状态) -->
<input class="border user-invalid:border-red-500 user-valid:border-green-500" />
```

#### JavaScript 禁用检测
```html
<!-- v4 新功能：CSS 方式检测 JS 禁用 -->
<div class="hidden noscript:block">
  请启用 JavaScript 来使用此应用。
</div>
```

### 3. 文本阴影透明度控制
```html
<!-- v4 新功能：直接控制阴影透明度 -->
<p class="text-shadow-lg/20">轻微阴影</p>
<p class="text-shadow-lg/50">中等阴影</p>
<p class="text-shadow-lg/80">深度阴影</p>
```

### 4. 列表样式图像
```html
<!-- v4 新功能：自定义列表标记 -->
<ul class="list-image-[url(/icon.png)]">
  <li>自定义图标列表项</li>
</ul>
```

## 常见错误对比表

| 功能 | ❌ v3 语法 | ✅ v4 语法 | 说明 |
|------|-----------|-----------|------|
| 表单验证 | `invalid:border-red-500` | `user-invalid:border-red-500` | 用户交互后显示 |
| 阴影透明度 | 需要自定义 CSS | `text-shadow-lg/30` | 内置支持 |
| JS 禁用检测 | `<noscript>` 标签 | `noscript:block` | CSS 类方式 |

## CSS 层级系统 (v4 新架构)

v4 引入了原生 CSS 层级：
```css
@layer theme, base, components, utilities;

@layer utilities {
  .mx-6 {
    margin-inline: calc(var(--spacing) * 6);
  }
}
```

## 现代 CSS 特性

### color-mix() 函数
```css
/* v4 内部使用现代 CSS 特性 */
.bg-blue-500\/50 {
  background-color: color-mix(in oklab, var(--color-blue-500) 50%, transparent);
}
```

### 注册的自定义属性
```css
@property --tw-gradient-from {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
```

## 开发规范

### ✅ 必须使用
- 所有透明度都使用 `\/` 转义语法
- 表单验证优先使用 `user-*` 变体
- 利用 v4 新特性提升用户体验

### ❌ 严禁使用
- v3 的 `/` 透明度语法
- 过时的验证变体
- 忽略 v4 新功能特性

## 安装配置

```bash
# 安装 v4 (当前为 alpha)
npm install tailwindcss@next @tailwindcss/vite@next
```

## 参考资源

- [Tailwind CSS v4 官方博客](https://tailwindcss.com/blog/tailwindcss-v4)
- [v4 Alpha 发布说明](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [现代 CSS 特性支持](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

💡 **开发提醒**：在编写或审查代码时，务必检查是否使用了正确的 v4 语法！