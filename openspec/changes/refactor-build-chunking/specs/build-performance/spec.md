## MODIFIED Requirements
### Requirement: Build chunk size
系统 SHALL 配置构建分块策略，使主 chunk 体积不触发构建警告，并保持运行时行为不变。

#### Scenario: 构建无 chunk 警告
- **WHEN** 执行 `npm run build`
- **THEN** 构建输出不再出现 chunk 体积警告
