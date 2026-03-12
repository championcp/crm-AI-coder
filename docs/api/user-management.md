# 用户管理API文档

## 1. 获取用户列表

### 请求
```
GET /api/users
```

### 查询参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | number | 否 | 页码，默认为1 |
| pageSize | number | 否 | 每页大小，默认为10 |
| keyword | string | 否 | 搜索关键字 |
| role | string | 否 | 角色筛选 |
| department | string | 否 | 部门筛选 |
| status | string | 否 | 状态筛选 |

### 响应
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "uuid",
        "username": "用户名",
        "realName": "真实姓名",
        "phone": "手机号",
        "email": "邮箱",
        "role": "角色",
        "department": "部门",
        "status": "状态",
        "createTime": "创建时间",
        "updateTime": "更新时间"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

## 2. 获取用户详情

### 请求
```
GET /api/users/:id
```

### 响应
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "用户名",
    "realName": "真实姓名",
    "phone": "手机号",
    "email": "邮箱",
    "role": "角色",
    "department": "部门",
    "status": "状态",
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 3. 创建用户

### 请求
```
POST /api/users
```

### 请求体
```json
{
  "username": "用户名",
  "password": "密码",
  "realName": "真实姓名",
  "phone": "手机号",
  "email": "邮箱",
  "role": "角色",
  "department": "部门"
}
```

### 响应
```json
{
  "success": true,
  "message": "用户创建成功",
  "data": {
    "id": "uuid",
    "username": "用户名",
    "realName": "真实姓名",
    "role": "角色",
    "department": "部门"
  }
}
```

## 4. 更新用户

### 请求
```
PUT /api/users/:id
```

### 请求体
```json
{
  "realName": "真实姓名",
  "phone": "手机号",
  "email": "邮箱",
  "role": "角色",
  "department": "部门",
  "status": "状态"
}
```

### 响应
```json
{
  "success": true,
  "message": "用户更新成功",
  "data": {
    "id": "uuid",
    "username": "用户名",
    "realName": "真实姓名",
    "phone": "手机号",
    "email": "邮箱",
    "role": "角色",
    "department": "部门",
    "status": "状态",
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 5. 删除用户

### 请求
```
DELETE /api/users/:id
```

### 响应
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

## 6. 修改用户密码

### 请求
```
PUT /api/users/:id/password
```

### 请求体
```json
{
  "oldPassword": "旧密码",
  "newPassword": "新密码"
}
```

### 响应
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

## 7. 切换用户状态

### 请求
```
PUT /api/users/:id/toggle-status
```

### 响应
```json
{
  "success": true,
  "message": "用户状态切换成功",
  "data": {
    "id": "uuid",
    "status": "状态"
  }
}
```

## 8. 获取角色选项

### 请求
```
GET /api/users/options/roles
```

### 响应
```json
{
  "success": true,
  "data": [
    {
      "value": "system_admin",
      "label": "系统管理员"
    }
  ]
}
```

## 9. 获取部门选项

### 请求
```
GET /api/users/options/departments
```

### 响应
```json
{
  "success": true,
  "data": [
    {
      "value": "销售部",
      "label": "销售部"
    }
  ]
}
```

## 错误响应格式

### 400 错误请求
```json
{
  "success": false,
  "message": "错误信息"
}
```

### 401 未认证
```json
{
  "success": false,
  "message": "未提供认证令牌"
}
```

### 403 权限不足
```json
{
  "success": false,
  "message": "权限不足"
}
```

### 404 未找到
```json
{
  "success": false,
  "message": "用户不存在"
}
```

### 500 服务器错误
```json
{
  "success": false,
  "message": "服务器错误"
}
```