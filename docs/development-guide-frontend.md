# Development Conventions

- **Images need to be localized**: All images used in the frontend should be stored locally in the `frontend/public` directory.
- **Avoid Google resources**: Do not use Google Fonts or other Google-hosted resources directly. Use local alternatives like `@fontsource` for fonts.
- **Component Prop Typing**: All React component props must be explicitly typed. This is mandatory to prevent `implicit any` type errors that will cause the production build (`npm run build`) to fail.

  - **Bad Practice:**
    ```tsx
    // Bad: Props have implicit 'any' type, which will fail the build.
    const MyComponent = ({ title, data }) => {
      // ...
    };
    ```

  - **Good Practice:**
    ```tsx
    // Good: Props are explicitly typed using an interface or type alias.
    interface MyComponentProps {
      title: string;
      data: SomeDataType;
    }

    const MyComponent = ({ title, data }: MyComponentProps) => {
      // ...
    };
    ```

---

## 技术栈关键注意事项：Tailwind CSS v4

**警告：** 本项目使用 **Tailwind CSS v4**，其配置和工作方式与旧的 v3 版本有根本性不同。在进行任何样式相关的修改前，必须理解以下核心概念，以避免破坏整个样式系统。

### 核心概念

1.  **CSS 即配置 (CSS as Configuration)**:
    *   本项目**不使用** `tailwind.config.js` 或 `tailwind.config.ts` 文件。
    *   所有 Tailwind 的配置，包括主题（颜色、字体等）的自定义，都直接在 `frontend/app/globals.css` 文件中通过 `@theme` 指令完成。

2.  **入口点**:
    *   `globals.css` 文件顶部的 `@import "tailwindcss";` 是必须的。它负责引入整个 Tailwind v4 引擎。**绝对不能删除此行**。

### 与 `next/font` 的集成模式

本项目的字体优化遵循以下官方推荐的最佳实践：

1.  **`layout.tsx` (或相关组件)**: 使用 `next/font/local` 加载字体文件，并为字体创建一个 CSS 变量 (e.g., `variable: '--font-noto-sans-sc'`)。
2.  **`globals.css`**: 在 `@theme` 指令块中，消费 `layout.tsx` 中创建的 CSS 变量，将其赋值给 Tailwind 的主题（如 `--font-sans`）。

---

## 样式规范：使用CSS变量进行主题化

**核心要求**: **严禁**在组件中硬编码颜色值。所有颜色都必须通过项目中预定义的CSS变量来引用，以确保全局主题的一致性和可维护性。

项目中所有核心颜色都在 `globals.css` 的 `:root` 中定义，例如 `--primary-color`, `--text-primary`, `--background-color` 等。

-   **错误实践 (Bad Practice):**
    ```tsx
    // 错误: 硬编码颜色值，破坏了主题。
    <div className="bg-blue-600 text-white">
      <p className="text-gray-500">Some text</p>
    </div>
    ```

-   **正确实践 (Good Practice):**
    ```tsx
    // 正确: 使用CSS变量，与全局主题保持一致。
    <div className="bg-[var(--primary-color)] text-white">
      <p className="text-[var(--text-secondary)]">Some text</p>
    </div>
    ```

---

## 组件导入规范

- **路径别名 (Path Aliases):** 本项目前端使用 `@/` 作为 `frontend/` 目录的别名。所有组件和模块的导入都应优先使用此别名，以保证路径的一致性。例如，`@/app/components/Header`。在引用前，请确认 `tsconfig.json` 中 `paths` 的具体配置。

- **默认与命名导入 (Default vs. Named Imports):**
    - 务必确认组件的导出方式。如果组件使用 `export default` 导出，导入时不应使用大括号 `{}`。
    - **错误示例**: `import { MyComponent } from './MyComponent';` (当 `MyComponent` 是默认导出时)
    - **正确示例**: `import MyComponent from './MyComponent';` (当 `MyComponent` 是默认导出时)
    - 在不确定导出方式时，应先查看组件源文件，避免出现模块解析错误。

---

## `next/image` 组件使用规范 (Next.js 13+)

**核心要求**: `next/image` 组件不再支持 `layout` 属性。

- **`layout` 属性已废弃**: 不要使用 `layout="responsive"`, `layout="fill"`, 或 `layout="fixed"`。
- **响应式图片**: 要实现旧版 `layout="responsive"` 的效果，移除 `layout` 属性，并为 `Image` 组件添加 `className="h-auto w-full"`。`width` 和 `height` 属性此时用于计算宽高比，防止布局位移。

  - **错误实践 (Bad Practice):**
    ```tsx
    // 错误: 使用了已废弃的 layout 属性。
    <Image
      src="/my-image.png"
      alt="My Image"
      width={800}
      height={600}
      layout="responsive" 
    />
    ```

  - **正确实践 (Good Practice):**
    ```tsx
    // 正确: 移除 layout 属性，通过 className 实现响应式。
    <Image
      src="/my-image.png"
      alt="My Image"
      width={800}
      height={600}
      className="h-auto w-full" 
    />
    ```
