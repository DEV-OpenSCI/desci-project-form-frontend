# Change: Align Semantic Tokens to Shadcn Naming

## Why
当前样式体系引入了自定义语义 token 与类名，不利于与 shadcn/ui 的默认语义体系对齐。
统一命名可降低认知成本，提升可维护性与生态兼容性。

## What Changes
- 统一 CSS 语义 token 命名为 shadcn/ui 默认集合
- 调整 Tailwind 主题配置以匹配 shadcn 语义 token
- 批量更新组件类名与样式引用

## Impact
- Affected specs: ui-tokens
- Affected code: src/index.css, tailwind.config.js, src/components/**/*
