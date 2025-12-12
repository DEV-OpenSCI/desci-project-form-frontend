# 实现任务清单

## 1. 环境准备

- [ ] 1.1 安装 axios：`npm install axios`
- [ ] 1.2 创建 `.env.development` 文件，配置 `VITE_API_BASE_URL=https://testogapi.opensci.io/account`
- [ ] 1.3 更新 `.gitignore`，确保 `.env.local` 被忽略

---

## 2. 数据结构调整

### 2.1 更新类型定义（`src/types/form.ts`）

- [ ] 2.1.1 里程碑 `objectives` 改为 `goals: string[]`
- [ ] 2.1.2 经费 `donation/selfFund` 改为 `donationAmount/selfFundedAmount`
- [ ] 2.1.3 成员 `resumeFile` 改为 `resumeS3Key?: string`
- [ ] 2.1.4 添加 API 响应类型定义（在 `src/services/types.ts` 中）

### 2.2 更新常量定义（`src/lib/constants.ts`）

- [ ] 2.2.1 删除 `DISCIPLINES` 中的 `military`（军事学）
- [ ] 2.2.2 更新 `RESEARCH_FIELDS` 与 API 对齐（11 个选项）
- [ ] 2.2.3 更新 `TITLES` 与 API 对齐（8 个选项：院士、教授/研究员、副教授/副研究员、讲师/助理研究员、博士后、高级工程师、工程师、其他）
- [ ] 2.2.4 更新 `EDUCATIONS` 与 API 对齐（4 个选项：博士、硕士、本科、其他）
- [ ] 2.2.5 更新 `BUDGET_CATEGORIES` 与 API 对齐（11 个细分类别）
- [ ] 2.2.6 （可选）将常量改为从 API 动态加载

---

## 3. API 服务层实现

### 3.1 创建 HTTP 客户端（`src/services/client.ts`）

- [ ] 3.1.1 创建 axios 实例，配置 baseURL 和 timeout
- [ ] 3.1.2 实现请求拦截器，自动添加 `X-Fill-Code` header
- [ ] 3.1.3 实现响应拦截器，统一处理错误和响应格式

### 3.2 创建 API 类型定义（`src/services/types.ts`）

- [ ] 3.2.1 定义统一响应格式 `ApiResponse<T>`
- [ ] 3.2.2 定义各接口的请求和响应类型

### 3.3 实现填写码相关接口（`src/services/fillCodeApi.ts`）

- [ ] 3.3.1 `validateFillCode()` - 校验填写码是否有效

### 3.4 实现下拉选项接口（`src/services/optionsApi.ts`）

- [ ] 3.4.1 `getOptions(type: string)` - 获取指定类型的下拉选项
- [ ] 3.4.2 `getAllOptions()` - 批量获取所有下拉选项

### 3.5 实现文件上传接口（`src/services/fileApi.ts`）

- [ ] 3.5.1 `getPresignedUrl()` - 获取 S3 预签名 URL
- [ ] 3.5.2 `uploadToS3()` - 上传文件到 S3
- [ ] 3.5.3 `uploadResume()` - 完整的简历上传流程（获取 URL + 上传 + 返回 s3Key）

### 3.6 实现 AI 文档解析接口（`src/services/aiApi.ts`）

- [ ] 3.6.1 `parseDocument()` - 上传文档并解析内容

### 3.7 实现表单提交接口（`src/services/formApi.ts`）

- [ ] 3.7.1 `submitApplication()` - 提交项目申请表单
- [ ] 3.7.2 `formDataToApiPayload()` - 数据转换函数（FormData → API 请求体）

---

## 4. 填写码认证功能

### 4.1 创建填写码管理（`src/lib/auth.ts`）

- [ ] 4.1.1 `getFillCode()` - 从 sessionStorage 获取填写码
- [ ] 4.1.2 `setFillCode(code: string)` - 保存填写码到 sessionStorage
- [ ] 4.1.3 `clearFillCode()` - 清除填写码

### 4.2 创建填写码 Context（`src/contexts/FillCodeContext.tsx`）

- [ ] 4.2.1 创建 Context 和 Provider
- [ ] 4.2.2 提供 `fillCode`、`isValidating`、`validateAndSet()` 等状态和方法
- [ ] 4.2.3 在 Provider 初始化时从 sessionStorage 恢复填写码

### 4.3 创建填写码输入组件（`src/components/FillCodeForm.tsx`）

- [ ] 4.3.1 创建输入框和提交按钮
- [ ] 4.3.2 调用 `validateFillCode()` API
- [ ] 4.3.3 显示校验结果（成功/失败、过期时间等）
- [ ] 4.3.4 校验成功后保存到 Context 和 sessionStorage

### 4.4 更新应用入口（`src/App.tsx`）

- [ ] 4.4.1 使用 `FillCodeProvider` 包裹应用
- [ ] 4.4.2 根据填写码状态显示不同页面：
  - 无填写码 → 显示 `FillCodeForm`
  - 有填写码 → 显示 `ProjectForm`

---

## 5. 文件上传功能

