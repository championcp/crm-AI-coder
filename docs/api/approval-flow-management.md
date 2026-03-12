# 审批流程管理API文档

## 1. 获取审批流程列表

### 请求
```
GET /api/approval-flows
```

### 查询参数
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | number | 否 | 页码，默认为1 |
| pageSize | number | 否 | 每页大小，默认为10 |
| keyword | string | 否 | 搜索关键字 |
| businessType | string | 否 | 业务类型筛选 |
| status | string | 否 | 状态筛选 |

### 响应
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "uuid",
        "flowCode": "流程编码",
        "flowName": "流程名称",
        "businessType": "业务类型",
        "description": "流程描述",
        "status": "状态",
        "version": 1,
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

## 2. 获取审批流程详情

### 请求
```
GET /api/approval-flows/:id
```

### 响应
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "flowCode": "流程编码",
    "flowName": "流程名称",
    "businessType": "业务类型",
    "description": "流程描述",
    "status": "状态",
    "version": 1,
    "createTime": "创建时间",
    "updateTime": "更新时间",
    "nodes": [
      {
        "id": "uuid",
        "nodeName": "节点名称",
        "nodeOrder": 1,
        "approverType": "审批人类型",
        "approvers": ["审批人1", "审批人2"],
        "conditions": {},
        "status": "状态",
        "flowId": "流程ID",
        "createTime": "创建时间",
        "updateTime": "更新时间"
      }
    ]
  }
}
```

## 3. 创建审批流程

### 请求
```
POST /api/approval-flows
```

### 请求体
```json
{
  "flowCode": "流程编码",
  "flowName": "流程名称",
  "businessType": "业务类型",
  "description": "流程描述",
  "nodes": [
    {
      "nodeName": "节点名称",
      "approverType": "审批人类型",
      "approvers": ["审批人1", "审批人2"],
      "conditions": {}
    }
  ]
}
```

### 响应
```json
{
  "success": true,
  "message": "审批流程创建成功",
  "data": {
    "id": "uuid",
    "flowCode": "流程编码",
    "flowName": "流程名称",
    "businessType": "业务类型",
    "description": "流程描述",
    "status": "draft",
    "version": 1,
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 4. 更新审批流程

### 请求
```
PUT /api/approval-flows/:id
```

### 请求体
```json
{
  "flowName": "流程名称",
  "description": "流程描述",
  "status": "状态",
  "nodes": [
    {
      "nodeName": "节点名称",
      "approverType": "审批人类型",
      "approvers": ["审批人1", "审批人2"],
      "conditions": {}
    }
  ]
}
```

### 响应
```json
{
  "success": true,
  "message": "审批流程更新成功",
  "data": {
    "id": "uuid",
    "flowCode": "流程编码",
    "flowName": "流程名称",
    "businessType": "业务类型",
    "description": "流程描述",
    "status": "状态",
    "version": 1,
    "createTime": "创建时间",
    "updateTime": "更新时间"
  }
}
```

## 5. 删除审批流程

### 请求
```
DELETE /api/approval-flows/:id
```

### 响应
```json
{
  "success": true,
  "message": "审批流程删除成功"
}
```

## 6. 切换审批流程状态

### 请求
```
PUT /api/approval-flows/:id/toggle-status
```

### 响应
```json
{
  "success": true,
  "message": "状态更新成功",
  "data": {
    "id": "uuid",
    "status": "状态"
  }
}
```

## 7. 获取业务类型列表

### 请求
```
GET /api/approval-flows/business-types/list
```

### 响应
```json
{
  "success": true,
  "data": [
    {
      "value": "contract",
      "label": "合同审批"
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
  "message": "审批流程不存在"
}
```

### 500 服务器错误
```json
{
  "success": false,
  "message": "服务器错误"
}
```