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

## UI 组件规范 (shadcn/ui)

本项目使用 `shadcn/ui` 作为 UI 组件的基础。它并非传统的组件库，而是一套可复用的组件代码集合，通过 CLI 添加到项目中。

### 安装命令
```
cd frontend-app && npx shadcn@latest add button
```

### 项目特定规范

**重要**: 对于 `frontend-app` 项目，**必须优先使用 shadcn/ui 组件实现页面**。这确保了整个应用的设计系统一致性和组件可维护性。

- **强制要求**: 在开发任何新页面或组件时，首先检查是否有可用的 shadcn/ui 组件
- **优先级顺序**: shadcn/ui > 自定义组件 > 第三方组件库
- **设计一致性**: 所有 UI 元素都应基于 shadcn/ui 的设计规范构建

### 核心理念

- **非依赖包**: `shadcn/ui` 不是一个 npm 包。你拥有组件的全部代码，可以自由修改。
- **基于 Radix UI**: 底层使用功能强大、无障碍性优秀的 Radix UI 无头组件。
- **Tailwind CSS 造型**: 样式完全由 Tailwind CSS 实现，与项目设计系统无缝集成。

### 使用流程

1.  **添加新组件**:
    - 在 `frontend-app` 目录下，运行 CLI 命令添加新组件。
    - 组件代码会自动生成在 `frontend-app/components/ui` 目录下。
    ```bash
    # 示例：添加一个 Checkbox 组件
    cd frontend-app
    npx shadcn@latest add checkbox
    ```

2.  **自定义样式 (最佳实践)**:
    - **优先使用 `variant`**: 当需要为组件创建不同风格时，应优先修改组件文件 (`*.tsx`) 中的 `cva` (Class Variance Authority) 配置，为其添加新的 `variant`。
    - **避免直接覆盖**: 不要用外部 CSS 类或行内样式去覆盖组件的基础样式。通过 `variant` 扩展组件，是 `shadcn/ui` 的核心优势。

    ```tsx
    // 示例：在 button.tsx 中添加一个名为 "help" 的新变体
    const buttonVariants = cva(
      // ... base styles
      {
        variants: {
          variant: {
            default: "...",
            destructive: "...",
            help: "bg-[#0d8ca5] text-white hover:bg-[#0b7a93]", // 新增变体
          },
          // ...
        },
      }
    )

    // 在页面中使用
    import { Button } from "@/components/ui/button"
    <Button variant="help">帮助中心</Button>
    ```

---

## 图标库使用规范

**官方推荐**: 使用 **Lucide React** 作为主要图标库（shadcn/ui 官方默认）。

### 使用策略

- **新功能**: 必须使用 Lucide React
- **现有功能**: 保持现状，按需迁移

### 正确用法

```tsx
// 按需导入
import { Home, Settings, Bell } from 'lucide-react';

// 使用 CSS 变量设置颜色
<Home className="text-[var(--primary-color)]" size={24} />
<Settings className="text-[var(--text-secondary)]" strokeWidth={1.5} />
```

### 错误用法

```tsx
// ❌ 硬编码颜色
<Home color="#333333" />

// ❌ 新功能中创建自定义 SVG（应优先检查 Lucide）
const CustomIcon = () => <svg>...</svg>;
```

---

## 依赖管理 (npm Workspaces)

**核心要求**: **所有前端相关的依赖项**都必须安装到 `frontend` 工作区中，而不是项目的根目录。

本项目使用 npm Workspaces 管理 monorepo。为了保持 `frontend` 工作区依赖的清晰和独立，请遵循以下规范：

-   **错误的做法**: 在项目根目录直接运行 `npm install <package-name>`。
-   **正确的做法**: 使用 `--workspace=frontend` 参数来指定依赖的安装位置。

#### 命令示例

如果你要为前端项目添加一个新的依赖包，你应该在**项目根目录**下运行以下命令：

```bash
# 为 frontend 工作区安装一个生产依赖
npm install <package-name> --workspace=frontend

# 为 frontend 工作区安装一个开发依赖
npm install <package-name> --save-dev --workspace=frontend
```

**效果**:
执行上述命令后，依赖项会被正确地添加到 `frontend/package.json` 文件中。这可以确保依赖关系的清晰，并避免在部署时（如Vercel）出现“模块未找到”的错误。

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