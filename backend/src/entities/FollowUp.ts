/**
 * 跟进记录实体
 * 企业项目全流程管理数据系统 - 客户管理模块
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Customer } from './Customer';
import { User } from './User';

/**
 * 跟进类型枚举
 */
export enum FollowUpType {
  PHONE = 'phone',      // 电话跟进
  VISIT = 'visit',      // 拜访
  EMAIL = 'email',      // 邮件
  OTHER = 'other'       // 其他
}

@Entity('follow_ups')
export class FollowUp {
  // 主键ID
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 关联客户ID
  @Column()
  customerId!: string;

  // 关联客户
  @ManyToOne(() => Customer, customer => customer.followUps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  // 跟进内容
  @Column({ type: 'text' })
  content!: string;

  // 跟进类型：电话/拜访/邮件/其他
  @Column({
    type: 'varchar',
    length: 20,
    default: FollowUpType.PHONE
  })
  type!: string;

  // 跟进时间
  @Column()
  followUpTime!: Date;

  // 下次跟进时间（可选）
  @Column({ nullable: true })
  nextFollowUpTime!: Date;

  // 创建人ID（关联用户）
  @Column()
  createdBy!: string;

  // 创建人关联关系
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  creator!: User;

  // 创建时间
  @CreateDateColumn()
  createdAt!: Date;
}