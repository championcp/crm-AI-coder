/**
 * 项目管理路由
 * 企业项目全流程管理数据系统 - 项目管理模块
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Project, ProjectType, ProjectLevel, ProjectStatus, ProjectMilestone, ProjectMember } from '../entities/Project';
import { Contract } from '../entities/Contract';
import { Approval, ApprovalType, ApprovalStatus } from '../entities/Approval';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const projectRepository = () => AppDataSource.getRepository(Project);
const milestoneRepository = () => AppDataSource.getRepository(ProjectMilestone);
const memberRepository = () => AppDataSource.getRepository(ProjectMember);
const approvalRepository = () => AppDataSource.getRepository(Approval);

// 生成项目编号
function generateProjectCode(): string {
  const prefix = 'PRJ';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;

}
function generateMilestoneCode(): string {
  const prefix = 'MS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

/**
 * 获取项目列表
 * GET /api/projects
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, projectType, status, level, managerId } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = projectRepository().createQueryBuilder('project')
      .leftJoinAndSelect('project.contract', 'contract')
      .leftJoinAndSelect('project.manager', 'manager');

    if (keyword) {
      queryBuilder.andWhere('(project.projectName LIKE :keyword OR project.projectCode LIKE :keyword OR project.customerName LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    if (projectType) {
      queryBuilder.andWhere('project.projectType = :projectType', { projectType });
    }
    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }
    if (level) {
      queryBuilder.andWhere('project.level = :level', { level });
    }
    if (managerId) {
      queryBuilder.andWhere('project.managerId = :managerId', { managerId });
    }

    const [projects, total] = await queryBuilder
      .orderBy('project.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: projects,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取项目列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取项目详情
 * GET /api/projects/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await projectRepository().findOne({
      where: { id: req.params.id },
      relations: ['contract', 'contract.customer', 'manager', 'deputyManager', 'creator']
    });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    // 获取里程碑
    const milestones = await milestoneRepository().find({
      where: { projectId: project.id },
      order: { planDate: 'ASC' }
    });

    // 获取团队成员
    const members = await memberRepository().find({
      where: { projectId: project.id },
      relations: ['user'],
      order: { joinDate: 'ASC' }
    });

    res.json({
      success: true,
      data: { ...project, milestones, members }
    });
  } catch (error) {
    console.error('获取项目详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建项目
 * POST /api/projects
 */
