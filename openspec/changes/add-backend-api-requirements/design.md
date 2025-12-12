# 技术设计文档

## Context

后端已提供完整的项目申请表单 API 接口（测试环境：`https://testogapi.opensci.io/account/`），包含以下核心能力：
1. **填写码认证机制**：用户必须先输入有效的填写码才能开始填表和提交
2. **S3 文件上传**：通过预签名 URL 上传简历文件到 S3
3. **AI 文档解析**：上传文档后通过 AI 提取项目简介或背景意义
4. **表单提交**：提交后填写码被标记为已使用，返回申请编号

前端需要完整对接这些功能，并修正现有数据结构与 API 的不匹配问题。

## Goals / Non-Goals

**Goals：**
- 实现填写码认证流程，确保安全性
- 创建统一的 API 服务层，便于维护
- 实现文件上传到 S3 的完整流程
- 修正数据结构与 API 对齐
- 提供良好的用户体验（加载状态、错误提示等）

**Non-Goals：**
- 不实现草稿保存功能（后端未提供）
- 不实现申请记录查询功能（后端未提供）
- 不实现用户注册/登录（表单为匿名提交，仅需填写码）

## Decisions

### 1. 填写码认证流程设计

**决策**：在用户访问应用时，先显示填写码输入页面，验证通过后才显示表单。

**技术实现**：
- 使用 React Context 管理填写码状态
- 填写码存储在 sessionStorage（刷新页面不丢失，关闭标签页清除）
- 请求拦截器自动添加 `X-Fill-Code` header

**流程**：
```
1. 用户访问 → 检查 sessionStorage
2. 无填写码 → 显示填写码输入页面
3. 用户输入填写码 → 调用 /fill-code/validate
4. 验证成功 → 存储到 sessionStorage + Context → 显示表单
5. 表单提交时 → 自动携带填写码
6. 提交成功 → 填写码被标记为已使用，清除 sessionStorage
```

**Alternatives considered**：
- ❌ 使用 localStorage：关闭浏览器后仍保留，可能导致填写码已失效但仍缓存的问题
- ❌ 不存储填写码：每次刷新都要重新输入，用户体验差
- ✅ **使用 sessionStorage**：平衡了安全性和用户体验

---

### 2. API 服务层架构

**决策**：创建 `/src/services/` 目录，统一管理所有 API 调用。

**目录结构**：
```
src/services/
├── client.ts         # HTTP 客户端配置（axios）
├── types.ts          # API 请求/响应类型定义
├── fillCodeApi.ts    # 填写码相关接口
├── fileApi.ts        # 文件上传相关接口
├── optionsApi.ts     # 下拉选项接口
├── aiApi.ts          # AI 文档解析接口
└── formApi.ts        # 表单提交接口
```

**HTTP 客户端**（使用 axios）：
```typescript
// client.ts
import axios from 'axios'
import { getFillCode } from '@/lib/auth'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

// 请求拦截器：自动添加填写码
client.interceptors.request.use((config) => {
  const fillCode = getFillCode()
  if (fillCode) {
    config.headers['X-Fill-Code'] = fillCode
  }
  return config
})

// 响应拦截器：统一处理错误
client.interceptors.response.use(
  (response) => response.data, // 直接返回 data
  (error) => {
    // 处理 401、400、500 等错误
    throw error
  }
)
```

**Alternatives considered**：
- ❌ 使用 fetch API：需要手动处理很多细节（超时、拦截器等）
- ✅ **使用 axios**：成熟的 HTTP 库，支持拦截器、超时等功能

---

### 3. 文件上传流程设计

**决策**：使用后端提供的 S3 预签名 URL 机制。

**流程**：
```
1. 用户选择文件
2. 调用 POST /file/presigned-url，传递文件信息（名称、类型、大小）
3. 后端返回 { uploadUrl, s3Key, expiresIn }
4. 使用 PUT 方法上传文件到 uploadUrl
5. 上传成功后，将 s3Key 保存到表单数据
6. 提交表单时，成员简历字段传递 s3Key
```

**前端实现**：
```typescript
async function uploadResume(file: File): Promise<string> {
  // 1. 获取预签名 URL
  const { uploadUrl, s3Key } = await getPresignedUrl({
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  })

  // 2. 上传到 S3
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  })

  // 3. 返回 s3Key
  return s3Key
}
```

**Alternatives considered**：
- ❌ 直接上传到后端，后端再转存 S3：增加后端负担，文件需要经过后端中转
- ✅ **使用预签名 URL 直接上传 S3**：更高效，减轻后端压力

---

### 4. 数据结构对齐方案

**当前问题**：
| 项目 | 当前前端 | API 要求 | 差异 |
|------|---------|---------|------|
| 学科选项 | 14 个（含 military） | 13 个（无 military） | 需删除 military |
| 研究领域 | 14 个 | 11 个 | 完全不匹配 |
| 职称 | 10 个 | 8 个 | 不匹配 |
| 学历 | 5 个 | 4 个 | 不匹配 |
| 经费类别 | 4 个大类 | 11 个细分类别 | 完全不匹配 |
| 里程碑目标 | objectives (string) | goals (string[]) | 类型不匹配 |
| 经费金额 | donation/selfFund | donationAmount/selfFundedAmount | 字段名不匹配 |
| 成员简历 | resumeFile (File) | resumeS3Key (string) | 类型不匹配 |

**决策**：
1. **常量定义**：从静态常量改为动态从 API 获取（调用 `/options/{type}`）
2. **表单 Schema**：更新字段名和类型与 API 对齐
3. **表单提交时**：将前端数据结构转换为 API 要求的格式

