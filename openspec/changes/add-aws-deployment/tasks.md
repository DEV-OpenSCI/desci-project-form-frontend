# Tasks: AWS 多环境部署

## 1. CloudFormation 模板

- [x] 1.1 创建 `cloudformation/` 目录
- [x] 1.2 编写 `static-website.yaml` CloudFormation 模板
  - CloudFront Origin Access Control (OAC)
  - CloudFront Distribution（CDN 分发，Origin Path 指向 `/frontend/{env}`）
  - 输出 CloudFront 域名和 Distribution ID

## 2. GitHub Actions 工作流

- [x] 2.1 创建 `.github/workflows/` 目录
- [x] 2.2 编写 `setup-infra.yml` 基础设施工作流
  - 手动触发（workflow_dispatch）
  - 环境选择（test/staging/production）
  - 使用 AWS CloudFormation 部署/更新 Stack
- [x] 2.3 编写 `deploy.yml` 部署工作流
  - 手动触发（workflow_dispatch）
  - 环境选择（test/staging/production）
  - 构建应用（bun install + bun run build）
  - 同步到 S3 (`s3://sci-io-storage/frontend/{env}/`)
  - CloudFront 缓存失效

## 3. S3 Bucket Policy 更新

- [ ] 3.1 创建 `scripts/update-bucket-policy.sh` 脚本（可选）
- [x] 3.2 记录手动更新 S3 Bucket Policy 的步骤（见 docs/deployment.md）

## 4. 文档更新

- [x] 4.1 更新 README.md 添加部署说明
- [x] 4.2 创建 `docs/deployment.md` 详细部署指南
  - GitHub Secrets 配置
  - 首次部署步骤
  - 日常部署步骤
  - S3 Bucket Policy 配置

## 5. 验证

- [x] 5.1 本地验证 CloudFormation 模板语法（aws cloudformation validate-template）
- [ ] 5.2 测试 test 环境部署
- [ ] 5.3 测试 staging 环境部署
- [ ] 5.4 测试 production 环境部署

## Dependencies

- 任务 2.x 依赖任务 1.x 完成
- 任务 5.2-5.4 依赖任务 1.x、2.x 和 3.x 完成
- 任务 4.x 可并行执行
