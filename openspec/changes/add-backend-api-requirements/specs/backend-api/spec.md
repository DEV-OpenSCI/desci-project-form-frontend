# Backend API Specification

## ADDED Requirements

### Requirement: 填写码校验接口

后端 SHALL 提供填写码校验接口，用于验证填写码是否有效。

**接口能力：**
- 路径：`GET /project-form/fill-code/validate`
- 认证：通过请求头 `X-Fill-Code` 传递填写码
- 返回填写码状态：是否有效、过期时间、失效原因等

**填写码状态：**
- 有效：可以继续填写和提交表单
- 无效：填写码不存在
- 已使用：填写码已经提交过表单
- 已过期：填写码超过有效期
- 已作废：填写码被管理员作废

#### Scenario: 填写码有效
- **WHEN** 用户输入有效的填写码
- **THEN** 返回 `valid: true` 和过期时间

#### Scenario: 填写码无效
- **WHEN** 用户输入不存在的填写码
- **THEN** 返回 `valid: false` 和错误消息 "填写码无效"

#### Scenario: 填写码已过期
- **WHEN** 用户输入已过期的填写码
- **THEN** 返回 `valid: false` 和错误消息 "填写码已过期"

#### Scenario: 填写码已使用
- **WHEN** 用户输入已经提交过表单的填写码
- **THEN** 返回 `valid: false` 和错误消息 "填写码已被使用"

---

### Requirement: 下拉选项配置接口

后端 SHALL 提供下拉选项配置接口，用于动态获取选项列表。

**接口能力：**
- 路径：`GET /project-form/options/{type}`
- 认证：无需认证（公开接口）
- 支持的选项类型：
  - `discipline`：所属学科/专项（13 个）
  - `researchField`：研究领域（11 个）
  - `title`：职称（8 个）
  - `education`：学历（4 个）
  - `budgetCategory`：经费类别（11 个）

**响应格式：**
```json
{
  "code": 200,
  "data": [
    { "value": "science", "label": "理学", "description": null }
  ]
}
```

#### Scenario: 获取学科选项
- **WHEN** 请求 `/project-form/options/discipline`
- **THEN** 返回 13 个学科选项（理学、工学、医学等）

#### Scenario: 获取经费类别选项
- **WHEN** 请求 `/project-form/options/budgetCategory`
- **THEN** 返回 11 个经费类别选项，包含 `description` 字段

#### Scenario: 请求不存在的选项类型
- **WHEN** 请求 `/project-form/options/invalid-type`
- **THEN** 返回 400 错误

---

### Requirement: S3 预签名 URL 接口

后端 SHALL 提供 S3 预签名 URL 接口，用于生成文件上传链接。

**接口能力：**
- 路径：`POST /project-form/file/presigned-url`
- 认证：填写码（通过 `X-Fill-Code` header）或 JWT
- 接收参数：`fileName`、`fileType`、`fileSize`
- 返回：`uploadUrl`（预签名 URL）、`s3Key`（S3 对象键）、`expiresIn`（有效期秒数）

**文件限制：**
- 支持格式：PDF、DOC、DOCX
- 最大大小：10MB

**S3 上传流程：**
1. 前端调用此接口获取 `uploadUrl` 和 `s3Key`
2. 前端使用 PUT 方法上传文件到 `uploadUrl`
3. 前端在表单提交时携带 `s3Key`

#### Scenario: 获取预签名 URL 成功
- **WHEN** 用户上传符合格式和大小限制的文件信息
- **THEN** 返回预签名 URL 和 S3 Key

#### Scenario: 文件格式不支持
- **WHEN** 用户上传不支持的文件格式（如 .txt）
- **THEN** 返回 400 错误 "不支持的文件类型"

#### Scenario: 文件过大
- **WHEN** 用户上传超过 10MB 的文件
- **THEN** 返回 400 错误 "文件大小不能超过10MB"

#### Scenario: 填写码无效
- **WHEN** 请求头中的填写码无效
- **THEN** 返回 401 错误

---

### Requirement: AI 文档解析接口

后端 SHALL 提供 AI 文档解析接口，用于上传文档并通过 AI 提取/生成表单内容。

**接口能力：**
- 路径：`POST /project-form/ai/parse-document`
- 认证：填写码（通过 `X-Fill-Code` header）或 JWT
- Content-Type：`multipart/form-data`
- 接收参数：
  - `file`：文档文件（PDF、DOC、DOCX）
  - `parseType`：解析类型（`introduction` 或 `background`）
- 返回：`content`（AI 生成的内容，最长 1500 字符）

**使用场景：**
- `introduction`：AI 根据文档提取/生成项目简介
- `background`：AI 根据文档提取/生成背景和意义

**限制：**
- 文档大小：10MB
- 文档内容：截断到 10000 字符后提交给 AI
- 生成内容：限制在 1500 字符以内

#### Scenario: 解析项目简介成功
- **WHEN** 用户上传有效文档并指定 `parseType=introduction`
- **THEN** 返回 AI 生成的项目简介内容（≤1500 字符）

#### Scenario: 解析背景意义成功
- **WHEN** 用户上传有效文档并指定 `parseType=background`
- **THEN** 返回 AI 生成的背景和意义内容（≤1500 字符）

#### Scenario: 文档无法解析
- **WHEN** 用户上传的文档内容无法识别或为空
- **THEN** 返回解析失败的错误信息

#### Scenario: AI 服务不可用
- **WHEN** AI 服务暂时不可用
- **THEN** 返回 503 错误 "AI 服务暂时不可用"

