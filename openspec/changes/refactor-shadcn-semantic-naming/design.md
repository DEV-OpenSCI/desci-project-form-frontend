## Context
当前样式体系存在自定义语义 token（如 success/warning/info/brand）与 shadcn 默认 token 并存的情况。

## Goals / Non-Goals
- Goals: 统一命名为 shadcn 语义集合，减少自定义命名
- Non-Goals: 改变产品视觉风格（除非明确要求）

## Decisions
- Decision: 采用 shadcn 默认语义 token 命名作为唯一标准
- Alternatives considered: 保留自定义 token（不利于一致性）

## Risks / Trade-offs
- 批量替换可能导致样式偏差 → 通过映射表与构建验证降低风险

## Migration Plan
1. 生成 token/类名映射表
2. 批量替换 CSS 与组件引用
3. 运行构建验证

## Open Questions
- 是否需要保持现有视觉效果不变？
