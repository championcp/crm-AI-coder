/**
 * 审批实体
 * 企业项目全流程管理数据系统 - 审批管理模块
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

export enum ApprovalType {
  OPPORTUNITY_CHANGE = 'opportunity_change', // 商机变更审批
  CONTRACT_APPROVAL = 'contract_approval', // 合同审批
  PROJECT_SETUP = 'project_setup', // 项目立项审批
  PROJECT_CHANGE = 'project_change', // 项目变更审批
  PAYMENT_APPROVAL = 'payment_approval', // 付款审批
  OTHER = 'other' // 其他审批
}

export enum ApprovalStatus {
  PENDING = 'pending', // 待审批
  APPROVED = 'approved', // 已审批
  REJECTED = 'rejected', // 已拒绝
  CANCELLED = 'cancelled' // 已取消
}

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20, unique: true })
  approvalCode!: string; // 审批编号

  @Column({ type: 'varchar', length: 50 })
  type!: string; // 审批类型

  @Column({ length: 200 })
  title!: string; // 审批标题

  @Column({ type: 'text' })
  content!: string; // 审批内容（JSON字符串）

  @Column()
  applicantId!: string; // 申请人

  @ManyToOne(() => User)
  @JoinColumn({ name: 'applicantId' })
  applicant!: User;

  @Column({ nullable: true })
  approverId!: string; // 审批人

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approverId' })
  approver!: User;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status!: string; // 审批状态

  @Column({ type: 'text', nullable: true })
  comment!: string; // 审批意见

  @Column({ nullable: true })
  relatedId!: string; // 关联业务ID（如商机ID、合同ID、项目ID等）

  @Column({ type: 'varchar', length: 50, default: 'other' })
  relatedType!: string; // 关联业务类型

  @Column({ type: 'datetime', nullable: true })
  approvalTime!: Date; // 审批时间

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}