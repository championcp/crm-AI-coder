/**
 * API 服务层
 * 企业项目全流程管理数据系统
 */

import axios, { AxiosInstance } from 'axios';
import {
  LoginParams,
  User,
  Customer,
  PageResponse,
  Opportunity,
  Contract,
  Project,
  Approval,
  DashboardStats,
  ApiResponse
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 创建Axios实例 - 响应拦截器已经解包data
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
request.interceptors.response.use(
  (response) => {
    // 直接返回响应，页面处理success
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== 认证服务 =====
export const authService = {
  login: (params: LoginParams) => request.post<ApiResponse<{ token: string; user: User }>>('/auth/login', params),
  register: (params: Partial<User> & { password: string }) => request.post('/auth/register', params),
  getCurrentUser: () => request.get<ApiResponse<User>>('/auth/me'),
  changePassword: (oldPassword: string, newPassword: string) =>
    request.post('/auth/change-password', { oldPassword, newPassword })
};

// ===== 用户服务 =====
export const userService = {
  getList: (params?: { page?: number; pageSize?: number; keyword?: string; role?: string; department?: string }) =>
    request.get<ApiResponse<PageResponse<User>>>('/users', { params }),
  getById: (id: string) => request.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: Partial<User> & { password: string }) => request.post('/users', data),
  update: (id: string, data: Partial<User>) => request.put(`/users/${id}`, data),
  delete: (id: string) => request.delete(`/users/${id}`),
  getOptions: (params?: { role?: string; department?: string }) =>
    request.get<ApiResponse<User[]>>('/users/options/list', { params }),
  getRoles: () => request.get<ApiResponse<{ value: string; label: string }[]>>('/users/options/roles'),
  getDepartments: () => request.get<ApiResponse<{ value: string; label: string }[]>>('/users/options/departments')
};

// ===== 客户管理服务 =====
export const customerService = {
  getList: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    level?: string;
    status?: string;
    industry?: string;
  }) => request.get<ApiResponse<PageResponse<Customer>>>('/customers', { params }),
  getById: (id: string) => request.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: Partial<Customer>) => request.post('/customers', data),
  update: (id: string, data: Partial<Customer>) => request.put(`/customers/${id}`, data),
  delete: (id: string) => request.delete(`/customers/${id}`),
  getOptions: () => request.get<ApiResponse<Customer[]>>('/customers/options/list')
};

// ===== 商机管理服务 =====
export const opportunityService = {
  getList: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    level?: string;
    stage?: string;
    status?: string;
    customerId?: string;
    ownerId?: string;
  }) => request.get<ApiResponse<PageResponse<Opportunity>>>('/opportunities', { params }),
  getById: (id: string) => request.get<ApiResponse<Opportunity>>(`/opportunities/${id}`),
  create: (data: Partial<Opportunity>) => request.post('/opportunities', data),
  update: (id: string, data: Partial<Opportunity>) => request.put(`/opportunities/${id}`, data),
  delete: (id: string) => request.delete(`/opportunities/${id}`),
  changeStage: (id: string, stage: string) => request.post(`/opportunities/${id}/change-stage`, { stage }),
  submitChangeApproval: (id: string, data: { changeType: string; beforeContent: string; afterContent: string; reason: string }) =>
    request.post(`/opportunities/${id}/change-approval`, data),
  getStats: () => request.get<ApiResponse<any>>('/opportunities/stats/summary')
};

// ===== 合同管理服务 =====
export const contractService = {
  getList: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    contractType?: string;
    status?: string;
    customerId?: string;
  }) => request.get<ApiResponse<PageResponse<Contract>>>('/contracts', { params }),
  getById: (id: string) => request.get<ApiResponse<Contract>>(`/contracts/${id}`),
  create: (data: Partial<Contract>) => request.post('/contracts', data),
  update: (id: string, data: Partial<Contract>) => request.put(`/contracts/${id}`, data),
  delete: (id: string) => request.delete(`/contracts/${id}`),
  submitApproval: (id: string) => request.post(`/contracts/${id}/approve`)
};

// ===== 项目管理服务 =====
export const projectService = {
  getList: (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    projectType?: string;
    status?: string;
    level?: string;
    managerId?: string;
  }) => request.get<ApiResponse<PageResponse<Project>>>('/projects', { params }),
  getById: (id: string) => request.get<ApiResponse<Project>>(`/projects/${id}`),
  create: (data: Partial<Project>) => request.post('/projects', data),
  update: (id: string, data: Partial<Project>) => request.put(`/projects/${id}`, data),
  delete: (id: string) => request.delete(`/projects/${id}`),
  submitApproval: (id: string) => request.post(`/projects/${id}/approve`),
  submitChangeApproval: (id: string, data: { changeType: string; changeTitle: string; beforeContent: string; afterContent: string; reason: string }) =>
    request.post(`/projects/${id}/change-approval`, data),
  addMilestone: (id: string, data: Partial<{ name: string; description: string; planDate: string; deliverables: string }>) =>
    request.post(`/projects/${id}/milestones`, data),
  addMember: (id: string, data: Partial<{ userId: string; role: string; department: string; joinDate: string; workRatio: number }>) =>
    request.post(`/projects/${id}/members`, data)
};

// ===== 审批管理服务 =====
export const approvalService = {
  getList: (params?: { page?: number; pageSize?: number; type?: string; status?: string }) =>
    request.get<ApiResponse<PageResponse<Approval>>>('/approvals', { params }),
  getPending: () => request.get<ApiResponse<Approval[]>>('/approvals/pending'),
  getById: (id: string) => request.get<ApiResponse<Approval>>(`/approvals/${id}`),
  process: (id: string, action: 'approve' | 'reject', comment?: string) =>
    request.post(`/approvals/${id}/process`, { action, comment }),
  cancel: (id: string) => request.post(`/approvals/${id}/cancel`),
  getStats: () => request.get<ApiResponse<any>>('/approvals/stats/summary')
};

// ===== 仪表盘服务 =====
export const dashboardService = {
  getStats: () => request.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  getSalesFunnel: () => request.get<ApiResponse<any[]>>('/dashboard/sales-funnel'),
  getProjectStatus: () => request.get<ApiResponse<any[]>>('/dashboard/project-status'),
  getRecentActivities: (limit?: number) => request.get<ApiResponse<any>>('/dashboard/recent-activities', { params: { limit } }),
  getTodos: () => request.get<ApiResponse<any>>('/dashboard/todos')
};

export default request;