## Context
构建产物出现 chunk 体积警告，提示需要分块优化。

## Goals / Non-Goals
- Goals: 通过拆分 chunk 消除警告，保持功能与视觉一致
- Non-Goals: 引入新依赖或改变功能行为

## Decisions
- Decision: 通过 Rollup manualChunks 切分第三方依赖
- Alternatives considered: 全面动态导入（改动范围较大）

## Risks / Trade-offs
- 分块不当可能导致缓存命中率下降 → 采用稳定的 vendor 分组

## Migration Plan
1. 配置 manualChunks
2. 构建验证

## Open Questions
- 是否需要将某些重量级依赖单独分包？
