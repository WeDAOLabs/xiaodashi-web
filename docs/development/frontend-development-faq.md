# 前端开发常见问题 FAQ

## 图表组件问题

### Q: recharts 柱状图鼠标悬停时出现灰色背景如何解决？

**问题描述**: 使用 recharts 的 BarChart 组件时，鼠标悬停在柱状图上会出现灰色背景 (`fill="#ccc"`)

**解决方案**: 在 `ChartTooltip` 组件上添加 `cursor={false}` 属性

```tsx
// ❌ 错误方法：在 BarChart 上设置 cursor
<BarChart cursor={false}>
  <ChartTooltip />
</BarChart>

// ✅ 正确方法：在 ChartTooltip 上设置 cursor
<BarChart>
  <ChartTooltip cursor={false} />
</BarChart>
```

**替代方案**: 如果需要自定义悬停效果，可使用透明填充
```tsx
<ChartTooltip cursor={{ fill: 'transparent' }} />
```

**原理**: 灰色背景是 recharts 的默认 highlight 效果，通过在 Tooltip 上设置 cursor={false} 可以完全禁用。

### Q: recharts 横向柱状图不显示柱子（空矩形元素）如何解决？

**问题症状**:
- HTML中显示空的 `<g class="recharts-layer recharts-bar-rectangle"></g>`
- 坐标轴和网格线正常，但柱子不显示
- 即使使用直接颜色值也不显示

**根本原因**: `layout="horizontal"` 配置错误

**解决方案**: 使用 `layout="vertical"` 创建横向柱状图

```tsx
// ❌ 错误配置：会导致柱子不显示
<BarChart layout="horizontal" data={data}>
  <CartesianGrid horizontal={true} vertical={false} />
  <XAxis type="number" />
  <YAxis type="category" dataKey="name" />
  <Bar dataKey="value" fill="#10b981" />
</BarChart>

// ✅ 正确配置：横向柱状图
<BarChart layout="vertical" data={data}>
  <CartesianGrid horizontal={false} />
  <XAxis type="number" hide />
  <YAxis type="category" dataKey="name" />
  <Bar dataKey="value" fill="#10b981" maxBarSize={40} />
</BarChart>
```

**关键要点**:
1. 横向柱状图使用 `layout="vertical"`
2. CartesianGrid 设置 `horizontal={false}`
3. 添加 `maxBarSize` 限制柱子高度
4. 推荐隐藏 XAxis: `<XAxis type="number" hide />`

---

## Tailwind CSS v4 相关

### Q: 当前项目使用的 Tailwind 语法是否兼容 v4？

**回答**: 是的，当前项目中使用的样式完全兼容 Tailwind v4。

**支持的语法**:
- CSS 变量: `var(--color-chart-1)` ✅
- 基础类名: `text-lg`, `font-semibold` ✅
- 响应式: `lg:col-span-3` ✅
- 间距: `p-5`, `mb-4` ✅

**注意事项**: 如果未来使用透明度语法，需要转义斜杠 `bg-blue-500\/50`

---

## 其他常见问题

*此部分将根据实际开发中遇到的问题持续更新*