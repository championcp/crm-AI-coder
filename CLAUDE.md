# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 CRM 客户关系管理系统项目，采用敏捷开发模式，由多个 AI Agent 协作完成开发任务。

## 开发模式

- **交流语言**: 中文
- **开发流程**: 敏捷开发，使用多 Agent 协作
  - `scrum-master`: 与用户沟通，协调各 Agent
  - `product-owner`: 收集需求，整理用户故事
  - `ui-ux-designer`: 设计界面和用户体验
  - `developer-engineer`: 实现功能代码
  - `qa-test-engineer`: 编写和执行测试

## 开发命令

项目启动前需要先配置，命令根据选用的技术栈确定：
- 前端: `npm install`, `npm run dev`
- 后端: 根据所选框架配置
- 测试: 使用 chrome-mcp-server 进行 UI 交互测试

## 架构说明

使用 EnterPlanMode 进行架构规划，选择技术栈后定义模块结构。

## 代码规范

- 代码注释使用中文
- 遵循 GitHub Flow 开发流程
- 使用 Task 工具追踪任务进度