# 角色管理API文档

## 1. 获取角色列表

### 请求
```
GET /api/roles
```

### 查询参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | number | 否 | 页码，默认为1 |
| pageSize | number | 否 | 每页大小，默认为10 |
| keyword | string | 否 | 搜索关键字 |
| status | string | 否 | 状态筛选 |

### 响应
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "uuid",
        "roleCode": "角色编码",
        "roleName": "角色名称",
        "description": "角色描述",
        "permissions": ["权限1", "权限2"],
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

## 2. 获取角色详情

### 请求
```
GET /api/roles/:id
```

### 响应
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "roleCode": "角色编码",
    "roleName": "角色名称",
    "description": "角色描述",
    "permissions": ["权限1", "权限2"],
    "status": "状态",
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 3. 创建角色

### 请求
```
POST /api/roles
```

### 请求体
```json
{
  "roleCode": "角色编码",
  "roleName": "角色名称",
  "description": "角色描述",
  "permissions": ["权限1", "权限2"],
  "status": "状态"
}
```

### 响应
```json
{
  "success": true,
  "message": "角色创建成功",
  "data": {
    "id": "uuid",
    "roleCode": "角色编码",
    "roleName": "角色名称",
    "description": "角色描述",
    "permissions": ["权限1", "权限2"],
    "status": "状态",
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 4. 更新角色

### 请求
```
PUT /api/roles/:id
```

### 请求体
```json
{
  "roleName": "角色名称",
  "description": "角色描述",
  "permissions": ["权限1", "权限2"],
  "status": "状态"
}
```

### 响应
```json
{
  "success": true,
  "message": "角色更新成功",
  "data": {
    "id": "uuid",
    "roleCode": "角色编码",
    "roleName": "角色名称",
    "description": "角色描述",
    "permissions": ["权限1", "权限2"],
    "status": "状态",
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 5. 删除角色

### 请求
```
DELETE /api/roles/:id
```

### 响应
```json
{
  "success": true,
  "message": "角色删除成功"
}
```

## 6. 获取权限列表

### 请求
```
GET /api/roles/permissions/list
```

### 响应
```json
{
  "success": true,
  "data": [
    {
      "module": "模块名",
      "actions": ["操作1", "操作2"]
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
  "message": "角色不存在"
}
```

### 500 服务器错误
```json
{
  "success": false,
  "message": "服务器错误"
}
```