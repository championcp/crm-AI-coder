# CRM系统UI设计文档

## 1. 设计概述

### 1.1 设计目标
- 打造专业、高效的企业级CRM系统界面
- 提供清晰的信息架构和直观的操作流程
- 确保良好的用户体验和可访问性
- 建立统一的设计语言和组件规范

### 1.2 设计原则
1. **简洁性**：界面元素精简，避免视觉噪音
2. **一致性**：统一的视觉语言和交互模式
3. **效率性**：减少用户操作步骤，提升工作效率
4. **可扩展性**：设计系统具备良好的扩展能力

### 1.3 技术栈
- **UI框架**：Ant Design 5.x
- **图标库**：@ant-design/icons
- **图表库**：Ant Design Charts / ECharts
- **前端框架**：React 18 + TypeScript

---

## 2. 设计规范

### 2.1 颜色系统

#### 主色调
```
--color-primary: #1677ff          // 主品牌色，用于主要按钮、链接、选中状态
--color-primary-hover: #4096ff    // 主色悬停态
--color-primary-active: #0958d9   // 主色激活态
--color-primary-light: #e6f4ff    // 主色浅色背景
```

#### 辅助色
```
--color-secondary: #1E293B        // 辅助深色，用于侧边栏背景
--color-secondary-light: #334155  // 辅助色浅色
```

#### 状态色
```
--color-success: #52c41a          // 成功状态
--color-success-bg: #f6ffed       // 成功背景

--color-warning: #faad14          // 警告状态
--color-warning-bg: #fffbe6       // 警告背景

--color-error: #ff4d4f            // 错误状态
--color-error-bg: #fff2f0         // 错误背景

--color-info: #1677ff             // 信息状态
```

#### 业务状态色
```
--color-customer-potential: #faad14    // 潜在客户
--color-customer-active: #52c41a       // 活跃客户
--color-customer-inactive: #8c8c8c     // 流失客户

--color-opportunity-high: #ff4d4f      // 高优先级商机
--color-opportunity-medium: #faad14    // 中优先级商机
--color-opportunity-low: #52c41a       // 低优先级商机
```

#### 中性色
```
--color-text-primary: #262626     // 主要文本
--color-text-secondary: #595959   // 次要文本
--color-text-tertiary: #8c8c8c    // 辅助文本
--color-text-disabled: #bfbfbf    // 禁用文本

--color-border: #d9d9d9           // 边框颜色
--color-border-light: #f0f0f0     // 浅色边框
--color-background: #f5f5f5       // 页面背景
--color-white: #ffffff            // 白色
```

### 2.2 字体规范

