/**
 * 审批流程管理路由
 * 企业项目全流程管理数据系统 - 审批流程管理
 */

import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ApprovalFlow } from '../entities/ApprovalFlow';
import { ApprovalNode } from '../entities/ApprovalNode';
import { AuthRequest, authenticate, authorize } from '../middlewares/auth';

const router = Router();
const approvalFlowRepository = () => AppDataSource.getRepository(ApprovalFlow);
const approvalNodeRepository = () => AppDataSource.getRepository(ApprovalNode);

/**
 * 获取审批流程列表
 * GET /api/approval-flows
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, keyword, businessType, status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const queryBuilder = approvalFlowRepository().createQueryBuilder('flow');

    if (keyword) {
      queryBuilder.andWhere('(flow.flowCode LIKE :keyword OR flow.flowName LIKE :keyword)', {
        keyword: `%${keyword}%`
      });
    }

    if (businessType) {
      queryBuilder.andWhere('flow.businessType = :businessType', { businessType });
    }

    if (status) {
      queryBuilder.andWhere('flow.status = :status', { status });
    }

    const [flows, total] = await queryBuilder
      .orderBy('flow.createTime', 'DESC')
      .skip(skip)
      .take(Number(pageSize))
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        list: flows,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取审批流程列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取审批流程详情
 * GET /api/approval-flows/:id
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const flow = await approvalFlowRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!flow) {
      return res.status(404).json({ success: false, message: '审批流程不存在' });
    }

    // 获取流程节点
    const nodes = await approvalNodeRepository().find({
      where: { flowId: flow.id },
      order: { nodeOrder: 'ASC' }
    });

    res.json({
      success: true,
      data: {
        ...flow,
        nodes
      }
    });
  } catch (error) {
    console.error('获取审批流程详情错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 创建审批流程
 * POST /api/approval-flows
 */
router.post('/', authenticate, authorize('system:approval:create'), async (req: AuthRequest, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { flowCode, flowName, businessType, description, nodes } = req.body;

    if (!flowCode || !flowName || !businessType) {
      return res.status(400).json({ success: false, message: '请填写必填信息' });
    }

    // 检查流程编码是否已存在
    const existingFlow = await queryRunner.manager.findOne(ApprovalFlow, {
      where: { flowCode }
    });
    if (existingFlow) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({ success: false, message: '流程编码已存在' });
    }

    // 创建流程
    const flow = queryRunner.manager.create(ApprovalFlow, {
      flowCode,
      flowName,
      businessType,
      description: description || '',
      status: 'draft',
      version: 1
    });

    const savedFlow = await queryRunner.manager.save(flow);

    // 创建节点
    if (nodes && Array.isArray(nodes)) {
      for (let i = 0; i < nodes.length; i++) {
        const nodeData = nodes[i];
        const node = queryRunner.manager.create(ApprovalNode, {
          ...nodeData,
          flowId: savedFlow.id,
          nodeOrder: i + 1,
          status: 'active'
        });
        await queryRunner.manager.save(node);
      }
    }

    await queryRunner.commitTransaction();

    res.status(201).json({
      success: true,
      message: '审批流程创建成功',
      data: savedFlow
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('创建审批流程错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  } finally {
    await queryRunner.release();
  }
});

/**
 * 更新审批流程
 * PUT /api/approval-flows/:id
 */
router.put('/:id', authenticate, authorize('system:approval:update'), async (req: AuthRequest, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const flow = await queryRunner.manager.findOne(ApprovalFlow, {
      where: { id: String(req.params.id) }
    });

    if (!flow) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ success: false, message: '审批流程不存在' });
    }

    const { flowName, description, status, nodes } = req.body;

    // 更新流程基本信息
    Object.assign(flow, {
      flowName,
      description,
      status
    });

    const savedFlow = await queryRunner.manager.save(flow);

    // 如果提供了节点信息，则更新节点
    if (nodes && Array.isArray(nodes)) {
      // 删除现有节点
      await queryRunner.manager.delete(ApprovalNode, { flowId: flow.id });

      // 创建新节点
      for (let i = 0; i < nodes.length; i++) {
        const nodeData = nodes[i];
        const node = queryRunner.manager.create(ApprovalNode, {
          ...nodeData,
          flowId: flow.id,
          nodeOrder: i + 1,
          status: 'active'
        });
        await queryRunner.manager.save(node);
      }
    }

    await queryRunner.commitTransaction();

    res.json({
      success: true,
      message: '审批流程更新成功',
      data: savedFlow
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('更新审批流程错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  } finally {
    await queryRunner.release();
  }
});

/**
 * 删除审批流程
 * DELETE /api/approval-flows/:id
 */
router.delete('/:id', authenticate, authorize('system:approval:delete'), async (req: AuthRequest, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const flow = await queryRunner.manager.findOne(ApprovalFlow, {
      where: { id: String(req.params.id) }
    });

    if (!flow) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ success: false, message: '审批流程不存在' });
    }

    // 删除相关节点
    await queryRunner.manager.delete(ApprovalNode, { flowId: flow.id });

    // 删除流程
    await queryRunner.manager.remove(flow);

    await queryRunner.commitTransaction();

    res.json({ success: true, message: '审批流程删除成功' });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('删除审批流程错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  } finally {
    await queryRunner.release();
  }
});

/**
 * 启用/禁用审批流程
 * PUT /api/approval-flows/:id/toggle-status
 */
router.put('/:id/toggle-status', authenticate, authorize('system:approval:update'), async (req: AuthRequest, res: Response) => {
  try {
    const flow = await approvalFlowRepository().findOne({
      where: { id: String(req.params.id) }
    });

    if (!flow) {
      return res.status(404).json({ success: false, message: '审批流程不存在' });
    }

    flow.status = flow.status === 'active' ? 'inactive' : 'active';
    await approvalFlowRepository().save(flow);

    res.json({
      success: true,
      message: '状态更新成功',
      data: {
        id: flow.id,
        status: flow.status
      }
    });
  } catch (error) {
    console.error('更新审批流程状态错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

/**
 * 获取业务类型列表
 * GET /api/approval-flows/business-types
 */
router.get('/business-types/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const businessTypes = [
      { value: 'contract', label: '合同审批' },
      { value: 'project', label: '项目审批' },
      { value: 'opportunity', label: '商机变更' },
      { value: 'payment', label: '付款审批' },
      { value: 'other', label: '其他审批' }
    ];

    res.json({ success: true, data: businessTypes });
  } catch (error) {
    console.error('获取业务类型列表错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;