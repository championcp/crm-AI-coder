/**
 * 客户实体
 * 企业项目全流程管理数据系统 - 客户管理模块
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
import { FollowUp } from './FollowUp';

/**
 * 客户类型枚举
 */
export enum CustomerType {
  ENTERPRISE = 'enterprise', // 企业客户
  INDIVIDUAL = 'individual'  // 个人客户
}

/**
 * 客户规模枚举
 */
export enum CustomerScale {
  LARGE = 'large',     // 大型企业
  MEDIUM = 'medium',   // 中型企业
  SMALL = 'small',     // 小型企业
  MICRO = 'micro'      // 微型企业
}

/**
 * 所属行业枚举
 */
export enum CustomerIndustry {
  IT = 'it',                  // 信息技术
  FINANCE = 'finance',        // 金融
  MANUFACTURING = 'manufacturing', // 制造业
  RETAIL = 'retail',          // 零售
  EDUCATION = 'education',    // 教育
  HEALTHCARE = 'healthcare',  // 医疗健康
  REAL_ESTATE = 'real_estate', // 房地产
  ENERGY = 'energy',          // 能源
  TRANSPORTATION = 'transportation', // 交通物流
  OTHER = 'other'             // 其他
}

/**
 * 客户状态枚举
 */
export enum CustomerStatus {
  POTENTIAL = 'potential',    // 潜在客户
  FORMAL = 'formal',          // 正式客户
  LOST = 'lost'               // 已流失
}

/**
 * 客户来源枚举
 */
export enum CustomerSource {
  COLD_CALL = 'cold_call',    // 电话营销
  VISIT = 'visit',            // 主动拜访
  REFERRAL = 'referral',      // 客户推荐
  BIDDING = 'bidding',        // 招投标
  WEBSITE = 'website',        // 官网
  SOCIAL_MEDIA = 'social_media', // 社交媒体
  OTHER = 'other'             // 其他
}

@Entity('customers')
export class Customer {
  // 主键ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 客户编码
  @Column({ length: 50, unique: true })
  code!: string;

  // 客户名称
  @Column({ length: 200 })
  name!: string;

  // 客户类型：企业/个人
  @Column({
    type: 'varchar',
    length: 20,
    default: CustomerType.ENTERPRISE
  })
  type!: string;

  // 所属行业
  @Column({ type: 'varchar', length: 50 })
  industry!: string;

  // 客户规模
  @Column({ type: 'varchar', length: 50 })
  scale!: string;

  // 联系人姓名
  @Column({ length: 50, nullable: true })
  contactName!: string;

  // 联系人电话
  @Column({ length: 20, nullable: true })
  contactPhone!: string;

  // 联系人邮箱
  @Column({ length: 100, nullable: true })
  contactEmail!: string;

  // 联系地址
  @Column({ length: 255, nullable: true })
  address!: string;

  // 客户状态
  @Column({
    type: 'varchar',
    length: 20,
    default: CustomerStatus.POTENTIAL
  })
  status!: string;

  // 客户来源
  @Column({
    type: 'varchar',
    length: 50,
    default: CustomerSource.OTHER
  })
  source!: string;

  // 备注说明
  @Column({ type: 'text', nullable: true })
  remark!: string;

  // 负责人ID（关联用户）
  @Column()
  ownerId!: string;

  // 负责人关联关系
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  // 跟进记录关联关系
  @OneToMany(() => FollowUp, followUp => followUp.customer)
  followUps!: FollowUp[];

  // 创建时间
  @CreateDateColumn()
  createdAt!: Date;

  // 更新时间
  @UpdateDateColumn()
  updatedAt!: Date;
}