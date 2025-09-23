**Date:** 2025-09-23

### **Q: 如何解决 shadcn Card 组件底部栏样式问题（缺少背景色、分割线、覆盖不完整）？**

**A:**
当使用 shadcn Card 组件时，底部栏（CardFooter）经常出现样式问题，如缺少灰色背景、分割线或底部覆盖不完整。正确的解决方案是使用 shadcn 组件的语义化结构并添加必要的样式。

**关键解决步骤：**

- **使用正确的 Card 组件结构**：
  ```tsx
  <Card className="bg-[var(--bg-primary)] rounded-lg shadow-sm border-2 transition-all duration-200 group cursor-pointer flex flex-col p-0 gap-0">
    <CardContent className="p-5 flex-1">
      {/* 主要内容 */}
      <div className="mt-4 pt-4 border-t border-[var(--border-secondary)]">
        {/* AI摘要 - 需要上边框分割线 */}
      </div>
    </CardContent>
    <CardFooter className="px-5 py-3 bg-[var(--bg-tertiary)] rounded-b-lg flex items-center justify-between text-xs text-[var(--text-secondary)]">
      {/* 底部元数据栏 */}
    </CardFooter>
  </Card>
  ```

- **Card 组件必须添加样式**：`p-0 gap-0` 移除默认间距
- **CardFooter 必须添加样式**：
  - `bg-[var(--bg-tertiary)]` - 灰色背景
  - `rounded-b-lg` - 底部圆角匹配
  - 内边距和布局样式：`px-5 py-3 flex items-center justify-between`
- **内容分割线**：在需要分割的内容区域添加 `border-t border-[var(--border-secondary)]`

**常见错误避免：**

- ❌ 不要放弃 shadcn 组件改用原生 div
- ❌ 不要将底部内容放在 CardContent 中
- ❌ 不要忘记给 CardFooter 添加背景色样式
- ❌ 不要混用原生 HTML 和 shadcn 组件破坏语义化

**技术要点：**

- shadcn Card 组件默认没有 CardFooter 的背景样式，需要手动添加
- 使用 CSS 变量确保主题一致性：`var(--bg-tertiary)` 和 `var(--border-secondary)`
- 保持组件的语义化结构有利于可访问性和样式继承
