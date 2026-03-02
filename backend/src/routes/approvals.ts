/**
 * 审批管理路由
 * 企业项目全流程管理数据系统 - 审批管理模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Approval, ApprovalType, ApprovalStatus } from '../entities/Approval';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const approvalRepository = () => AppDataSource.getRepository(Approval);

/**
 * 获取审批列表
 * GET /api/approvals
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, type, status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = approvalRepository().createQueryBuilder('approval')
      .leftJoinAndSelect('approval.applicant', 'applicant')
      .leftJoinAndSelect('approval.approver', 'approver');

    if (type) {
      queryBuilder.andWhere('approval.type = :type', { type });
    }
    if (status) {
      queryBuilder.andWhere('approval.status = :status', { status });
    }

    const userRole = req.user!.role;
    const userId = req.user!.id;

    // 数据权限控制
    if (userRole === 'system_admin' || userRole === 'project_controller' || userRole === 'department_head') {
      // 管理员可以查看所有
    } else {
      // 其他人只能看到自己申请的或需要自己审批的
      queryBuilder.andWhere('(approval.applicantId = :userId OR approval.approverId = :userId)', { userId });
    }

    const [approvals, total] = await queryBuilder
      .orderBy('approval.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: approvals,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取审批列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取待审批列表
 * GET /api/approvals/pending
 */
router.get('/pending', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const approvals = await approvalRepository().find({
      where: { status: ApprovalStatus.PENDING },
      relations: ['applicant'],
      order: { createTime: 'ASC' }
    });

    res.json({
      success: true,
      data: approvals
    });
  } catch (error) {
    console.error('获取待审批列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取审批详情
 * GET /api/approvals/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const approval = await approvalRepository().findOne({
      where: { id: String(req.params.id) },
      relations: ['applicant', 'approver']
    });

    if (!approval) {
      return res.status(404).json({ success: false, message: '审批记录不存在' });
    }

    res.json({ success: true, data: approval });
  } catch (error) {
    console.error('获取审批详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 审批操作
 * POST /api/approvals/:id/process
 */
router.post('/:id/process', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { action, comment } = req.body; // action: approve/reject
    const approval = await approvalRepository().findOne({
      where: { id: String(req.params.id) },
      relations: ['applicant']
    });

    if (!approval) {
      return res.status(404).json({ success: false, message: '审批记录不存在' });
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      return res.status(400).json({ success: false, message: '该审批已处理' });
    }

    if (action === 'approve') {
      approval.status = ApprovalStatus.APPROVED;
    } else if (action === 'reject') {
      approval.status = ApprovalStatus.REJECTED;
    } else {
      return res.status(400).json({ success: false, message: '无效的操作' });
    }

    approval.approverId = req.user!.id;
    approval.approvalTime = new Date();
    approval.comment = comment;

    await approvalRepository().save(approval);

    res.json({
      success: true,
      message: action === 'approve' ? '审批通过' : '审批拒绝',
      data: approval
    });
  } catch (error) {
    console.error('审批操作错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 取消审批
 * POST /api/approvals/:id/cancel
 */
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const approval = await approvalRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!approval) {
      return res.status(404).json({ success: false, message: '审批记录不存在' });
    }

    // 只能取消自己申请的审批
    if (approval.applicantId !== req.user!.id) {
      return res.status(403).json({ success: false, message: '只能取消自己申请的审批' });
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      return res.status(400).json({ success: false, message: '只能取消待审批的记录' });
    }

    approval.status = ApprovalStatus.CANCELLED;
    await approvalRepository().save(approval);

    res.json({
      success: true,
      message: '审批已取消',
      data: approval
    });
  } catch (error) {
    console.error('取消审批错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取审批统计
 * GET /api/approvals/stats
 */
router.get('/stats/summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const total = await approvalRepository().count();
    const pendingCount = await approvalRepository().count({ where: { status: ApprovalStatus.PENDING } });
    const approvedCount = await approvalRepository().count({ where: { status: ApprovalStatus.APPROVED } });
    const rejectedCount = await approvalRepository().count({ where: { status: ApprovalStatus.REJECTED } });

    // 按类型统计
    const typeStats = await approvalRepository()
      .createQueryBuilder('approval')
      .select('approval.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('approval.type')
      .getRawMany();

    res.json({
      success: true,
      data: {
        total,
        pendingCount,
        approvedCount,
        rejectedCount,
        typeStats
      }
    });
  } catch (error) {
    console.error('获取审批统计错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;