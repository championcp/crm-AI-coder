/**
 * 类型定义
 * 企业项目全流程管理数据系统
 */

// 用户相关类型
export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  SALES_MANAGER = 'sales_manager',
  SALES_CONTROLLER = 'sales_controller',
  DELIVERY_MANAGER = 'delivery_manager',
  DEVELOPER = 'developer',
  PROJECT_MANAGER = 'project_manager',
  PROJECT_CONTROLLER = 'project_controller',
  OPERATIONS_SUPERVISOR = 'operations_supervisor',
  PROJECT_OPERATIONS = 'project_operations',
  FINANCE_ACCOUNTANT = 'finance_accountant',
  DEPARTMENT_HEAD = 'department_head',
  SENIOR_MANAGEMENT = 'senior_management'
}

export interface User {
  id: string;
  username: string;
  realName: string;
  phone?: string;
  email?: string;
  role: UserRole;
  department: string;
  status: string;
  lastLoginTime?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

// 客户相关类型
export enum CustomerLevel {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export enum CustomerScale {
  LARGE = 'large',
  MEDIUM = 'medium',
  SMALL = 'small',
  MICRO = 'micro'
}

export enum CustomerIndustry {
  IT = 'IT',
  FINANCE = 'finance',
  MANUFACTURING = 'manufacturing',
  RETAIL = 'retail',
  EDUCATION = 'education',
  HEALTHCARE = 'healthcare',
  REAL_ESTATE = 'real_estate',
  ENERGY = 'energy',
  TRANSPORTATION = 'transportation',
  OTHER = 'other'
}

export enum CustomerStatus {
  POTENTIAL = 'potential',
  FORMAL = 'formal',
  LOST = 'lost'
}

export interface Customer {
  id: string;
  customerCode: string;
  customerName: string;
  shortName?: string;
  industry: CustomerIndustry;
  scale: CustomerScale;
  phone: string;
  address?: string;
  level: CustomerLevel;
  ownerId: string;
  owner?: User;
  status: CustomerStatus;
  description?: string;
  createTime: string;
  updateTime: string;
}

// 商机相关类型
export enum OpportunityLevel {
  LEVEL_1 = '一级',
  QUASI_LEVEL_1 = '准一级',
  LEVEL_2 = '二级',
  QUASI_LEVEL_2 = '准二级',
  LEVEL_3 = '三级',
  QUASI_LEVEL_3 = '准三级',
  LEVEL_4 = '四级'
}

export enum OpportunitySource {
  COLD_CALL = 'cold_call',
  VISIT = 'visit',
  REFERRAL = 'referral',
  BIDDING = 'bidding',
  OTHER = 'other'
}

export enum OpportunityStage {
  REQUIREMENT = 'requirement',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CONTRACT_REVIEW = 'contract_review',
  CONTRACT_APPROVAL = 'contract_approval',
  SIGNED = 'signed'
}

export enum OpportunityStatus {
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled'
}

export interface Opportunity {
  id: string;
  opportunityCode: string;
  opportunityName: string;
  customerId: string;
  customer?: Customer;
  amount: number;
  level?: OpportunityLevel;
  source: OpportunitySource;
  stage: OpportunityStage;
  expectedSignDate?: string;
  winRate?: number;
  products?: string;
  competitors?: string;
  description?: string;
  ownerId: string;
  owner?: User;
  presalesId?: string;
  presales?: User;
  status: OpportunityStatus;
  lastFollowTime?: string;
  createTime: string;
  updateTime: string;
}

// 合同相关类型
export enum ContractType {
  PRODUCT_SALES = 'product_sales',
  SERVICE = 'service',
  CUSTOM_DEVELOPMENT = 'custom_development',
  MIXED = 'mixed'
}

export enum PaymentMethod {
  LUMP_SUM = 'lump_sum',
  INSTALLMENT = 'installment',
  MILESTONES = 'milestones'
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  TERMINATED = 'terminated'
}

export interface PaymentSchedule {
  id: string;
  contractId: string;
  period: number;
  planDate: string;
  planAmount: string;
  terms?: string;
  actualDate?: string;
  actualAmount?: string;
  status: string;
}

export interface Contract {
  id: string;
  contractCode: string;
  contractName: string;
  contractType: ContractType;
  customerId: string;
  customer?: Customer;
  opportunityId?: string;
  opportunity?: Opportunity;
  amount: string;
  signDate: string;
  startDate: string;
  endDate: string;
  paymentMethod: PaymentMethod;
  paymentTerms?: string;
  status: ContractStatus;
  contractFile?: string;
  ownerId: string;
  owner?: User;
  description?: string;
  createTime: string;
  updateTime: string;
  paymentSchedules?: PaymentSchedule[];
}

// 项目相关类型
export enum ProjectType {
  PRODUCT_DEVELOPMENT = 'product_development',
  SERVICE_DELIVERY = 'service_delivery',
  CONSULTING = 'consulting',
  MIXED = 'mixed'
}

export enum ProjectLevel {
  A = 'A',
  B = 'B',
  C = 'C'
}

export enum ProjectStatus {
  PENDING_APPROVAL = 'pending_approval',
  EXECUTING = 'executing',
  ACCEPTANCE = 'acceptance',
  COMPLETED = 'completed',
  TERMINATED = 'terminated'
}

export interface ProjectMilestone {
  id: string;
  milestoneCode: string;
  projectId: string;
  name: string;
  description?: string;
  planDate: string;
  actualDate?: string;
  status: string;
  deliverables?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user?: User;
  role: string;
  department: string;
  joinDate: string;
  leaveDate?: string;
  workRatio: string;
}

export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  projectType: ProjectType;
  contractId: string;
  contract?: Contract;
  customerName: string;
  managerId: string;
  manager?: User;
  deputyManagerId?: string;
  deputyManager?: User;
  status: ProjectStatus;
  level: ProjectLevel;
  planStartDate: string;
  planEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  budget: string;
  contractAmount: string;
  description?: string;
  createTime: string;
  updateTime: string;
  milestones?: ProjectMilestone[];
  members?: ProjectMember[];
}

// 审批相关类型
export enum ApprovalType {
  OPPORTUNITY_CHANGE = 'opportunity_change',
  CONTRACT_APPROVAL = 'contract_approval',
  PROJECT_SETUP = 'project_setup',
  PROJECT_CHANGE = 'project_change',
  PAYMENT_APPROVAL = 'payment_approval',
  OTHER = 'other'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface Approval {
  id: string;
  approvalCode: string;
  type: ApprovalType;
  title: string;
  content: string;
  applicantId: string;
  applicant?: User;
  approverId?: string;
  approver?: User;
  status: ApprovalStatus;
  comment?: string;
  relatedId?: string;
  relatedType?: string;
  approvalTime?: string;
  createTime: string;
  updateTime: string;
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// 仪表盘统计数据
export interface DashboardStats {
  customers: {
    total: number;
    formal: number;
  };
  opportunities: {
    total: number;
    active: number;
    won: number;
    amount: number;
  };
  contracts: {
    total: number;
    executing: number;
    amount: number;
  };
  projects: {
    total: number;
    executing: number;
    completed: number;
  };
  approvals: {
    pending: number;
  };
}