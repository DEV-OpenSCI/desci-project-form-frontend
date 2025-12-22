# Change: Reduce Build Chunk Size Warnings

## Why
当前构建产物出现 chunk 体积警告，影响性能可维护性与后续优化判断。
需要通过合理拆分与分块策略消除警告并保持现有行为。

## What Changes
- 配置 Vite/Rollup 输出分块策略
- 将较大的依赖拆分为独立 chunk
- 保持现有功能与视觉表现不变

## Impact
- Affected specs: build-performance
- Affected code: vite.config.ts
