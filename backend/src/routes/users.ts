/**
 * 用户管理路由
 * 企业项目全流程管理数据系统 - 系统管理模块
 */

import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';
import * as userService from '../services/userService';

const router = Router();
const userRepository = () => AppDataSource.getRepository(User);

/**
 * 获取用户列表
 * GET /api/users
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, role, department, status } = req.query;

    const result = await userService.getUserList({
      page: Number(page),
      pageSize: Number(pageSize),
      keyword: keyword as string,
      role: role as string,
      department: department as string,
      status: status as string
    });

    res.json({
      success: true,
      data: {
        list: result.list,
        total: result.total,
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
    const userId = String(req.params.id);
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({ success: true, data: user });
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

    const user = await userService.createUser({
      username,
      password,
      realName,
      phone,
      email,
      role,
      department
    });

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
  } catch (error: any) {
    console.error('创建用户错误:', error);
    res.status(400).json({ success: false, message: error.message || '创建用户失败' });
  }
});

/**
 * 更新用户
 * PUT /api/users/:id
 */
router.put('/:id', authenticate, authorize('system:user:update'), async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.params.id);
    const { realName, phone, email, role, department, status } = req.body;

    const user = await userService.updateUser(userId, {
      realName,
      phone,
      email,
      role,
      department,
      status
    });

    res.json({
      success: true,
      message: '用户更新成功',
      data: user
    });
  } catch (error: any) {
    console.error('更新用户错误:', error);
    res.status(400).json({ success: false, message: error.message || '用户更新失败' });
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

    await userService.deleteUser(user.id);

    res.json({ success: true, message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 修改用户密码
 * PUT /api/users/:id/password
 */
router.put('/:id/password', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = String(req.params.id);

    // 用户只能修改自己的密码，管理员可以修改所有用户的密码
    if (userId !== req.user!.id && !req.user!.role.includes('admin')) {
      return res.status(403).json({ success: false, message: '权限不足' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: '请提供旧密码和新密码' });
    }

    // 如果是管理员重置密码，不需要旧密码
    if (req.user!.role.includes('admin') && userId !== req.user!.id) {
      await userService.resetUserPassword(userId, newPassword);
      res.json({ success: true, message: '密码重置成功' });
    } else {
      await userService.changeUserPassword(userId, oldPassword, newPassword);
      res.json({ success: true, message: '密码修改成功' });
    }
  } catch (error: any) {
    console.error('修改密码错误:', error);
    res.status(400).json({ success: false, message: error.message || '密码修改失败' });
  }
});

/**
 * 切换用户状态
 * PUT /api/users/:id/toggle-status
 */
router.put('/:id/toggle-status', authenticate, authorize('system:user:update'), async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.params.id);

    // 不能切换自己的状态
    if (userId === req.user!.id) {
      return res.status(400).json({ success: false, message: '不能切换当前登录用户的状态' });
    }

    const user = await userService.toggleUserStatus(userId);

    res.json({
      success: true,
      message: '用户状态切换成功',
      data: {
        id: user.id,
        status: user.status
      }
    });
  } catch (error: any) {
    console.error('切换用户状态错误:', error);
    res.status(400).json({ success: false, message: error.message || '状态切换失败' });
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
    const roles = userService.getRoleOptions();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('获取角色列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取部门列表
 * GET /api/users/departments
 */
router.get('/options/departments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const departments = userService.getDepartmentOptions();
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('获取部门列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;