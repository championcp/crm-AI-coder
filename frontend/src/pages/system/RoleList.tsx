/**
 * 角色管理页面
 * 企业项目全流程管理数据系统 - 系统管理模块
 */

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Checkbox,
  Transfer
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Radio } from 'antd';

const { Title, Text } = Typography;

interface RoleRecord {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
  status: string;
  userCount: number;
  permissions: string[];
  createTime: string;
}

const RoleListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoleRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleRecord | null>(null);
  const [form] = Form.useForm();

  const allPermissions = [
    { key: 'dashboard', label: '仪表盘' },
    { key: 'customer_view', label: '客户-查看' },
    { key: 'customer_create', label: '客户-创建' },
    { key: 'customer_edit', label: '客户-编辑' },
    { key: 'customer_delete', label: '客户-删除' },
    { key: 'opportunity_view', label: '商机-查看' },
    { key: 'opportunity_create', label: '商机-创建' },
    { key: 'opportunity_edit', label: '商机-编辑' },
    { key: 'contract_view', label: '合同-查看' },
    { key: 'contract_create', label: '合同-创建' },
    { key: 'contract_approve', label: '合同-审批' },
    { key: 'project_view', label: '项目-查看' },
    { key: 'project_create', label: '项目-创建' },
    { key: 'project_manage', label: '项目-管理' },
    { key: 'task_view', label: '任务-查看' },
    { key: 'task_manage', label: '任务-管理' },
    { key: 'finance_view', label: '财务-查看' },
    { key: 'finance_manage', label: '财务-管理' },
    { key: 'system_user', label: '系统-用户管理' },
    { key: 'system_role', label: '系统-角色管理' },
    { key: 'system_config', label: '系统-系统配置' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const mockData: RoleRecord[] = [
      {
        id: '1',
        roleCode: 'system_admin',
        roleName: '系统管理员',
        description: '拥有系统所有权限',
        status: 'active',
        userCount: 2,
        permissions: allPermissions.map(p => p.key),
        createTime: '2024-01-01'
      },
      {
        id: '2',
        roleCode: 'sales_manager',
        roleName: '销售经理',
        description: '负责销售团队管理',
        status: 'active',
        userCount: 5,
        permissions: ['dashboard', 'customer_view', 'customer_create', 'customer_edit', 'opportunity_view', 'opportunity_create', 'opportunity_edit', 'contract_view'],
        createTime: '2024-01-15'
      },
      {
        id: '3',
        roleCode: 'project_manager',
        roleName: '项目经理',
        description: '负责项目管理',
        status: 'active',
        userCount: 8,
        permissions: ['dashboard', 'project_view', 'project_create', 'project_manage', 'task_view', 'task_manage', 'contract_view'],
        createTime: '2024-02-01'
      },
      {
        id: '4',
        roleCode: 'developer',
        roleName: '开发人员',
        description: '项目开发人员',
        status: 'active',
        userCount: 15,
        permissions: ['dashboard', 'task_view', 'task_manage'],
        createTime: '2024-02-10'
      },
      {
        id: '5',
        roleCode: 'finance_accountant',
        roleName: '财务会计',
        description: '负责财务相关工作',
        status: 'active',
        userCount: 3,
        permissions: ['dashboard', 'finance_view', 'finance_manage', 'contract_view'],
        createTime: '2024-03-01'
      }
    ];
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({ permissions: [] });
    setModalVisible(true);
  };

  const handleEdit = (record: RoleRecord) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: RoleRecord) => {
    setViewingRole(record);
  };

  const handleDelete = async (id: string) => {
    message.success('删除成功');
    fetchData();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success(editingRole ? '更新成功' : '创建成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {}
  };

  const handlePermissionEdit = (record: RoleRecord) => {
    setEditingRole(record);
    form.setFieldsValue({ permissions: record.permissions });
    setPermissionModalVisible(true);
  };

  const handlePermissionSubmit = async () => {
    message.success('权限更新成功');
    setPermissionModalVisible(false);
    fetchData();
  };

  const columns = [
    { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode', width: 120 },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag>
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '操作', key: 'action', width: 220,
      render: (_: any, record: RoleRecord) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handlePermissionEdit(record)}>权限</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除该角色吗?" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>角色管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增角色</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card><Statistic title="总角色数" value={data.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="启用角色" value={data.filter(d => d.status === 'active').length} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="总用户数" value={data.reduce((sum, d) => sum + d.userCount, 0)} /></Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal title={editingRole ? '编辑角色' : '新增角色'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="roleCode" label="角色编码" rules={[{ required: true }]}>
            <Input placeholder="请输入角色编码" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Radio.Group>
              <Radio value="active">启用</Radio>
              <Radio value="inactive">禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="权限配置" open={permissionModalVisible} onOk={handlePermissionSubmit} onCancel={() => setPermissionModalVisible(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="permissions" label="权限">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {allPermissions.map(p => (
                  <Col span={8} key={p.key}>
                    <Checkbox value={p.key}>{p.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleListPage;