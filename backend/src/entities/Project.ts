/**
 * 项目实体
 * 企业项目全流程管理数据系统 - 项目管理模块
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { User } from './User';
import { Contract } from './Contract';

export enum ProjectType {
  PRODUCT_DEVELOPMENT = 'product_development', // 产品开发
  SERVICE_DELIVERY = 'service_delivery', // 服务交付
  CONSULTING = 'consulting', // 咨询实施
  MIXED = 'mixed' // 混合类型
}

export enum ProjectLevel {
  A = 'A', // A级：重要
  B = 'B', // B级：一般
  C = 'C'  // C级：普通
}

export enum ProjectStatus {
  PENDING_APPROVAL = 'pending_approval', // 立项审批中
  EXECUTING = 'executing', // 执行中
  ACCEPTANCE = 'acceptance', // 验收中
  COMPLETED = 'completed', // 已验收
  TERMINATED = 'terminated' // 已终止
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20, unique: true })
  projectCode!: string; // 项目编号

  @Column({ length: 200 })
  projectName!: string; // 项目名称

  @Column({
    type: 'enum',
    enum: ProjectType
  })
  projectType!: ProjectType; // 项目类型

  @Column()
  contractId!: string; // 关联合同

  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contractId' })
  contract!: Contract;

  @Column({ length: 200 })
  customerName!: string; // 客户名称（冗余便于查询）

  @Column()
  managerId!: string; // 项目经理

  @ManyToOne(() => User)
  @JoinColumn({ name: 'managerId' })
  manager!: User;

  @Column({ nullable: true })
  deputyManagerId!: string; // 项目副经理

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deputyManagerId' })
  deputyManager!: User;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING_APPROVAL
  })
  status!: ProjectStatus; // 项目状态

  @Column({
    type: 'enum',
    enum: ProjectLevel,
    default: ProjectLevel.B
  })
  level!: ProjectLevel; // 项目级别

  @Column({ type: 'date' })
  planStartDate!: Date; // 计划开始日期

  @Column({ type: 'date' })
  planEndDate!: Date; // 计划结束日期

  @Column({ type: 'date', nullable: true })
  actualStartDate!: Date; // 实际开始日期

  @Column({ type: 'date', nullable: true })
  actualEndDate!: Date; // 实际结束日期

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  budget!: string; // 项目预算

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  contractAmount!: string; // 合同金额（冗余）

  @Column({ type: 'text', nullable: true })
  description!: string; // 项目概述

  @Column()
  creatorId!: string; // 创建人

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator!: User;

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}

// 项目里程碑
@Entity('project_milestones')
export class ProjectMilestone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20, unique: true })
  milestoneCode!: string; // 里程碑编号

  @Column()
  projectId!: string; // 关联项目

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column({ length: 200 })
  name!: string; // 里程碑名称

  @Column({ length: 500, nullable: true })
  description!: string; // 里程碑说明

  @Column({ type: 'date' })
  planDate!: string; // 计划完成日期

  @Column({ type: 'date', nullable: true })
  actualDate!: string; // 实际完成日期

  @Column({
    type: 'enum',
    enum: ['not_started', 'in_progress', 'completed', 'delayed'],
    default: 'not_started'
  })
  status!: string; // 里程碑状态

  @Column({ length: 500, nullable: true })
  deliverables!: string; // 交付物

  @CreateDateColumn()
  createTime!: Date;

  @UpdateDateColumn()
  updateTime!: Date;
}

// 项目团队成员
@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectId!: string; // 关联项目

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  userId!: string; // 成员ID

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({
    type: 'enum',
    enum: ['manager', 'tech_lead', 'developer', 'tester', 'implementer']
  })
  role!: string; // 成员角色

  @Column({ length: 50 })
  department!: string; // 所属部门

  @Column({ type: 'date' })
  joinDate!: Date; // 入项日期

  @Column({ type: 'date', nullable: true })
  leaveDate!: Date; // 离项日期

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  workRatio!: string; // 工作占比

  @CreateDateColumn()
  createTime!: Date;

  @UpdateDateColumn()
  updateTime!: Date;
}