---

### Requirement: 表单提交接口

后端 SHALL 提供项目申请表单提交接口，接收完整的表单数据并进行校验。

**接口能力：**
- 路径：`POST /project-form/application/submit`
- 认证：填写码（通过 `X-Fill-Code` header，**必需**）
- Content-Type：`application/json`
- 接收数据模块：
  - `basicInfo`：项目基本信息（名称、起止时间、学科、领域、人数）
  - `leader`：项目负责人（姓名、ORCID、邮箱、职称、学历、简介）
  - `members`：成员列表（角色、简历 S3 Key）
  - `introduction`：项目简介（≤1500 字）
  - `background`：背景和意义（≤1500 字）
  - `milestones`：里程碑列表（必须 3 个阶段：early、mid、late）
  - `budgets`：经费预算列表
  - `contact`：联系人信息

**服务端校验：**
- 必填字段校验
- 字数限制校验（负责人简介 ≤200 字、项目简介/背景 ≤1500 字）
- 邮箱格式校验
- 里程碑必须为 3 个阶段
- 日期格式：YYYY-MM-DD

**提交后处理：**
- 填写码被标记为"已使用"，不能再次提交
- 返回申请编号（格式：PA + 年月日 + 序号，如 `PA202512120002`）

#### Scenario: 提交成功
- **WHEN** 用户提交完整且有效的表单数据
- **THEN** 返回成功状态和申请编号

#### Scenario: 必填字段缺失
- **WHEN** 表单数据缺少必填字段（如项目名称）
- **THEN** 返回 400 错误 "项目名称不能为空"

#### Scenario: 字数超限
- **WHEN** 项目简介超过 1500 字
- **THEN** 返回 400 错误 "项目简介不能超过1500字"

#### Scenario: 邮箱格式错误
- **WHEN** 负责人邮箱格式不正确
- **THEN** 返回 400 错误 "负责人邮箱格式不正确"

#### Scenario: 里程碑数量错误
- **WHEN** 里程碑不是 3 个阶段
- **THEN** 返回 400 错误 "里程碑必须为3个阶段"

#### Scenario: 填写码已使用
- **WHEN** 使用已经提交过表单的填写码
- **THEN** 返回 401 错误 "填写码已被使用"

#### Scenario: 填写码已过期
- **WHEN** 使用已过期的填写码
- **THEN** 返回 401 错误 "填写码无效或已过期"

---

## 统一响应格式

### Requirement: API 响应格式

所有接口 SHALL 使用统一的响应格式。

**成功响应：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { /* 具体数据 */ },
  "timestamp": "2025-12-12T09:25:10.32152453",
  "success": true
}
```

**错误响应：**
```json
{
  "code": 400,
  "message": "错误描述",
  "timestamp": "2025-12-12T09:25:10.32152453",
  "success": false
}
```

#### Scenario: 成功响应
- **WHEN** 请求成功
- **THEN** 返回 `success: true`、`code: 200`、`data` 字段

#### Scenario: 错误响应
- **WHEN** 请求失败
- **THEN** 返回 `success: false`、错误 `code`、错误 `message`

---

## 错误码

### Requirement: HTTP 状态码和错误码

接口 SHALL 使用标准 HTTP 状态码和错误码。

**标准状态码：**
- 200：请求成功
- 400：请求参数错误
- 401：未授权（填写码无效或缺失）
- 500：服务器内部错误
- 503：服务不可用（AI 服务暂时不可用）

#### Scenario: 参数错误
- **WHEN** 请求参数不符合要求
- **THEN** 返回 400 状态码和具体错误消息

#### Scenario: 填写码无效
- **WHEN** 填写码无效、已过期或已使用
- **THEN** 返回 401 状态码

#### Scenario: 服务器错误
- **WHEN** 服务器内部错误
- **THEN** 返回 500 状态码

---

## 附录：完整的下拉选项定义

### Requirement: 下拉选项数据

接口 SHALL 提供以下下拉选项数据。

**学科/专项（13 个）：**
- 哲学、经济学、法学、教育学、文学、历史学、理学、工学、农学、医学、管理学、艺术学、交叉学科

**研究领域（11 个）：**
- 人工智能、区块链、生物技术、新材料、新能源、环境科学、健康医疗、量子科技、航空航天、海洋科学、其他

**职称（8 个）：**
- 院士、教授/研究员、副教授/副研究员、讲师/助理研究员、博士后、高级工程师、工程师、其他

**学历（4 个）：**
- 博士、硕士、本科、其他

**经费类别（11 个）：**
- 设备费、材料费、测试化验加工费、燃料动力费、差旅费、会议费、出版/文献/信息传播费、劳务费、专家咨询费、间接费用、其他支出

#### Scenario: 学科选项数量正确
- **WHEN** 请求 `/project-form/options/discipline`
- **THEN** 返回恰好 13 个选项

#### Scenario: 经费类别包含说明
- **WHEN** 请求 `/project-form/options/budgetCategory`
- **THEN** 每个选项包含 `description` 字段

---

## 测试数据

### Requirement: 测试环境配置

测试环境 SHALL 提供以下配置：

- **测试域名**：`https://testogapi.opensci.io/account/`
- **测试填写码**：`TEST_CODE_20251212`（有效期至 2025-12-19）

#### Scenario: 使用测试填写码
- **WHEN** 在测试环境使用 `TEST_CODE_20251212`
- **THEN** 填写码校验通过
