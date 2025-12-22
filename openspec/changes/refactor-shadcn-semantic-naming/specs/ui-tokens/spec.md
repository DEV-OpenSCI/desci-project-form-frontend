## MODIFIED Requirements
### Requirement: UI 语义 Token 命名
系统 SHALL 使用 shadcn/ui 默认语义 token 命名作为唯一标准，并在 CSS、Tailwind 配置与组件类名中保持一致。

#### Scenario: CSS token 命名一致
- **WHEN** 在全局样式中定义语义 token
- **THEN** 仅使用 shadcn/ui 默认命名集合

#### Scenario: 组件类名引用一致
- **WHEN** 组件使用语义颜色或状态
- **THEN** 类名引用与 token 命名一致
