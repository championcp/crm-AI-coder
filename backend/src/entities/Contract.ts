/**
 * 合同实体
 * 企业项目全流程管理数据系统 - 合同管理模块
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
import { Customer } from './Customer';
import { Opportunity } from './Opportunity';

export enum ContractType {
  PRODUCT_SALES = 'product_sales', // 产品销售
  SERVICE = 'service', // 服务合同
  CUSTOM_DEVELOPMENT = 'custom_development', // 定制开发
  MIXED = 'mixed' // 混合合同
}

export enum PaymentMethod {
  LUMP_SUM = 'lump_sum', // 一次性付款
  INSTALLMENT = 'installment', // 分期付款
  milestones = 'milestones' // 按进度付款
}

export enum ContractStatus {
  DRAFT = 'draft', // 草稿
  PENDING_APPROVAL = 'pending_approval', // 审批中
  EXECUTING = 'executing', // 执行中
  COMPLETED = 'completed', // 已完成
  TERMINATED = 'terminated' // 已终止
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20, unique: true })
  contractCode!: string; // 合同编号

  @Column({ length: 200 })
  contractName!: string; // 合同名称

  @Column({
    type: 'enum',
    enum: ContractType
  })
  contractType!: ContractType; // 合同类型

  @Column()
  customerId!: string; // 关联客户

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column({ nullable: true })
  opportunityId!: string; // 关联商机

  @ManyToOne(() => Opportunity, { nullable: true })
  @JoinColumn({ name: 'opportunityId' })
  opportunity!: Opportunity;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: string; // 合同金额

  @Column({ type: 'date' })
  signDate!: Date; // 合同签订日期

  @Column({ type: 'date' })
  startDate!: Date; // 合同开始日期

  @Column({ type: 'date' })
  endDate!: Date; // 合同结束日期

  @Column({
    type: 'enum',
    enum: PaymentMethod
  })
  paymentMethod!: PaymentMethod; // 付款方式

  @Column({ length: 500, nullable: true })
  paymentTerms!: string; // 付款条件

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT
  })
  status!: ContractStatus; // 合同状态

  @Column({ nullable: true })
  contractFile!: string; // 合同扫描件路径

  @Column()
  ownerId!: string; // 负责销售

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column()
  creatorId!: string; // 创建人

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator!: User;

  @Column({ type: 'text', nullable: true })
  description!: string; // 备注说明

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}

// 分期付款计划
@Entity('payment_schedules')
export class PaymentSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  contractId!: string; // 关联合同

  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contractId' })
  contract!: Contract;

  @Column()
  period!: number; // 期数

  @Column({ type: 'date' })
  planDate!: string; // 计划付款日期

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  planAmount!: string; // 计划付款金额

  @Column({ length: 500, nullable: true })
  terms!: string; // 付款条件说明

  @Column({ type: 'date', nullable: true })
  actualDate!: string; // 实际付款日期

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualAmount!: string; // 实际付款金额

  @Column({
    type: 'enum',
    enum: ['unpaid', 'paid', 'partial', 'overdue'],
    default: 'unpaid'
  })
  status!: string; // 付款状态

  @CreateDateColumn()
  createTime!: Date;

  @UpdateDateColumn()
  updateTime!: Date;
}