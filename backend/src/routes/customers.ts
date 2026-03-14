/**
 * 客户管理路由
 * 企业项目全流程管理数据系统 - 客户管理模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Customer, CustomerType, CustomerScale, CustomerIndustry, CustomerStatus, CustomerSource } from '../entities/Customer';
import { FollowUp, FollowUpType } from '../entities/FollowUp';
import { User } from '../entities/User';
import { AuthRequest, authenticate } from '../middlewares/auth';

const router = Router();

/**
 * 获取客户仓库
 */
const customerRepository = () => AppDataSource.getRepository(Customer);

/**
 * 生成客户编码
 * 格式: CUST-YYYYMMDD-序号
 */
async function generateCustomerCode(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

  // 查询当天最大的客户编码
  const maxCode = await customerRepository()
    .createQueryBuilder('customer')
    .where('customer.code LIKE :prefix', { prefix: `CUST-${dateStr}-%` })
    .orderBy('customer.code', 'DESC')
    .getOne();

  let sequence = 1;
  if (maxCode) {
    const parts = maxCode.code.split('-');
    const lastSequence = parseInt(parts[2], 10);
    sequence = lastSequence + 1;
  }

  // 序号补零，格式为4位
  const sequenceStr = sequence.toString().padStart(4, '0');
  return `CUST-${dateStr}-${sequenceStr}`;
}

/**
 * 获取跟进记录仓库
 */
const followUpRepository = () => AppDataSource.getRepository(FollowUp);

/**
 * 获取用户仓库
 */
const userRepository = () => AppDataSource.getRepository(User);

/**
 * 验证客户数据
 * @param data 客户数据
 * @returns 验证结果
 */
function validateCustomerData(data: any): { valid: boolean; message?: string } {
  const { name, industry, scale, type, status, source } = data;

  // 验证必填字段
  if (!name || name.trim() === '') {
    return { valid: false, message: '客户名称不能为空' };
  }

  if (!industry) {
    return { valid: false, message: '所属行业不能为空' };
  }

  if (!scale) {
    return { valid: false, message: '客户规模不能为空' };
  }

  // 验证枚举值
  if (type && !Object.values(CustomerType).includes(type)) {
    return { valid: false, message: '无效的客户类型' };
  }

  if (!Object.values(CustomerScale).includes(scale)) {
    return { valid: false, message: '无效的客户规模' };
  }

  if (!Object.values(CustomerIndustry).includes(industry)) {
    return { valid: false, message: '无效的行业类型' };
  }

  if (status && !Object.values(CustomerStatus).includes(status)) {
    return { valid: false, message: '无效的客户状态' };
  }

  if (source && !Object.values(CustomerSource).includes(source)) {
    return { valid: false, message: '无效的客户来源' };
  }

  return { valid: true };
}

/**
 * 验证跟进记录数据
 * @param data 跟进记录数据
 * @returns 验证结果
 */
function validateFollowUpData(data: any): { valid: boolean; message?: string } {
  const { content, type, followUpTime } = data;

  // 验证必填字段
  if (!content || content.trim() === '') {
    return { valid: false, message: '跟进内容不能为空' };
  }

  // 验证跟进类型
  if (type && !Object.values(FollowUpType).includes(type)) {
    return { valid: false, message: '无效的跟进类型' };
  }

  // 验证跟进时间
  if (followUpTime) {
    const date = new Date(followUpTime);
    if (isNaN(date.getTime())) {
      return { valid: false, message: '无效的跟进时间格式' };
    }
  }

  return { valid: true };
}