#### 字体族
```
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

#### 字号规范
| 级别 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| H1 | 24px | 32px | 600 | 页面主标题 |
| H2 | 20px | 28px | 600 | 区块标题 |
| H3 | 16px | 24px | 600 | 卡片标题 |
| H4 | 14px | 22px | 600 | 小标题 |
| Body | 14px | 22px | 400 | 正文内容 |
| Small | 12px | 20px | 400 | 辅助文本 |

### 2.3 间距规范

#### 基础间距
```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-xxl: 48px
```

#### 组件间距
- 卡片内边距：24px
- 表单行间距：24px
- 按钮间距：8px
- 表格行高：54px

### 2.4 圆角规范
```
--radius-sm: 4px    // 小按钮、标签
--radius-md: 6px    // 输入框、卡片
--radius-lg: 8px    // 大卡片、弹窗
--radius-full: 9999px // 圆形、胶囊
```

### 2.5 阴影规范
```
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15)
```

---

## 3. 布局系统

### 3.1 整体布局结构

```
┌─────────────────────────────────────────────────────┐
│  侧边栏 (Sider)          │  顶部栏 (Header)          │
│  宽度: 240px/80px        │  高度: 64px               │
│  背景: #1E293B           │  背景: #1E293B            │
├──────────────────────────┼───────────────────────────┤
│                          │                           │
│                          │  内容区 (Content)          │
│     导航菜单              │  内边距: 24px             │
│                          │  背景: #f5f5f5            │
│                          │                           │
│                          │                           │
└──────────────────────────┴───────────────────────────┘
```

### 3.2 侧边栏 (Sider)

#### 设计规格
- **宽度**：展开 240px，收起 80px
- **背景色**：#1E293B
- **Logo区**：高度 64px，居中/左对齐
- **菜单项**：高度 48px，内边距 16px
- **子菜单**：缩进 24px

#### 菜单结构
```typescript
const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  {
    key: 'business',
    icon: <ShopOutlined />,
    label: '业务管理',
    children: [
      { key: '/customers', label: '客户管理' },
      { key: '/opportunities', label: '商机管理' },
      { key: '/contracts', label: '合同管理' },
      { key: '/projects', label: '项目管理' }
    ]
  },
  {
    key: 'execution',
    icon: <ProjectOutlined />,
    label: '执行管理',
    children: [
      { key: '/progress', label: '进度管理' },
      { key: '/tasks', label: '任务管理' },
      { key: '/risks', label: '风险管理' }
    ]
  },
  { key: '/acceptance', icon: <CheckCircleOutlined />, label: '验收管理' },
  {
    key: 'finance',
    icon: <DollarOutlined />,
    label: '财务管理',
    children: [
      { key: '/budget', label: '预算管理' },
      { key: '/cost', label: '成本管理' },
      { key: '/payment', label: '回款管理' }
    ]
  },
  { key: '/approvals', icon: <AuditOutlined />, label: '审批中心' },
  {
    key: 'report',
    icon: <RiseOutlined />,
    label: '报表分析',
    children: [
      { key: '/report/sales', label: '销售报表' },
      { key: '/report/project', label: '项目报表' },
      { key: '/report/finance', label: '财务报表' }
    ]
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/users', label: '用户管理' },
      { key: '/system/roles', label: '角色管理' },
      { key: '/system/config', label: '系统配置' }
    ]
  }
];
```

### 3.3 顶部栏 (Header)

#### 设计规格
- **高度**：64px
- **背景色**：#1E293B
- **内边距**：0 24px
- **左侧**：折叠按钮
- **右侧**：通知图标、用户头像/名称

#### 组件说明
| 组件 | 说明 |
|------|------|
| 折叠按钮 | 控制侧边栏展开/收起 |
| 通知图标 | Badge显示未读数量，点击展开通知列表 |
| 用户区 | Avatar + 用户名，点击展开下拉菜单 |

#### 用户下拉菜单
- 个人中心
- 设置
- 分隔线
- 退出登录（危险样式）

### 3.4 内容区 (Content)

#### 设计规格
- **背景色**：#f5f5f5
- **内边距**：24px
- **最小高度**：calc(100vh - 64px)

---

## 4. 页面设计

### 4.1 仪表盘 (Dashboard)

#### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  页面标题：仪表盘                    [刷新按钮]      │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 统计卡片1 │ │ 统计卡片2 │ │ 统计卡片3 │ │ 统计卡片4 │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │    销售趋势图        │  │    商机状态分布      │  │
│  │    (折线图)          │  │    (饼图)            │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │    本月Top客户      │  │    待办事项          │  │
│  │    (表格)            │  │    (列表)            │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### 统计卡片设计
- **尺寸**：响应式，4列布局
- **背景**：白色
- **圆角**：8px
- **阴影**：0 1px 2px rgba(0,0,0,0.05)
- **内容**：
  - 图标（左侧，圆形背景）
  - 数值（主文本，24px，加粗）
  - 标签（副文本，14px，灰色）
  - 趋势（底部，带颜色箭头）

#### 图表区域
1. **销售趋势图**：折线图，展示近12个月销售额
2. **商机状态分布**：饼图，展示各状态占比
3. **本月Top客户**：表格，展示消费金额排名
4. **待办事项**：列表，展示待办任务

### 4.2 客户管理 (Customers)

#### 4.2.1 客户列表页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  客户管理                               [新建客户]   │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  搜索框 │ 筛选器(状态/等级/行业) │ 重置筛选  │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐│
│  │ 表格                                             ││
│  │  - 客户名称(可点击)                               ││
│  │  - 客户等级(标签样式)                             ││
│  │  - 联系人/电话                                   ││
│  │  - 行业                                          ││
│  │  - 状态                                          ││
│  │  - 最近跟进时间                                  ││
│  │  - 操作(编辑/删除/跟进)                          ││
│  └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│  [分页器]                                           │
└─────────────────────────────────────────────────────┘
```

##### 搜索筛选区
| 组件 | 说明 |
|------|------|
| 搜索框 | 按客户名称/联系人/电话搜索 |
| 状态筛选 | 全部/潜在/活跃/流失 |
| 等级筛选 | 全部/A/B/C级 |
| 行业筛选 | 全部/IT/制造/金融/零售等 |
| 重置按钮 | 清空所有筛选条件 |

##### 表格列定义
| 列名 | 宽度 | 说明 |
|------|------|------|
| 客户名称 | 200px | 蓝色链接，点击进入详情 |
| 客户等级 | 100px | Tag组件，A级红色、B级橙色、C级蓝色 |
| 联系人 | 120px | 主要联系人姓名 |
| 联系电话 | 140px | 手机号码 |
| 行业 | 120px | 行业分类 |
| 状态 | 100px | Badge组件 |
| 最近跟进 | 150px | 时间显示 |
| 操作 | 180px | 编辑/删除/跟进按钮 |

#### 4.2.2 客户详情页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  < 返回列表    客户详情                             │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  客户信息卡片                                  │   │
│  │  - 客户名称 | 等级 | 状态                      │   │
│  │  - 基本信息(行业/规模/地址)                    │   │
│  │  - 联系信息(联系人/电话/邮箱)                  │   │
│  │  [编辑] [转为商机] [添加跟进]                  │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  [基本信息] [跟进记录] [关联商机] [关联合同] [操作日志]│
├─────────────────────────────────────────────────────┤
│  Tab内容区域                                        │
└─────────────────────────────────────────────────────┘
```

##### Tab页签内容
1. **基本信息**：客户完整资料展示
2. **跟进记录**：时间线形式展示跟进历史
3. **关联商机**：该客户相关的商机列表
4. **关联合同**：该客户相关的合同列表
5. **操作日志**：对该客户的操作记录

#### 4.2.3 客户表单页（新建/编辑）

##### 表单字段
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 客户名称 | Input | 是 | 唯一，2-50字符 |
| 客户等级 | Select | 是 | A/B/C/D级 |
| 客户状态 | Select | 是 | 潜在/活跃/流失 |
| 行业 | Select | 否 | 下拉选择 |
| 公司规模 | Select | 否 | 1-50人/51-200人等 |
| 公司地址 | Input.TextArea | 否 | 详细地址 |
| 主要联系人 | Input | 是 | 姓名 |
| 联系电话 | Input | 是 | 手机号验证 |
| 电子邮箱 | Input | 否 | 邮箱格式验证 |
| 备注 | Input.TextArea | 否 | 其他信息 |

### 4.3 商机管理 (Opportunities)

#### 4.3.1 商机看板视图（销售漏斗）

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  商机管理          [列表视图] [+ 新建商机]           │
├─────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │  初步接洽  │  需求确认  │  方案报价  │  谈判签约  │     │
│  │  ¥1,200万 │  ¥800万   │  ¥500万   │  ¥300万   │     │
│  ├──────────┼──────────┼──────────┼──────────┤     │
│  │ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │     │
│  │ │商机1 │ │ │商机3 │ │ │商机5 │ │ │商机7 │ │     │
│  │ └──────┘ │ └──────┘ │ └──────┘ │ └──────┘ │     │
│  │ ┌──────┐ │ ┌──────┐ │        │ │        │ │     │
│  │ │商机2 │ │ │商机4 │ │        │ │        │ │     │
│  │ └──────┘ │ └──────┘ │        │ │        │ │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
└─────────────────────────────────────────────────────┘
```

##### 看板卡片设计
- **宽度**：列宽自适应，最小280px
- **卡片内容**：
  - 商机名称（加粗，可点击）
  - 客户名称（灰色，链接）
  - 预计金额（高亮显示）
  - 预计成交日期
  - 负责人头像
  - 优先级标签（颜色区分）
- **拖拽**：支持在不同阶段间拖拽

#### 4.3.2 商机列表视图

##### 表格列定义
| 列名 | 宽度 | 说明 |
|------|------|------|
| 商机名称 | 200px | 链接 |
| 客户名称 | 150px | 链接 |
| 当前阶段 | 120px | Badge |
| 预计金额 | 120px | 金额格式 |
| 预计成交 | 120px | 日期 |
| 优先级 | 100px | Tag（高/中/低） |
| 负责人 | 100px | 用户头像+名称 |
| 操作 | 150px | 编辑/推进/关闭 |

### 4.4 合同管理 (Contracts)

#### 4.4.1 合同列表页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  合同管理                               [新建合同]   │
├─────────────────────────────────────────────────────┤
│  筛选区：合同状态 | 合同类型 | 客户筛选 | 日期范围   │
├─────────────────────────────────────────────────────┤
│  表格：合同编号 | 合同名称 | 客户 | 金额 | 状态 | 操作 │
├─────────────────────────────────────────────────────┤
│  [分页器]                                           │
└─────────────────────────────────────────────────────┘
```

##### 合同状态流程图（可视化）
```
草稿 → 审批中 → 已生效 → 履行中 → 已完成
         ↓        ↓
       已驳回   已终止
```

##### 表格列定义
| 列名 | 宽度 | 说明 |
|------|------|------|
| 合同编号 | 140px | 系统生成 |
| 合同名称 | 200px | 链接 |
| 客户名称 | 150px | 链接 |
| 合同金额 | 120px | 金额格式 |
| 签订日期 | 120px | 日期 |
| 到期日期 | 120px | 日期 |
| 状态 | 100px | 进度条样式 |
| 操作 | 180px | 查看/编辑/审批 |

#### 4.4.2 合同审批流程

##### 审批流程展示
```
┌─────────────────────────────────────────────────────┐
│  合同审批流程                                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ○ ──────── ○ ──────── ○ ──────── ○               │
│   │         │         │         │                 │
│  提交      部门经理   财务审核   法务审核   总经理   │
│  申请人    张三       李四       王五       赵六    │
│  已提交    已批准     审批中     待审批     待审批   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  审批意见                                           │
│  ┌─────────────────────────────────────────────┐   │
│  │ 时间线形式展示审批历史                         │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  [批准] [驳回] [转交] [加签]                        │
└─────────────────────────────────────────────────────┘
```

### 4.5 项目管理 (Projects)

#### 4.5.1 项目列表页

##### 表格列定义
| 列名 | 宽度 | 说明 |
|------|------|------|
| 项目名称 | 200px | 链接 |
| 项目编号 | 120px | 系统生成 |
| 客户名称 | 150px | 链接 |
| 项目经理 | 100px | 头像+名称 |
| 项目状态 | 100px | Tag |
| 进度 | 120px | Progress组件 |
| 计划周期 | 180px | 开始~结束 |
| 操作 | 150px | 查看/编辑/任务 |

#### 4.5.2 项目详情页 - 甘特图视图

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  项目详情：XXX系统实施项目           [编辑] [任务管理]│
├─────────────────────────────────────────────────────┤
│  项目信息卡片（进度/时间/负责人/状态）               │
├─────────────────────────────────────────────────────┤
│  [概览] [甘特图] [任务看板] [里程碑] [风险] [团队]   │
├─────────────────────────────────────────────────────┤
│  甘特图区域                                          │
│  ┌──────────────────────────────────────────────┐  │
│  │  任务名称    │ 负责人 │ 进度 │ 时间轴(月/周)   │  │
│  │  ─────────────────────────────────────────── │  │
│  │  需求分析    │ 张三   │ 100% │ ████          │  │
│  │  系统设计    │ 李四   │ 80%  │    ███▓       │  │
│  │  开发实现    │ 王五   │ 40%  │       ███     │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### 4.5.3 任务看板视图

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  任务管理                               [新建任务]   │
├─────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │  待处理    │  进行中   │  待验收   │  已完成   │     │
│  │  (12)     │  (8)     │  (5)     │  (23)    │     │
│  ├──────────┼──────────┼──────────┼──────────┤     │
│  │ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │     │
│  │ │任务卡片│ │ │任务卡片│ │ │任务卡片│ │ │任务卡片│ │     │
│  │ └──────┘ │ └──────┘ │ └──────┘ │ └──────┘ │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
└─────────────────────────────────────────────────────┘
```

##### 任务卡片设计
- **标题**：任务名称（可点击）
- **标签**：优先级（颜色）、类型
- **进度**：小Progress条
- **负责人**：头像
- **截止日期**：红色表示逾期
- **子任务数**：如果有子任务则显示

### 4.6 审批中心 (Approvals)

#### 4.6.1 审批中心主页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  审批中心                                           │
├─────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │   待我审批  │   我已审批  │   我发起的  │   抄送我的  │     │
│  │    (12)   │    (58)   │    (23)   │    (8)    │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
├─────────────────────────────────────────────────────┤
│  Tab内容区域：                                       │
│  每行显示：审批类型 | 标题 | 发起人 | 时间 | 操作    │
└─────────────────────────────────────────────────────┘
```

##### 审批类型标识
| 类型 | 图标 | 颜色 |
|------|------|------|
| 合同审批 | FileTextOutlined | blue |
| 报销审批 | DollarOutlined | green |
| 请假审批 | CalendarOutlined | orange |
| 采购审批 | ShoppingOutlined | purple |

### 4.7 财务管理 (Finance)

#### 4.7.1 预算管理页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  预算管理                               [新建预算]   │
├─────────────────────────────────────────────────────┤
│  项目筛选：[下拉选择]  年份：[2024 ▼]                │
├─────────────────────────────────────────────────────┤
│  预算概览卡片：                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ 总预算      │ │ 已使用      │ │ 剩余预算    │   │
│  │ ¥500万     │ │ ¥320万     │ │ ¥180万     │   │
│  │ 使用率64%  │ │            │ │            │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│  预算明细表格                                        │
│  项目 | 预算金额 | 已使用 | 剩余 | 使用率 | 操作    │
└─────────────────────────────────────────────────────┘
```

#### 4.7.2 回款管理页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  回款管理                               [记录回款]   │
├─────────────────────────────────────────────────────┤
│  统计卡片：待回款 | 本月回款 | 本季度回款 | 年度回款  │
├─────────────────────────────────────────────────────┤
│  回款计划表格                                        │
│  合同 | 客户 | 计划回款日期 | 金额 | 状态 | 操作     │
└─────────────────────────────────────────────────────┘
```

### 4.8 报表分析 (Reports)

#### 4.8.1 销售报表页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  销售报表          [导出Excel] [导出PDF]            │
├─────────────────────────────────────────────────────┤
│  时间范围：[开始日期] ~ [结束日期]  [查询]           │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │   销售额趋势图       │  │   销售业绩排名       │  │
│  │   (折线图+柱状图)    │  │   (横向柱状图)       │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │   客户贡献分析       │  │   产品销售分析       │  │
│  │   (饼图)            │  │   (堆叠柱状图)       │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  详细数据表格（可分页、排序、筛选）                  │
└─────────────────────────────────────────────────────┘
```

### 4.9 系统管理 (System)

#### 4.9.1 用户管理页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  用户管理                               [新建用户]   │
├─────────────────────────────────────────────────────┤
│  搜索：用户名/姓名    筛选：角色/状态                │
├─────────────────────────────────────────────────────┤
│  表格：                                              │
│  头像 | 用户名 | 姓名 | 角色 | 部门 | 状态 | 操作    │
├─────────────────────────────────────────────────────┤
│  [分页器]                                           │
└─────────────────────────────────────────────────────┘
```

#### 4.9.2 角色管理页

##### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  角色管理                               [新建角色]   │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┬─────────────────────────────────┐│
│  │              │                                  ││
│  │  角色列表     │        权限配置                  ││
│  │  - 管理员     │        ┌──────────────┐        ││
│  │  - 销售经理   │        │ 模块权限      │        ││
│  │  - 销售人员   │        │ ☑ 客户管理    │        ││
│  │  - 财务人员   │        │ ☑ 商机管理    │        ││
│  │  - 项目经理   │        │ ☐ 系统管理    │        ││
│  │              │        └──────────────┘        ││
│  │              │                                  ││
│  │              │        操作权限：                ││
│  │              │        ☑ 查看 ☑ 新增 ☑ 编辑 ☑ 删除 ││
│  └──────────────┴─────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## 5. 组件规范

### 5.1 通用组件

#### 5.1.1 页面头部 (PageHeader)
```tsx
interface PageHeaderProps {
  title: string;              // 页面标题
  subtitle?: string;          // 副标题
  back?: boolean;             // 是否显示返回按钮
  extra?: React.ReactNode;    // 右侧操作区
  breadcrumb?: BreadcrumbItem[]; // 面包屑
}
```

#### 5.1.2 统计卡片 (StatCard)
```tsx
interface StatCardProps {
  title: string;              // 卡片标题
  value: number | string;     // 数值
  prefix?: string;            // 前缀（如¥）
  suffix?: string;            // 后缀（如%、个）
  icon: React.ReactNode;      // 图标
  trend?: number;             // 趋势值（正数为上升）
  trendText?: string;         // 趋势描述
  color?: string;             // 主题色
  onClick?: () => void;       // 点击事件
}
```

#### 5.1.3 搜索筛选栏 (SearchFilterBar)
```tsx
interface SearchFilterBarProps {
  searchPlaceholder?: string;
  filters: FilterItem[];      // 筛选项配置
  onSearch?: (value: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onReset?: () => void;
}
```

### 5.2 业务组件

#### 5.2.1 客户信息卡片 (CustomerInfoCard)
```tsx
interface CustomerInfoCardProps {
  customer: Customer;
  actions?: ActionItem[];
  expandable?: boolean;
}
```

#### 5.2.2 商机看板列 (OpportunityBoardColumn)
```tsx
interface OpportunityBoardColumnProps {
  stage: OpportunityStage;
  opportunities: Opportunity[];
  totalAmount: number;
  onCardClick: (id: string) => void;
  onCardDrop: (cardId: string, stageId: string) => void;
}
```

#### 5.2.3 审批流程时间线 (ApprovalTimeline)
```tsx
interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  currentStep: number;
}
```

#### 5.2.4 项目进度甘特图 (ProjectGanttChart)
```tsx
interface ProjectGanttChartProps {
  tasks: GanttTask[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: GanttTask) => void;
}
```

### 5.3 表单组件

#### 5.3.1 表单布局规范
- 表单标签右对齐，宽度 120px
- 表单项间距 24px
- 必填项标记红色星号
- 错误提示在输入框下方

#### 5.3.2 表单验证规则
```typescript
const validationRules = {
  required: { required: true, message: '此项为必填项' },
  email: { type: 'email', message: '请输入有效的邮箱地址' },
  phone: { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
  money: { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的金额' }
};
```

---

## 6. 交互规范

### 6.1 通用交互

| 交互 | 行为 |
|------|------|
| 点击链接 | 页面跳转，保留当前列表状态 |
| 点击按钮 | 立即响应，显示loading状态 |
| 表单提交 | 验证通过后提交，显示loading |
| 删除操作 | 显示确认弹窗 |
| 批量操作 | 选中后显示批量操作栏 |

### 6.2 表格交互

| 交互 | 行为 |
|------|------|
| 点击行 | 选中当前行 |
| 点击链接 | 进入详情页 |
| 悬停行 | 显示操作按钮 |
| 拖拽列 | 调整列宽 |
| 排序 | 点击表头排序 |

### 6.3 看板交互

| 交互 | 行为 |
|------|------|
| 拖拽卡片 | 改变状态/阶段 |
| 点击卡片 | 打开详情抽屉 |
| 悬停卡片 | 显示快捷操作 |
| 滚动加载 | 到底部加载更多 |

### 6.4 表单交互

| 交互 | 行为 |
|------|------|
| 失去焦点 | 触发字段验证 |
| 输入中 | 实时显示字数统计 |
| 提交 | 全局验证，显示错误 |
| 取消 | 提示保存确认 |

---

## 7. 响应式设计

### 7.1 断点定义
| 断点 | 宽度 | 布局调整 |
|------|------|----------|
| xs | < 576px | 移动端布局 |
| sm | 576px - 768px | 平板竖屏 |
| md | 768px - 992px | 平板横屏 |
| lg | 992px - 1200px | 小桌面 |
| xl | 1200px - 1600px | 桌面 |
| xxl | > 1600px | 大桌面 |

### 7.2 响应式规则
- **侧边栏**：< 768px 时自动收起，显示汉堡菜单
- **表格**：小屏幕横向滚动，或切换为卡片列表
- **图表**：自适应容器宽度
- **表单**：单列布局，全宽输入框

---

## 8. 页面代码示例

### 8.1 客户列表页完整代码

```tsx
// /Users/chengpeng/cursor/crm-AI-coder/frontend/src/pages/customers/CustomerList.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Badge,
  Dropdown,
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCustomerList, deleteCustomer } from '../../services/customerApi';
import { Customer, CustomerStatus, CustomerLevel } from '../../types';

const { Option } = Select;

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined,
    level: undefined,
    industry: undefined
  });

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getCustomerList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      });
      setData(res.data.list);
      setPagination(prev => ({ ...prev, total: res.data.total }));
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, filters]);

  // 状态标签渲染
  const renderStatus = (status: CustomerStatus) => {
    const statusMap = {
      potential: { text: '潜在客户', color: 'default' },
      active: { text: '活跃客户', color: 'success' },
      inactive: { text: '流失客户', color: 'error' }
    };
    const config = statusMap[status];
    return <Badge status={config.color as any} text={config.text} />;
  };

  // 等级标签渲染
  const renderLevel = (level: CustomerLevel) => {
    const colorMap = {
      A: 'red',
      B: 'orange',
      C: 'blue',
      D: 'default'
    };
    return <Tag color={colorMap[level]}>{level}级</Tag>;
  };

  // 操作菜单
  const getActionItems = (record: Customer) => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => navigate(`/customers/${record.id}`)
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => navigate(`/customers/${record.id}/edit`)
    },
    {
      key: 'follow',
      icon: <PhoneOutlined />,
      label: '添加跟进',
      onClick: () => {/* 打开跟进弹窗 */}
    },
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => handleDelete(record.id)
    }
  ];

  // 删除客户
  const handleDelete = async (id: string) => {
    // 显示确认弹窗
    // 调用删除API
    // 刷新列表
  };

  // 表格列定义
  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      width: 200,
      render: (text: string, record: Customer) => (
        <a onClick={() => navigate(`/customers/${record.id}`)}>{text}</a>
      )
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      width: 100,
      render: renderLevel
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      width: 120
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 140
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: renderStatus
    },
    {
      title: '最近跟进',
      dataIndex: 'lastFollowUpTime',
      width: 150,
      render: (text: string) => text || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: any, record: Customer) => (
        <Dropdown menu={{ items: getActionItems(record) }} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>客户管理</h2>
      </div>

      <Card>
        {/* 搜索筛选区 */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜索客户名称/联系人/电话"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            allowClear
          />
          <Select
            placeholder="客户状态"
            style={{ width: 120 }}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            allowClear
          >
            <Option value="potential">潜在客户</Option>
            <Option value="active">活跃客户</Option>
            <Option value="inactive">流失客户</Option>
          </Select>
          <Select
            placeholder="客户等级"
            style={{ width: 120 }}
            value={filters.level}
            onChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
            allowClear
          >
            <Option value="A">A级</Option>
            <Option value="B">B级</Option>
            <Option value="C">C级</Option>
            <Option value="D">D级</Option>
          </Select>
          <Button icon={<FilterOutlined />}>更多筛选</Button>
          <Button onClick={() => setFilters({ keyword: '', status: undefined, level: undefined, industry: undefined })}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/customers/new')}>
            新建客户
          </Button>
        </Space>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={(p) => setPagination({ current: p.current || 1, pageSize: p.pageSize || 10, total: pagination.total })}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default CustomerList;
```

### 8.2 仪表盘页面代码

```tsx
// /Users/chengpeng/cursor/crm-AI-coder/frontend/src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, List, Badge, Avatar } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  ProjectOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Column, Pie, Line } from '@ant-design/charts';
import { getDashboardData } from '../services/dashboardApi';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await getDashboardData();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  // 统计卡片数据
  const statCards = [
    {
      title: '客户总数',
      value: data?.customerCount || 0,
      icon: <UserOutlined />,
      color: '#1677ff',
      trend: 12.5
    },
    {
      title: '本月销售额',
      value: data?.monthlySales || 0,
      prefix: '¥',
      icon: <DollarOutlined />,
      color: '#52c41a',
      trend: 8.3
    },
    {
      title: '待签合同',
      value: data?.pendingContracts || 0,
      icon: <FileTextOutlined />,
      color: '#faad14',
      trend: -2.1
    },
    {
      title: '进行中项目',
      value: data?.activeProjects || 0,
      icon: <ProjectOutlined />,
      color: '#722ed1',
      trend: 5.7
    }
  ];

  // 销售趋势图配置
  const lineConfig = {
    data: data?.salesTrend || [],
    xField: 'month',
    yField: 'amount',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond'
    },
    label: {
      style: {
        fill: '#aaa'
      }
    }
  };

  // 商机分布图配置
  const pieConfig = {
    data: data?.opportunityDistribution || [],
    angleField: 'count',
    colorField: 'stage',
    radius: 0.8,
    label: {
      type: 'outer'
    }
  };

  // 待办事项列
  const todoColumns = [
    {
      title: '任务',
      dataIndex: 'title',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockCircleOutlined style={{ color: '#faad14' }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      width: 120
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (priority: string) => {
        const colors = { high: 'red', medium: 'orange', low: 'green' };
        return <Badge color={colors[priority as keyof typeof colors]} text={priority} />;
      }
    }
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0' }}>仪表盘</h2>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card loading={loading}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#8c8c8c', marginBottom: 8 }}>{card.title}</div>
                  <Statistic
                    value={card.value}
                    prefix={card.prefix}
                    valueStyle={{ fontSize: 28, fontWeight: 'bold' }}
                  />
                  <div style={{ marginTop: 8, fontSize: 12 }}>
                    {card.trend > 0 ? (
                      <span style={{ color: '#52c41a' }}>
                        <RiseOutlined /> 较上月 +{card.trend}%
                      </span>
                    ) : (
                      <span style={{ color: '#ff4d4f' }}>
                        <FallOutlined /> 较上月 {card.trend}%
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: card.color
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="销售趋势" loading={loading}>
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="商机状态分布" loading={loading}>
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 列表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="本月Top客户" loading={loading}>
            <Table
              dataSource={data?.topCustomers || []}
              columns={[
                { title: '客户', dataIndex: 'name' },
                { title: '成交金额', dataIndex: 'amount', render: (v: number) => `¥${v.toLocaleString()}` },
                { title: '合同数', dataIndex: 'contractCount' }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="待办事项" loading={loading}>
            <Table
              dataSource={data?.todos || []}
              columns={todoColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
```

### 8.3 商机看板页面代码

```tsx
// /Users/chengpeng/cursor/crm-AI-coder/frontend/src/pages/opportunities/OpportunityBoard.tsx

import React, { useState, useEffect } from 'react';
import { Card, Tag, Progress, Avatar, Dropdown, Button, Badge } from 'antd';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { Opportunity, OpportunityStage, OpportunityPriority } from '../../types';

interface BoardColumnProps {
  stage: OpportunityStage;
  opportunities: Opportunity[];
  onCardClick: (id: string) => void;
}

// 看板列组件
const BoardColumn: React.FC<BoardColumnProps> = ({ stage, opportunities, onCardClick }) => {
  const { setNodeRef } = useDroppable({ id: stage.id });

  const totalAmount = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        background: '#f5f5f5',
        borderRadius: 8,
        minWidth: 280,
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 列头部 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontWeight: 'bold', marginRight: 8 }}>{stage.name}</span>
          <Badge count={opportunities.length} style={{ backgroundColor: '#8c8c8c' }} />
        </div>
        <div style={{ color: '#1677ff', fontWeight: 'bold' }}>
          ¥{(totalAmount / 10000).toFixed(1)}万
        </div>
      </div>

      {/* 卡片列表 */}
      <div style={{ padding: 12, flex: 1, overflowY: 'auto' }}>
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} onClick={() => onCardClick(opp.id)} />
        ))}
      </div>
    </div>
  );
};

