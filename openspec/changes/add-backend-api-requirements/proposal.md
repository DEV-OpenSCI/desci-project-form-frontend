# Change: 对接后端 API 并实现完整表单功能

## Why

后端已提供完整的项目申请表单 API 接口文档（包含填写码认证机制），前端需要完成以下工作：
1. 实现填写码认证流程（用户必须先输入有效填写码才能填表）
2. 创建 API 服务层对接后端接口
3. 实现文件上传到 S3 的功能
4. 实现 AI 文档解析功能
5. 修正前端数据结构与 API 的不匹配问题
6. 实现完整的表单提交流程

## What Changes

- **新增功能**：
  - 填写码认证页面和校验逻辑
  - API 服务层（`/src/services/`）
  - HTTP 客户端配置和请求拦截器（自动携带 X-Fill-Code）
  - 文件上传到 S3 的完整流程
  - AI 文档解析功能（可选）
  - 环境变量配置（API 地址等）

- **修正数据结构**：
  - 更新常量定义与 API 对齐（学科、领域、职称、学历、经费类别）
  - 修正表单 schema 字段名（objectives→goals, donation→donationAmount 等）
  - 成员简历从 File 对象改为 S3 Key

- **完善功能**：
  - 加载状态和错误提示
  - 表单提交成功后显示申请编号
  - 动态加载下拉选项（从 API 获取）

## Impact

- Affected specs: `backend-api`（更新）、新增 `frontend-auth`、`frontend-file-upload`
- Affected code:
  - `/src/types/form.ts` - 数据结构调整
  - `/src/lib/constants.ts` - 常量更新
  - `/src/services/` - 新建 API 服务层
  - `/src/components/form/` - 各表单组件增加 API 调用
  - `/src/App.tsx` - 增加填写码认证流程

## API 接口文档地址

后端接口文档：`/Users/deme/workspace/IdeaProjects/desci-backend/openspec/changes/add-project-form-api/API接口文档.md`

测试环境域名：`https://testogapi.opensci.io/account/`
