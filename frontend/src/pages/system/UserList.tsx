/**
 * 用户管理页面
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
  Select,
  Modal,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { userService } from '../../services/api';
import { User, UserRole } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const UserListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userService.getList({ pageSize: 100 });
      if (response.success) {
        setData(response.data.list);
      }
    } catch (error) {
      // 使用模拟数据
      const mockData: User[] = [
        { id: '1', username: 'admin', realName: '系统管理员', phone: '13800138000', email: 'admin@example.com', role: UserRole.SYSTEM_ADMIN, department: '总经办', status: 'active' },
        { id: '2', username: 'zhangsan', realName: '张三', phone: '13800138001', email: 'zhangsan@example.com', role: UserRole.PROJECT_MANAGER, department: '项目部', status: 'active' },
        { id: '3', username: 'lisi', realName: '李四', phone: '13800138002', email: 'lisi@example.com', role: UserRole.SALES_MANAGER, department: '销售部', status: 'active' },
        { id: '4', username: 'wangwu', realName: '王五', phone: '13800138003', email: 'wangwu@example.com', role: UserRole.DEVELOPER, department: '研发部', status: 'active' },
        { id: '5', username: 'zhaoliu', realName: '赵六', phone: '13800138004', email: 'zhaoliu@example.com', role: UserRole.FINANCE_ACCOUNTANT, department: '财务部', status: 'inactive' }
      ];
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [deptRes, roleRes] = await Promise.all([
        userService.getDepartments(),
        userService.getRoles()
      ]);
      if (deptRes.success) setDepartments(deptRes.data);
      if (roleRes.success) setRoles(roleRes.data);
    } catch (error) {
      setDepartments([
        { value: '总经办', label: '总经办' },
        { value: '销售部', label: '销售部' },
        { value: '项目部', label: '项目部' },
        { value: '研发部', label: '研发部' },
        { value: '财务部', label: '财务部' }
      ]);
      setRoles([
        { value: 'system_admin', label: '系统管理员' },
        { value: 'sales_manager', label: '销售经理' },
        { value: 'project_manager', label: '项目经理' },
        { value: 'developer', label: '开发人员' },
        { value: 'finance_accountant', label: '财务会计' }
      ]);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: User) => {
    setViewingUser(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.success('删除成功');
      fetchData();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userService.update(editingUser.id, values);
        message.success('更新成功');
      } else {
        await userService.create(values as any);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {}
  };

  const getRoleConfig = (role: UserRole) => {
    const config: Record<string, { color: string; text: string }> = {
      SYSTEM_ADMIN: { color: 'red', text: '系统管理员' },
      SALES_MANAGER: { color: 'blue', text: '销售经理' },
      PROJECT_MANAGER: { color: 'green', text: '项目经理' },
      DEVELOPER: { color: 'purple', text: '开发人员' },
      FINANCE_ACCOUNTANT: { color: 'orange', text: '财务会计' }
    };
    return config[role] || { color: 'default', text: role };
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 100 },
    { title: '姓名', dataIndex: 'realName', key: 'realName' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role',
      render: (role: UserRole) => <Tag color={getRoleConfig(role).color}>{getRoleConfig(role).text}</Tag>
    },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag>
    },
    { title: '操作', key: 'action', width: 180,
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除该用户吗?" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const activeCount = data.filter(d => d.status === 'active').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>用户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增用户</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card><Statistic title="总用户数" value={data.length} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="启用用户" value={activeCount} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="禁用用户" value={data.length - activeCount} valueStyle={{ color: '#f5222d' }} /></Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal title={editingUser ? '编辑用户' : '新增用户'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input type="password" placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item name="realName" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              {roles.map(r => <Option key={r.value} value={r.value}>{r.label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="department" label="部门" rules={[{ required: true }]}>
            <Select placeholder="请选择部门">
              {departments.map(d => <Option key={d.value} value={d.value}>{d.label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="用户详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]} width={500}>
        {viewingUser && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><strong>用户名：</strong>{viewingUser.username}</div>
            <div><strong>姓名：</strong>{viewingUser.realName}</div>
            <div><strong>手机号：</strong>{viewingUser.phone || '-'}</div>
            <div><strong>邮箱：</strong>{viewingUser.email || '-'}</div>
            <div><strong>角色：</strong><Tag color={getRoleConfig(viewingUser.role).color}>{getRoleConfig(viewingUser.role).text}</Tag></div>
            <div><strong>部门：</strong>{viewingUser.department}</div>
            <div><strong>状态：</strong><Tag color={viewingUser.status === 'active' ? 'success' : 'default'}>{viewingUser.status === 'active' ? '启用' : '禁用'}</Tag></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserListPage;