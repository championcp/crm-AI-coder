/**
 * 审批流程管理页面
 * 企业项目全流程管理数据系统 - 审批流程管理
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
  Steps,
  Drawer,
  List,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  StopOutlined,
  EyeOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { approvalFlowService } from '../../services/api';
import type { ApprovalFlow } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const ApprovalFlowListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApprovalFlow[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingFlow, setEditingFlow] = useState<ApprovalFlow | null>(null);
  const [viewingFlow, setViewingFlow] = useState<ApprovalFlow | null>(null);
  const [form] = Form.useForm();
  const [businessTypes, setBusinessTypes] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchData();
    fetchBusinessTypes();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await approvalFlowService.getList({ pageSize: 100 });
      if (response.success) {
        setData(response.data.list);
      }
    } catch (error) {
      message.error('获取审批流程列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessTypes = async () => {
    try {
      const response = await approvalFlowService.getBusinessTypes();
      if (response.success) {
        setBusinessTypes(response.data);
      }
    } catch (error) {
      message.error('获取业务类型列表失败');
    }
  };

  const handleAdd = () => {
    setEditingFlow(null);
    form.resetFields();
    form.setFieldsValue({ status: 'draft' });
    setModalVisible(true);
  };

  const handleEdit = (record: ApprovalFlow) => {
    setEditingFlow(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: ApprovalFlow) => {
    setViewingFlow(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await approvalFlowService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      await approvalFlowService.toggleStatus(id);
      message.success(`${currentStatus === 'active' ? '禁用' : '启用'}成功`);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingFlow) {
        await approvalFlowService.update(editingFlow.id, values);
        message.success('更新成功');
      } else {
        await approvalFlowService.create(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: '草稿' },
      active: { color: 'success', text: '启用' },
      inactive: { color: 'default', text: '禁用' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const getBusinessTypeLabel = (type: string) => {
    const typeObj = businessTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const columns = [
    {
      title: '流程编码',
      dataIndex: 'flowCode',
      key: 'flowCode',
      width: 150
    },
    {
      title: '流程名称',
      dataIndex: 'flowName',
      key: 'flowName'
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type: string) => getBusinessTypeLabel(type)
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version'
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
      render: (_: any, record: ApprovalFlow) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status === 'active'}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定${record.status === 'active' ? '禁用' : '启用'}该流程吗?`}
            onConfirm={() => handleToggleStatus(record.id, record.status)}
            okText="确定"
            cancelText="取消"
            disabled={record.status === 'draft'}
          >
            <Button
              type="link"
              size="small"
              icon={record.status === 'active' ? <StopOutlined /> : <PlayCircleOutlined />}
              danger={record.status === 'active'}
              disabled={record.status === 'draft'}
            >
              {record.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确定删除该流程吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record.status === 'active'}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.status === 'active'}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const activeCount = data.filter(d => d.status === 'active').length;
  const draftCount = data.filter(d => d.status === 'draft').length;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          审批流程管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增流程
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总流程数" value={data.length} prefix={<BranchesOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="启用流程" value={activeCount} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="草稿流程" value={draftCount} valueStyle={{ color: '#faad14' }} />
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
        title={editingFlow ? '编辑审批流程' : '新增审批流程'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="flowCode"
            label="流程编码"
            rules={[{ required: true, message: '请输入流程编码' }]}
          >
            <Input placeholder="请输入流程编码" disabled={!!editingFlow} />
          </Form.Item>
          <Form.Item
            name="flowName"
            label="流程名称"
            rules={[{ required: true, message: '请输入流程名称' }]}
          >
            <Input placeholder="请输入流程名称" />
          </Form.Item>
          <Form.Item
            name="businessType"
            label="业务类型"
            rules={[{ required: true, message: '请选择业务类型' }]}
          >
            <Select placeholder="请选择业务类型">
              {businessTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="draft">
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="审批流程详情"
        width={600}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {viewingFlow && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><strong>流程编码：</strong>{viewingFlow.flowCode}</div>
                <div><strong>流程名称：</strong>{viewingFlow.flowName}</div>
                <div><strong>业务类型：</strong>{getBusinessTypeLabel(viewingFlow.businessType)}</div>
                <div><strong>版本：</strong>{viewingFlow.version}</div>
                <div><strong>状态：</strong>
                  <Tag color={getStatusConfig(viewingFlow.status).color}>
                    {getStatusConfig(viewingFlow.status).text}
                  </Tag>
                </div>
                <div><strong>创建时间：</strong>{dayjs(viewingFlow.createTime).format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <strong>描述：</strong>
                <div>{viewingFlow.description || '暂无描述'}</div>
              </div>
            </div>

            <Divider>审批节点</Divider>

            {viewingFlow.nodes && viewingFlow.nodes.length > 0 ? (
              <Steps direction="vertical" size="small" current={-1}>
                {viewingFlow.nodes.map((node, index) => (
                  <Step
                    key={node.id}
                    title={node.nodeName}
                    description={
                      <div>
                        <div>审批人类型: {node.approverType}</div>
                        {node.approvers && node.approvers.length > 0 && (
                          <div>审批人: {node.approvers.join(', ')}</div>
                        )}
                      </div>
                    }
                  />
                ))}
              </Steps>
            ) : (
              <Text type="secondary">暂无审批节点</Text>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ApprovalFlowListPage;