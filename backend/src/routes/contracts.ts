/**
 * 合同管理路由
 * 企业项目全流程管理数据系统 - 合同管理模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Contract, ContractType, PaymentMethod, ContractStatus, PaymentSchedule } from '../entities/Contract';
import { Opportunity } from '../entities/Opportunity';
import { Approval, ApprovalType, ApprovalStatus } from '../entities/Approval';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const contractRepository = () => AppDataSource.getRepository(Contract);
const paymentScheduleRepository = () => AppDataSource.getRepository(PaymentSchedule);
const approvalRepository = () => AppDataSource.getRepository(Approval);

// 生成合同编号
function generateContractCode(): string {
  const prefix = 'CT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/**
 * 获取合同列表
 * GET /api/contracts
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, contractType, status, customerId } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = contractRepository().createQueryBuilder('contract')
      .leftJoinAndSelect('contract.customer', 'customer')
      .leftJoinAndSelect('contract.owner', 'owner')
      .leftJoinAndSelect('contract.opportunity', 'opportunity');

    if (keyword) {
      queryBuilder.andWhere('(contract.contractName LIKE :keyword OR contract.contractCode LIKE :keyword OR customer.customerName LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    if (contractType) {
      queryBuilder.andWhere('contract.contractType = :contractType', { contractType });
    }
    if (status) {
      queryBuilder.andWhere('contract.status = :status', { status });
    }
    if (customerId) {
      queryBuilder.andWhere('contract.customerId = :customerId', { customerId });
    }

    const [contracts, total] = await queryBuilder
      .orderBy('contract.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: contracts,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取合同列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取合同详情
 * GET /api/contracts/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const contract = await contractRepository().findOne({
      where: { id: String(req.params.id) },
      relations: ['customer', 'owner', 'creator', 'opportunity']
    });

    if (!contract) {
      return res.status(404).json({ success: false, message: '合同不存在' });
    }

    // 获取付款计划
    const paymentSchedules = await paymentScheduleRepository().find({
      where: { contractId: contract.id },
      order: { period: 'ASC' }
    });

    res.json({
      success: true,
      data: { ...contract, paymentSchedules }
    });
  } catch (error) {
    console.error('获取合同详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建合同
 * POST /api/contracts
 */
router.post('/', authenticate, authorize('contract:create'), async (req: AuthRequest, res: Response) => {
  try {
    const { contractName, contractType, customerId, opportunityId, amount, signDate, startDate, endDate, paymentMethod, paymentTerms, description, paymentSchedules } = req.body;

    if (!contractName || !contractType || !customerId || !amount || !signDate || !startDate || !endDate || !paymentMethod) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    const contract = contractRepository().create({
      contractCode: generateContractCode(),
      contractName,
      contractType,
      customerId,
      opportunityId,
      amount: String(amount),
      signDate: new Date(signDate),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      paymentMethod,
      paymentTerms,
      status: ContractStatus.DRAFT,
      description,
      ownerId: req.user!.id,
      creatorId: req.user!.id
    });

    const savedContract = await contractRepository().save(contract);

    // 如果有分期付款计划，保存
    if (paymentSchedules && paymentSchedules.length > 0) {
      for (const schedule of paymentSchedules) {
        const paymentSchedule = paymentScheduleRepository().create({
          contractId: savedContract.id,
          period: schedule.period,
          planDate: schedule.planDate,
          planAmount: String(schedule.planAmount),
          terms: schedule.terms,
          status: 'unpaid'
        });
        await paymentScheduleRepository().save(paymentSchedule);
      }
    }

    res.status(201).json({
      success: true,
      message: '合同创建成功',
      data: savedContract
    });
  } catch (error) {
    console.error('创建合同错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 更新合同
 * PUT /api/contracts/:id
 */
router.put('/:id', authenticate, authorize('contract:update'), async (req: AuthRequest, res: Response) => {
  try {
    const contract = await contractRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!contract) {
      return res.status(404).json({ success: false, message: '合同不存在' });
    }

    const { contractName, contractType, customerId, opportunityId, amount, signDate, startDate, endDate, paymentMethod, paymentTerms, status, description } = req.body;

    Object.assign(contract, {
      contractName,
      contractType,
      customerId,
      opportunityId,
      amount: String(amount),
      signDate: new Date(signDate),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      paymentMethod,
      paymentTerms,
      status,
      description
    });

    await contractRepository().save(contract);

    res.json({
      success: true,
      message: '合同更新成功',
      data: contract
    });
  } catch (error) {
    console.error('更新合同错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 合同审批申请
 * POST /api/contracts/:id/approve
 */
router.post('/:id/approve', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const contract = await contractRepository().findOne({
      where: { id: String(req.params.id) },
      relations: ['customer']
    });

    if (!contract) {
      return res.status(404).json({ success: false, message: '合同不存在' });
    }

    // 创建审批记录
    const approval = approvalRepository().create({
      approvalCode: `AP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      type: ApprovalType.CONTRACT_APPROVAL,
      title: `合同审批 - ${contract.contractName}`,
      content: JSON.stringify({
        contractId: contract.id,
        contractCode: contract.contractCode,
        contractName: contract.contractName,
        customerName: contract.customer?.customerName,
        amount: contract.amount,
        signDate: contract.signDate,
        startDate: contract.startDate,
        endDate: contract.endDate
      }),
      applicantId: req.user!.id,
      relatedId: contract.id,
      relatedType: 'contract',
      status: ApprovalStatus.PENDING
    });

    await approvalRepository().save(approval);

    // 更新合同状态
    contract.status = ContractStatus.PENDING_APPROVAL;
    await contractRepository().save(contract);

    res.status(201).json({
      success: true,
      message: '合同审批申请已提交',
      data: approval
    });
  } catch (error) {
    console.error('合同审批申请错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 删除合同
 * DELETE /api/contracts/:id
 */
router.delete('/:id', authenticate, authorize('contract:delete'), async (req: AuthRequest, res: Response) => {
  try {
    const contract = await contractRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!contract) {
      return res.status(404).json({ success: false, message: '合同不存在' });
    }

    // 删除关联的付款计划
    await paymentScheduleRepository().delete({ contractId: contract.id });
    await contractRepository().remove(contract);

    res.json({ success: true, message: '合同删除成功' });
  } catch (error) {
    console.error('删除合同错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;