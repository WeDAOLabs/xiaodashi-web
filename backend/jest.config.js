/**
 * Jest 配置文件 - 优化用于显示所有警告和错误信息
 *
 * 主要优化点:
 * 1. 启用 verbose 模式显示详细信息
 * 2. 配置 TypeScript 编译器警告输出
 * 3. 优化测试覆盖率报告
 * 4. 配置模块路径映射
 */
module.exports = {
  // 基础配置
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',

  // 输出和显示配置 - 关键优化点
  verbose: true,                    // 显示详细测试信息
  silent: false,                   // 不抑制输出，显示所有信息
  errorOnDeprecated: true,         // 对废弃API报错

  // TypeScript 配置
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // 使用独立的tsconfig文件进行测试
        tsconfig: 'tsconfig.json',
        // 显示TypeScript编译警告
        diagnostics: {
          ignoreCodes: [],  // 不忽略任何诊断代码，显示所有警告
          warnOnly: true,   // 将警告作为警告而不是错误处理
          pretty: true      // 美化输出格式
        },
        // 编译选项 - 使用新的transpilation选项
        transpilation: true
      }
    ]
  },

  // 模块路径映射 - 与项目配置保持一致
  moduleNameMapper: {
    '^@xiaodashi/shared$': '<rootDir>/../../shared/dist/index.js',
    // 支持绝对路径导入
    '^@/(.*)$': '<rootDir>/$1',
    // Mock slider-puzzle.generator以在测试中使用mock版本
    '^../utils/slider-puzzle.generator$': '<rootDir>/security/utils/slider-puzzle.generator.mock.ts'
  },

  // 测试覆盖率配置
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',        // 排除测试文件
    '!**/node_modules/**',  // 排除node_modules
    '!**/dist/**',         // 排除构建输出
    '!**/coverage/**'      // 排除覆盖率报告
  ],
  coverageDirectory: '../coverage',
  coverageReporters: [
    'text',                // 命令行显示
    'lcov',               // HTML报告
    'text-summary'        // 摘要报告
  ],

  // 测试设置
  testTimeout: 10000,     // 10秒超时

  // 清理配置
  clearMocks: true,
  restoreMocks: true,

  // 监视模式配置
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],

  };