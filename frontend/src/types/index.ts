/**
 * 类型定义文件
 * 企业项目全流程管理数据系统
 */

// ===== 通用类型 =====

/**
 * API响应包装
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 分页查询参数
 */
export interface PageParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// ===== 用户相关类型 =====

/**
 * 用户信息
 */
export interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked';
  createdAt: string;
  updatedAt: string;
}

/**
 * 登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

// ===== 客户管理类型 =====

/**
 * 客户等级
 */
export type CustomerLevel = 'A' | 'B' | 'C' | 'D';

/**
 * 客户状态
 */
export type CustomerStatus = '潜在客户' | '正式客户' | '重点客户' | '流失客户';

/**
 * 客户信息
 */
export interface Customer {
  id: string;
  name: string;
  code: string;
  level: CustomerLevel;
  status: CustomerStatus;
  industry: string;
  scale: string;
  website?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  description?: string;
  tags?: string[];
  // 联系人信息
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactPosition?: string;
  // 系统字段
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

/**
 * 跟进记录
 */
export interface FollowUp {
  id: string;
  customerId: string;
  customer?: Customer;
  type: '电话' | '邮件' | '拜访' | '会议' | '其他';
  content: string;
  followUpTime: string;
  nextFollowUpTime?: string;
  reminderTime?: string;
  result?: string;
  createdBy: string;
  creator?: User;
  createdAt: string;
  attachments?: Attachment[];
}

/**
 * 附件
 */
export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

// ===== 商机管理类型 =====

/**
 * 商机阶段
 */
export type OpportunityStage = '需求了解' | '方案制定' | '商务洽谈' | '合同评审' | '签约完成' | '商机关闭';

/**
 * 商机等级
 */
export type OpportunityLevel = 'A' | 'B' | 'C' | 'D';

/**
 * 商机信息
 */
export interface Opportunity {
  id: string;
  name: string;
  code: string;
  customerId: string;
  customer?: Customer;
  amount: number;
  level: OpportunityLevel;
  stage: OpportunityStage;
  status: '进行中' | '已成交' | '已关闭';
  expectCloseDate: string;
  actualCloseDate?: string;
  description?: string;
  // 系统字段
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

// ===== 合同管理类型 =====

/**
 * 合同类型
 */
export type ContractType = '销售合同' | '采购合同' | '服务合同' | '其他合同';

/**
 * 合同状态
 */
export type ContractStatus = '草稿' | '审批中' | '已生效' | '执行中' | '已完成' | '已终止';

/**
 * 合同信息
 */
export interface Contract {
  id: string;
  name: string;
  code: string;
  type: ContractType;
  status: ContractStatus;
  customerId: string;
  customer?: Customer;
  amount: number;
  signDate?: string;
  startDate: string;
  endDate: string;
  paymentTerms?: string;
  content?: string;
  attachments?: Attachment[];
  // 系统字段
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

// ===== 项目管理类型 =====

/**
 * 项目状态
 */
export type ProjectStatus = '筹备中' | '执行中' | '已暂停' | '验收中' | '已完成' | '已取消';

/**
 * 项目等级
 */
export type ProjectLevel = 'A' | 'B' | 'C' | 'D';

/**
 * 项目类型
 */
export type ProjectType = '内部项目' | '外部项目';

/**
 * 项目信息
 */
export interface Project {
  id: string;
  name: string;
  code: string;
  type: ProjectType;
  status: ProjectStatus;
  level: ProjectLevel;
  customerId?: string;
  customer?: Customer;
  contractId?: string;
  contract?: Contract;
  amount?: number;
  description?: string;
  startDate: string;
  planEndDate: string;
  actualEndDate?: string;
  // 负责人
  managerId: string;
  manager?: User;
  // 系统字段
  createdAt: string;
  updatedAt: string;
}

/**
 * 项目里程碑
 */
export interface Milestone {
  id: string;
  projectId: string;
  project?: Project;
  name: string;
  description?: string;
  planDate: string;
  actualDate?: string;
  status: '未开始' | '进行中' | '已完成';
  deliverables?: string;
  createdAt: string;
}

/**
 * 项目成员
 */
export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user?: User;
  role: string;
  department: string;
  joinDate: string;
  leaveDate?: string;
  workRatio: number;
  createdAt: string;
}

// ===== 审批管理类型 =====

/**
 * 审批类型
 */
export type ApprovalType = '合同审批' | '项目审批' | '商机变更' | '项目变更' | '费用申请';

/**
 * 审批状态
 */
export type ApprovalStatus = '待审批' | '审批中' | '已通过' | '已驳回' | '已撤回';

/**
 * 审批信息
 */
export interface Approval {
  id: string;
  code: string;
  type: ApprovalType;
  status: ApprovalStatus;
  title: string;
  description?: string;
  // 关联数据
  businessId: string;
  businessType: string;
  // 申请人
  applicantId: string;
  applicant?: User;
  // 当前审批人
  currentApproverId?: string;
  currentApprover?: User;
  // 审批记录
  records?: ApprovalRecord[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 审批记录
 */
export interface ApprovalRecord {
  id: string;
  approvalId: string;
  approverId: string;
  approver?: User;
  action: 'submit' | 'approve' | 'reject' | 'transfer' | 'withdraw';
  comment?: string;
  createdAt: string;
}

// ===== 财务管理类型 =====

/**
 * 收支类型
 */
export type FinanceType = '收入' | '支出';

/**
 * 财务记录
 */
export interface Finance {
  id: string;
  code: string;
  type: FinanceType;
  category: string;
  amount: number;
  date: string;
  customerId?: string;
  customer?: Customer;
  projectId?: string;
  project?: Project;
  contractId?: string;
  contract?: Contract;
  description?: string;
  attachments?: Attachment[];
  // 系统字段
  createdBy: string;
  creator?: User;
  createdAt: string;
  updatedAt: string;
}

// ===== 系统管理类型 =====

/**
 * 系统设置
 */
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 操作日志
 */
export interface OperationLog {
  id: string;
  userId: string;
  user?: User;
  module: string;
  action: string;
  description?: string;
  ip?: string;
  userAgent?: string;
  requestData?: string;
  responseData?: string;
  createdAt: string;
}

// ===== 仪表盘类型 =====

/**
 * 仪表盘统计数据
 */
export interface DashboardStats {
  customers: {
    total: number;
    formal: number;
    potential: number;
    vip: number;
    churn: number;
  };
  opportunities: {
    total: number;
    active: number;
    won: number;
    lost: number;
    amount: number;
    wonAmount: number;
  };
  projects: {
    total: number;
    executing: number;
    completed: number;
    paused: number;
  };
  contracts: {
    total: number;
    draft: number;
    effective: number;
    completed: number;
    amount: number;
  };
  approvals: {
    pending: number;
    processing: number;
    approved: number;
    rejected: number;
  };
}

// ===== 查询参数类型 =====

/**
 * 客户查询参数
 */
export interface CustomerQueryParams extends PageParams {
  level?: CustomerLevel;
  status?: CustomerStatus;
  industry?: string;
}

/**
 * 商机查询参数
 */
export interface OpportunityQueryParams extends PageParams {
  level?: OpportunityLevel;
  stage?: OpportunityStage;
  status?: string;
  customerId?: string;
  ownerId?: string;
}

/**
 * 合同查询参数
 */
export interface ContractQueryParams extends PageParams {
  contractType?: ContractType;
  status?: ContractStatus;
  customerId?: string;
}

/**
 * 项目查询参数
 */
export interface ProjectQueryParams extends PageParams {
  projectType?: ProjectType;
  status?: ProjectStatus;
  level?: ProjectLevel;
  managerId?: string;
}

/**
 * 审批查询参数
 */
export interface ApprovalQueryParams extends PageParams {
  type?: ApprovalType;
  status?: ApprovalStatus;
}

/**
 * 财务查询参数
 */
export interface FinanceQueryParams extends PageParams {
  type?: FinanceType;
  category?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  projectId?: string;
}

// ===== 用户角色类型 =====
export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  PROJECT_MANAGER = 'project_manager',
  SALES_MANAGER = 'sales_manager',
  DEVELOPER = 'developer',
  FINANCE_ACCOUNTANT = 'finance_accountant'
}
