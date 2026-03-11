/**
 * 成本管理页面
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
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker
} from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface CostRecord {
  id: string;
  costCode: string;
  projectName: string;
  costType: string;
  amount: number;
  costDate: string;
  description: string;
  applicantId: string;
  applicantName: string;
  status: string;
  createTime: string;
}

const CostListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CostRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const mockData: CostRecord[] = [
      {
        id: '1',
        costCode: 'C001',
        projectName: 'ERP系统开发项目',
        costType: 'PERSONNEL',
        amount: 85000,
        costDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
        description: '9月人力成本',
        applicantId: 'u1',
        applicantName: '张三',
        status: 'APPROVED',
        createTime: dayjs().subtract(5, 'day').toISOString()
      },
      {
        id: '2',
        costCode: 'C002',
        projectName: 'ERP系统开发项目',
        costType: 'EQUIPMENT',
        amount: 15000,
        costDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
        description: '服务器租赁费用',
        applicantId: 'u1',
        applicantName: '张三',
        status: 'APPROVED',
        createTime: dayjs().subtract(10, 'day').toISOString()
      },
      {
        id: '3',
        costCode: 'C003',
        projectName: '银行数据仓库项目',
        costType: 'PERSONNEL',
        amount: 120000,
        costDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
        description: '10月人力成本',
        applicantId: 'u2',
        applicantName: '李四',
        status: 'PENDING',
        createTime: dayjs().subtract(3, 'day').toISOString()
      }
    ];
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ costDate: dayjs() });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success('创建成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {}
  };

  const getCostTypeConfig = (type: string) => {
    const config: Record<string, { color: string; text: string }> = {
      PERSONNEL: { color: 'blue', text: '人力成本' },
      EQUIPMENT: { color: 'green', text: '设备成本' },
      SOFTWARE: { color: 'purple', text: '软件成本' },
      TRAVEL: { color: 'orange', text: '差旅成本' },
      OTHER: { color: 'default', text: '其他' }
    };
    return config[type] || { color: 'default', text: type };
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'processing', text: '待审批' },
      APPROVED: { color: 'success', text: '已批准' },
      REJECTED: { color: 'error', text: '已驳回' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const columns = [
    { title: '费用编号', dataIndex: 'costCode', key: 'costCode', width: 100 },
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    { title: '费用类型', dataIndex: 'costType', key: 'costType',
      render: (type: string) => <Tag color={getCostTypeConfig(type).color}>{getCostTypeConfig(type).text}</Tag>
    },
    { title: '金额', dataIndex: 'amount', key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`
    },
    { title: '费用日期', dataIndex: 'costDate', key: 'costDate' },
    { title: '说明', dataIndex: 'description', key: 'description' },
    { title: '申请人', dataIndex: 'applicantName', key: 'applicantName' },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => <Tag color={getStatusConfig(status).color}>{getStatusConfig(status).text}</Tag>
    },
    { title: '操作', key: 'action', width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      )
    }
  ];

  const totalCost = data.reduce((sum, d) => sum + d.amount, 0);
  const approvedCost = data.filter(d => d.status === 'APPROVED').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>成本管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增费用</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card><Statistic title="总成本" value={totalCost} prefix="¥" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已批准" value={approvedCost} valueStyle={{ color: '#52c41a' }} prefix="¥" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="待审批" value={totalCost - approvedCost} valueStyle={{ color: '#1890ff' }} prefix="¥" /></Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal title="新增费用" open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="projectName" label="项目名称" rules={[{ required: true }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="costType" label="费用类型" initialValue="PERSONNEL">
            <Select>
              <Option value="PERSONNEL">人力成本</Option>
              <Option value="EQUIPMENT">设备成本</Option>
              <Option value="SOFTWARE">软件成本</Option>
              <Option value="TRAVEL">差旅成本</Option>
              <Option value="OTHER">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入金额" />
          </Form.Item>
          <Form.Item name="costDate" label="费用日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="说明">
            <Input.TextArea rows={2} placeholder="请输入说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CostListPage;