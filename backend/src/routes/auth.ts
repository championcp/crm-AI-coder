/**
 * 认证路由
 * 企业项目全流程管理数据系统 - 用户认证与权限管理
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { generateToken, AuthRequest, authenticate } from '../middlewares/auth';

const router = Router();
const userRepository = () => AppDataSource.getRepository(User);

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    const user = await userRepository().findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    if (user.status === UserStatus.DISABLED) {
      return res.status(403).json({ success: false, message: '账户已被禁用' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 更新最后登录时间
    user.lastLoginTime = new Date();
    await userRepository().save(user);

    // 生成token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          realName: user.realName,
          role: user.role,
          department: user.department,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 用户注册（仅系统管理员可调用）
 * POST /api/auth/register
 */
router.post('/register', authenticate, async (req: AuthRequest, res: Response) => {
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

    // 创建用户
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
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userRepository().findOne({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        department: user.department,
        email: user.email,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 修改密码
 * POST /api/auth/change-password
 */
router.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: '请填写旧密码和新密码' });
    }

    const user = await userRepository().findOne({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: '原密码错误' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await userRepository().save(user);

    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;