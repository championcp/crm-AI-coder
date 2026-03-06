/**
 * 风险管理页面
 * 企业项目全流程管理数据系统 - 执行管理模块
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
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface RiskRecord {
  id: string;
  riskCode: string;
  riskName: string;
  projectName: string;
  category: string;
  level: string;
  status: string;
  probability: number;
  impact: number;
  riskValue: number;
  mitigationPlan: string;
  ownerId: string;
  ownerName: string;
  identifiedDate: string;
  dueDate: string;
  createTime: string;
}

const RiskListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RiskRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RiskRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<RiskRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const mockData: RiskRecord[] = [
      {
        id: '1',
        riskCode: 'R001',
        riskName: '技术架构风险',
        projectName: 'ERP系统开发项目',
        category: 'TECHNICAL',
        level: 'HIGH',
        status: 'MONITORING',
        probability: 70,
        impact: 80,
        riskValue: 56,
        mitigationPlan: '引入外部技术专家进行架构评审',
        ownerId: 'u1',
        ownerName: '张三',
        identifiedDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
        dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
        createTime: dayjs().subtract(10, 'day').toISOString()
      },
      {
        id: '2',
        riskCode: 'R002',
        riskName: '人员流动风险',
        projectName: '银行数据仓库项目',
        category: 'PERSONNEL',
        level: 'MEDIUM',
        status: 'MITIGATING',
        probability: 40,
        impact: 60,
        riskValue: 24,
        mitigationPlan: '建立知识库，做好工作交接准备',
        ownerId: 'u2',
        ownerName: '李四',
        identifiedDate: dayjs().subtract(15, 'day').format('YYYY-MM-DD'),
        dueDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
        createTime: dayjs().subtract(15, 'day').toISOString()
      },
      {
        id: '3',
        riskCode: 'R003',
        riskName: '需求变更风险',
        projectName: 'ERP系统开发项目',
        category: 'REQUIREMENT',
        level: 'LOW',
        status: 'CLOSED',
        probability: 30,
        impact: 40,
        riskValue: 12,
        mitigationPlan: '加强需求评审，建立变更流程',
        ownerId: 'u3',
        ownerName: '王五',
        identifiedDate: dayjs().subtract(20, 'day').format('YYYY-MM-DD'),
        dueDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
        createTime: dayjs().subtract(20, 'day').toISOString()
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

  const handleEdit = (record: RiskRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: RiskRecord) => {
    setViewingRecord(record);
    setDetailVisible(true);
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

  const getLevelConfig = (level: string) => {
    const config: Record<string, { color: string; text: string }> = {
      HIGH: { color: 'red', text: '高风险' },
      MEDIUM: { color: 'orange', text: '中风险' },
      LOW: { color: 'green', text: '低风险' }
    };
    return config[level] || { color: 'default', text: level };
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      IDENTIFIED: { color: 'red', text: '已识别' },
      MONITORING: { color: 'orange', text: '监控中' },
      MITIGATING: { color: 'processing', text: '处理中' },
      CLOSED: { color: 'green', text: '已关闭' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const getCategoryConfig = (category: string) => {
    const config: Record<string, string> = {
      TECHNICAL: '技术风险',
      PERSONNEL: '人员风险',
      REQUIREMENT: '需求风险',
      SCHEDULE: '进度风险',
      BUDGET: '预算风险',
      QUALITY: '质量风险'
    };
    return config[category] || category;
  };

  const getRiskValueColor = (value: number) => {
    if (value >= 50) return '#f5222d';
    if (value >= 25) return '#fa541c';
    if (value >= 10) return '#faad14';
    return '#52c41a';
  };

  const columns = [
    {
      title: '风险编号',
      dataIndex: 'riskCode',
      key: 'riskCode',
      width: 100
    },
    {
      title: '风险名称',
      dataIndex: 'riskName',
      key: 'riskName'
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '风险类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => getCategoryConfig(category)
    },
    {
      title: '风险等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={getLevelConfig(level).color}>{getLevelConfig(level).text}</Tag>
      )
    },
    {
      title: '风险值',
      dataIndex: 'riskValue',
      key: 'riskValue',
      render: (value: number) => (
        <span style={{ color: getRiskValueColor(value), fontWeight: 'bold' }}>
          {value}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusConfig(status).color}>{getStatusConfig(status).text}</Tag>
      )
    },
    {
      title: '负责人',
      dataIndex: 'ownerName',
      key: 'ownerName'
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: RiskRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该风险吗?"
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          风险管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增风险
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总风险数"
              value={data.length}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高风险"
              value={data.filter(d => d.level === 'HIGH').length}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="处理中"
              value={data.filter(d => d.status === 'MITIGATING').length}
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已关闭"
              value={data.filter(d => d.status === 'CLOSED').length}
              valueStyle={{ color: '#52c41a' }}
            />
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
        title={editingRecord ? '编辑风险' : '新增风险'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="riskName" label="风险名称" rules={[{ required: true, message: '请输入风险名称' }]}>
            <Input placeholder="请输入风险名称" />
          </Form.Item>
          <Form.Item name="projectName" label="所属项目" rules={[{ required: true, message: '请输入所属项目' }]}>
            <Input placeholder="请输入所属项目" />
          </Form.Item>
          <Form.Item name="category" label="风险类别" rules={[{ required: true }]}>
            <Select placeholder="请选择风险类别">
              <Option value="TECHNICAL">技术风险</Option>
              <Option value="PERSONNEL">人员风险</Option>
              <Option value="REQUIREMENT">需求风险</Option>
              <Option value="SCHEDULE">进度风险</Option>
              <Option value="BUDGET">预算风险</Option>
              <Option value="QUALITY">质量风险</Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="风险等级" initialValue="MEDIUM">
            <Select>
              <Option value="HIGH">高风险</Option>
              <Option value="MEDIUM">中风险</Option>
              <Option value="LOW">低风险</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="probability" label="发生概率(%)">
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="impact" label="影响程度(%)">
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="mitigationPlan" label="应对措施">
            <TextArea rows={3} placeholder="请输入应对措施" />
          </Form.Item>
          <Form.Item name="ownerName" label="负责人" rules={[{ required: true }]}>
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="dueDate" label="计划关闭日期">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="风险详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
        width={700}
      >
        {viewingRecord && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><strong>风险编号：</strong>{viewingRecord.riskCode}</div>
            <div><strong>风险名称：</strong>{viewingRecord.riskName}</div>
            <div><strong>所属项目：</strong>{viewingRecord.projectName}</div>
            <div><strong>风险类别：</strong>{getCategoryConfig(viewingRecord.category)}</div>
            <div><strong>风险等级：</strong><Tag color={getLevelConfig(viewingRecord.level).color}>{getLevelConfig(viewingRecord.level).text}</Tag></div>
            <div><strong>状态：</strong><Tag color={getStatusConfig(viewingRecord.status).color}>{getStatusConfig(viewingRecord.status).text}</Tag></div>
            <div><strong>发生概率：</strong>{viewingRecord.probability}%</div>
            <div><strong>影响程度：</strong>{viewingRecord.impact}%</div>
            <div><strong>风险值：</strong><span style={{ color: getRiskValueColor(viewingRecord.riskValue), fontWeight: 'bold' }}>{viewingRecord.riskValue}</span></div>
            <div><strong>负责人：</strong>{viewingRecord.ownerName}</div>
            <div style={{ gridColumn: '1 / -1' }}><strong>应对措施：</strong>{viewingRecord.mitigationPlan}</div>
            <div><strong>识别日期：</strong>{viewingRecord.identifiedDate}</div>
            <div><strong>计划关闭日期：</strong>{viewingRecord.dueDate}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RiskListPage;