### 5.1 更新团队成员组件（`src/components/form/TeamSection.tsx`）

- [ ] 5.1.1 添加文件选择按钮
- [ ] 5.1.2 文件选择后调用 `uploadResume()` 上传
- [ ] 5.1.3 显示上传进度和状态
- [ ] 5.1.4 上传成功后保存 `s3Key` 到表单字段
- [ ] 5.1.5 支持删除已上传文件

### 5.2 文件上传限制

- [ ] 5.2.1 限制文件类型：PDF、DOC、DOCX
- [ ] 5.2.2 限制文件大小：10MB
- [ ] 5.2.3 显示友好的错误提示

---

## 6. AI 文档解析功能（可选）

### 6.1 更新项目介绍组件（`src/components/form/ProjectIntroSection.tsx`）

- [ ] 6.1.1 在"项目简介"字段添加"AI 辅助填写"按钮
- [ ] 6.1.2 点击按钮弹出文件选择对话框
- [ ] 6.1.3 上传文档后调用 `parseDocument()` API（类型：introduction）
- [ ] 6.1.4 显示解析结果，用户确认后填充到表单

### 6.2 背景意义字段

- [ ] 6.2.1 在"背景和意义"字段添加"AI 辅助填写"按钮
- [ ] 6.2.2 调用 `parseDocument()` API（类型：background）
- [ ] 6.2.3 显示解析结果并填充

---

## 7. 表单提交功能

### 7.1 更新表单组件（`src/components/form/ProjectForm.tsx`）

- [ ] 7.1.1 在 `onSubmit` 中调用 `formDataToApiPayload()` 转换数据
- [ ] 7.1.2 调用 `submitApplication()` API 提交表单
- [ ] 7.1.3 处理提交中状态（禁用按钮、显示 loading）
- [ ] 7.1.4 处理提交成功（显示申请编号、清除填写码）
- [ ] 7.1.5 处理提交失败（显示错误信息）

### 7.2 创建提交成功页面（`src/components/SubmitSuccess.tsx`）

- [ ] 7.2.1 显示申请编号
- [ ] 7.2.2 显示提交成功提示

---

## 8. 用户体验优化

### 8.1 加载状态

- [ ] 8.1.1 填写码校验时显示 loading
- [ ] 8.1.2 文件上传时显示进度条
- [ ] 8.1.3 AI 解析时显示 loading
- [ ] 8.1.4 表单提交时显示 loading

### 8.2 错误处理

- [ ] 8.2.1 统一错误提示组件
- [ ] 8.2.2 网络错误提示
- [ ] 8.2.3 校验错误提示
- [ ] 8.2.4 文件上传失败提示

### 8.3 填写码过期提醒

- [ ] 8.3.1 在表单顶部显示填写码过期时间
- [ ] 8.3.2 过期时间临近（如剩余 24 小时）时高亮提醒

### 8.4 响应式设计优化

- [ ] 8.4.1 确保所有新组件在移动端适配良好

---

## 9. 测试

### 9.1 填写码认证流程测试

- [ ] 9.1.1 测试输入有效填写码
- [ ] 9.1.2 测试输入无效填写码
- [ ] 9.1.3 测试填写码过期场景
- [ ] 9.1.4 测试刷新页面后填写码是否保留

### 9.2 文件上传测试

- [ ] 9.2.1 测试上传 PDF 文件
- [ ] 9.2.2 测试上传 DOC/DOCX 文件
- [ ] 9.2.3 测试上传超大文件（>10MB）
- [ ] 9.2.4 测试上传不支持的文件格式
- [ ] 9.2.5 测试删除已上传文件

### 9.3 AI 解析测试（如果实现）

- [ ] 9.3.1 测试项目简介解析
- [ ] 9.3.2 测试背景意义解析
- [ ] 9.3.3 测试无法解析的文档

### 9.4 表单提交测试

- [ ] 9.4.1 测试完整表单提交成功
- [ ] 9.4.2 测试必填字段校验
- [ ] 9.4.3 测试填写码失效时提交
- [ ] 9.4.4 测试网络错误时提交
- [ ] 9.4.5 测试提交后显示申请编号

### 9.5 数据转换测试

- [ ] 9.5.1 测试 `formDataToApiPayload()` 转换正确性
- [ ] 9.5.2 测试日期格式转换（Date → YYYY-MM-DD）
- [ ] 9.5.3 测试里程碑目标转换（string → string[]）

---

## 10. 文档和清理

- [ ] 10.1 更新 README.md，添加环境变量配置说明
- [ ] 10.2 添加 API 接口文档链接
- [ ] 10.3 清理未使用的代码和注释
- [ ] 10.4 确保所有 TODO 注释已删除或完成

---

## 备注

- **测试填写码**：`TEST_CODE_20251212`（有效期至 2025-12-19）
- **测试环境 API**：`https://testogapi.opensci.io/account/`
- **后端接口文档**：`/Users/deme/workspace/IdeaProjects/desci-backend/openspec/changes/add-project-form-api/API接口文档.md`
