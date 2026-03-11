/**
 * 验收管理页面
 * 企业项目全流程管理数据系统
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
  Timeline
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface AcceptanceRecord {
  id: string;
  acceptanceCode: string;
  acceptanceName: string;
  projectName: string;
  contractName: string;
  type: string;
  status: string;
  submitDate: string;
  planEndDate: string;
  actualEndDate?: string;
  submitterId: string;
  submitterName: string;
  reviewerId?: string;
  reviewerName?: string;
  items: AcceptanceItem[];
  createTime: string;
}

interface AcceptanceItem {
  id: string;
  itemName: string;
  standard: string;
  result: string;
  remark?: string;
}

const AcceptanceListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AcceptanceRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AcceptanceRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<AcceptanceRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const mockData: AcceptanceRecord[] = [
      {
        id: '1',
        acceptanceCode: 'A001',
        acceptanceName: '第一阶段验收',
        projectName: 'ERP系统开发项目',
        contractName: '某企业ERP系统开发合同',
        type: 'PHASE',
        status: 'ACCEPTED',
        submitDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
        planEndDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        actualEndDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
        submitterId: 'u1',
        submitterName: '张三',
        reviewerId: 'u2',
        reviewerName: '李四',
        items: [
          { id: '1', itemName: '系统功能完整性', standard: '满足合同要求的所有功能', result: 'PASS', remark: '全部通过' },
          { id: '2', itemName: '系统性能', standard: '响应时间<3秒', result: 'PASS', remark: '平均响应时间2.5秒' },
          { id: '3', itemName: '数据准确性', standard: '数据准确率>99%', result: 'PASS' }
        ],
        createTime: dayjs().subtract(5, 'day').toISOString()
      },
      {
        id: '2',
        acceptanceCode: 'A002',
        acceptanceName: '最终验收',
        projectName: '银行数据仓库项目',
        contractName: '某银行数据仓库建设合同',
        type: 'FINAL',
        status: 'PENDING',
        submitDate: dayjs().format('YYYY-MM-DD'),
        planEndDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        submitterId: 'u3',
        submitterName: '王五',
        items: [],
        createTime: dayjs().toISOString()
      },
      {
        id: '3',
        acceptanceCode: 'A003',
        acceptanceName: '功能验收测试',
        projectName: 'ERP系统开发项目',
        contractName: '某企业ERP系统开发合同',
        type: 'FUNCTIONAL',
        status: 'REVIEWING',
        submitDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
        planEndDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
        submitterId: 'u4',
        submitterName: '赵六',
        reviewerId: 'u5',
        reviewerName: '孙七',
        items: [
          { id: '1', itemName: '用户管理功能', standard: '支持增删改查', result: 'PENDING' },
          { id: '2', itemName: '权限管理', standard: '支持角色和权限配置', result: 'PENDING' }
        ],
        createTime: dayjs().subtract(2, 'day').toISOString()
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
    form.setFieldsValue({ submitDate: dayjs() });
    setModalVisible(true);
  };

  const handleEdit = (record: AcceptanceRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: AcceptanceRecord) => {
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

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string; step: number }> = {
      DRAFT: { color: 'default', text: '草稿', step: 0 },
      SUBMITTED: { color: 'processing', text: '已提交', step: 1 },
      REVIEWING: { color: 'blue', text: '审核中', step: 2 },
      ACCEPTED: { color: 'success', text: '已通过', step: 3 },
      REJECTED: { color: 'error', text: '已驳回', step: 2 }
    };
    return config[status] || { color: 'default', text: status, step: 0 };
  };

  const getTypeConfig = (type: string) => {
    const config: Record<string, string> = {
      PHASE: '阶段验收',
      FUNCTIONAL: '功能验收',
      PERFORMANCE: '性能验收',
      FINAL: '最终验收',
      OTHER: '其他验收'
    };
    return config[type] || type;
  };

  const columns = [
    {
      title: '验收编号',
      dataIndex: 'acceptanceCode',
      key: 'acceptanceCode',
      width: 100
    },
    {
      title: '验收名称',
      dataIndex: 'acceptanceName',
      key: 'acceptanceName'
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '关联合同',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '验收类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeConfig(type)
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
      title: '提交日期',
      dataIndex: 'submitDate',
      key: 'submitDate'
    },
    {
      title: '计划完成',
      dataIndex: 'planEndDate',
      key: 'planEndDate'
    },
    {
      title: '实际完成',
      dataIndex: 'actualEndDate',
      key: 'actualEndDate',
      render: (date: string) => date || '-'
    },
    {
      title: '提交人',
      dataIndex: 'submitterName',
      key: 'submitterName'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: AcceptanceRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          {record.status === 'DRAFT' && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                编辑
              </Button>
              <Popconfirm
                title="确定删除该验收记录吗?"
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  const getCurrentStep = (status: string): number => {
    const statusStepMap: Record<string, number> = {
      DRAFT: 0,
      SUBMITTED: 1,
      REVIEWING: 2,
      ACCEPTED: 3,
      REJECTED: 1
    };
    return statusStepMap[status] || 0;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          验收管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增验收
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总验收数" value={data.length} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="审核中" value={data.filter(d => d.status === 'REVIEWING').length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已通过" value={data.filter(d => d.status === 'ACCEPTED').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待提交" value={data.filter(d => d.status === 'DRAFT').length} valueStyle={{ color: '#faad14' }} />
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
        title={editingRecord ? '编辑验收' : '新增验收'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="acceptanceName" label="验收名称" rules={[{ required: true, message: '请输入验收名称' }]}>
            <Input placeholder="请输入验收名称" />
          </Form.Item>
          <Form.Item name="projectName" label="所属项目" rules={[{ required: true }]}>
            <Input placeholder="请输入所属项目" />
          </Form.Item>
          <Form.Item name="contractName" label="关联合同">
            <Input placeholder="请输入关联合同" />
          </Form.Item>
          <Form.Item name="type" label="验收类型" initialValue="PHASE">
            <Select>
              <Option value="PHASE">阶段验收</Option>
              <Option value="FUNCTIONAL">功能验收</Option>
              <Option value="PERFORMANCE">性能验收</Option>
              <Option value="FINAL">最终验收</Option>
              <Option value="OTHER">其他验收</Option>
            </Select>
          </Form.Item>
          <Form.Item name="submitDate" label="提交日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="planEndDate" label="计划完成日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="submitterName" label="提交人" rules={[{ required: true }]}>
            <Input placeholder="请输入提交人" />
          </Form.Item>
          <Form.Item name="description" label="验收说明">
            <TextArea rows={3} placeholder="请输入验收说明" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="验收详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
        width={800}
      >
        {viewingRecord && (
          <div>
            <Steps
              current={getCurrentStep(viewingRecord.status)}
              style={{ marginBottom: 24 }}
              items={[
                { title: '草稿' },
                { title: '已提交' },
                { title: '审核中' },
                { title: '已完成' }
              ]}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><strong>验收编号：</strong>{viewingRecord.acceptanceCode}</div>
              <div><strong>验收名称：</strong>{viewingRecord.acceptanceName}</div>
              <div><strong>所属项目：</strong>{viewingRecord.projectName}</div>
              <div><strong>关联合同：</strong>{viewingRecord.contractName}</div>
              <div><strong>验收类型：</strong>{getTypeConfig(viewingRecord.type)}</div>
              <div><strong>状态：</strong><Tag color={getStatusConfig(viewingRecord.status).color}>{getStatusConfig(viewingRecord.status).text}</Tag></div>
              <div><strong>提交日期：</strong>{viewingRecord.submitDate}</div>
              <div><strong>计划完成日期：</strong>{viewingRecord.planEndDate}</div>
              <div><strong>提交人：</strong>{viewingRecord.submitterName}</div>
              {viewingRecord.reviewerName && <div><strong>审核人：</strong>{viewingRecord.reviewerName}</div>}
              {viewingRecord.actualEndDate && <div><strong>实际完成日期：</strong>{viewingRecord.actualEndDate}</div>}
            </div>

            {viewingRecord.items.length > 0 && (
              <div>
                <Text strong style={{ marginBottom: 8, display: 'block' }}>验收项：</Text>
                <Table
                  dataSource={viewingRecord.items}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  columns={[
                    { title: '验收项', dataIndex: 'itemName', key: 'itemName' },
                    { title: '验收标准', dataIndex: 'standard', key: 'standard' },
                    { title: '结果', dataIndex: 'result', key: 'result',
                      render: (result: string) => {
                        if (result === 'PASS') return <Tag color="green">通过</Tag>;
                        if (result === 'FAIL') return <Tag color="red">不通过</Tag>;
                        return <Tag color="default">待测试</Tag>;
                      }
                    },
                    { title: '备注', dataIndex: 'remark', key: 'remark' }
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AcceptanceListPage;