# 文档组织说明

本文档目录按照开发类型进行分类组织，采用一级文件夹结构，便于快速定位和查找相关文档。

## 目录结构

```
docs/
├── architecture/           # 架构设计相关
├── development/           # 开发指南和规范
├── design/               # 设计规范和UI指南
├── api/                  # API相关文档
├── project/              # 项目信息和技术栈
└── README.md             # 本说明文件
```

## 各文件夹说明

### 📐 architecture/ - 架构设计
**作用**：系统架构、项目结构、安全架构等核心设计文档
**适用场景**：了解系统整体设计、技术选型、安全策略
**包含文档**：
- `architecture.md` - 整体架构设计
- `project-structure.md` - 项目结构说明
- `api-security-architecture.md` - API安全架构

### 🔧 development/ - 开发指南
**作用**：开发环境搭建、开发流程、框架使用指南、常见问题
**适用场景**：新人入门、开发环境配置、解决开发问题
**包含文档**：
- `development-guide.md` - 通用开发指南
- `development-guide-frontend.md` - 前端开发指南
- `dashboard-framework-guide.md` - Dashboard框架指南
- `frontend-development-faq.md` - 前端开发常见问题

### 🎨 design/ - 设计规范
**作用**：UI设计规范、样式指南、设计系统迁移
**适用场景**：前端UI开发、设计规范遵循、样式升级
**包含文档**：
- `ui-design-guidelines.md` - UI设计规范
- `tailwind-v4-migration.md` - Tailwind CSS v4迁移指南

### 🔌 api/ - API文档
**作用**：API设计规范、接口文档、API使用指南
**适用场景**：后端API开发、前端接口对接、API规范制定
**包含文档**：
- `api-design.md` - API设计规范

### 📋 project/ - 项目信息
**作用**：项目基本信息、技术栈说明、项目介绍
**适用场景**：了解项目概况、技术栈选择、项目介绍
**包含文档**：
- `tech-stack.md` - 技术栈说明
- `project-frontend-app.md` - 前端应用项目介绍

## 文档查找建议

1. **新人入门**：先看 `project/` 了解项目概况，再看 `development/` 搭建开发环境
2. **架构了解**：查看 `architecture/` 目录下的相关文档
3. **开发问题**：优先查看 `development/` 目录下的FAQ和指南
4. **UI开发**：参考 `design/` 目录下的设计规范
5. **API开发**：查看 `api/` 目录下的设计规范

## 文档维护规则

- 新增文档请按内容类型放入对应文件夹
- 保持一级文件夹结构，避免嵌套过深
- 文档命名采用kebab-case格式（小写+连字符）
- 重要文档更新后请及时同步相关人员