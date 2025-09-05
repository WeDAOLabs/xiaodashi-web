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
