## ADDED Requirements
### Requirement: UI 组件层级拆分
系统 SHALL 将页面级、区块级与字段级 UI 拆分为独立组件，并遵循明确的职责边界。

#### Scenario: 页面级组件存在
- **WHEN** 进入应用的主要页面
- **THEN** 页面渲染由页面级组件负责组织结构

#### Scenario: 区块级组件可复用
- **WHEN** 两个页面需要相同结构的区块
- **THEN** 使用同一个区块级组件进行复用

#### Scenario: 字段级组件独立
- **WHEN** 表单字段在多个位置复用
- **THEN** 字段级组件可直接被多个区块调用

### Requirement: 组件职责与命名一致
系统 SHALL 以清晰的目录结构与命名规范表达组件职责。

#### Scenario: 组件命名表达职责
- **WHEN** 新增或重构组件
- **THEN** 组件名能反映其层级与职责