router.post('/', authenticate, authorize('project:create'), async (req: AuthRequest, res: Response) => {
  try {
    const { projectName, projectType, contractId, customerName, managerId, deputyManagerId, level, planStartDate, planEndDate, budget, contractAmount, description } = req.body;

    if (!projectName || !projectType || !contractId || !customerName || !managerId || !level || !planStartDate || !planEndDate || !budget || !contractAmount) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    const project = projectRepository().create({
      projectCode: generateProjectCode(),
      projectName,
      projectType,
      contractId,
      customerName,
      managerId,
      deputyManagerId,
      status: ProjectStatus.PENDING_APPROVAL,
      level,
      planStartDate: new Date(planStartDate),
      planEndDate: new Date(planEndDate),
      budget: String(budget),
      contractAmount: String(contractAmount),
      description,
      creatorId: req.user!.id
    });

    const savedProject = await projectRepository().save(project);

    res.status(201).json({
      success: true,
      message: '项目创建成功',
      data: savedProject
    });
  } catch (error) {
    console.error('创建项目错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 更新项目
 * PUT /api/projects/:id
 */
router.put('/:id', authenticate, authorize('project:update'), async (req: AuthRequest, res: Response) => {
  try {
    const project = await projectRepository().findOne({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    const { projectName, projectType, contractId, customerName, managerId, deputyManagerId, level, status, planStartDate, planEndDate, actualStartDate, actualEndDate, budget, contractAmount, description } = req.body;

    Object.assign(project, {
      projectName,
      projectType,
      contractId,
      customerName,
      managerId,
      deputyManagerId,
      level,
      status,
      planStartDate: planStartDate ? new Date(planStartDate) : project.planStartDate,
      planEndDate: planEndDate ? new Date(planEndDate) : project.planEndDate,
      actualStartDate: actualStartDate ? new Date(actualStartDate) : project.actualStartDate,
      actualEndDate: actualEndDate ? new Date(actualEndDate) : project.actualEndDate,
      budget: budget ? String(budget) : project.budget,
      contractAmount: contractAmount ? String(contractAmount) : project.contractAmount,
      description
    });

    await projectRepository().save(project);

    res.json({
      success: true,
      message: '项目更新成功',
      data: project
    });
  } catch (error) {
    console.error('更新项目错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 项目立项审批
 * POST /api/projects/:id/approve
 */
router.post('/:id/approve', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await projectRepository().findOne({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    // 创建审批记录
    const approval = approvalRepository().create({
      approvalCode: `AP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      type: ApprovalType.PROJECT_SETUP,
      title: `项目立项审批 - ${project.projectName}`,
      content: JSON.stringify({
        projectId: project.id,
        projectCode: project.projectCode,
        projectName: project.projectName,
        customerName: project.customerName,
        budget: project.budget,
        managerId: project.managerId,
        planStartDate: project.planStartDate,
        planEndDate: project.planEndDate
      }),
      applicantId: req.user!.id,
      relatedId: project.id,
      relatedType: 'project',
      status: ApprovalStatus.PENDING
    });

    await approvalRepository().save(approval);

    res.status(201).json({
      success: true,
      message: '项目立项审批申请已提交',
      data: approval
    });
  } catch (error) {
    console.error('项目立项审批申请错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 项目变更审批
 * POST /api/projects/:id/change-approval
 */
router.post('/:id/change-approval', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { changeType, changeTitle, beforeContent, afterContent, reason } = req.body;
    const project = await projectRepository().findOne({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    // 创建审批记录
    const approval = approvalRepository().create({
      approvalCode: `AP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      type: ApprovalType.PROJECT_CHANGE,
      title: `项目变更审批 - ${project.projectName}`,
      content: JSON.stringify({
        projectId: project.id,
        changeType,
        changeTitle,
        beforeContent,
        afterContent,
        reason
      }),
      applicantId: req.user!.id,
      relatedId: project.id,
      relatedType: 'project',
      status: ApprovalStatus.PENDING
    });

    await approvalRepository().save(approval);

    res.status(201).json({
      success: true,
      message: '项目变更申请已提交',
      data: approval
    });
  } catch (error) {
    console.error('项目变更申请错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 删除项目
 * DELETE /api/projects/:id
 */
router.delete('/:id', authenticate, authorize('project:delete'), async (req: AuthRequest, res: Response) => {
  try {
    const project = await projectRepository().findOne({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    // 删除关联数据
    await milestoneRepository().delete({ projectId: project.id });
    await memberRepository().delete({ projectId: project.id });
    await projectRepository().remove(project);

    res.json({ success: true, message: '项目删除成功' });
  } catch (error) {
    console.error('删除项目错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 里程碑管理
/**
 * 添加里程碑
 * POST /api/projects/:id/milestones
 */
router.post('/:id/milestones', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, planDate, deliverables } = req.body;
    const project = await projectRepository().findOne({ where: { id: req.params.id } });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    const milestone = milestoneRepository().create({
      milestoneCode: generateMilestoneCode(),
      projectId: project.id,
      name,
      description,
      planDate,
      deliverables,
      status: 'not_started'
    });

    await milestoneRepository().save(milestone);

    res.status(201).json({
      success: true,
      message: '里程碑创建成功',
      data: milestone
    });
  } catch (error) {
    console.error('创建里程碑错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 团队成员管理
/**
 * 添加团队成员
 * POST /api/projects/:id/members
 */
router.post('/:id/members', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role, department, joinDate, workRatio } = req.body;
    const project = await projectRepository().findOne({ where: { id: req.params.id } });

    if (!project) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    const member = memberRepository().create({
      projectId: project.id,
      userId,
      role,
      department,
      joinDate: new Date(joinDate),
      workRatio: String(workRatio)
    });

    await memberRepository().save(member);

    res.status(201).json({
      success: true,
      message: '团队成员添加成功',
      data: member
    });
  } catch (error) {
    console.error('添加团队成员错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;