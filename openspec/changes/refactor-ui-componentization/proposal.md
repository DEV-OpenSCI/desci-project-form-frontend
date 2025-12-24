# Change: Refactor UI Componentization

## Why
当前 UI 结构中仍存在多层级 JSX 直接堆叠，复用与维护成本较高。
通过系统性组件化可以提升可读性、复用率与后续扩展效率。

## What Changes
- 将页面级与表单级 UI 拆分为更细粒度、可复用的组件
- 统一组件职责边界与命名规范
- 调整现有组件结构以适配新的组件划分

## Impact
- Affected specs: ui-componentization
- Affected code: src/App.tsx, src/components/FillCodeForm.tsx, src/components/form/*, src/components/layout/*
