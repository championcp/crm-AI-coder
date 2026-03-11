/**
 * 审批节点实体
 * 企业项目全流程管理数据系统 - 审批流程管理
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
import { ApprovalFlow } from './ApprovalFlow';

@Entity('approval_nodes')
export class ApprovalNode {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nodeName!: string; // 节点名称

  @Column({ type: 'int' })
  nodeOrder!: number; // 节点顺序

  @Column({ length: 50 })
  approverType!: string; // 审批人类型 (user, role, department)

  @Column({ type: 'simple-array', nullable: true })
  approvers!: string[]; // 审批人列表

  @Column({ type: 'simple-json', nullable: true })
  conditions!: any; // 审批条件

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active'
  })
  status!: string; // 节点状态

  @Column()
  flowId!: string; // 所属流程ID

  @ManyToOne(() => ApprovalFlow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flowId' })
  flow!: ApprovalFlow;

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}