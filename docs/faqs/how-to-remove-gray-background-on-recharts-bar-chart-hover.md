# **Q: 如何解决 recharts 柱状图鼠标悬停时出现灰色背景的问题？**

**A:**
使用 recharts 的 BarChart 组件时，鼠标悬停在柱状图上会出现默认的灰色背景 (fill="#ccc")，这是 recharts 的默认 highlight 效果。要解决这个问题，需要在 `ChartTooltip` 组件上正确设置 `cursor` 属性。

## 解决方案

### 方法一：完全禁用悬停背景
在 `ChartTooltip` 组件上添加 `cursor={false}` 属性：

```tsx
import { Bar, BarChart, XAxis, YAxis, ChartTooltip, ChartContainer } from "recharts"

export function MyBarChart() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" fill="#8884d8" />
        <ChartTooltip cursor={false} />
      </BarChart>
    </ChartContainer>
  )
}
```

### 方法二：使用透明背景
如果需要保留悬停效果但不显示背景，可以使用透明填充：

```tsx
<ChartTooltip cursor={{ fill: 'transparent' }} />
```

### 方法三：自定义悬停样式
也可以自定义悬停背景的颜色和样式：

```tsx
<ChartTooltip
  cursor={{
    fill: 'rgba(0, 0, 0, 0.1)',
    stroke: '#8884d8',
    strokeWidth: 1
  }}
/>
```

## 常见错误

❌ **错误做法：在 BarChart 上设置 cursor**
```tsx
// 这样设置无效
<BarChart data={data} cursor={false}>
  <ChartTooltip />
</BarChart>
```

✅ **正确做法：在 ChartTooltip 上设置 cursor**
```tsx
<BarChart data={data}>
  <ChartTooltip cursor={false} />
</BarChart>
```

## 技术原理

- 灰色背景是 recharts 的默认 highlight 效果，用于指示当前悬停的数据区域
- 该效果由 `Tooltip` 组件的 `cursor` 属性控制，而不是 `BarChart` 组件
- 默认的 cursor 样式为 `{ fill: '#ccc' }`
- 通过设置 `cursor={false}` 可以完全禁用此效果
- 通过自定义 cursor 对象可以调整背景颜色、描边等样式

## 相关配置选项

| 属性 | 类型 | 说明 |
|------|------|------|
| `cursor={false}` | boolean | 完全禁用悬停背景 |
| `cursor={{ fill: 'transparent' }}` | object | 透明背景 |
| `cursor={{ fill: '#f0f0f0' }}` | object | 自定义背景颜色 |
| `cursor={{ stroke: '#000', strokeWidth: 1 }}` | object | 添加边框样式 |

这个解决方案适用于所有 recharts 图表类型，包括 BarChart、LineChart、AreaChart 等。