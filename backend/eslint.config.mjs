// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
  // 测试文件特殊规则 - 放宽测试相关的类型检查和限制
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts'],
    rules: {
      // 放宽Mock和框架集成相关的类型检查
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/require-await': 'off',

      // 测试中允许的未使用变量（包括下划线前缀）
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        // 测试文件中允许注释掉的未使用导入和变量
        caughtErrors: 'none'  // 完全禁用测试文件中的未使用变量警告
      }],

      // 测试中允许未绑定的方法（用于Mock验证）
      '@typescript-eslint/unbound-method': 'off',

      // 测试中允许未使用的表达式（用于验证Mock调用）
      '@typescript-eslint/no-unused-expressions': 'off',

      // 测试中允许require导入（用于动态导入测试模块）
      '@typescript-eslint/no-require-imports': 'off',

      // 测试特定的放宽规则
      '@typescript-eslint/no-non-null-assertion': 'off', // 测试中可以使用!断言

      // 测试中允许any类型（用于Mock对象和测试数据）
      '@typescript-eslint/no-explicit-any': 'off',

      // 但保持核心代码质量检查
      'prefer-const': 'error',
    },
  },
);