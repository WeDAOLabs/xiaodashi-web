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