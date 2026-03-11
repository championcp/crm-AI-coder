/**
 * 角色实体
 * 企业项目全流程管理数据系统 - 角色权限管理
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { UserRole } from './User';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  roleCode!: string; // 角色编码

  @Column({ length: 100 })
  roleName!: string; // 角色名称

  @Column({ type: 'text', nullable: true })
  description!: string; // 角色描述

  @Column({ type: 'simple-array', nullable: true })
  permissions!: string[]; // 权限列表

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active'
  })
  status!: string; // 角色状态

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}