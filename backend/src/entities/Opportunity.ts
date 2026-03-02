/**
 * 商机实体
 * 企业项目全流程管理数据系统 - 商机管理模块
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
import { Customer } from './Customer';

export enum OpportunityLevel {
  LEVEL_1 = '一级', // 一级：高价值重点商机
  QUASI_LEVEL_1 = '准一级', // 准一级：重要商机
  LEVEL_2 = '二级', // 二级：中高价值商机
  QUASI_LEVEL_2 = '准二级', // 准二级：中等价值商机
  LEVEL_3 = '三级', // 三级：一般价值商机
  QUASI_LEVEL_3 = '准三级', // 准三级：小型商机
  LEVEL_4 = '四级' // 四级：低价值商机
}

export enum OpportunitySource {
  COLD_CALL = 'cold_call', // 电话营销
  VISIT = 'visit', // 主动拜访
  REFERRAL = 'referral', // 客户推荐
  BIDDING = 'bidding', // 招投标
  OTHER = 'other' // 其他
}

export enum OpportunityStage {
  REQUIREMENT = 'requirement', // 需求了解
  PROPOSAL = 'proposal', // 方案制定
  NEGOTIATION = 'negotiation', // 商务洽谈
  CONTRACT_REVIEW = 'contract_review', // 合同评审
  CONTRACT_APPROVAL = 'contract_approval', // 合同审批
  SIGNED = 'signed' // 签约完成
}

export enum OpportunityStatus {
  ACTIVE = 'active', // 进行中
  WON = 'won', // 已成交
  LOST = 'lost', // 已失败
  CANCELLED = 'cancelled' // 已取消
}

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20, unique: true })
  opportunityCode!: string; // 商机编号

  @Column({ length: 200 })
  opportunityName!: string; // 商机名称

  @Column()
  customerId!: string; // 关联客户

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number; // 商机金额

  @Column({ type: 'varchar', length: 20, nullable: true })
  level!: string; // 商机级别

  @Column({ type: 'varchar', length: 50 })
  source!: string; // 商机来源

  @Column({ type: 'varchar', length: 50, default: 'requirement' })
  stage!: string; // 销售阶段

  @Column({ type: 'date', nullable: true })
  expectedSignDate!: Date; // 预计签约日期

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  winRate!: number; // 胜率评估

  @Column({ length: 500, nullable: true })
  products!: string; // 产品/服务类型

  @Column({ length: 255, nullable: true })
  competitors!: string; // 竞争对手

  @Column({ type: 'text', nullable: true })
  description!: string; // 备注说明

  @Column()
  ownerId!: string; // 负责销售

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column({ nullable: true })
  presalesId!: string; // 售前支持

  @ManyToOne(() => User)
  @JoinColumn({ name: 'presalesId' })
  presales!: User;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: string; // 商机状态

  @Column({ type: 'datetime', nullable: true })
  lastFollowTime!: Date; // 最后跟进时间

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}

/**
 * 商机级别自动评级规则
 * - 一级: 金额 >= 500万
 * - 准一级: 金额 200-500万
 * - 二级: 金额 100-200万
 * - 准二级: 金额 50-100万
 * - 三级: 金额 20-50万
 * - 准三级: 金额 5-20万
 * - 四级: 金额 < 5万
 */
export function calculateOpportunityLevel(amount: number): string {
  if (amount >= 5000000) return OpportunityLevel.LEVEL_1;
  if (amount >= 2000000) return OpportunityLevel.QUASI_LEVEL_1;
  if (amount >= 1000000) return OpportunityLevel.LEVEL_2;
  if (amount >= 500000) return OpportunityLevel.QUASI_LEVEL_2;
  if (amount >= 200000) return OpportunityLevel.LEVEL_3;
  if (amount >= 50000) return OpportunityLevel.QUASI_LEVEL_3;
  return OpportunityLevel.LEVEL_4;
}