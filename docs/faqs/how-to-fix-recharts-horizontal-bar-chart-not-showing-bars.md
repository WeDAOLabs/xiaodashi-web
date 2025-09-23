### **Q: 如何解决 recharts 横向柱状图不显示柱子的问题？**

**A:**
当 recharts 横向柱状图只显示坐标轴和网格线，但柱子不显示时（HTML中出现空的 `<g class="recharts-layer recharts-bar-rectangle"></g>` 元素），通常是配置错误导致的。

**问题症状：**
- 坐标轴和网格线正常显示
- HTML 中存在空的柱子容器元素
- 即使设置直接颜色值柱子也不显示
- 控制台无错误信息

**根本原因：**
使用了错误的 `layout` 配置。很多开发者误以为横向柱状图应该使用 `layout="horizontal"`。

**解决方案：**
横向柱状图需要使用 `layout="vertical"` 配置。

**错误配置示例：**
```jsx
// ❌ 错误：这样会导致柱子不显示
<ResponsiveContainer width="100%" height={400}>
  <BarChart
    layout="horizontal"  // 错误配置
    data={data}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
```

**正确配置示例：**
```jsx
// ✅ 正确：横向柱状图使用 layout="vertical"
<ResponsiveContainer width="100%" height={400}>
  <BarChart
    layout="vertical"  // 正确配置
    data={data}
    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
    <XAxis type="number" hide />  {/* 推荐隐藏数值轴 */}
    <YAxis type="category" dataKey="name" />
    <Bar dataKey="value" fill="#8884d8" maxBarSize={30} />
  </BarChart>
</ResponsiveContainer>
```

**关键配置要点：**
- `layout="vertical"` - 创建横向柱状图的正确配置
- `CartesianGrid horizontal={false}` - 显示垂直网格线
- `XAxis type="number" hide` - 隐藏数值轴（推荐）
- `YAxis type="category" dataKey="name"` - 分类轴显示标签
- `maxBarSize={30}` - 限制柱子高度，避免过粗

**数据格式示例：**
```javascript
const data = [
  { name: '产品A', value: 400 },
  { name: '产品B', value: 300 },
  { name: '产品C', value: 200 },
  { name: '产品D', value: 278 }
];
```

**参考文档：**
[Recharts BarChart 官方文档](https://recharts.org/en-US/api/BarChart)