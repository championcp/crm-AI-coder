/**
 * 回款管理页面
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
  Progress
} from 'antd';
import { PlusOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface PaymentRecord {
  id: string;
  paymentCode: string;
  contractName: string;
  customerName: string;
  totalAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  paymentCount: number;
  totalPayments: number;
  status: string;
  createTime: string;
}

const PaymentListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaymentRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const mockData: PaymentRecord[] = [
      {
        id: '1',
        paymentCode: 'P001',
        contractName: '某企业ERP系统开发合同',
        customerName: '某科技有限公司',
        totalAmount: 800000,
        receivedAmount: 240000,
        pendingAmount: 560000,
        paymentCount: 1,
        totalPayments: 4,
        status: 'PARTIAL',
        createTime: dayjs().subtract(60, 'day').toISOString()
      },
      {
        id: '2',
        paymentCode: 'P002',
        contractName: '某银行数据仓库建设合同',
        customerName: '某银行',
        totalAmount: 1500000,
        receivedAmount: 1500000,
        pendingAmount: 0,
        paymentCount: 2,
        totalPayments: 2,
        status: 'COMPLETED',
        createTime: dayjs().subtract(90, 'day').toISOString()
      },
      {
        id: '3',
        paymentCode: 'P003',
        contractName: '某企业CRM系统开发合同',
        customerName: '某实业集团',
        totalAmount: 500000,
        receivedAmount: 0,
        pendingAmount: 500000,
        paymentCount: 0,
        totalPayments: 3,
        status: 'PENDING',
        createTime: dayjs().subtract(10, 'day').toISOString()
      }
    ];
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  const handleRecordPayment = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success('记录成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {}
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'default', text: '待回款' },
      PARTIAL: { color: 'processing', text: '部分回款' },
      COMPLETED: { color: 'success', text: '已结清' },
      OVERDUE: { color: 'error', text: '已逾期' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const columns = [
    { title: '回款编号', dataIndex: 'paymentCode', key: 'paymentCode', width: 100 },
    { title: '合同名称', dataIndex: 'contractName', key: 'contractName' },
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName' },
    { title: '合同总额', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `¥${v.toLocaleString()}`
    },
    { title: '已回款', dataIndex: 'receivedAmount', key: 'receivedAmount',
      render: (v: number, r: PaymentRecord) => {
        const percent = r.totalAmount > 0 ? (v / r.totalAmount) * 100 : 0;
        return (
          <div>
            <div>¥{v.toLocaleString()}</div>
            <Progress percent={Math.round(percent)} size="small" />
          </div>
        );
      }
    },
    { title: '待回款', dataIndex: 'pendingAmount', key: 'pendingAmount',
      render: (v: number) => (
        <span style={{ color: v > 0 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>
          ¥{v.toLocaleString()}
        </span>
      )
    },
    { title: '回款进度', key: 'progress',
      render: (_: any, r: PaymentRecord) => `${r.paymentCount}/${r.totalPayments}期`
    },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={getStatusConfig(s).color}>{getStatusConfig(s).text}</Tag>
    },
    { title: '操作', key: 'action', width: 120,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={handleRecordPayment}>回款</Button>
        </Space>
      )
    }
  ];

  const totalContract = data.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalReceived = data.reduce((sum, d) => sum + d.receivedAmount, 0);
  const totalPending = data.reduce((sum, d) => sum + d.pendingAmount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>回款管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleRecordPayment}>记录回款</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card><Statistic title="合同总额" value={totalContract} prefix="¥" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已回款" value={totalReceived} valueStyle={{ color: '#52c41a' }} prefix="¥" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="待回款" value={totalPending} valueStyle={{ color: totalPending > 0 ? '#f5222d' : '#52c41a' }} prefix="¥" /></Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal title="记录回款" open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="contractName" label="合同名称" rules={[{ required: true }]}>
            <Input placeholder="请选择合同" />
          </Form.Item>
          <Form.Item name="amount" label="回款金额" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入回款金额" />
          </Form.Item>
          <Form.Item name="paymentDate" label="回款日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentListPage;