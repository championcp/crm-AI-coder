# 企业项目全流程管理数据系统

> CRM客户关系管理系统 - 敏捷开发模式

## 项目概述

这是一个企业级CRM客户关系管理系统，采用前后端分离架构，支持客户管理、商机管理、合同管理、项目管理、审批流程、财务管理等核心功能。

## 技术栈

### 后端
- **框架**: Express + TypeScript
- **ORM**: TypeORM
- **数据库**: SQLite
- **认证**: JWT

### 前端
- **框架**: React + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design
- **路由**: React Router

## 文档目录

| 文档 | 说明 |
|------|------|
| [CLAUDE.md](docs/CLAUDE.md) | Claude Code开发指南 |
| [product-backlog.md](docs/product-backlog.md) | 产品待办列表 |
| [ui-design.md](docs/ui-design.md) | UI设计规范 |
| [test-cases.md](docs/test-cases.md) | 测试用例 |
| [PRD-项目管理数据系统.md](docs/PRD-项目管理数据系统.md) | 产品需求文档 |
| [UI-UX-设计文档.md](docs/UI-UX-设计文档.md) | UI/UX设计文档 |

## 快速开始

### 后端启动
```bash
cd backend
npm install
npm run dev
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## 开发模式

项目采用敏捷开发模式，由多个AI Agent协作完成：

- **scrum-master**: 与用户沟通，协调各Agent
- **product-owner**: 收集需求，整理用户故事
- **ui-ux-designer**: 设计界面和用户体验
- **developer-engineer**: 实现功能代码
- **qa-test-engineer**: 编写和执行测试

## 默认账号

- 用户名: `admin`
- 密码: `admin123`

## 许可证

MIT