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
  JoinColumn
} from 'typeorm';
import { User } from './User';

export enum CustomerLevel {
  A = 'A', // A级客户
  B = 'B', // B级客户
  C = 'C', // C级客户
  D = 'D'  // D级客户
}

export enum CustomerScale {
  LARGE = 'large', // 大型企业
  MEDIUM = 'medium', // 中型企业
  SMALL = 'small', // 小型企业
  MICRO = 'micro' // 微型企业
}

export enum CustomerIndustry {
  IT = 'IT', // 信息技术
  FINANCE = 'finance', // 金融
  MANUFACTURING = 'manufacturing', // 制造业
  RETAIL = 'retail', // 零售
  EDUCATION = 'education', // 教育
  HEALTHCARE = 'healthcare', // 医疗健康
  REAL_ESTATE = 'real_estate', // 房地产
  ENERGY = 'energy', // 能源
  TRANSPORTATION = 'transportation', // 交通物流
  OTHER = 'other' // 其他
}

export enum CustomerStatus {
  POTENTIAL = 'potential', // 潜在客户
  FORMAL = 'formal', // 正式客户
  LOST = 'lost' // 已流失
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20, unique: true })
  customerCode!: string; // 客户编号（自动生成）

  @Column({ length: 200 })
  customerName!: string; // 客户名称

  @Column({ length: 100, nullable: true })
  shortName!: string; // 客户简称

  @Column({ type: 'varchar', length: 50 })
  industry!: string; // 所属行业

  @Column({ type: 'varchar', length: 50 })
  scale!: string; // 客户规模

  @Column({ length: 20 })
  phone!: string; // 联系电话

  @Column({ length: 255, nullable: true })
  address!: string; // 联系地址

  @Column({ type: 'varchar', length: 50 })
  level!: string; // 客户等级

  @Column()
  ownerId!: string; // 关联销售（负责人）

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column({ type: 'varchar', length: 50, default: 'potential' })
  status!: string; // 客户状态

  @Column({ type: 'text', nullable: true })
  description!: string; // 备注说明

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