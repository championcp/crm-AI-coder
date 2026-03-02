/**
 * 用户管理路由
 * 企业项目全流程管理数据系统 - 系统管理模块
 */

import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const userRepository = () => AppDataSource.getRepository(User);

/**
 * 获取用户列表
 * GET /api/users
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, role, department, status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = userRepository().createQueryBuilder('user');

    if (keyword) {
      queryBuilder.andWhere('(user.username LIKE :keyword OR user.realName LIKE :keyword OR user.email LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }
    if (department) {
      queryBuilder.andWhere('user.department = :department', { department });
    }
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    // 移除密码字段
    const sanitizedUsers = users.map(user => ({
      ...user,
      password: undefined
    }));

    res.json({
      success: true,
      data: {
        list: sanitizedUsers,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取用户详情
 * GET /api/users/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建用户（系统管理员）
 * POST /api/users
 */
router.post('/', authenticate, authorize('system:user:create'), async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, realName, phone, email, role, department } = req.body;

    if (!username || !password || !realName) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    // 检查用户名是否已存在
    const existingUser = await userRepository().findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository().create({
      username,
      password: hashedPassword,
      realName,
      phone: phone || '',
      email: email || '',
      role: role || UserRole.SALES_MANAGER,
      department: department || '销售部',
      status: UserStatus.ACTIVE
    });

    await userRepository().save(user);

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 更新用户
 * PUT /api/users/:id
 */
router.put('/:id', authenticate, authorize('system:user:update'), async (req: AuthRequest, res: Response) => {
  try {
    const user = await userRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const { realName, phone, email, role, department, status } = req.body;

    Object.assign(user, {
      realName,
      phone,
      email,
      role,
      department,
      status
    });

    await userRepository().save(user);

    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: '用户更新成功',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 删除用户
 * DELETE /api/users/:id
 */
router.delete('/:id', authenticate, authorize('system:user:delete'), async (req: AuthRequest, res: Response) => {
  try {
    const user = await userRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 不能删除自己
    if (user.id === req.user!.id) {
      return res.status(400).json({ success: false, message: '不能删除当前登录用户' });
    }

    await userRepository().remove(user);

    res.json({ success: true, message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取用户选项列表（用于下拉选择）
 * GET /api/users/options
 */
router.get('/options/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role, department } = req.query;

    const queryBuilder = userRepository()
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.realName', 'user.role', 'user.department'])
      .where('user.status = :status', { status: UserStatus.ACTIVE });

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }
    if (department) {
      queryBuilder.andWhere('user.department = :department', { department });
    }

    const users = await queryBuilder.orderBy('user.realName', 'ASC').getMany();

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('获取用户选项列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取角色列表
 * GET /api/users/roles
 */
router.get('/options/roles', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const roles = Object.values(UserRole).map(role => ({
      value: role,
      label: getRoleLabel(role)
    }));

    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('获取角色列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 角色标签映射
function getRoleLabel(role: UserRole): string {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.SYSTEM_ADMIN]: '系统管理员',
    [UserRole.SALES_MANAGER]: '销售经理',
    [UserRole.SALES_CONTROLLER]: '销售管控',
    [UserRole.DELIVERY_MANAGER]: '交付经理',
    [UserRole.DEVELOPER]: '开发工程师',
    [UserRole.PROJECT_MANAGER]: '项目经理',
    [UserRole.PROJECT_CONTROLLER]: '项目管控',
    [UserRole.OPERATIONS_SUPERVISOR]: '运营主管',
    [UserRole.PROJECT_OPERATIONS]: '项目运营管控',
    [UserRole.FINANCE_ACCOUNTANT]: '财务会计',
    [UserRole.DEPARTMENT_HEAD]: '部门负责人',
    [UserRole.SENIOR_MANAGEMENT]: '高层管理人员'
  };
  return roleLabels[role] || role;
}

// 部门列表
router.get('/options/departments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const departments = [
      '销售部',
      '售前部',
      '交付部',
      '开发部',
      '管控部',
      '运营部',
      '财务部',
      '信息化部'
    ].map(dept => ({ value: dept, label: dept }));

    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('获取部门列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;