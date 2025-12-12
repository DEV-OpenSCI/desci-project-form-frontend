<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 DeSci（去中心化科学）项目申请表前端应用，使用 React + TypeScript + Vite 构建。用户通过表单提交科研项目申请，包含项目信息、团队成员、里程碑、经费预算等内容。

## 常用命令

```bash
# 开发
npm run dev

# 构建（先 TypeScript 检查，再 Vite 构建）
npm run build

# ESLint 检查
npm run lint

# 预览构建产物
npm run preview
```

## 技术栈

- **构建工具**: Vite 6
- **UI 框架**: React 18 + TypeScript 5.7
- **表单处理**: react-hook-form + zod（校验）+ @hookform/resolvers
- **样式**: Tailwind CSS 3 + tailwindcss-animate
- **UI 组件**: Radix UI (label, select, popover, separator, slot)
- **工具库**: clsx + tailwind-merge（通过 `cn()` 函数合并类名）

## 代码架构

### 路径别名

项目配置了 `@/*` 指向 `./src/*`，在 `tsconfig.json` 和 `vite.config.ts` 中同步配置。

### 目录结构

```
src/
├── components/
│   ├── form/           # 表单各分区组件
│   │   ├── ProjectForm.tsx      # 主表单组件，组合所有分区
│   │   ├── BasicInfoSection.tsx # 项目基本信息
│   │   ├── TeamSection.tsx      # 团队成员
│   │   ├── ProjectIntroSection.tsx # 项目介绍
│   │   ├── BudgetSection.tsx    # 经费预算
│   │   └── ContactSection.tsx   # 联系人
│   └── ui/             # 可复用 UI 组件（shadcn/ui 风格）
├── types/
│   └── form.ts         # Zod schema 定义和 TypeScript 类型导出
├── lib/
│   ├── constants.ts    # 下拉选项常量（学科、领域、职称等）
│   └── utils.ts        # 工具函数（cn 类名合并）
└── App.tsx             # 应用入口
```

### 表单架构

表单使用 `react-hook-form` 管理状态，`zod` 定义校验规则：

1. **Schema 定义** (`src/types/form.ts`): 所有校验规则和类型定义
2. **表单组件**: 接收 `UseFormReturn<ProjectFormData>` 作为 prop
3. **常量配置** (`src/lib/constants.ts`): 所有下拉选项的值和标签

### UI 组件规范

UI 组件遵循 shadcn/ui 风格：
- 使用 `cn()` 函数合并 Tailwind 类名
- 支持 `className` prop 覆盖样式
- 使用 CSS 变量定义主题色（在 Tailwind 配置中映射）
