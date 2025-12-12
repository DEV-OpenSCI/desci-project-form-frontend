// 一级学科（所属专项）- 13 个选项
export const DISCIPLINES = [
  { value: 'science', label: '理学' },
  { value: 'engineering', label: '工学' },
  { value: 'medicine', label: '医学' },
  { value: 'agriculture', label: '农学' },
  { value: 'economics', label: '经济学' },
  { value: 'law', label: '法学' },
  { value: 'education', label: '教育学' },
  { value: 'literature', label: '文学' },
  { value: 'history', label: '历史学' },
  { value: 'philosophy', label: '哲学' },
  { value: 'management', label: '管理学' },
  { value: 'art', label: '艺术学' },
  { value: 'interdisciplinary', label: '交叉学科' },
]

// 研究领域 - 11 个选项(与 API 对齐)
export const RESEARCH_FIELDS = [
  { value: 'ai', label: '人工智能' },
  { value: 'blockchain', label: '区块链' },
  { value: 'biotech', label: '生物技术' },
  { value: 'materials', label: '新材料' },
  { value: 'energy', label: '新能源' },
  { value: 'environment', label: '环境科学' },
  { value: 'health', label: '健康医疗' },
  { value: 'quantum', label: '量子科技' },
  { value: 'space', label: '航空航天' },
  { value: 'ocean', label: '海洋科学' },
  { value: 'other', label: '其他' },
]

// 职称 - 8 个选项(与 API 对齐)
export const TITLES = [
  { value: 'academician', label: '院士' },
  { value: 'professor', label: '教授/研究员' },
  { value: 'associate_professor', label: '副教授/副研究员' },
  { value: 'lecturer', label: '讲师/助理研究员' },
  { value: 'postdoc', label: '博士后' },
  { value: 'senior_engineer', label: '高级工程师' },
  { value: 'engineer', label: '工程师' },
  { value: 'other', label: '其他' },
]

// 学历 - 4 个选项(与 API 对齐)
export const EDUCATIONS = [
  { value: 'phd', label: '博士' },
  { value: 'master', label: '硕士' },
  { value: 'bachelor', label: '本科' },
  { value: 'other', label: '其他' },
]

// 成员角色
export const MEMBER_ROLES = [
  { value: 'key-member', label: '主要成员' },
  { value: 'other-member', label: '其他成员' },
]

// 里程碑阶段
export const MILESTONE_STAGES = [
  { value: 'early', label: '初期' },
  { value: 'mid', label: '中期' },
  { value: 'late', label: '末期' },
]

// 经费类别 - 11 个细分类别(与 API 对齐)
export const BUDGET_CATEGORIES = [
  { value: 'equipment', label: '设备费', description: '购买或租赁科研仪器设备的费用' },
  { value: 'materials', label: '材料费', description: '实验材料、试剂、耗材等费用' },
  { value: 'testing', label: '测试化验加工费', description: '委托外单位进行测试、化验、加工的费用' },
  { value: 'fuel', label: '燃料动力费', description: '在研究过程中消耗的各种燃料和动力费用' },
  { value: 'travel', label: '差旅费', description: '出差、调研、学术交流的交通和住宿费用' },
  { value: 'conference', label: '会议费', description: '组织或参加学术会议的费用' },
  { value: 'publication', label: '出版/文献/信息传播费', description: '论文发表、专利申请、文献资料等费用' },
  { value: 'labor', label: '劳务费', description: '支付给课题组成员以外人员的劳务报酬' },
  { value: 'consultant', label: '专家咨询费', description: '支付给临时聘请的专家的咨询费用' },
  { value: 'indirect', label: '间接费用', description: '管理费、房屋占用费、仪器折旧等' },
  { value: 'other', label: '其他支出', description: '其他与研究直接相关的支出' },
]
