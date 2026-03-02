/**
 * 用户实体
 * 企业项目全流程管理数据系统 - 用户认证与权限管理
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

export enum UserRole {
  // 系统角色
  SYSTEM_ADMIN = 'system_admin', // 系统管理员

  // 销售部角色
  SALES_MANAGER = 'sales_manager', // 销售经理
  SALES_CONTROLLER = 'sales_controller', // 销售管控

  // 交付部角色
  DELIVERY_MANAGER = 'delivery_manager', // 交付经理

  // 开发部角色
  DEVELOPER = 'developer', // 开发工程师

  // 管控部角色
  PROJECT_MANAGER = 'project_manager', // 项目经理
  PROJECT_CONTROLLER = 'project_controller', // 项目管控

  // 运营部角色
  OPERATIONS_SUPERVISOR = 'operations_supervisor', // 运营主管
  PROJECT_OPERATIONS = 'project_operations', // 项目运营管控

  // 财务部角色
  FINANCE_ACCOUNTANT = 'finance_accountant', // 财务会计

  // 通用角色
  DEPARTMENT_HEAD = 'department_head', // 部门负责人
  SENIOR_MANAGEMENT = 'senior_management' // 高层管理人员
}

export enum UserStatus {
  ACTIVE = 'active', // 正常
  DISABLED = 'disabled', // 禁用
  DELETED = 'deleted' // 已删除
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50, unique: true })
  username!: string; // 用户名

  @Column({ length: 255 })
  password!: string; // 密码（加密存储）

  @Column({ length: 50 })
  realName!: string; // 真实姓名

  @Column({ length: 20, nullable: true })
  phone!: string; // 手机号

  @Column({ length: 100, nullable: true })
  email!: string; // 邮箱

  @Column({
    type: 'varchar',
    length: 50,
    default: UserRole.SALES_MANAGER
  })
  role!: string; // 角色

  @Column({ length: 50 })
  department!: string; // 所属部门

  @Column({
    type: 'varchar',
    length: 20,
    default: UserStatus.ACTIVE
  })
  status!: string; // 用户状态

  @Column({ nullable: true })
  lastLoginTime!: Date; // 最后登录时间

  @CreateDateColumn()
  createTime!: Date; // 创建时间

  @UpdateDateColumn()
  updateTime!: Date; // 更新时间
}