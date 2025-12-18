# Design: AWS 多环境部署架构

## Context

DeSci 项目申请表是一个纯前端 React SPA 应用，需要部署到 AWS 并支持 test、staging、production 三个环境。用户要求：
- 使用 GitHub Actions 作为 CI/CD 工具
- 使用 AWS CloudFormation 管理基础设施
- 支持手动部署（workflow_dispatch）
- 使用现有的 S3 Bucket：`sci-io-storage`
- GitHub 已配置 AWS 密钥（AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ACCOUNT_ID, AWS_REGION）

## Goals / Non-Goals

**Goals:**
- 实现三环境（test, staging, production）独立部署
- 使用 CloudFormation 实现基础设施即代码（仅管理 CloudFront）
- 支持 GitHub Actions 手动触发部署
- 静态资源 CDN 加速（CloudFront）
- HTTPS 支持
- 复用现有 S3 Bucket

**Non-Goals:**
- 自定义域名配置（可后续添加）
- WAF/安全组配置（可后续添加）
- 多区域部署
- 自动化测试集成（可后续添加）

## Decisions

### 1. 静态网站托管方案：现有 S3 + CloudFront

**选择**: 使用现有 `sci-io-storage` bucket + CloudFront CDN 分发

**理由**:
- 复用现有基础设施，减少资源碎片化
- CloudFront 提供全球 CDN 加速和免费 HTTPS
- CloudFront 支持 SPA 路由（通过自定义错误响应）
- 方案成熟稳定，运维成本低

### 2. 环境隔离策略：同 Bucket 不同前缀

**选择**: 同一个 S3 Bucket (`sci-io-storage`)，通过路径前缀区分环境

**路径约定**:
- test 环境: `s3://sci-io-storage/frontend/test/`
- staging 环境: `s3://sci-io-storage/frontend/staging/`
- production 环境: `s3://sci-io-storage/frontend/production/`

**资源命名约定**:
- CloudFormation Stack: `desci-form-{env}`
- CloudFront: 每个环境独立分发，Origin Path 指向对应前缀

**理由**:
- 复用现有 bucket，简化管理
- 前缀隔离足够满足环境分离需求
- 统一管理更方便

### 3. 部署触发策略：仅手动触发

**选择**: 所有环境使用 `workflow_dispatch` 手动触发

**理由**:
- 用户明确要求支持手动部署
- 生产环境部署应有人工确认
- 可以选择性部署特定分支/commit

**工作流设计**:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        type: choice
        options:
          - test
          - staging
          - production
```

### 4. CloudFormation 模板结构：单模板多参数

**选择**: 一个 CloudFormation 模板，通过参数区分环境

**理由**:
- 减少重复代码
- 确保环境配置一致性
- 便于维护

**模板参数**:
- `Environment`: 环境名称（test/staging/production）
- `S3BucketName`: S3 Bucket 名称（默认 `sci-io-storage`）

**CloudFormation 管理的资源**:
- CloudFront Origin Access Control (OAC)
- CloudFront Distribution

**不由 CloudFormation 管理的资源**:
- S3 Bucket（已存在）
- S3 Bucket Policy（需要手动添加 OAC 访问权限，或在首次部署时更新）

### 5. 目录结构

```
├── cloudformation/
│   └── static-website.yaml    # CFN 模板（仅 CloudFront）
├── .github/
│   └── workflows/
│       ├── deploy.yml         # 部署工作流（手动触发）
│       └── setup-infra.yml    # 基础设施创建/更新工作流（手动触发）
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              GitHub Actions Workflows                │    │
│  │  ┌──────────────┐      ┌─────────────────────┐      │    │
│  │  │ setup-infra  │      │      deploy         │      │    │
│  │  │ (手动触发)    │      │    (手动触发)        │      │    │
│  │  └──────┬───────┘      └──────────┬──────────┘      │    │
│  └─────────┼──────────────────────────┼────────────────┘    │
└────────────┼──────────────────────────┼─────────────────────┘
             │                          │
             │ CloudFormation           │ S3 Sync
             │ deploy                   │
             ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                          AWS                                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                CloudFormation Stack                  │    │
