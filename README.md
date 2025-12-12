# DeSci 项目申请表前端

去中心化科学项目申请表单系统前端应用。

## 技术栈

- **框架**: React 18 + TypeScript 5.7 + Vite 6
- **包管理器**: Bun
- **表单**: react-hook-form + Zod
- **样式**: Tailwind CSS 3
- **UI 组件**: Radix UI + shadcn/ui
- **HTTP 客户端**: Axios

## 开发环境设置

### 1. 安装依赖

```bash
bun install
```

### 2. 环境变量配置

项目已包含 `.env.development` 文件,配置了测试环境 API 地址:

```
VITE_API_BASE_URL=https://testogapi.opensci.io/account
```

### 3. 启动开发服务器

```bash
bun run dev
```

访问 http://localhost:5173（支持内网 IP 访问）

### 4. 构建生产版本

```bash
bun run build
bun run preview  # 预览构建结果
```

## 功能特性

### ✅ 已实现

1. **填写码认证**
   - 用户必须输入有效填写码才能访问表单
   - 填写码存储在 sessionStorage
   - 自动在 API 请求中添加 `X-Fill-Code` header

2. **表单功能**
   - 项目基本信息(名称、时间、学科、领域等)
   - 项目负责人信息
   - 团队成员管理
   - 项目介绍(简介、背景、里程碑)
   - 经费预算管理
   - 联系人信息

3. **数据校验**
   - 使用 Zod 进行前端校验
   - 实时表单错误提示
   - 必填字段、字数限制、格式验证

4. **文件上传**
   - S3 预签名 URL 上传成员简历
   - 支持 PDF/DOC/DOCX 格式，最大 10MB
   - 上传进度显示和错误处理
   - 文件管理（删除已上传文件）

5. **AI 文档解析**
   - 支持上传文档（PDF/DOC/DOCX/TXT，最大 20MB）
   - AI 自动解析项目简介和背景意义
   - 解析进度显示和错误处理
   - 一键填充解析结果到表单

6. **表单提交**
   - 自动转换数据格式与 API 对齐
   - 提交成功显示详细反馈页面
   - 申请编号展示和保存提示
   - 后续流程说明
   - 支持打印申请编号和提交新申请
   - 错误处理和提示

### 🚧 待实现

- 动态加载下拉选项(从 API 获取)

## 测试

### 测试填写码

```
TEST_CODE_20251212
```

有效期至: 2025-12-19

### 测试环境 API

```
https://testogapi.opensci.io/account/
```

## 项目结构

```
src/
├── components/
│   ├── form/              # 表单组件
│   │   ├── ProjectForm.tsx
│   │   ├── BasicInfoSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── ProjectIntroSection.tsx
│   │   ├── BudgetSection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/                # UI 组件(shadcn/ui)
│   └── FillCodeForm.tsx   # 填写码输入组件
├── contexts/
│   └── FillCodeContext.tsx  # 填写码状态管理
├── services/              # API 服务层
│   ├── client.ts          # HTTP 客户端
│   ├── types.ts           # API 类型定义
│   ├── fillCodeApi.ts     # 填写码 API
│   ├── optionsApi.ts      # 下拉选项 API
│   ├── fileApi.ts         # 文件上传 API
│   ├── aiApi.ts           # AI 解析 API
│   └── formApi.ts         # 表单提交 API
├── types/
│   └── form.ts            # 表单类型和校验
├── lib/
│   ├── auth.ts            # 填写码管理
│   ├── constants.ts       # 常量定义
│   └── utils.ts           # 工具函数
└── App.tsx                # 应用入口
```

## API 接口说明

详细的 API 接口文档请参考后端项目:
`/Users/deme/workspace/IdeaProjects/desci-backend/openspec/changes/add-project-form-api/API接口文档.md`

### 主要接口

1. `GET /project-form/fill-code/validate` - 填写码校验
2. `GET /project-form/options/{type}` - 获取下拉选项
3. `POST /project-form/file/presigned-url` - 获取 S3 上传 URL
4. `POST /project-form/ai/parse-document` - AI 文档解析
5. `POST /project-form/application/submit` - 提交表单

## 开发说明

### 数据结构映射

前端表单数据与 API 请求体的映射关系:

- `field` → `researchField`
- `goals` (string) → `goals` (string[], 按换行分割)
- `donation/selfFund` → `donationAmount/selfFundedAmount`
- `resumeFile` → `resumeS3Key`

### 填写码流程

1. 用户访问应用 → 显示填写码输入页面
2. 输入填写码 → 调用 API 校验
3. 校验通过 → 存储到 sessionStorage → 显示表单
4. 表单提交时 → 自动携带填写码
5. 提交成功 → 清除填写码 → 显示申请编号

## License

MIT
