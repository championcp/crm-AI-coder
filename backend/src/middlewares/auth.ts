/**
 * 认证中间件
 * 企业项目全流程管理数据系统 - 用户认证与权限管理
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

// JWT密钥（生产环境应使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'project-management-secret-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    department: string;
  };
}

/**
 * 验证JWT token中间件
 */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
      department: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: '无效的认证令牌' });
  }
}

/**
 * 生成JWT token
 */
export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    department: user.department
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * 角色权限映射
 */
export const rolePermissions: Record<string, string[]> = {
  // 系统管理员 - 全部权限
  system_admin: ['*'],

  // 销售经理 - 本部门全部
  sales_manager: ['customer:*', 'opportunity:*', 'contract:read', 'contract:create'],

  // 销售管控 - 审批/查看
  sales_controller: ['customer:read', 'opportunity:*', 'contract:read', 'contract:approve'],

  // 交付经理 - 项目相关
  delivery_manager: ['project:*', 'milestone:*'],

  // 开发工程师 - 任务录入
  developer: ['task:read', 'task:create'],

  // 项目经理 - 项目管理
  project_manager: ['project:*', 'milestone:*', 'task:*'],

  // 项目管控 - 全部项目权限
  project_controller: ['project:*', 'milestone:*', 'task:*', 'risk:*'],

  // 运营主管
  operations_supervisor: ['dashboard:*', 'report:*'],

  // 项目运营管控
  project_operations: ['project:read', 'report:*'],

  // 财务会计
  finance_accountant: ['finance:*', 'budget:*', 'cost:*', 'payment:*'],

  // 部门负责人
  department_head: ['*'],

  // 高层管理
  senior_management: ['dashboard:*', 'report:*', 'project:read']
};

/**
 * 检查用户权限
 */
export function checkPermission(requiredPermission: string, userRole: string): boolean {
  const permissions = rolePermissions[userRole];

  if (!permissions) {
    return false;
  }

  // 超级管理员拥有所有权限
  if (permissions.includes('*')) {
    return true;
  }

  // 检查具体权限
  const [module, action] = requiredPermission.split(':');
  return permissions.some(p => {
    if (p === '*') return true;
    const [pModule, pAction] = p.split(':');
    if (pModule === module && (pAction === '*' || pAction === action)) {
      return true;
    }
    return pModule === '*';
  });
}

/**
 * 权限验证中间件
 */
export function authorize(requiredPermission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '未认证' });
    }

    if (!checkPermission(requiredPermission, req.user.role)) {
      return res.status(403).json({ success: false, message: '权限不足' });
    }

    next();
  };
}