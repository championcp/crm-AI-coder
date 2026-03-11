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
  Select,
  Modal,
  message,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tree,
  TreeSelect,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { roleService } from '../../services/api';
import type { Role } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RoleListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Role[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    fetchPermissions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await roleService.getList({ pageSize: 100 });
      if (response.success) {
        setData(response.data.list);
      }
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await roleService.getPermissions();
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (error) {
      message.error('获取权限列表失败');
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({ permissions: [], status: 'active' });
    setModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setEditingRole(record);
    form.setFieldsValue({
      ...record,
      permissions: record.permissions || []
    });
    setModalVisible(true);
  };

  const handleView = (record: Role) => {
    setViewingRole(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await roleService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRole) {
        await roleService.update(editingRole.id, values);
        message.success('更新成功');
      } else {
        await roleService.create(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await roleService.update(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
      message.success(`${currentStatus === 'active' ? '禁用' : '启用'}成功`);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getPermissionTreeData = () => {
    return permissions.map(module => ({
      title: module.module,
      value: module.module,
      children: module.actions.map((action: string) => ({
        title: action,
        value: `${module.module}:${action}`,
        key: `${module.module}:${action}`
      }))
    }));
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      active: { color: 'success', text: '启用' },
      inactive: { color: 'default', text: '禁用' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const columns = [
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      width: 150
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms: string[]) => perms?.length || 0
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Role) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title={`确定${record.status === 'active' ? '禁用' : '启用'}该角色吗?`}
            onConfirm={() => handleToggleStatus(record.id, record.status)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger={record.status === 'active'}
            >
              {record.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Popconfirm title="确定删除该角色吗?" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const activeCount = data.filter(d => d.status === 'active').length;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          角色管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增角色
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总角色数" value={data.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="roleCode"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="permissions" label="权限">
            <TreeSelect
              treeData={getPermissionTreeData()}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="请选择权限"
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="角色详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={600}
      >
        {viewingRole && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div><strong>角色编码：</strong>{viewingRole.roleCode}</div>
              <div><strong>角色名称：</strong>{viewingRole.roleName}</div>
              <div><strong>状态：</strong>
                <Tag color={getStatusConfig(viewingRole.status).color}>
                  {getStatusConfig(viewingRole.status).text}
                </Tag>
              </div>
              <div><strong>创建时间：</strong>{dayjs(viewingRole.createTime).format('YYYY-MM-DD HH:mm')}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>描述：</strong>{viewingRole.description || '-'}
              </div>
            </div>
            <div>
              <Text strong>权限列表：</Text>
              <div style={{ marginTop: 8 }}>
                {viewingRole.permissions && viewingRole.permissions.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {viewingRole.permissions.map((perm, index) => (
                      <Tag key={index} color="blue">{perm}</Tag>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary">暂无权限</Text>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoleListPage;