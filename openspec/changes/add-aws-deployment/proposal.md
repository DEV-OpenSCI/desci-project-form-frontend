# Change: 添加 AWS 多环境部署支持

## Why

项目需要部署到生产环境供用户使用。需要建立完整的 CI/CD 流程，支持 test、staging、production 三个环境，并使用 AWS CloudFormation 进行基础设施即代码管理。

## What Changes

- 添加 AWS CloudFormation 模板，创建 CloudFront Distribution 分发静态资源
- 复用现有 S3 Bucket (`sci-io-storage`)，通过路径前缀区分环境
- 配置 GitHub Actions 工作流支持三个环境的部署
- 支持手动触发部署（workflow_dispatch）
- 每个环境独立的 CloudFront 分发

## Impact

- Affected specs: 新增 `aws-deployment` capability
- Affected code:
  - 新增 `cloudformation/` 目录存放 CFN 模板
  - 新增 `.github/workflows/` 目录存放 GitHub Actions 工作流
- 外部依赖:
  - AWS 服务（S3, CloudFront, CloudFormation）
  - GitHub Actions
  - GitHub Secrets（AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ACCOUNT_ID, AWS_REGION）
- S3 路径约定:
  - test: `s3://sci-io-storage/frontend/test/`
  - staging: `s3://sci-io-storage/frontend/staging/`
  - production: `s3://sci-io-storage/frontend/production/`
