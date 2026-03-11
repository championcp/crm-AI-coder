/**
 * 角色管理路由
 * 企业项目全流程管理数据系统 - 角色权限管理
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const roleRepository = () => AppDataSource.getRepository(Role);

/**
 * 获取角色列表
 * GET /api/roles
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = roleRepository().createQueryBuilder('role');

    if (keyword) {
      queryBuilder.andWhere('(role.roleCode LIKE :keyword OR role.roleName LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    if (status) {
      queryBuilder.andWhere('role.status = :status', { status });
    }

    const [roles, total] = await queryBuilder
      .orderBy('role.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: roles,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取角色列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取角色详情
 * GET /api/roles/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const role = await roleRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!role) {
      return res.status(404).json({ success: false, message: '角色不存在' });
    }

    res.json({ success: true, data: role });
  } catch (error) {
    console.error('获取角色详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建角色（系统管理员）
 * POST /api/roles
 */
router.post('/', authenticate, authorize('system:role:create'), async (req: AuthRequest, res: Response) => {
  try {
    const { roleCode, roleName, description, permissions } = req.body;

    if (!roleCode || !roleName) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    // 检查角色编码是否已存在
    const existingRole = await roleRepository().findOne({ where: { roleCode } });
    if (existingRole) {
      return res.status(400).json({ success: false, message: '角色编码已存在' });
    }

    const role = roleRepository().create({
      roleCode,
      roleName,
      description: description || '',
      permissions: permissions || [],
      status: 'active'
    });

    await roleRepository().save(role);

    res.status(201).json({
      success: true,
      message: '角色创建成功',
      data: role
    });
  } catch (error) {
    console.error('创建角色错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 更新角色
 * PUT /api/roles/:id
 */
router.put('/:id', authenticate, authorize('system:role:update'), async (req: AuthRequest, res: Response) => {
  try {
    const role = await roleRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!role) {
      return res.status(404).json({ success: false, message: '角色不存在' });
    }

    const { roleName, description, permissions, status } = req.body;

    Object.assign(role, {
      roleName,
      description,
      permissions,
      status
    });

    await roleRepository().save(role);

    res.json({
      success: true,
      message: '角色更新成功',
      data: role
    });
  } catch (error) {
    console.error('更新角色错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 删除角色
 * DELETE /api/roles/:id
 */
router.delete('/:id', authenticate, authorize('system:role:delete'), async (req: AuthRequest, res: Response) => {
  try {
    const role = await roleRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!role) {
      return res.status(404).json({ success: false, message: '角色不存在' });
    }

    await roleRepository().remove(role);

    res.json({ success: true, message: '角色删除成功' });
  } catch (error) {
    console.error('删除角色错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取所有权限列表
 * GET /api/roles/permissions
 */
router.get('/permissions/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // 定义系统所有权限
    const permissions = [
      // 客户管理
      { module: 'customer', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      // 商机管理
      { module: 'opportunity', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      // 合同管理
      { module: 'contract', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      // 项目管理
      { module: 'project', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      // 审批管理
      { module: 'approval', actions: ['view', 'approve', 'reject'] },
      // 财务管理
      { module: 'finance', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      // 系统管理
      { module: 'system', actions: ['user', 'role', 'config', 'log', 'backup'] }
    ];

    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('获取权限列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;