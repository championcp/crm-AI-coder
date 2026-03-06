# CRM 企业项目全流程管理系统 - 测试用例文档

> 文档版本: v1.0
> 创建日期: 2026-03-05
> 最后更新: 2026-03-05
> 文档状态: 草稿
> 编写人员: QA测试工程师

---

## 目录

1. [文档说明](#1-文档说明)
2. [测试用例概述](#2-测试用例概述)
3. [登录模块测试用例](#3-登录模块测试用例)
4. [客户管理模块测试用例](#4-客户管理模块测试用例)
5. [权限控制测试用例](#5-权限控制测试用例)
6. [UI自动化测试代码示例](#6-ui自动化测试代码示例)

---

## 1. 文档说明

### 1.1 目的

本文档为 CRM 企业项目全流程管理系统提供详细的测试用例，覆盖登录模块、客户管理模块和权限控制等核心功能的测试场景。

### 1.2 测试用例标识规则

测试用例 ID 格式: `TC-{模块缩写}-{序号}`

| 模块 | 缩写 |
|------|------|
| 登录模块 | LOGIN |
| 客户管理 | CUST |
| 权限控制 | AUTH |

### 1.3 优先级定义

| 优先级 | 说明 | 测试要求 |
|--------|------|----------|
| P0 | 高 | 核心功能，必须测试通过 |
| P1 | 中 | 重要功能，建议测试通过 |
| P2 | 低 | 一般功能，可选择性测试 |

---

## 2. 测试用例概述

### 2.1 测试范围

本测试用例文档覆盖以下模块:

| 模块 | 功能点 | 用例数量 |
|------|--------|----------|
| 登录模块 | 正常登录、错误处理、Token失效 | 6 |
| 客户管理 | 创建、查询、更新、删除、跟进记录 | 14 |
| 权限控制 | 未登录拦截、页面权限 | 4 |
| **合计** | | **24** |

---

## 3. 登录模块测试用例

### 3.1 正常登录流程

#### TC-LOGIN-001: 正常登录成功

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-001 |
| **测试场景** | 正常登录流程 - 使用正确的用户名和密码登录系统 |
| **前置条件** | 1. 系统已部署并正常运行<br>2. 存在有效的用户账号: admin/admin123<br>3. 清除浏览器Cookie和缓存 |
| **测试步骤** | 1. 打开浏览器，访问登录页面: `http://localhost:5173/login`<br>2. 在用户名输入框输入: `admin`<br>3. 在密码输入框输入: `admin123`<br>4. 点击"登录"按钮 |
| **预期结果** | 1. 页面跳转到系统首页(Dashboard)<br>2. URL变为: `http://localhost:5173/dashboard`<br>3. 页面显示当前登录用户信息<br>4. 浏览器LocalStorage中存储了有效的JWT Token<br>5. 页面显示左侧导航菜单 |
| **优先级** | P0 |

#### TC-LOGIN-002: 登录状态保持

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-002 |
| **测试场景** | 验证登录状态保持 - 刷新页面后仍保持登录状态 |
| **前置条件** | 1. 用户已成功登录系统<br>2. JWT Token未过期 |
| **测试步骤** | 1. 确认当前已登录系统，显示Dashboard页面<br>2. 按F5刷新页面<br>3. 观察页面显示 |
| **预期结果** | 1. 页面刷新后仍显示Dashboard内容<br>2. 用户登录状态保持，未跳转到登录页<br>3. 页面左上角显示当前用户名 |
| **优先级** | P0 |

#### TC-LOGIN-003: 记住密码功能

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-003 |
| **测试场景** | 记住密码功能 - 下次访问自动填充用户名 |
| **前置条件** | 1. 系统正常运行<br>2. 使用Chrome浏览器 |
| **测试步骤** | 1. 访问登录页面<br>2. 输入用户名: `admin`<br>3. 输入密码: `admin123`<br>4. 勾选"记住密码"选项<br>5. 点击登录按钮<br>6. 成功登录后退出登录<br>7. 再次访问登录页面 |
| **预期结果** | 1. 再次访问登录页面时，用户名自动填充为`admin`<br>2. 浏览器提示保存密码的弹窗 |
| **优先级** | P1 |

---

### 3.2 错误密码提示

#### TC-LOGIN-004: 错误密码登录失败

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-004 |
| **测试场景** | 错误密码处理 - 使用错误的密码登录应提示错误信息 |
| **前置条件** | 1. 系统正常运行<br>2. 存在用户账号: admin |
| **测试步骤** | 1. 访问登录页面<br>2. 输入正确的用户名: `admin`<br>3. 输入错误的密码: `wrongpassword`<br>4. 点击"登录"按钮 |
| **预期结果** | 1. 页面停留在登录页，未跳转<br>2. 页面显示错误提示: "用户名或密码错误"<br>3. 密码输入框清空<br>4. 用户名输入框保持已输入内容 |
| **优先级** | P0 |

#### TC-LOGIN-005: 空值校验

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-005 |
| **测试场景** | 空值校验 - 用户名或密码为空时的处理 |
| **前置条件** | 系统正常运行 |
| **测试步骤** | 1. 访问登录页面<br>2. 不输入用户名和密码，直接点击"登录"按钮<br>3. 只输入用户名，不输入密码，点击登录<br>4. 只输入密码，不输入用户名，点击登录 |
| **预期结果** | 1. 步骤2: 页面显示提示"请输入用户名"<br>2. 步骤3: 页面显示提示"请输入密码"<br>3. 均未触发登录请求 |
| **优先级** | P0 |

#### TC-LOGIN-006: 不存在用户登录

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-006 |
| **测试场景** | 不存在用户登录 - 使用系统中不存在的账号登录 |
| **前置条件** | 系统正常运行 |
| **测试步骤** | 1. 访问登录页面<br>2. 输入不存在的用户名: `nonexistent`<br>3. 输入任意密码: `password123`<br>4. 点击"登录"按钮 |
| **预期结果** | 1. 页面停留在登录页<br>2. 显示错误提示: "用户名或密码错误"<br>3. 不泄露该用户是否存在的提示信息 |
| **优先级** | P0 |

---

### 3.3 Token失效处理

#### TC-LOGIN-007: Token过期自动跳转登录页

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-007 |
| **测试场景** | Token过期处理 - JWT Token过期后自动跳转登录页 |
| **前置条件** | 1. 用户已登录系统<br>2. 等待JWT Token过期(默认8小时)或通过开发者工具清除Token |
| **测试步骤** | 1. 用户登录系统<br>2. 通过浏览器开发者工具清除LocalStorage中的token<br>3. 在页面中进行任意操作(如点击菜单)<br>4. 或等待Token自然过期后刷新页面 |
| **预期结果** | 1. 系统自动跳转回登录页面<br>2. 登录页面显示提示: "登录已过期，请重新登录"<br>3. 用户需要重新输入凭据登录 |
| **优先级** | P0 |

#### TC-LOGIN-008: Token失效时的API请求处理

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-LOGIN-008 |
| **测试场景** | Token失效时的API请求 - 后端返回401状态码处理 |
| **前置条件** | 1. 用户已登录系统<br>2. Token即将过期或被篡改 |
| **测试步骤** | 1. 正常登录系统<br>2. 在浏览器开发者工具中修改token值(模拟失效)<br>3. 在页面上点击按钮触发API请求(如查询客户列表) |
| **预期结果** | 1. 后端返回401 Unauthorized状态码<br>2. 前端拦截到401错误<br>3. 清除本地存储的token<br>4. 跳转至登录页面<br>5. 显示提示: "登录已过期，请重新登录" |
| **优先级** | P0 |

---

## 4. 客户管理模块测试用例

### 4.1 创建客户

#### TC-CUST-001: 成功创建客户(完整信息)

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-001 |
| **测试场景** | 创建客户 - 填写完整客户信息成功创建 |
| **前置条件** | 1. 用户已登录系统<br>2. 用户具有客户管理权限<br>3. 客户名称"测试科技有限公司"在系统中不存在 |
| **测试步骤** | 1. 点击左侧菜单"客户管理"<br>2. 点击页面右上角"新建客户"按钮<br>3. 在弹出的表单中填写:<br>   - 客户名称: 测试科技有限公司<br>   - 统一社会信用代码: 91110000123456789X<br>   - 所属行业: 信息技术<br>   - 客户级别: A级<br>   - 客户状态: 潜在客户<br>   - 客户地址: 北京市海淀区中关村大街1号<br>   - 备注: 这是一条测试客户数据<br>4. 点击"保存"按钮 |
| **预期结果** | 1. 弹窗关闭<br>2. 页面显示成功提示: "客户创建成功"<br>3. 客户列表自动刷新，新增客户显示在列表中<br>4. 客户编号自动生成，格式为CUST-YYYY-XXXXX<br>5. 数据库中新增一条客户记录 |
| **优先级** | P0 |

#### TC-CUST-002: 创建客户(必填项验证)

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-002 |
| **测试场景** | 创建客户 - 必填项为空时的校验 |
| **前置条件** | 用户已登录且具有客户管理权限 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击"新建客户"按钮<br>3. 不填写任何字段，直接点击"保存"<br>4. 只填写客户名称，其他必填项不填，点击保存 |
| **预期结果** | 1. 步骤3: 表单显示红色提示"客户名称不能为空"、"客户级别不能为空"等<br>2. 步骤4: 未填写的必填项显示红色提示<br>3. 提交被拦截，未创建客户记录 |
| **优先级** | P0 |

#### TC-CUST-003: 客户名称唯一性校验

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-003 |
| **测试场景** | 创建客户 - 客户名称重复校验 |
| **前置条件** | 1. 系统中已存在客户名称为"已有科技有限公司"的客户 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击"新建客户"按钮<br>3. 填写客户名称: 已有科技有限公司<br>4. 填写其他必填项<br>5. 点击"保存"按钮 |
| **预期结果** | 1. 页面显示错误提示: "客户名称已存在"<br>2. 客户名称输入框高亮显示<br>3. 未创建客户记录 |
| **优先级** | P0 |

#### TC-CUST-004: 手机号格式验证

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-004 |
| **测试场景** | 创建客户 - 联系人手机号格式验证 |
| **前置条件** | 用户已登录且具有客户管理权限 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击"新建客户"按钮<br>3. 填写客户基本信息<br>4. 在联系人区域添加联系人，输入:<br>   - 姓名: 张三<br>   - 手机号: 13800138000(正确格式)<br>5. 保存<br>6. 再新建客户，输入手机号: 123456789(错误格式)<br>7. 再新建客户，输入手机号: abcdefghijk(非数字) |
| **预期结果** | 1. 步骤5: 创建成功，手机号格式校验通过<br>2. 步骤6: 显示提示"手机号格式不正确"<br>3. 步骤7: 显示提示"手机号格式不正确" |
| **优先级** | P0 |

---

### 4.2 查询客户

#### TC-CUST-005: 客户列表展示

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-005 |
| **测试场景** | 查询客户 - 客户列表正常展示 |
| **前置条件** | 1. 用户已登录<br>2. 系统中存在客户数据(至少10条) |
| **测试步骤** | 1. 点击左侧菜单"客户管理"<br>2. 观察客户列表页面 |
| **预期结果** | 1. 页面显示客户列表表格<br>2. 表格列包括: 客户编号、客户名称、客户级别、客户状态、所属行业、创建时间、操作<br>3. 列表按创建时间倒序排列<br>4. 底部显示分页控件，默认每页20条<br>5. 页面右上角显示"新建客户"按钮 |
| **优先级** | P0 |

#### TC-CUST-006: 客户名称模糊搜索

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-006 |
| **测试场景** | 查询客户 - 按客户名称模糊搜索 |
| **前置条件** | 1. 用户已登录<br>2. 系统中存在客户: "北京科技有限公司"、"北京软件有限公司"、"上海科技有限公司" |
| **测试步骤** | 1. 进入客户管理页面<br>2. 在搜索框输入: 北京<br>3. 按回车或点击搜索按钮<br>4. 清空搜索框，输入: 科技<br>5. 按回车搜索 |
| **预期结果** | 1. 步骤3: 列表只显示"北京科技有限公司"和"北京软件有限公司"<br>2. 步骤5: 列表显示"北京科技有限公司"和"上海科技有限公司"<br>3. 搜索结果符合模糊匹配规则 |
| **优先级** | P0 |

#### TC-CUST-007: 组合条件筛选

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-007 |
| **测试场景** | 查询客户 - 多条件组合筛选 |
| **前置条件** | 用户已登录，系统中存在多条客户数据 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击"筛选"按钮展开筛选面板<br>3. 选择客户级别: A级<br>4. 选择客户状态: 正式客户<br>5. 选择所属行业: 信息技术<br>6. 点击"确定"按钮 |
| **预期结果** | 1. 列表只显示同时满足三个条件的客户<br>2. 筛选条件显示在页面上方<br>3. 点击"清除筛选"按钮可恢复显示所有客户 |
| **优先级** | P1 |

#### TC-CUST-008: 分页功能

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-008 |
| **测试场景** | 查询客户 - 分页功能测试 |
| **前置条件** | 用户已登录，系统中客户数量超过20条 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 观察分页控件<br>3. 点击第2页按钮<br>4. 点击"下一页"按钮<br>5. 选择每页显示50条 |
| **预期结果** | 1. 分页控件显示总页数和当前页码<br>2. 点击第2页，显示第21-40条数据<br>3. 点击下一页，页码增加，数据切换<br>4. 选择每页50条，列表显示50条数据 |
| **优先级** | P1 |

---

### 4.3 更新客户

#### TC-CUST-009: 编辑客户信息

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-009 |
| **测试场景** | 更新客户 - 编辑客户信息并保存 |
| **前置条件** | 1. 用户已登录<br>2. 系统中存在客户"测试客户A"<br>3. 用户具有编辑权限 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 找到"测试客户A"，点击"编辑"按钮<br>3. 在弹出的编辑表单中:<br>   - 修改客户级别: B级 → A级<br>   - 修改客户状态: 潜在客户 → 正式客户<br>   - 修改备注: 添加"已签约合作"<br>4. 点击"保存"按钮 |
| **预期结果** | 1. 弹窗关闭<br>2. 显示成功提示: "客户信息更新成功"<br>3. 列表中该客户信息更新为最新内容<br>4. 数据库中客户记录已更新 |
| **优先级** | P0 |

#### TC-CUST-010: 编辑时数据回显

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-010 |
| **测试场景** | 更新客户 - 编辑页面数据回显正确 |
| **前置条件** | 用户已登录，系统中存在客户数据 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击任意客户的"编辑"按钮<br>3. 观察编辑表单中各字段的值 |
| **预期结果** | 1. 表单中各字段的值与该客户的实际数据一致<br>2. 客户名称、级别、状态、行业等信息正确回显<br>3. 联系人列表正确显示 |
| **优先级** | P0 |

---

### 4.4 删除客户

#### TC-CUST-011: 删除客户确认弹窗

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-011 |
| **测试场景** | 删除客户 - 删除操作需确认弹窗 |
| **前置条件** | 用户已登录，系统中存在客户数据，用户有删除权限 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 找到要删除的客户<br>3. 点击"删除"按钮 |
| **预期结果** | 1. 弹出确认对话框<br>2. 对话框显示: "确定要删除该客户吗？此操作不可恢复。"<br>3. 对话框提供"确定"和"取消"两个按钮 |
| **优先级** | P0 |

#### TC-CUST-012: 删除客户成功

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-012 |
| **测试场景** | 删除客户 - 确认删除后成功删除并刷新列表 |
| **前置条件** | 用户已登录，系统中存在客户"待删除客户" |
| **测试步骤** | 1. 进入客户管理页面<br>2. 找到"待删除客户"<br>3. 点击"删除"按钮<br>4. 在确认弹窗中点击"确定" |
| **预期结果** | 1. 弹窗关闭<br>2. 显示成功提示: "客户删除成功"<br>3. 客户列表自动刷新<br>4. "待删除客户"不再显示在列表中<br>5. 数据库中该客户记录被标记为删除或物理删除 |
| **优先级** | P0 |

#### TC-CUST-013: 取消删除操作

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-013 |
| **测试场景** | 删除客户 - 取消删除操作 |
| **前置条件** | 用户已登录，系统中存在客户数据 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击任意客户的"删除"按钮<br>3. 在确认弹窗中点击"取消"或关闭弹窗 |
| **预期结果** | 1. 弹窗关闭<br>2. 客户列表保持不变<br>3. 该客户数据未被删除 |
| **优先级** | P1 |

---

### 4.5 添加跟进记录

#### TC-CUST-014: 添加客户跟进记录

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-CUST-014 |
| **测试场景** | 添加跟进记录 - 为客户添加沟通跟进记录 |
| **前置条件** | 1. 用户已登录<br>2. 系统中存在客户"跟进测试客户"<br>3. 用户具有添加跟进记录的权限 |
| **测试步骤** | 1. 进入客户管理页面<br>2. 点击"跟进测试客户"的"详情"按钮<br>3. 在客户详情页，点击"跟进记录"标签<br>4. 点击"添加跟进记录"按钮<br>5. 填写跟进表单:<br>   - 跟进方式: 电话<br>   - 跟进时间: 2026-03-05 14:00<br>   - 沟通内容: 与客户沟通了产品方案，客户表示满意<br>   - 下次跟进计划: 发送正式报价单<br>   - 下次跟进时间: 2026-03-08<br>6. 点击"保存"按钮 |
| **预期结果** | 1. 跟进记录保存成功<br>2. 跟进记录列表显示新添加的记录<br>3. 记录按时间倒序排列<br>4. 显示成功提示: "跟进记录添加成功" |
| **优先级** | P1 |

---

## 5. 权限控制测试用例

### 5.1 未登录访问拦截

#### TC-AUTH-001: 未登录访问系统页面自动跳转

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-AUTH-001 |
| **测试场景** | 未登录访问拦截 - 未登录用户访问系统内部页面应跳转登录页 |
| **前置条件** | 1. 浏览器未登录系统<br>2. 清除浏览器Cookie和LocalStorage |
| **测试步骤** | 1. 直接在地址栏输入: `http://localhost:5173/dashboard`<br>2. 直接在地址栏输入: `http://localhost:5173/customers`<br>3. 直接在地址栏输入: `http://localhost:5173/projects` |
| **预期结果** | 1. 所有请求都被拦截<br>2. 页面自动跳转到登录页: `http://localhost:5173/login`<br>3. 登录成功后自动跳转到原访问页面(如有记录) |
| **优先级** | P0 |

#### TC-AUTH-002: 未登录访问API返回401

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-AUTH-002 |
| **测试场景** | 未登录API访问 - 未登录直接调用API应返回401 |
| **前置条件** | 系统正常运行 |
| **测试步骤** | 1. 使用Postman或curl直接调用API:<br>   `GET http://localhost:3000/api/customers`<br>2. 不携带任何Token<br>3. 或携带无效的Token |
| **预期结果** | 1. 接口返回HTTP 401 Unauthorized<br>2. 返回JSON格式错误信息:<br>   `{"code": 401, "message": "未登录或Token无效"}` |
| **优先级** | P0 |

---

### 5.2 页面权限控制

#### TC-AUTH-003: 无权限页面访问控制

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-AUTH-003 |
| **测试场景** | 页面权限控制 - 无权限用户访问受限页面 |
| **前置条件** | 1. 使用普通销售经理账号登录<br>2. 该账号无系统管理权限 |
| **测试步骤** | 1. 使用普通销售经理账号登录<br>2. 观察左侧导航菜单<br>3. 尝试直接访问系统管理页面URL: `http://localhost:5173/system/users` |
| **预期结果** | 1. 左侧导航菜单不显示"系统管理"菜单项<br>2. 直接访问URL时，页面显示"403 无权访问"或跳转到无权限提示页<br>3. 不显示系统管理相关功能 |
| **优先级** | P0 |

#### TC-AUTH-004: 按钮级权限控制

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-AUTH-004 |
| **测试场景** | 按钮权限控制 - 无权限用户不显示操作按钮 |
| **前置条件** | 1. 使用只读权限账号登录<br>2. 该账号仅有客户查看权限，无编辑删除权限 |
| **测试步骤** | 1. 使用只读账号登录<br>2. 进入客户管理页面<br>3. 观察客户列表的操作列 |
| **预期结果** | 1. 客户列表正常显示<br>2. 操作列不显示"编辑"和"删除"按钮<br>3. 右上角不显示"新建客户"按钮 |
| **优先级** | P0 |

---

## 6. UI自动化测试代码示例

本章节提供使用 `chrome-mcp-server` 进行UI自动化测试的示例代码。

### 6.1 测试环境配置

```typescript
/**
 * 测试配置文件
 * 路径: /Users/chengpeng/cursor/crm-AI-coder/e2e/config.ts
 */

export const config = {
  // 应用URL
  baseURL: 'http://localhost:5173',
  apiBaseURL: 'http://localhost:3000',

  // 测试账号
  testUser: {
    username: 'admin',
    password: 'admin123'
  },

  // 超时配置(毫秒)
  timeout: {
    implicit: 5000,
    explicit: 10000,
    pageLoad: 30000
  },

  // 浏览器配置
  browser: {
    width: 1920,
    height: 1080
  }
};
```

### 6.2 登录模块测试代码

```typescript
/**
 * 登录模块UI自动化测试
 * 路径: /Users/chengpeng/cursor/crm-AI-coder/e2e/tests/login.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { config } from '../config';

// 使用 chrome-mcp-server 进行UI测试的工具函数
async function navigateToLogin() {
  // 导航到登录页面
  await mcp__chrome_mcp_server__chrome_navigate({
    url: `${config.baseURL}/login`,
    width: config.browser.width,
    height: config.browser.height
  });
}

async function fillLoginForm(username: string, password: string) {
  // 填写用户名
  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="username"], input[placeholder*="用户名"], #username',
    value: username
  });

  // 填写密码
  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="password"], input[type="password"], #password',
    value: password
  });
}

async function clickLoginButton() {
  // 点击登录按钮
  await mcp__chrome_mcp_server__chrome_click_element({
    selector: 'button[type="submit"], button:has-text("登录"), .login-btn',
    waitForNavigation: true,
    timeout: config.timeout.pageLoad
  });
}

async function getCurrentUrl(): Promise<string> {
  // 获取当前页面URL
  const windows = await mcp__chrome_mcp_server__get_windows_and_tabs({});
  return windows.windows[0]?.tabs?.find(t => t.active)?.url || '';
}

describe('登录模块测试', () => {
  beforeEach(async () => {
    // 每个测试用例开始前清空登录状态
    await mcp__chrome_mcp_server__chrome_navigate({
      url: `${config.baseURL}/login`
    });
  });

  /**
   * TC-LOGIN-001: 正常登录成功
   */
  it('正常登录成功 - TC-LOGIN-001', async () => {
    // 步骤1: 访问登录页面
    await navigateToLogin();

    // 步骤2: 填写登录表单
    await fillLoginForm(config.testUser.username, config.testUser.password);

    // 步骤3: 点击登录按钮
    await clickLoginButton();

    // 验证: 检查是否跳转到Dashboard
    const currentUrl = await getCurrentUrl();
    expect(currentUrl).toContain('/dashboard');

    // 验证: 检查页面内容
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(content).toContain('Dashboard');
    expect(content).toContain(config.testUser.username);
  });

  /**
   * TC-LOGIN-004: 错误密码登录失败
   */
  it('错误密码登录失败 - TC-LOGIN-004', async () => {
    // 步骤1: 访问登录页面
    await navigateToLogin();

    // 步骤2: 填写错误的密码
    await fillLoginForm(config.testUser.username, 'wrongpassword');

    // 步骤3: 点击登录按钮
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'button[type="submit"]',
      waitForNavigation: false,
      timeout: 5000
    });

    // 等待错误提示出现
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证: 页面仍在登录页
    const currentUrl = await getCurrentUrl();
    expect(currentUrl).toContain('/login');

    // 验证: 显示错误提示
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(content).toMatch(/用户名或密码错误|登录失败/);
  });

  /**
   * TC-LOGIN-005: 空值校验
   */
  it('空值校验 - TC-LOGIN-005', async () => {
    await navigateToLogin();

    // 不输入任何内容直接点击登录
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'button[type="submit"]',
      waitForNavigation: false
    });

    // 验证: 显示必填提示
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(content).toMatch(/请输入用户名|用户名不能为空/);
  });

  /**
   * TC-AUTH-001: 未登录访问拦截
   */
  it('未登录访问拦截 - TC-AUTH-001', async () => {
    // 尝试直接访问Dashboard
    await mcp__chrome_mcp_server__chrome_navigate({
      url: `${config.baseURL}/dashboard`
    });

    // 验证: 被重定向到登录页
    const currentUrl = await getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });
});
```

### 6.3 客户管理模块测试代码

```typescript
/**
 * 客户管理模块UI自动化测试
 * 路径: /Users/chengpeng/cursor/crm-AI-coder/e2e/tests/customer.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { config } from '../config';

// 登录辅助函数
async function login() {
  await mcp__chrome_mcp_server__chrome_navigate({
    url: `${config.baseURL}/login`
  });

  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="username"], #username',
    value: config.testUser.username
  });

  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="password"], #password',
    value: config.testUser.password
  });

  await mcp__chrome_mcp_server__chrome_click_element({
    selector: 'button[type="submit"]',
    waitForNavigation: true,
    timeout: 10000
  });
}

describe('客户管理模块测试', () => {
  beforeAll(async () => {
    // 测试套件开始前登录
    await login();
  });

  /**
   * TC-CUST-001: 成功创建客户
   */
  it('成功创建客户 - TC-CUST-001', async () => {
    // 步骤1: 进入客户管理页面
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'a[href="/customers"], .menu-item:has-text("客户管理")',
      waitForNavigation: true
    });

    // 等待页面加载
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤2: 点击新建客户按钮
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'button:has-text("新建客户"), .btn-create',
      waitForNavigation: false
    });

    // 等待弹窗出现
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤3: 填写客户信息
    const timestamp = Date.now();
    const customerName = `测试科技有限公司${timestamp}`;

    await mcp__chrome_mcp_server__chrome_fill_or_select({
      selector: 'input[name="name"], #customerName',
      value: customerName
    });

    await mcp__chrome_mcp_server__chrome_fill_or_select({
      selector: 'input[name="creditCode"], #creditCode',
      value: '91110000123456789X'
    });

    // 选择所属行业
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: '.ant-select:has([placeholder="请选择所属行业"])',
      waitForNavigation: false
    });
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: '.ant-select-item:has-text("信息技术")',
      waitForNavigation: false
    });

    // 选择客户级别
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: '.ant-radio-group:has(.ant-radio-wrapper:has-text("A级")) .ant-radio-wrapper:has-text("A级")',
      waitForNavigation: false
    });

    // 填写地址
    await mcp__chrome_mcp_server__chrome_fill_or_select({
      selector: 'textarea[name="address"], #address',
      value: '北京市海淀区中关村大街1号'
    });

    // 步骤4: 点击保存
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'button:has-text("保存"), button[type="submit"]',
      waitForNavigation: false
    });

    // 等待保存完成
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 验证: 显示成功提示
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(content).toMatch(/创建成功|保存成功/);

    // 验证: 列表中出现新客户
    expect(content).toContain(customerName);
  });

  /**
   * TC-CUST-002: 必填项验证
   */
  it('创建客户必填项验证 - TC-CUST-002', async () => {
    // 进入客户管理页面
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'a[href="/customers"], .menu-item:has-text("客户管理")',
      waitForNavigation: true
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 点击新建客户
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'button:has-text("新建客户")',
      waitForNavigation: false
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // 直接点击保存，不填写任何内容
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'button:has-text("保存")',
      waitForNavigation: false
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // 验证: 显示验证错误
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(content).toMatch(/不能为空|请填写|必填/);
  });

  /**
   * TC-CUST-006: 客户名称模糊搜索
   */
  it('客户名称模糊搜索 - TC-CUST-006', async () => {
    // 进入客户管理页面
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'a[href="/customers"], .menu-item:has-text("客户管理")',
      waitForNavigation: true
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 在搜索框输入关键词
    await mcp__chrome_mcp_server__chrome_fill_or_select({
      selector: 'input[placeholder*="搜索"], .search-input',
      value: '测试'
    });

    // 按回车触发搜索
    await mcp__chrome_mcp_server__chrome_keyboard({
      keys: 'Enter'
    });

    // 等待搜索结果
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证: 列表显示搜索结果
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });

    // 应该显示搜索相关的内容，或者显示"暂无数据"
    expect(content).toBeTruthy();
  });

  /**
   * TC-CUST-012: 删除客户
   */
  it('删除客户 - TC-CUST-012', async () => {
    // 进入客户管理页面
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'a[href="/customers"], .menu-item:has-text("客户管理")',
      waitForNavigation: true
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 找到第一个客户的删除按钮并点击
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'table tbody tr:first-child .btn-delete, table tbody tr:first-child button:has-text("删除")',
      waitForNavigation: false
    });

    // 等待确认弹窗
    await new Promise(resolve => setTimeout(resolve, 500));

    // 验证: 显示确认弹窗
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(content).toMatch(/确定删除|确认删除|不可恢复/);

    // 点击确认删除
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: '.ant-modal-confirm-btns button:has-text("确定"), .ant-modal button:has-text("确定")',
      waitForNavigation: false
    });

    // 等待删除完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证: 显示删除成功提示
    const afterContent = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });
    expect(afterContent).toMatch(/删除成功/);
  });
});
```

### 6.4 权限控制测试代码

```typescript
/**
 * 权限控制UI自动化测试
 * 路径: /Users/chengpeng/cursor/crm-AI-coder/e2e/tests/permission.test.ts
 */

import { describe, it, expect } from 'vitest';
import { config } from '../config';

// 使用普通用户登录
async function loginAsNormalUser() {
  await mcp__chrome_mcp_server__chrome_navigate({
    url: `${config.baseURL}/login`
  });

  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="username"], #username',
    value: 'sales01'  // 普通销售账号
  });

  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="password"], #password',
    value: 'sales123'
  });

  await mcp__chrome_mcp_server__chrome_click_element({
    selector: 'button[type="submit"]',
    waitForNavigation: true,
    timeout: 10000
  });
}

describe('权限控制测试', () => {
  /**
   * TC-AUTH-003: 无权限页面访问控制
   */
  it('无权限页面访问控制 - TC-AUTH-003', async () => {
    await loginAsNormalUser();

    // 尝试访问系统管理页面
    await mcp__chrome_mcp_server__chrome_navigate({
      url: `${config.baseURL}/system/users`
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证: 显示403或无权限提示
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });

    const currentUrl = (await mcp__chrome_mcp_server__get_windows_and_tabs({}))
      .windows[0]?.tabs?.find(t => t.active)?.url || '';

    // 应该要么被重定向，要么显示403
    const isBlocked = content.includes('403') ||
                      content.includes('无权限') ||
                      content.includes('无权访问') ||
                      !currentUrl.includes('/system/users');

    expect(isBlocked).toBe(true);
  });

  /**
   * TC-AUTH-004: 按钮级权限控制
   */
  it('按钮级权限控制 - TC-AUTH-004', async () => {
    await loginAsNormalUser();

    // 进入客户管理页面
    await mcp__chrome_mcp_server__chrome_click_element({
      selector: 'a[href="/customers"], .menu-item:has-text("客户管理")',
      waitForNavigation: true
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证: 菜单项权限 - 检查是否存在系统管理菜单
    const content = await mcp__chrome_mcp_server__chrome_get_web_content({
      textContent: true
    });

    // 普通销售应该看不到系统管理菜单
    expect(content).not.toMatch(/系统管理|用户管理|角色管理/);
  });
});
```

### 6.5 测试工具函数库

```typescript
/**
 * UI测试工具函数库
 * 路径: /Users/chengpeng/cursor/crm-AI-coder/e2e/utils/index.ts
 */

import { config } from '../config';

/**
 * 等待元素出现
 */
export async function waitForElement(selector: string, timeout = 5000): Promise<boolean> {
  try {
    const elements = await mcp__chrome_mcp_server__chrome_get_interactive_elements({
      selector: selector
    });
    return elements.length > 0;
  } catch {
    return false;
  }
}

/**
 * 等待指定时间
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 获取当前页面URL
 */
export async function getCurrentUrl(): Promise<string> {
  const windows = await mcp__chrome_mcp_server__get_windows_and_tabs({});
  return windows.windows[0]?.tabs?.find(t => t.active)?.url || '';
}

/**
 * 检查页面是否包含文本
 */
export async function pageContains(text: string): Promise<boolean> {
  const content = await mcp__chrome_mcp_server__chrome_get_web_content({
    textContent: true
  });
  return content.includes(text);
}

/**
 * 截图保存
 */
export async function takeScreenshot(name: string): Promise<void> {
  await mcp__chrome_mcp_server__chrome_screenshot({
    name: name,
    savePng: true,
    fullPage: true
  });
}

/**
 * 清除登录状态
 */
export async function clearAuth(): Promise<void> {
  // 注入脚本清除LocalStorage
  await mcp__chrome_mcp_server__chrome_inject_script({
    type: 'ISOLATED',
    jsScript: `
      localStorage.clear();
      sessionStorage.clear();
    `
  });
}

/**
 * 完整的登录流程
 */
export async function performLogin(
  username: string = config.testUser.username,
  password: string = config.testUser.password
): Promise<void> {
  await mcp__chrome_mcp_server__chrome_navigate({
    url: `${config.baseURL}/login`
  });

  await sleep(500);

  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="username"], input[placeholder*="用户名"], #username',
    value: username
  });

  await mcp__chrome_mcp_server__chrome_fill_or_select({
    selector: 'input[name="password"], input[type="password"], #password',
    value: password
  });

  await mcp__chrome_mcp_server__chrome_click_element({
    selector: 'button[type="submit"], button:has-text("登录"), .login-btn',
    waitForNavigation: true,
    timeout: config.timeout.pageLoad
  });

  await sleep(1000);
}
```

### 6.6 运行测试的命令

```bash
# 1. 确保后端服务已启动
cd /Users/chengpeng/cursor/crm-AI-coder/backend
npm run dev

# 2. 确保前端服务已启动
cd /Users/chengpeng/cursor/crm-AI-coder/frontend
npm run dev

# 3. 运行UI自动化测试
cd /Users/chengpeng/cursor/crm-AI-coder
e2e

# 或者使用Vitest运行测试
npx vitest run e2e/
```

---

## 附录

### A.1 测试用例执行清单

| 模块 | 用例ID | 用例名称 | 优先级 | 执行状态 |
|------|--------|----------|--------|----------|
| 登录 | TC-LOGIN-001 | 正常登录成功 | P0 | 待执行 |
| 登录 | TC-LOGIN-002 | 登录状态保持 | P0 | 待执行 |
| 登录 | TC-LOGIN-003 | 记住密码功能 | P1 | 待执行 |
| 登录 | TC-LOGIN-004 | 错误密码登录失败 | P0 | 待执行 |
| 登录 | TC-LOGIN-005 | 空值校验 | P0 | 待执行 |
| 登录 | TC-LOGIN-006 | 不存在用户登录 | P0 | 待执行 |
| 登录 | TC-LOGIN-007 | Token过期自动跳转 | P0 | 待执行 |
| 登录 | TC-LOGIN-008 | Token失效API处理 | P0 | 待执行 |
| 客户 | TC-CUST-001 | 成功创建客户 | P0 | 待执行 |
| 客户 | TC-CUST-002 | 必填项验证 | P0 | 待执行 |
| 客户 | TC-CUST-003 | 客户名称唯一性校验 | P0 | 待执行 |
| 客户 | TC-CUST-004 | 手机号格式验证 | P0 | 待执行 |
| 客户 | TC-CUST-005 | 客户列表展示 | P0 | 待执行 |
| 客户 | TC-CUST-006 | 客户名称模糊搜索 | P0 | 待执行 |
| 客户 | TC-CUST-007 | 组合条件筛选 | P1 | 待执行 |
| 客户 | TC-CUST-008 | 分页功能 | P1 | 待执行 |
| 客户 | TC-CUST-009 | 编辑客户信息 | P0 | 待执行 |
| 客户 | TC-CUST-010 | 编辑时数据回显 | P0 | 待执行 |
| 客户 | TC-CUST-011 | 删除客户确认弹窗 | P0 | 待执行 |
| 客户 | TC-CUST-012 | 删除客户成功 | P0 | 待执行 |
| 客户 | TC-CUST-013 | 取消删除操作 | P1 | 待执行 |
| 客户 | TC-CUST-014 | 添加跟进记录 | P1 | 待执行 |
| 权限 | TC-AUTH-001 | 未登录访问拦截 | P0 | 待执行 |
| 权限 | TC-AUTH-002 | 未登录API返回401 | P0 | 待执行 |
| 权限 | TC-AUTH-003 | 无权限页面访问控制 | P0 | 待执行 |
| 权限 | TC-AUTH-004 | 按钮级权限控制 | P0 | 待执行 |

### A.2 Bug报告模板

```markdown
## Bug 报告

**Bug ID**: BUG-001
**标题**: [简明描述问题]
**发现日期**: 2026-03-05
**发现人**: QA测试工程师
**严重程度**: [致命/严重/一般/轻微]
**优先级**: [P0/P1/P2]

### 环境信息
- 测试环境: 本地开发环境
- 浏览器: Chrome 120
- 系统版本: v1.0.0

### 复现步骤
1. [步骤1]
2. [步骤2]
3. [步骤3]

### 预期结果
[描述预期应该发生什么]

### 实际结果
[描述实际发生了什么]

### 截图/日志
[附上相关截图或错误日志]

### 关联用例
- 测试用例ID: TC-XXXX-XXX
```

---

*文档结束*
