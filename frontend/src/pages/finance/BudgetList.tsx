/**
 * 预算管理页面
 * 企业项目全流程管理数据系统 - 财务管理模块
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
  Progress
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface BudgetRecord {
  id: string;
  budgetCode: string;
  projectName: string;
  budgetType: string;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  year: number;
  quarter: string;
  status: string;
  applicantId: string;
  applicantName: string;
  createTime: string;
}

const BudgetListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BudgetRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BudgetRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const mockData: BudgetRecord[] = [
      {
        id: '1',
        budgetCode: 'B001',
        projectName: 'ERP系统开发项目',
        budgetType: 'PROJECT',
        totalBudget: 500000,
        usedBudget: 320000,
        remainingBudget: 180000,
        year: 2024,
        quarter: 'Q1',
        status: 'APPROVED',
        applicantId: 'u1',
        applicantName: '张三',
        createTime: dayjs().subtract(30, 'day').toISOString()
      },
      {
        id: '2',
        budgetCode: 'B002',
        projectName: '银行数据仓库项目',
        budgetType: 'PROJECT',
        totalBudget: 800000,
        usedBudget: 450000,
        remainingBudget: 350000,
        year: 2024,
        quarter: 'Q1',
        status: 'APPROVED',
        applicantId: 'u2',
        applicantName: '李四',
        createTime: dayjs().subtract(20, 'day').toISOString()
      },
      {
        id: '3',
        budgetCode: 'B003',
        projectName: '研发部运营预算',
        budgetType: 'DEPARTMENT',
        totalBudget: 200000,
        usedBudget: 180000,
        remainingBudget: 20000,
        year: 2024,
        quarter: 'Q1',
        status: 'APPROVED',
        applicantId: 'u3',
        applicantName: '王五',
        createTime: dayjs().subtract(10, 'day').toISOString()
      }
    ];
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: BudgetRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    message.success('删除成功');
    fetchData();
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success(editingRecord ? '更新成功' : '创建成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      // 表单验证失败
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      DRAFT: { color: 'default', text: '草稿' },
      PENDING: { color: 'processing', text: '待审批' },
      APPROVED: { color: 'success', text: '已批准' },
      REJECTED: { color: 'error', text: '已驳回' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const getBudgetTypeConfig = (type: string) => {
    const config: Record<string, string> = {
      PROJECT: '项目预算',
      DEPARTMENT: '部门预算',
      MARKETING: '市场预算',
      RND: '研发预算'
    };
    return config[type] || type;
  };

  const columns = [
    {
      title: '预算编号',
      dataIndex: 'budgetCode',
      key: 'budgetCode',
      width: 100
    },
    {
      title: '项目/部门名称',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '预算类型',
      dataIndex: 'budgetType',
      key: 'budgetType',
      render: (type: string) => getBudgetTypeConfig(type)
    },
    {
      title: '年度',
      dataIndex: 'year',
      key: 'year'
    },
    {
      title: '季度',
      dataIndex: 'quarter',
      key: 'quarter'
    },
    {
      title: '预算总额',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      render: (value: number) => `¥${value.toLocaleString()}`
    },
    {
      title: '已使用',
      dataIndex: 'usedBudget',
      key: 'usedBudget',
      render: (value: number, record: BudgetRecord) => {
        const percent = record.totalBudget > 0 ? (value / record.totalBudget) * 100 : 0;
        return (
          <div>
            <div>¥{value.toLocaleString()}</div>
            <Progress percent={Math.round(percent)} size="small" />
          </div>
        );
      }
    },
    {
      title: '剩余预算',
      dataIndex: 'remainingBudget',
      key: 'remainingBudget',
      render: (value: number) => (
        <span style={{ color: value < 50000 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>
          ¥{value.toLocaleString()}
        </span>
      )
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
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: BudgetRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该预算吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const totalBudget = data.reduce((sum, d) => sum + d.totalBudget, 0);
  const totalUsed = data.reduce((sum, d) => sum + d.usedBudget, 0);
  const totalRemaining = data.reduce((sum, d) => sum + d.remainingBudget, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          预算管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增预算
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总预算" value={totalBudget} prefix="¥" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="已使用" value={totalUsed} valueStyle={{ color: '#1890ff' }} prefix="¥" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="剩余预算" value={totalRemaining} valueStyle={{ color: totalRemaining < 100000 ? '#f5222d' : '#52c41a' }} prefix="¥" />
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
        title={editingRecord ? '编辑预算' : '新增预算'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="projectName" label="项目/部门名称" rules={[{ required: true }]}>
            <Input placeholder="请输入项目或部门名称" />
          </Form.Item>
          <Form.Item name="budgetType" label="预算类型" initialValue="PROJECT">
            <Select>
              <Option value="PROJECT">项目预算</Option>
              <Option value="DEPARTMENT">部门预算</Option>
              <Option value="MARKETING">市场预算</Option>
              <Option value="RND">研发预算</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="year" label="年度" initialValue={dayjs().year()}>
                <Select>
                  {[dayjs().year() - 1, dayjs().year(), dayjs().year() + 1].map(y => (
                    <Option key={y} value={y}>{y}年</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quarter" label="季度" initialValue="Q1">
                <Select>
                  <Option value="Q1">Q1</Option>
                  <Option value="Q2">Q2</Option>
                  <Option value="Q3">Q3</Option>
                  <Option value="Q4">Q4</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="totalBudget" label="预算金额" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入预算金额" />
          </Form.Item>
          <Form.Item name="description" label="预算说明">
            <Input.TextArea rows={3} placeholder="请输入预算说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BudgetListPage;