**实现**：
- 在应用启动时，调用 API 加载所有选项并缓存
- 更新 `src/types/form.ts` 的字段定义
- 创建数据转换函数：`formDataToApiPayload()`

---

### 5. 环境变量配置

**决策**：使用 Vite 环境变量管理 API 地址。

**文件**：
```bash
# .env.development（开发环境）
VITE_API_BASE_URL=https://testogapi.opensci.io/account

# .env.production（生产环境）
VITE_API_BASE_URL=https://api.opensci.io/account
```

---

## 数据结构映射

### 表单数据 → API 请求体

```typescript
// 前端表单数据
interface FormData {
  projectName: string
  startDate: Date
  endDate: Date
  discipline: string
  field: string        // 前端字段名
  teamSize: number
  leader: Leader
  members: Member[]
  projectSummary: string
  background: string
  milestones: Milestone[]
  budgetItems: BudgetItem[]
  contact: Contact
}

// API 请求体
interface ApiPayload {
  basicInfo: {
    name: string
    startDate: string      // YYYY-MM-DD 格式
    endDate: string        // YYYY-MM-DD 格式
    discipline: string
    researchField: string  // API 字段名
    teamSize: number
  }
  leader: Leader
  members: {
    role: string
    resumeS3Key: string    // 从 File 改为 S3 Key
  }[]
  introduction: string
  background: string
  milestones: {
    phase: string          // early/mid/late
    startDate: string      // YYYY-MM-DD
    endDate: string        // YYYY-MM-DD
    content: string
    goals: string[]        // 从 string 改为 string[]
  }[]
  budgets: {
    category: string
    donationAmount: number // 字段名变化
    selfFundedAmount: number // 字段名变化
  }[]
  contact: Contact
}
```

**转换函数**：
```typescript
function formDataToApiPayload(data: FormData): ApiPayload {
  return {
    basicInfo: {
      name: data.projectName,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      discipline: data.discipline,
      researchField: data.field,
      teamSize: data.teamSize,
    },
    // ... 其他字段转换
    milestones: data.milestones.map(m => ({
      phase: m.stage,
      startDate: formatDate(m.startDate),
      endDate: formatDate(m.endDate),
      content: m.content,
      goals: m.objectives.split('\n').filter(Boolean), // 转为数组
    })),
    budgets: data.budgetItems.map(b => ({
      category: b.category,
      donationAmount: b.donation,
      selfFundedAmount: b.selfFund,
    })),
  }
}
```

---

## Risks / Trade-offs

### Risk 1: 填写码失效导致表单数据丢失
**场景**：用户填表过程中，填写码过期（例如 7 天后）。

**缓解措施**：
- 在填写码验证接口响应中显示过期时间
- 在表单页面顶部显示填写码有效期提醒
- 如果提交时返回 401（填写码失效），提示用户联系管理员获取新填写码

**Trade-off**：不实现草稿自动保存（后端未提供），用户需要一次性完成填表。

---

### Risk 2: 文件上传失败
**场景**：网络不稳定或 S3 服务异常导致上传失败。

**缓解措施**：
- 显示上传进度条
- 上传失败时允许重试
- 限制文件大小（10MB）和格式（PDF、DOC、DOCX）

---

### Risk 3: API 响应格式变化
**场景**：后端修改响应格式，导致前端解析错误。

**缓解措施**：
- 使用 TypeScript 类型定义 API 响应
- 在响应拦截器中验证数据结构
- 添加单元测试覆盖数据转换逻辑

---

## Migration Plan

### 步骤 1：环境准备
1. 安装 axios：`npm install axios`
2. 创建 `.env.development` 文件
3. 配置 API 地址

### 步骤 2：数据结构调整
1. 更新 `src/types/form.ts`
2. 更新 `src/lib/constants.ts`（改为从 API 动态加载）
3. 调整表单组件以适配新数据结构

### 步骤 3：实现 API 服务层
1. 创建 `src/services/client.ts`
2. 实现各 API 模块（fillCodeApi、fileApi 等）
3. 创建数据转换函数

### 步骤 4：实现填写码认证
1. 创建 FillCodeContext
2. 创建填写码输入组件
3. 更新 App.tsx 路由逻辑

### 步骤 5：对接表单功能
1. 实现文件上传
2. 实现 AI 文档解析（可选）
3. 实现表单提交
4. 添加加载状态和错误处理

### 步骤 6：测试
1. 测试填写码认证流程
2. 测试文件上传
3. 测试表单提交
4. 测试错误场景（填写码失效、网络错误等）

---

## Open Questions

1. **AI 文档解析是否必需？**
   - 答：可选功能，先实现基础表单，后续再添加

2. **是否需要实现表单字段的本地缓存？**
   - 答：暂不实现，后端未提供草稿接口

3. **下拉选项是否需要缓存？**
   - 答：是，在应用启动时加载并缓存到 Context，避免重复请求

---

## 附录：API 接口清单

| 接口 | 路径 | 方法 | 认证 | 用途 |
|------|------|------|------|------|
| 下拉选项 | `/project-form/options/{type}` | GET | 无 | 获取选项列表 |
| 填写码校验 | `/project-form/fill-code/validate` | GET | 填写码（header） | 校验填写码 |
| S3 预签名 URL | `/project-form/file/presigned-url` | POST | 填写码 | 获取上传 URL |
| AI 文档解析 | `/project-form/ai/parse-document` | POST | 填写码 | 解析文档 |
| 表单提交 | `/project-form/application/submit` | POST | 填写码（必需） | 提交表单 |