│  │                (desci-form-{env})                   │    │
│  │            仅管理 CloudFront 资源                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              ▼                           ▼                   │
│  ┌────────────────────┐    ┌────────────────────────┐       │
│  │     S3 Bucket      │    │      CloudFront        │       │
│  │   sci-io-storage   │◄───│    Distribution        │       │
│  │ ┌────────────────┐ │    │   (HTTPS + CDN)        │       │
│  │ │ frontend/test/ │ │    │                        │       │
│  │ │frontend/staging│ │    │  Origin Path:          │       │
│  │ │frontend/prod...│ │    │  /frontend/{env}       │       │
│  │ └────────────────┘ │    └───────────┬────────────┘       │
│  │   (现有 Bucket)    │                │                     │
│  └────────────────────┘                │                     │
│                                        │                     │
└────────────────────────────────────────┼─────────────────────┘
                                         │
                                         ▼
                              ┌───────────────────┐
                              │      Users        │
                              │  (Web Browser)    │
                              └───────────────────┘
```

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| CloudFront 缓存导致部署后内容不更新 | 用户看到旧版本 | 部署时自动 invalidate 缓存 |
| 环境前缀误操作 | 影响其他环境 | 工作流严格限制前缀路径 |
| GitHub Secrets 泄露 | 安全风险 | 使用最小权限 IAM 策略 |
| CloudFront 冷启动延迟 | 首次访问慢 | 预热不在本次范围，可后续优化 |
| S3 Bucket Policy 未配置 OAC | CloudFront 无法访问 | 首次部署后手动更新或通过脚本更新 |

## Migration Plan

1. **首次部署准备**:
   - 确认 `sci-io-storage` bucket 存在
   - 运行 `setup-infra.yml` 创建 CloudFormation Stack（CloudFront Distribution）
   - 更新 S3 Bucket Policy 允许 CloudFront OAC 访问

2. **日常部署**:
   - 只需运行 `deploy.yml`
   - 选择目标环境
   - 自动构建、同步到 S3、失效 CloudFront 缓存

3. **基础设施变更**:
   - 更新 CFN 模板
   - 重新运行 `setup-infra.yml`

## S3 Bucket Policy 配置

需要在现有 `sci-io-storage` bucket 上添加以下 Policy（允许 CloudFront OAC 访问）：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontOAC",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::sci-io-storage/frontend/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": [
                        "arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{TEST_DISTRIBUTION_ID}",
                        "arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{STAGING_DISTRIBUTION_ID}",
                        "arn:aws:cloudfront::{ACCOUNT_ID}:distribution/{PRODUCTION_DISTRIBUTION_ID}"
                    ]
                }
            }
        }
    ]
}
```

> 注意：首次部署后需要将实际的 Distribution ID 填入 Policy。

## Open Questions

1. ~~是否需要配置自定义域名？~~ → 当前不需要，使用 CloudFront 默认域名
2. ~~是否需要配置 CI 测试步骤？~~ → 当前不需要，可后续添加
3. ~~S3 Bucket 命名？~~ → 使用现有 `sci-io-storage`
4. 是否需要配置部署通知（Slack/邮件）？ → 可后续添加

## IAM 权限要求

GitHub Actions 使用的 AWS 凭证需要以下权限：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sci-io-storage",
        "arn:aws:s3:::sci-io-storage/frontend/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:GetTemplate"
      ],
      "Resource": [
        "arn:aws:cloudformation:*:*:stack/desci-form-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:DeleteDistribution",
        "cloudfront:GetDistribution",
        "cloudfront:CreateInvalidation",
        "cloudfront:CreateOriginAccessControl",
        "cloudfront:DeleteOriginAccessControl",
        "cloudfront:GetOriginAccessControl",
        "cloudfront:UpdateOriginAccessControl",
        "cloudfront:TagResource"
      ],
      "Resource": "*"
    }
  ]
}
```
