# 页面布局修复经验

## 问题背景
CRM系统的列表页面（除Dashboard外）存在布局不一致的问题，主要差异：

1. **Dashboard.tsx**（正常）：
   - 根元素: `<div style={{ width: '100%' }}>`
   - 使用 `Row` 和 `Col` 栅格布局
   - 使用 `Card` 包裹统计卡片

2. **其他页面**（问题）：
   - 根元素缺少 `width: '100%'`
   - 标题区域布局方式不一致
   - 搜索表单有的用Card包裹，有的直接暴露

## 统一布局标准

```tsx
<div style={{ width: '100%' }}>
  {/* 页面标题和操作按钮 */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
    <Title level={4} style={{ margin: 0 }}>页面标题</Title>
    <Button type="primary" icon={<PlusOutlined />}>新增</Button>
  </div>

  {/* 搜索区域 - 使用Card包裹 */}
  <Card style={{ marginBottom: 16 }}>
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={12} md={6} lg={5}>
        {/* 搜索字段 */}
      </Col>
    </Row>
  </Card>

  {/* 表格区域 */}
  <Table ... />
</div>
```

## 修复的文件清单

| 文件 | 主要修改 |
|------|---------|
| OpportunityList.tsx | 添加 width: '100%'，搜索表单用 Card + Row/Col 包裹 |
| ContractList.tsx | 同上，添加 Card/Row/Col imports |
| ProjectList.tsx | 同上 |
| ApprovalList.tsx | 添加 width: '100%' |
| UserList.tsx | 添加 width: '100%'，标题区 marginBottom 改为 24 |
| RoleList.tsx | 同上 |

## 关键注意事项

1. 使用 Node.js 脚本进行批量替换比手动编辑更高效
2. 注意检查引号类型（单引号 vs 双引号）
3. 替换前应先备份或确认能回滚
4. 响应式布局使用 `xs`, `sm`, `md`, `lg` 断点
5. 搜索表单的 Form.Item 需要设置 `style={{ marginBottom: 0 }}` 以避免双重间距