/**
 * 获取客户列表
 * GET /api/customers
 * 支持分页、按名称搜索、按类型筛选、按状态筛选
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = '1',
      pageSize = '10',
      name,
      type,
      status,
      industry,
      scale
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const sizeNum = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)));
    const skip = (pageNum - 1) * sizeNum;

    // 构建查询
    const queryBuilder = customerRepository()
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.owner', 'owner');

    // 按名称搜索
    if (name && String(name).trim() !== '') {
      queryBuilder.andWhere('customer.name LIKE :name', {
        name: `%${String(name).trim()}%`
      });
    }

    // 按类型筛选
    if (type && Object.values(CustomerType).includes(type as CustomerType)) {
      queryBuilder.andWhere('customer.type = :type', { type });
    }

    // 按状态筛选
    if (status && Object.values(CustomerStatus).includes(status as CustomerStatus)) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }

    // 按行业筛选
    if (industry && Object.values(CustomerIndustry).includes(industry as CustomerIndustry)) {
      queryBuilder.andWhere('customer.industry = :industry', { industry });
    }

    // 按规模筛选
    if (scale && Object.values(CustomerScale).includes(scale as CustomerScale)) {
      queryBuilder.andWhere('customer.scale = :scale', { scale });
    }

    // 获取总数和列表
    const [customers, total] = await queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .skip(skip)
      .take(sizeNum)
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: customers,
        total,
        page: pageNum,
        pageSize: sizeNum
      }
    });
  } catch (error) {
    console.error('获取客户列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，获取客户列表失败' });
  }
});

/**
 * 获取客户详情（包含跟进记录）
 * GET /api/customers/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    // 查询客户详情
    const customer = await customerRepository().findOne({
      where: { id },
      relations: ['owner']
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    // 查询跟进记录
    const followUps = await followUpRepository()
      .createQueryBuilder('followUp')
      .leftJoinAndSelect('followUp.creator', 'creator')
      .where('followUp.customerId = :customerId', { customerId: id })
      .orderBy('followUp.followUpTime', 'DESC')
      .getMany();

    res.json({
      success: true,
      data: {
        ...customer,
        followUps
      }
    });
  } catch (error) {
    console.error('获取客户详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，获取客户详情失败' });
  }
});

/**
 * 创建客户
 * POST /api/customers
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      type,
      industry,
      scale,
      contactName,
      contactPhone,
      contactEmail,
      address,
      status,
      source,
      remark,
      ownerId
    } = req.body;

    // 验证数据
    const validation = validateCustomerData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    // 验证负责人是否存在
    let finalOwnerId = ownerId;
    if (finalOwnerId) {
      const owner = await userRepository().findOne({ where: { id: finalOwnerId } });
      if (!owner) {
        return res.status(400).json({ success: false, message: '指定的负责人不存在' });
      }
    } else {
      // 如果没有指定负责人，默认为当前用户
      finalOwnerId = req.user!.id;
    }

    // 自动生成客户编码
    const customerCode = await generateCustomerCode();

    // 创建客户
    const customer = customerRepository().create({
      code: customerCode,
      name: name.trim(),
      type: type || CustomerType.ENTERPRISE,
      industry,
      scale,
      contactName: contactName || null,
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      address: address || null,
      status: status || CustomerStatus.POTENTIAL,
      source: source || CustomerSource.OTHER,
      remark: remark || null,
      ownerId: finalOwnerId
    });

    await customerRepository().save(customer);

    // 返回创建的客户（包含负责人信息）
    const savedCustomer = await customerRepository().findOne({
      where: { id: customer.id },
      relations: ['owner']
    });

    res.status(201).json({
      success: true,
      message: '客户创建成功',
      data: savedCustomer
    });
  } catch (error) {
    console.error('创建客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，创建客户失败' });
  }
});

/**
 * 更新客户
 * PUT /api/customers/:id
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const {
      name,
      type,
      industry,
      scale,
      contactName,
      contactPhone,
      contactEmail,
      address,
      status,
      source,
      remark,
      ownerId
    } = req.body;

    // 查询客户是否存在
    const customer = await customerRepository().findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    // 验证数据
    const validation = validateCustomerData({
      name: name || customer.name,
      industry: industry || customer.industry,
      scale: scale || customer.scale,
      type: type || customer.type,
      status: status || customer.status,
      source: source || customer.source
    });
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    // 如果更新了负责人，验证负责人是否存在
    if (ownerId && ownerId !== customer.ownerId) {
      const owner = await userRepository().findOne({ where: { id: ownerId } });
      if (!owner) {
        return res.status(400).json({ success: false, message: '指定的负责人不存在' });
      }
    }

    // 更新客户数据
    customer.name = name !== undefined ? name.trim() : customer.name;
    customer.type = type !== undefined ? type : customer.type;
    customer.industry = industry !== undefined ? industry : customer.industry;
    customer.scale = scale !== undefined ? scale : customer.scale;
    customer.contactName = contactName !== undefined ? contactName : customer.contactName;
    customer.contactPhone = contactPhone !== undefined ? contactPhone : customer.contactPhone;
    customer.contactEmail = contactEmail !== undefined ? contactEmail : customer.contactEmail;
    customer.address = address !== undefined ? address : customer.address;
    customer.status = status !== undefined ? status : customer.status;
    customer.source = source !== undefined ? source : customer.source;
    customer.remark = remark !== undefined ? remark : customer.remark;
    customer.ownerId = ownerId !== undefined ? ownerId : customer.ownerId;

    await customerRepository().save(customer);

    // 返回更新后的客户（包含负责人信息）
    const updatedCustomer = await customerRepository().findOne({
      where: { id: customer.id },
      relations: ['owner']
    });

    res.json({
      success: true,
      message: '客户更新成功',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('更新客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，更新客户失败' });
  }
});

/**
 * 删除客户
 * DELETE /api/customers/:id
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    // 查询客户是否存在
    const customer = await customerRepository().findOne({
      where: { id },
      relations: ['followUps']
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    // 删除客户（关联的跟进记录会通过级联删除自动删除）
    await customerRepository().remove(customer);

    res.json({
      success: true,
      message: '客户删除成功'
    });
  } catch (error) {
    console.error('删除客户错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，删除客户失败' });
  }
});

/**
 * 获取客户的跟进记录列表
 * GET /api/customers/:id/followups
 */
