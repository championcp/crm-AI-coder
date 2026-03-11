/**
 * 数据库配置文件
 * 企业项目全流程管理数据系统
 */

import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Customer } from '../entities/Customer';
import { FollowUp } from '../entities/FollowUp';
import { Opportunity } from '../entities/Opportunity';
import { Contract, PaymentSchedule } from '../entities/Contract';
import { Project, ProjectMilestone, ProjectMember } from '../entities/Project';
import { Approval } from '../entities/Approval';
import { ApprovalFlow } from '../entities/ApprovalFlow';
import { ApprovalNode } from '../entities/ApprovalNode';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || './database.sqlite',
  synchronize: true, // 开发环境设为true，生产环境应设为false
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Customer,
    FollowUp,
    Opportunity,
    Contract,
    Project,
    ProjectMilestone,
    ProjectMember,
    PaymentSchedule,
    Approval,
    ApprovalFlow,
    ApprovalNode
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: []
});