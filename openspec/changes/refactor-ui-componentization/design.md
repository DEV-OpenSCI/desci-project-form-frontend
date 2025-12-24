## Context
当前页面与表单组件内存在较多直接 JSX 结构，职责边界不够清晰。

## Goals / Non-Goals
- Goals: 提升组件复用与可维护性，明确组件层级与职责
- Non-Goals: 不改变现有业务流程与表单逻辑行为

## Decisions
- Decision: 以页面级/区块级/字段级三层结构拆分 UI 组件
- Alternatives considered: 仅按页面拆分（复用不足）

## Risks / Trade-offs
- 组件数量增加可能带来结构复杂度 → 用统一目录与命名降低认知负担

## Migration Plan
1. 先抽取无状态展示组件
2. 再抽取区块级组合组件
3. 最后替换 App 与页面中的内联结构

## Open Questions
- 是否需要新增统一的字段级组件目录（如 components/fields）？