router.get('/:id/followups', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { page = '1', pageSize = '10' } = req.query;

    // 验证客户是否存在
    const customer = await customerRepository().findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const sizeNum = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)));
    const skip = (pageNum - 1) * sizeNum;

    // 查询跟进记录
    const [followUps, total] = await followUpRepository()
      .createQueryBuilder('followUp')
      .leftJoinAndSelect('followUp.creator', 'creator')
      .where('followUp.customerId = :customerId', { customerId: id })
      .orderBy('followUp.followUpTime', 'DESC')
      .skip(skip)
      .take(sizeNum)
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: followUps,
        total,
        page: pageNum,
        pageSize: sizeNum
      }
    });
  } catch (error) {
    console.error('获取跟进记录列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，获取跟进记录失败' });
  }
});

/**
 * 添加跟进记录
 * POST /api/customers/:id/followups
 */
router.post('/:id/followups', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { content, type, followUpTime, nextFollowUpTime } = req.body;

    // 验证客户是否存在
    const customer = await customerRepository().findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    // 验证数据
    const validation = validateFollowUpData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    // 创建跟进记录
    const followUp = followUpRepository().create({
      customerId: id,
      content: content.trim(),
      type: type || FollowUpType.PHONE,
      followUpTime: followUpTime ? new Date(followUpTime) : new Date(),
      nextFollowUpTime: nextFollowUpTime ? new Date(nextFollowUpTime) : undefined,
      createdBy: req.user!.id
    });

    await followUpRepository().save(followUp);

    // 返回创建的跟进记录（包含创建人信息）
    const savedFollowUp = await followUpRepository().findOne({
      where: { id: followUp.id },
      relations: ['creator']
    });

    res.status(201).json({
      success: true,
      message: '跟进记录添加成功',
      data: savedFollowUp
    });
  } catch (error) {
    console.error('添加跟进记录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，添加跟进记录失败' });
  }
});

/**
 * 获取客户选项列表（用于下拉选择）
 * GET /api/customers/options/list
 * 返回客户id和name列表
 */
router.get('/options/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // 返回客户列表（仅id和name），用于下拉选择
    const customers = await customerRepository()
      .createQueryBuilder('customer')
      .select(['customer.id', 'customer.name'])
      .orderBy('customer.name', 'ASC')
      .getMany();

    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('获取客户选项列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;