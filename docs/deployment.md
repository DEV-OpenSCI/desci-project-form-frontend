# 部署指南

本文档介绍如何将 DeSci 项目申请表前端应用部署到 AWS。

## 架构概览

```
GitHub Actions (手动触发)
         │
         ▼
    CloudFormation
    (管理 CloudFront)
         │
         ▼
┌────────────────────┐    ┌────────────────────────┐
│     S3 Bucket      │    │      CloudFront        │
│   sci-io-storage   │◄───│    Distribution        │
│ ┌────────────────┐ │    │   (HTTPS + CDN)        │
│ │ frontend/test/ │ │    │                        │
│ │frontend/staging│ │    │  Origin Path:          │
│ │frontend/prod...│ │    │  /frontend/{env}       │
│ └────────────────┘ │    └────────────────────────┘
│   (现有 Bucket)    │
└────────────────────┘
```

## 环境说明

| 环境 | S3 路径 | 用途 |
|------|---------|------|
| test | `s3://sci-io-storage/frontend/test/` | 开发测试 |
| staging | `s3://sci-io-storage/frontend/staging/` | 预发布环境 |
| production | `s3://sci-io-storage/frontend/production/` | 生产环境 |

## 前置条件

### 1. GitHub Secrets 配置

在 GitHub 仓库 Settings > Secrets and variables > Actions 中配置以下 Secrets：

| Secret 名称 | 说明 |
|-------------|------|
| `AWS_ACCESS_KEY_ID` | AWS 访问密钥 ID |
| `AWS_SECRET_ACCESS_KEY` | AWS 访问密钥 |
| `AWS_ACCOUNT_ID` | AWS 账户 ID |
| `AWS_REGION` | AWS 区域（如 `ap-northeast-1`） |

### 2. IAM 权限

确保 AWS 凭证具有以下权限：

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

## 首次部署

### 步骤 1：创建基础设施

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 **Setup Infrastructure** 工作流
3. 点击 **Run workflow**
4. 选择目标环境（test/staging/production）
5. 点击 **Run workflow** 执行

工作流完成后会输出：
- CloudFront 域名
- CloudFront Distribution ID
- S3 Bucket Policy 配置指南

### 步骤 2：配置 S3 Bucket Policy

首次部署后，需要更新 `sci-io-storage` bucket 的 Policy，允许 CloudFront 访问。

1. 登录 AWS Console
2. 进入 S3 > sci-io-storage > Permissions > Bucket policy
3. 添加以下 Policy（替换实际的 Distribution ARN）：

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
                        "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/TEST_DISTRIBUTION_ID",
                        "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/STAGING_DISTRIBUTION_ID",
                        "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/PRODUCTION_DISTRIBUTION_ID"
                    ]
                }
            }
        }
    ]
}
```

> 注意：每次为新环境创建基础设施后，需要将新的 Distribution ARN 添加到 Policy 中。

### 步骤 3：部署应用

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 **Deploy Application** 工作流
3. 点击 **Run workflow**
4. 选择目标环境
5. 点击 **Run workflow** 执行

部署完成后会输出访问 URL。

## 日常部署

日常部署只需运行 **Deploy Application** 工作流：

1. 进入 Actions 页面
2. 选择 **Deploy Application**
3. 选择目标环境
4. 执行部署

部署流程会自动：
1. 安装依赖
2. 构建应用
3. 同步文件到 S3
4. 刷新 CloudFront 缓存

## 本地部署（可选）

如果需要在本地执行部署：

```bash
# 构建应用
bun run build

# 同步到 S3（以 test 环境为例）
aws s3 sync dist/ s3://sci-io-storage/frontend/test/ --delete

# 刷新 CloudFront 缓存
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 故障排除

### CloudFront 返回 403 错误

1. 检查 S3 Bucket Policy 是否正确配置了 CloudFront OAC 访问权限
2. 确认 Distribution ARN 在 Policy 中正确

### 部署后看到旧内容

1. 确认 CloudFront 缓存失效已完成
2. 清除浏览器缓存
3. 等待几分钟让缓存传播到所有边缘节点

### CloudFormation Stack 更新失败

1. 查看 CloudFormation 控制台中的事件日志
2. 如果 Stack 处于 ROLLBACK 状态，可能需要删除后重新创建

## 相关文件

- `cloudformation/static-website.yaml` - CloudFormation 模板
- `.github/workflows/setup-infra.yml` - 基础设施部署工作流
- `.github/workflows/deploy.yml` - 应用部署工作流