// 商机卡片组件
interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: opportunity.id
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
  } : undefined;

  const priorityColors: Record<OpportunityPriority, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green'
  };

  return (
    <Card
      ref={setNodeRef}
      style={{
        marginBottom: 12,
        cursor: 'pointer',
        ...style
      }}
      bodyStyle={{ padding: 16 }}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontWeight: 'bold', fontSize: 14 }}>{opportunity.name}</span>
      </div>

      <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 8 }}>
        {opportunity.customerName}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
        <span style={{ color: '#1677ff', fontWeight: 'bold', fontSize: 16 }}>
          <DollarOutlined /> ¥{opportunity.amount?.toLocaleString()}
        </span>
        <Tag color={priorityColors[opportunity.priority]}>
          {opportunity.priority === 'high' ? '高' : opportunity.priority === 'medium' ? '中' : '低'}
        </Tag>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
          预计成交: {opportunity.expectedCloseDate}
        </div>
        <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>
          {opportunity.ownerName?.charAt(0)}
        </Avatar>
      </div>

      {opportunity.progress && (
        <Progress
          percent={opportunity.progress}
          size="small"
          style={{ marginTop: 12, marginBottom: 0 }}
        />
      )}
    </Card>
  );
};

// 主页面组件
const OpportunityBoard: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stages] = useState<OpportunityStage[]>([
    { id: 'stage1', name: '初步接洽', order: 1 },
    { id: 'stage2', name: '需求确认', order: 2 },
    { id: 'stage3', name: '方案报价', order: 3 },
    { id: 'stage4', name: '谈判签约', order: 4 }
  ]);

  useEffect(() => {
    // 加载商机数据
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // 更新商机阶段
    }
  };

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stageId === stageId);
  };

  return (
    <div style={{ height: 'calc(100vh - 140px)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h2 style={{ margin: 0 }}>商机管理</h2>
        <div>
          <Button style={{ marginRight: 8 }} onClick={() => navigate('/opportunities/list')}>
            列表视图
          </Button>
          <Button type="primary" onClick={() => navigate('/opportunities/new')}>
            + 新建商机
          </Button>
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          height: '100%'
        }}>
          {stages.map((stage) => (
            <BoardColumn
              key={stage.id}
              stage={stage}
              opportunities={getOpportunitiesByStage(stage.id)}
              onCardClick={(id) => navigate(`/opportunities/${id}`)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default OpportunityBoard;
```

---

## 9. 附录

### 9.1 图标映射表

| 模块 | 图标组件 |
|------|----------|
| 仪表盘 | DashboardOutlined |
| 客户管理 | TeamOutlined / ShopOutlined |
| 商机管理 | RiseOutlined |
| 合同管理 | FileTextOutlined |
| 项目管理 | ProjectOutlined |
| 进度管理 | ClockCircleOutlined |
| 任务管理 | CheckSquareOutlined |
| 风险管理 | WarningOutlined |
| 验收管理 | CheckCircleOutlined |
| 财务管理 | DollarOutlined |
| 审批中心 | AuditOutlined |
| 报表分析 | BarChartOutlined |
| 系统管理 | SettingOutlined |

### 9.2 常用常量定义

```typescript
// /Users/chengpeng/cursor/crm-AI-coder/frontend/src/constants/index.ts

// 客户状态
export const CUSTOMER_STATUS = {
  POTENTIAL: { value: 'potential', label: '潜在客户', color: 'default' },
  ACTIVE: { value: 'active', label: '活跃客户', color: 'success' },
  INACTIVE: { value: 'inactive', label: '流失客户', color: 'error' }
};

// 客户等级
export const CUSTOMER_LEVEL = {
  A: { value: 'A', label: 'A级', color: 'red' },
  B: { value: 'B', label: 'B级', color: 'orange' },
  C: { value: 'C', label: 'C级', color: 'blue' },
  D: { value: 'D', label: 'D级', color: 'default' }
};

// 商机优先级
export const OPPORTUNITY_PRIORITY = {
  HIGH: { value: 'high', label: '高', color: 'red' },
  MEDIUM: { value: 'medium', label: '中', color: 'orange' },
  LOW: { value: 'low', label: '低', color: 'green' }
};

// 合同状态
export const CONTRACT_STATUS = {
  DRAFT: { value: 'draft', label: '草稿', color: 'default' },
  PENDING: { value: 'pending', label: '审批中', color: 'processing' },
  APPROVED: { value: 'approved', label: '已批准', color: 'success' },
  ACTIVE: { value: 'active', label: '履行中', color: 'blue' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'success' },
  REJECTED: { value: 'rejected', label: '已驳回', color: 'error' },
  TERMINATED: { value: 'terminated', label: '已终止', color: 'error' }
};

// 项目状态
export const PROJECT_STATUS = {
  PLANNING: { value: 'planning', label: '规划中', color: 'default' },
  IN_PROGRESS: { value: 'in_progress', label: '进行中', color: 'processing' },
  ON_HOLD: { value: 'on_hold', label: '已暂停', color: 'warning' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'success' },
  CANCELLED: { value: 'cancelled', label: '已取消', color: 'error' }
};

// 任务状态
export const TASK_STATUS = {
  TODO: { value: 'todo', label: '待处理', color: 'default' },
  IN_PROGRESS: { value: 'in_progress', label: '进行中', color: 'processing' },
  REVIEW: { value: 'review', label: '待验收', color: 'warning' },
  DONE: { value: 'done', label: '已完成', color: 'success' }
};
```

### 9.3 响应式工具类

```typescript
// 响应式列数配置
export const responsiveColConfig = {
  xs: 24,    // 移动端：单列
  sm: 12,    // 小屏：2列
  md: 12,    // 中屏：2列
  lg: 8,     // 大屏：3列
  xl: 6,     // 超大屏：4列
  xxl: 6
};

// 响应式统计卡片
export const responsiveStatConfig = {
  xs: 24,
  sm: 12,
  lg: 6
};
```

---

## 10. 设计交付清单

### 10.1 已交付内容
- [x] 设计规范（颜色、字体、间距）
- [x] 布局系统设计
- [x] 各模块页面设计说明
- [x] 组件规范定义
- [x] 交互规范说明
- [x] 响应式设计规则
- [x] React组件代码示例

### 10.2 待开发页面清单
- [ ] 客户管理 - 列表/详情/表单
- [ ] 商机管理 - 看板/列表/详情
- [ ] 合同管理 - 列表/详情/审批
- [ ] 项目管理 - 列表/甘特图/任务看板
- [ ] 审批中心 - 待办/已办/流程
- [ ] 财务管理 - 预算/成本/回款
- [ ] 报表分析 - 各类图表页面
- [ ] 系统管理 - 用户/角色/配置

---

**文档版本**: v1.0
**创建日期**: 2026-03-05
**设计师**: UI/UX Designer Agent
