/**
 * 数据库配置文件
 * 企业项目全流程管理数据系统
 */

import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Customer } from '../entities/Customer';
import { Opportunity } from '../entities/Opportunity';
import { Contract, PaymentSchedule } from '../entities/Contract';
import { Project, ProjectMilestone, ProjectMember } from '../entities/Project';
import { Approval } from '../entities/Approval';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'project_management',
  synchronize: true, // 开发环境设为true，生产环境应设为false
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Customer,
    Opportunity,
    Contract,
    Project,
    ProjectMilestone,
    ProjectMember,
    PaymentSchedule,
    Approval
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: []
});