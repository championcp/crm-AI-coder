/**
 * 客户管理路由
 * 企业项目全流程管理数据系统 - 客户管理模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Customer, CustomerLevel, CustomerScale, CustomerIndustry, CustomerStatus } from '../entities/Customer';
import { User } from '../entities/User';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const customerRepository = () => AppDataSource.getRepository(Customer);
const userRepository = () => AppDataSource.getRepository(User);

// 生成客户编号
function generateCustomerCode(): string {
  const prefix = 'C';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/**
 * 获取客户列表
 * GET /api/customers
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, level, status, industry } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = customerRepository().createQueryBuilder('customer')
      .leftJoinAndSelect('customer.owner', 'owner')
      .leftJoinAndSelect('customer.creator', 'creator');

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere('(customer.customerName LIKE :keyword OR customer.shortName LIKE :keyword OR customer.phone LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    // 筛选条件
    if (level) {
      queryBuilder.andWhere('customer.level = :level', { level });
    }
    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }
    if (industry) {
      queryBuilder.andWhere('customer.industry = :industry', { industry });
    }

    // 数据权限控制
    const userRole = req.user!.role;
    if (userRole !== 'system_admin' && userRole !== 'department_head' && userRole !== 'senior_management') {
      // 销售部只能看到自己负责的客户
      if (userRole === 'sales_manager' || userRole === 'sales_controller') {
        queryBuilder.andWhere('customer.ownerId = :ownerId', { ownerId: req.user!.id });
      }
    }

    const [customers, total] = await queryBuilder
      .orderBy('customer.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: customers,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取客户列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取客户详情
 * GET /api/customers/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerRepository().findOne({
      where: { id: String(req.params.id) },
      relations: ['owner', 'creator']
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('获取客户详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建客户
 * POST /api/customers
 */
router.post('/', authenticate, authorize('customer:create'), async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, shortName, industry, scale, phone, address, level, ownerId, description, status } = req.body;

    if (!customerName || !industry || !scale || !phone || !level) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    const customer = customerRepository().create({
      customerCode: generateCustomerCode(),
      customerName,
      shortName,
      industry,
      scale,
      phone,
      address,
      level,
      ownerId: ownerId || req.user!.id,
      status: status || CustomerStatus.POTENTIAL,
      description,
      creatorId: req.user!.id
    });

    await customerRepository().save(customer);

    res.status(201).json({
      success: true,
      message: '客户创建成功',
      data: customer
    });
  } catch (error) {
    console.error('创建客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 更新客户
 * PUT /api/customers/:id
 */
router.put('/:id', authenticate, authorize('customer:update'), async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    const { customerName, shortName, industry, scale, phone, address, level, ownerId, status, description } = req.body;

    Object.assign(customer, {
      customerName,
      shortName,
      industry,
      scale,
      phone,
      address,
      level,
      ownerId,
      status,
      description
    });

    await customerRepository().save(customer);

    res.json({
      success: true,
      message: '客户更新成功',
      data: customer
    });
  } catch (error) {
    console.error('更新客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 删除客户
 * DELETE /api/customers/:id
 */
router.delete('/:id', authenticate, authorize('customer:delete'), async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    await customerRepository().remove(customer);

    res.json({ success: true, message: '客户删除成功' });
  } catch (error) {
    console.error('删除客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取客户选项列表（用于下拉选择）
 * GET /api/customers/options
 */
router.get('/options/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const customers = await customerRepository()
      .createQueryBuilder('customer')
      .select(['customer.id', 'customer.customerCode', 'customer.customerName', 'customer.shortName'])
      .where('customer.status = :status', { status: CustomerStatus.FORMAL })
      .orderBy('customer.customerName', 'ASC')
      .getMany();

    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('获取客户选项列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;