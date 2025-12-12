# Project Context

## Purpose

DeSci（去中心化科学）项目申请表前端应用。用户通过表单提交科研项目申请，包含：
- 项目基本信息（名称、时间、学科、领域）
- 团队成员信息（负责人、成员）
- 项目介绍（简介、背景、里程碑）
- 经费预算
- 联系人信息

## Tech Stack

### 核心框架
- **React 18** - UI 框架
- **TypeScript 5.7** - 类型安全
- **Vite 6** - 构建工具

### 表单处理
- **react-hook-form 7** - 表单状态管理
- **zod 3** - Schema 定义与校验
- **@hookform/resolvers** - zod 与 react-hook-form 集成

### 样式
- **Tailwind CSS 3** - 原子化 CSS
- **tailwindcss-animate** - 动画支持
- **clsx + tailwind-merge** - 类名合并（通过 `cn()` 函数）

### UI 组件
- **Radix UI** - 无障碍基础组件（label, select, popover, separator, slot）
- **class-variance-authority** - 组件变体管理
- **lucide-react** - 图标库
- **react-day-picker + date-fns** - 日期选择器

## Project Conventions

### Code Style

- **语言**: 中文注释和 UI 文案
- **路径别名**: `@/*` 指向 `./src/*`
- **导入顺序**: React/外部库 → 内部组件 → 类型 → 常量
- **组件定义**: 使用 `function` 声明，非默认导出
- **类型定义**: 优先使用 `type`，从 zod schema 推断类型

### Architecture Patterns

#### 目录结构
```
src/
├── components/
│   ├── form/           # 表单分区组件
│   └── ui/             # 可复用 UI 组件（shadcn/ui 风格）
├── types/              # Zod schema 和类型定义
├── lib/
│   ├── constants.ts    # 下拉选项常量
│   └── utils.ts        # 工具函数
└── App.tsx
```

#### 表单架构
1. **Schema 定义** (`src/types/form.ts`): 所有校验规则集中定义
2. **表单分区组件**: 接收 `UseFormReturn<ProjectFormData>` 作为 prop
3. **常量配置** (`src/lib/constants.ts`): 下拉选项的 value/label 映射

#### UI 组件规范（shadcn/ui 风格）
- 使用 `cn()` 函数合并 Tailwind 类名
- 支持 `className` prop 覆盖样式
- 使用 CSS 变量定义主题色
- 使用 `class-variance-authority` 管理组件变体

### Testing Strategy

目前项目尚未配置测试框架。建议后续添加：
- **Vitest** - 单元测试
- **React Testing Library** - 组件测试
- **Playwright/Cypress** - E2E 测试

### Git Workflow

- 使用常规的功能分支工作流
- 提交信息使用中文，格式：`<type>: <description>`
  - 类型：feat（功能）、fix（修复）、docs（文档）、style（样式）、refactor（重构）

## Domain Context

### 表单字段说明

- **学科/领域**: 下拉选项定义在 `constants.ts`
- **里程碑**: 固定三个阶段（第一阶段/第二阶段/第三阶段）
- **经费类别**: 设备费、材料费、测试化验加工费等
- **人员信息**: 职称、学历等有预定义选项

### 业务术语
- **DeSci**: Decentralized Science，去中心化科学
- **ORCID**: 科研人员唯一标识符

## Important Constraints

- 项目简介和背景最大 1500 字
- 里程碑必须填写 3 个阶段
- 所有必填字段通过 zod schema 校验
- 目前是纯前端应用，后端接口待对接

## External Dependencies

- 暂无外部 API 依赖
- 表单提交功能待对接后端服务
