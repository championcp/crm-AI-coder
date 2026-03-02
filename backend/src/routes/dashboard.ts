/**
 * 仪表盘路由
 * 企业项目全流程管理数据系统 - 仪表盘模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Customer, CustomerStatus } from '../entities/Customer';
import { Opportunity, OpportunityStatus, OpportunityStage } from '../entities/Opportunity';
import { Contract, ContractStatus } from '../entities/Contract';
import { Project, ProjectStatus } from '../entities/Project';
import { Approval, ApprovalStatus } from '../entities/Approval';
import { AuthRequest, authenticate } from '../middlewares/auth';

const router = Router();

const customerRepository = () => AppDataSource.getRepository(Customer);
const opportunityRepository = () => AppDataSource.getRepository(Opportunity);
const contractRepository = () => AppDataSource.getRepository(Contract);
const projectRepository = () => AppDataSource.getRepository(Project);
const approvalRepository = () => AppDataSource.getRepository(Approval);

/**
 * 获取仪表盘统计数据
 * GET /api/dashboard/stats
 */
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // 客户统计
    const totalCustomers = await customerRepository().count();
    const formalCustomers = await customerRepository().count({ where: { status: CustomerStatus.FORMAL } });

    // 商机统计
    const totalOpportunities = await opportunityRepository().count();
    const activeOpportunities = await opportunityRepository().count({ where: { status: OpportunityStatus.ACTIVE } });
    const wonOpportunities = await opportunityRepository().count({ where: { status: OpportunityStatus.WON } });

    // 商机金额统计
    const opportunityAmounts = await opportunityRepository()
      .createQueryBuilder('opp')
      .select('SUM(opp.amount)', 'total')
      .where('opp.status = :status', { status: OpportunityStatus.ACTIVE })
      .getRawOne();

    // 合同统计
    const totalContracts = await contractRepository().count();
    const executingContracts = await contractRepository().count({ where: { status: ContractStatus.EXECUTING } });

    // 合同金额统计
    const contractAmounts = await contractRepository()
      .createQueryBuilder('contract')
      .select('SUM(contract.amount)', 'total')
      .where('contract.status IN (:...statuses)', { statuses: [ContractStatus.EXECUTING, ContractStatus.COMPLETED] })
      .getRawOne();

    // 项目统计
    const totalProjects = await projectRepository().count();
    const executingProjects = await projectRepository().count({ where: { status: ProjectStatus.EXECUTING } });
    const completedProjects = await projectRepository().count({ where: { status: ProjectStatus.COMPLETED } });

    // 审批统计
    const pendingApprovals = await approvalRepository().count({ where: { status: ApprovalStatus.PENDING } });

    res.json({
      success: true,
      data: {
        customers: {
          total: totalCustomers,
          formal: formalCustomers
        },
        opportunities: {
          total: totalOpportunities,
          active: activeOpportunities,
          won: wonOpportunities,
          amount: Number(opportunityAmounts?.total || 0)
        },
        contracts: {
          total: totalContracts,
          executing: executingContracts,
          amount: Number(contractAmounts?.total || 0)
        },
        projects: {
          total: totalProjects,
          executing: executingProjects,
          completed: completedProjects
        },
        approvals: {
          pending: pendingApprovals
        }
      }
    });
  } catch (error) {
    console.error('获取仪表盘统计错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取销售漏斗数据
 * GET /api/dashboard/sales-funnel
 */
router.get('/sales-funnel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const funnelData = await opportunityRepository()
      .createQueryBuilder('opp')
      .select('opp.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(opp.amount)', 'amount')
      .where('opp.status = :status', { status: OpportunityStatus.ACTIVE })
      .groupBy('opp.stage')
      .orderBy('opp.stage', 'ASC')
      .getRawMany();

    res.json({
      success: true,
      data: funnelData
    });
  } catch (error) {
    console.error('获取销售漏斗错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取项目状态分布
 * GET /api/dashboard/project-status
 */
router.get('/project-status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const statusData = await projectRepository()
      .createQueryBuilder('project')
      .select('project.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('project.status')
      .getRawMany();

    res.json({
      success: true,
      data: statusData
    });
  } catch (error) {
    console.error('获取项目状态分布错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取近期活动
 * GET /api/dashboard/recent-activities
 */
router.get('/recent-activities', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // 最近创建的商机
    const recentOpportunities = await opportunityRepository().find({
      order: { createTime: 'DESC' },
      take: limit,
      relations: ['customer', 'owner']
    });

    // 最近创建的项目
    const recentProjects = await projectRepository().find({
      order: { createTime: 'DESC' },
      take: limit,
      relations: ['manager']
    });

    // 最近审批
    const recentApprovals = await approvalRepository().find({
      order: { createTime: 'DESC' },
      take: limit,
      relations: ['applicant']
    });

    res.json({
      success: true,
      data: {
        opportunities: recentOpportunities,
        projects: recentProjects,
        approvals: recentApprovals
      }
    });
  } catch (error) {
    console.error('获取近期活动错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取待办事项
 * GET /api/dashboard/todos
 */
router.get('/todos', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // 待审批的审批
    const pendingApprovals = await approvalRepository().find({
      where: { status: ApprovalStatus.PENDING },
      relations: ['applicant'],
      order: { createTime: 'ASC' },
      take: 5
    });

    // 我负责的正在进行的项目
    const myProjects = await projectRepository().find({
      where: { status: ProjectStatus.EXECUTING },
      order: { planEndDate: 'ASC' },
      take: 5
    });

    // 我负责的正在进行中的商机
    const myOpportunities = await opportunityRepository().find({
      where: { status: OpportunityStatus.ACTIVE },
      order: { lastFollowTime: 'ASC' },
      take: 5
    });

    res.json({
      success: true,
      data: {
        pendingApprovals,
        myProjects,
        myOpportunities
      }
    });
  } catch (error) {
    console.error('获取待办事项错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;