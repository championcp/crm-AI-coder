/**
 * 审批流程实体
 * 企业项目全流程管理数据系统 - 审批流程管理
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ApprovalNode } from './ApprovalNode';

@Entity('approval_flows')
export class ApprovalFlow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  flowCode!: string; // 流程编码

  @Column({ length: 100 })
  flowName!: string; // 流程名称

  @Column({ length: 50 })
  businessType!: string; // 业务类型（合同、项目、商机等）

  @Column({ type: 'text', nullable: true })
  description!: string; // 流程描述

  @Column({ type: 'simple-array', nullable: true })
  approvers!: string[]; // 审批人列表

  @Column({ type: 'simple-json', nullable: true })
  conditions!: any; // 审批条件

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft'
  })
  status!: string; // 流程状态 (draft, active, inactive)

  @Column({ default: 1 })
  version!: number; // 版本号

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}