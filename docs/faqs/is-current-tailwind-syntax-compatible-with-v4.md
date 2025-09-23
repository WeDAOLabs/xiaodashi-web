### **Q: 当前项目使用的 Tailwind 语法是否兼容 v4？**

**A:**
是的，当前项目中使用的样式完全兼容 Tailwind CSS v4。项目已经按照 v4 标准进行开发，现有的样式代码可以直接在 v4 环境下运行。

**兼容的语法类型：**
- **CSS 变量**: `var(--color-chart-1)` ✅
- **基础类名**: `text-lg`, `font-semibold`, `bg-white` ✅
- **响应式设计**: `lg:col-span-3`, `md:grid-cols-2` ✅
- **间距和布局**: `p-5`, `mb-4`, `gap-4` ✅
- **颜色系统**: `text-muted-foreground`, `bg-card` ✅
- **状态变体**: `hover:bg-accent`, `focus:ring-2` ✅

**v4 特有语法支持：**
- **用户交互验证**: `user-invalid:border-red-500` (推荐使用)
- **入场动画**: `starting:open:opacity-0`
- **JavaScript 禁用检测**: `noscript:block`

**重要注意事项：**
- **透明度语法**: 如果未来需要使用透明度，必须转义斜杠
  - ❌ 错误: `bg-blue-500/50`
  - ✅ 正确: `bg-blue-500\/50`
- **表单验证**: 优先使用 `user-*` 变体而不是 `invalid:*`
- **阴影透明度**: 支持 `text-shadow-lg/50` 等新语法

**代码示例：**
```tsx
// 当前项目中的兼容语法
<div className="p-5 bg-card text-card-foreground rounded-lg">
  <h3 className="text-lg font-semibold mb-4">
    标题内容
  </h3>
  <div className="grid gap-4 lg:grid-cols-3">
    {/* 内容 */}
  </div>
</div>

// v4 透明度语法示例（未来使用时需注意）
<div className="bg-blue-500\/50 text-white\/80">
  半透明背景内容
</div>
```

**参考文档**: 完整的 v3 vs v4 语法对比请查看 `docs/tailwind-v4-migration.md`