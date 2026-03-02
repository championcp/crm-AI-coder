/**
 * 商机管理路由
 * 企业项目全流程管理数据系统 - 商机管理模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Opportunity, OpportunityLevel, OpportunitySource, OpportunityStage, OpportunityStatus, calculateOpportunityLevel } from '../entities/Opportunity';
import { Customer } from '../entities/Customer';
import { Approval, ApprovalType, ApprovalStatus } from '../entities/Approval';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const opportunityRepository = () => AppDataSource.getRepository(Opportunity);
const customerRepository = () => AppDataSource.getRepository(Customer);
const approvalRepository = () => AppDataSource.getRepository(Approval);

// 生成商机编号
function generateOpportunityCode(): string {
  const prefix = 'OP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/**
 * 获取商机列表
 * GET /api/opportunities
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, level, stage, status, customerId, ownerId } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = opportunityRepository().createQueryBuilder('opp')
      .leftJoinAndSelect('opp.customer', 'customer')
      .leftJoinAndSelect('opp.owner', 'owner')
      .leftJoinAndSelect('opp.presales', 'presales');

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere('(opp.opportunityName LIKE :keyword OR customer.customerName LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    // 筛选条件
    if (level) {
      queryBuilder.andWhere('opp.level = :level', { level });
    }
    if (stage) {
      queryBuilder.andWhere('opp.stage = :stage', { stage });
    }
    if (status) {
      queryBuilder.andWhere('opp.status = :status', { status });
    }
    if (customerId) {
      queryBuilder.andWhere('opp.customerId = :customerId', { customerId });
    }
    if (ownerId) {
      queryBuilder.andWhere('opp.ownerId = :ownerId', { ownerId });
    }

    const [opportunities, total] = await queryBuilder
      .orderBy('opp.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: opportunities,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取商机列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取商机详情
 * GET /api/opportunities/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await opportunityRepository().findOne({
      where: { id: req.params.id },
      relations: ['customer', 'owner', 'presales']
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: '商机不存在' });
    }

    res.json({ success: true, data: opportunity });
  } catch (error) {
    console.error('获取商机详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建商机
 * POST /api/opportunities
 */
router.post('/', authenticate, authorize('opportunity:create'), async (req: AuthRequest, res: Response) => {
  try {
    const { opportunityName, customerId, amount, source, stage, expectedSignDate, winRate, products, competitors, description, ownerId, presalesId } = req.body;

    if (!opportunityName || !customerId || !amount || !source || !stage) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    // 自动计算商机级别
    const autoLevel = calculateOpportunityLevel(Number(amount));

    const opportunity = opportunityRepository().create({
      opportunityCode: generateOpportunityCode(),
      opportunityName,
      customerId,
      amount,
      level: autoLevel,
      source,
      stage: stage || OpportunityStage.REQUIREMENT,
      expectedSignDate,
      winRate,
      products,
      competitors,
      description,
      ownerId: ownerId || req.user!.id,
      presalesId,
      status: OpportunityStatus.ACTIVE,
      lastFollowTime: new Date()
    });

    await opportunityRepository().save(opportunity);

    res.status(201).json({
      success: true,
      message: '商机创建成功',
      data: opportunity
    });
  } catch (error) {
    console.error('创建商机错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 更新商机
 * PUT /api/opportunities/:id
 */
router.put('/:id', authenticate, authorize('opportunity:update'), async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await opportunityRepository().findOne({
      where: { id: req.params.id }
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: '商机不存在' });
    }

    const { opportunityName, customerId, amount, source, stage, expectedSignDate, winRate, products, competitors, description, ownerId, presalesId, status, level } = req.body;

    // 如果金额变化，重新计算级别
    let newLevel = level;
    if (amount && Number(amount) !== Number(opportunity.amount)) {
      newLevel = calculateOpportunityLevel(Number(amount));
    }

    Object.assign(opportunity, {
      opportunityName,
      customerId,
      amount,
      level: newLevel,
      source,
      stage,
      expectedSignDate,
      winRate,
      products,
      competitors,
      description,
      ownerId,
      presalesId,
      status,
      lastFollowTime: new Date()
    });

    await opportunityRepository().save(opportunity);

    res.json({
      success: true,
      message: '商机更新成功',
      data: opportunity
    });
  } catch (error) {
    console.error('更新商机错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 商机状态变更
 * POST /api/opportunities/:id/change-stage
 */
router.post('/:id/change-stage', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { stage } = req.body;
    const opportunity = await opportunityRepository().findOne({
      where: { id: req.params.id }
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: '商机不存在' });
    }

    opportunity.stage = stage;
    opportunity.lastFollowTime = new Date();
    await opportunityRepository().save(opportunity);

    res.json({
      success: true,
      message: '商机阶段更新成功',
      data: opportunity
    });
  } catch (error) {
    console.error('商机阶段变更错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 商机变更审批
 * POST /api/opportunities/:id/change-approval
 */
router.post('/:id/change-approval', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { changeType, beforeContent, afterContent, reason } = req.body;
    const opportunity = await opportunityRepository().findOne({
      where: { id: req.params.id },
      relations: ['customer']
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: '商机不存在' });
    }

    // 创建审批记录
    const approval = approvalRepository().create({
      approvalCode: `AP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      type: ApprovalType.OPPORTUNITY_CHANGE,
      title: `商机变更审批 - ${opportunity.opportunityName}`,
      content: JSON.stringify({
        opportunityId: opportunity.id,
        changeType,
        beforeContent,
        afterContent,
        reason
      }),
      applicantId: req.user!.id,
      relatedId: opportunity.id,
      relatedType: 'opportunity',
      status: ApprovalStatus.PENDING
    });

    await approvalRepository().save(approval);

    res.status(201).json({
      success: true,
      message: '商机变更申请已提交',
      data: approval
    });
  } catch (error) {
    console.error('商机变更申请错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 删除商机
 * DELETE /api/opportunities/:id
 */
router.delete('/:id', authenticate, authorize('opportunity:delete'), async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await opportunityRepository().findOne({
      where: { id: req.params.id }
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: '商机不存在' });
    }

    await opportunityRepository().remove(opportunity);

    res.json({ success: true, message: '商机删除成功' });
  } catch (error) {
    console.error('删除商机错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取商机统计
 * GET /api/opportunities/stats
 */
router.get('/stats/summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const total = await opportunityRepository().count();
    const activeCount = await opportunityRepository().count({ where: { status: OpportunityStatus.ACTIVE } });
    const wonCount = await opportunityRepository().count({ where: { status: OpportunityStatus.WON } });
    const lostCount = await opportunityRepository().count({ where: { status: OpportunityStatus.LOST } });

    // 按级别统计
    const levelStats = await opportunityRepository()
      .createQueryBuilder('opp')
      .select('opp.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(opp.amount)', 'totalAmount')
      .groupBy('opp.level')
      .getRawMany();

    // 按阶段统计
    const stageStats = await opportunityRepository()
      .createQueryBuilder('opp')
      .select('opp.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(opp.amount)', 'totalAmount')
      .groupBy('opp.stage')
      .getRawMany();

    res.json({
      success: true,
      data: {
        total,
        activeCount,
        wonCount,
        lostCount,
        levelStats,
        stageStats
      }
    });
  } catch (error) {
    console.error('获取商机统计错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;