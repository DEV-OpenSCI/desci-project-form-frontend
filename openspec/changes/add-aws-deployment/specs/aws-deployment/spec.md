## ADDED Requirements

### Requirement: Multi-Environment Infrastructure

系统 SHALL 支持三个独立的部署环境：test、staging 和 production，每个环境通过 S3 路径前缀隔离。

#### Scenario: 环境路径隔离

- **WHEN** 部署到指定环境
- **THEN** 静态文件上传到 `s3://sci-io-storage/frontend/{environment}/` 路径
- **AND** 每个环境拥有独立的 CloudFront Distribution

#### Scenario: CloudFormation Stack 管理

- **WHEN** 运行基础设施部署工作流
- **THEN** 系统使用 CloudFormation 创建或更新对应环境的 Stack
- **AND** Stack 名称为 `desci-form-{environment}`
- **AND** Stack 仅管理 CloudFront 相关资源

### Requirement: Static Website Hosting

系统 SHALL 使用现有 S3 Bucket (`sci-io-storage`) + CloudFront 托管静态前端应用。

#### Scenario: S3 存储配置

- **WHEN** 部署应用到指定环境
- **THEN** 静态文件同步到 `sci-io-storage` bucket 的对应环境前缀下
- **AND** CloudFront 通过 OAC 访问 S3 资源

#### Scenario: CloudFront CDN 分发

- **WHEN** 用户访问应用
- **THEN** 请求通过 CloudFront CDN 分发
- **AND** 使用 HTTPS 协议
- **AND** 支持 SPA 路由（404 重定向到 index.html）
- **AND** CloudFront Origin Path 指向 `/frontend/{environment}`

### Requirement: Manual Deployment Trigger

系统 SHALL 支持通过 GitHub Actions 手动触发部署。

#### Scenario: 手动触发基础设施部署

- **WHEN** 用户在 GitHub Actions 中手动触发 `setup-infra` 工作流
- **AND** 选择目标环境（test/staging/production）
- **THEN** 系统部署或更新对应环境的 CloudFormation Stack

#### Scenario: 手动触发应用部署

- **WHEN** 用户在 GitHub Actions 中手动触发 `deploy` 工作流
- **AND** 选择目标环境（test/staging/production）
- **THEN** 系统构建应用并同步到 `s3://sci-io-storage/frontend/{environment}/`
- **AND** 自动失效 CloudFront 缓存

### Requirement: GitHub Secrets Configuration

系统 SHALL 使用 GitHub Secrets 存储 AWS 凭证。

#### Scenario: AWS 凭证配置

- **WHEN** 配置 GitHub Actions 部署
- **THEN** 需要在 GitHub 仓库设置以下 Secrets
- **AND** AWS_ACCESS_KEY_ID
- **AND** AWS_SECRET_ACCESS_KEY
- **AND** AWS_ACCOUNT_ID
- **AND** AWS_REGION
