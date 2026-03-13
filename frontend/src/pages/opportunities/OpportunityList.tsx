/**
 * 商机列表页面
 * 企业项目全流程管理数据系统 - 商机管理模块
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
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { opportunityService, customerService, userService } from '../../services/api';
import {
  Opportunity,
  OpportunityLevel,
  OpportunityStage,
  OpportunityStatus,
  Customer,
  User
} from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const OpportunityListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [salesOptions, setSalesOptions] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, [page, pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await opportunityService.getList({
        page,
        pageSize,
        ...searchParams
      });
      if (response.success) {
        setData(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('获取商机列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [customerRes, userRes] = await Promise.all([
        customerService.getOptions(),
        userService.getOptions()
      ]);
      if (customerRes.success) {
        setCustomerOptions(customerRes.data);
      }
      if (userRes.success) {
        setSalesOptions(userRes.data);
      }
    } catch (error) {
      console.error('获取选项失败', error);
    }
  };

  const handleSearch = (values: any) => {
    setSearchParams(values);
    setPage(1);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (record: Opportunity) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      amount: Number(record.amount)
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await opportunityService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await opportunityService.update(editingId, values);
        message.success('更新成功');
      } else {
        await opportunityService.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      // 表单验证失败或API错误
    }
  };

  const getStageTag = (stage: OpportunityStage) => {
    const stageMap: Record<string, { color: string; text: string }> = {
      requirement: { color: 'blue', text: '需求了解' },
      proposal: { color: 'cyan', text: '方案制定' },
      negotiation: { color: 'orange', text: '商务洽谈' },
      contract_review: { color: 'purple', text: '合同评审' },
      contract_approval: { color: 'red', text: '合同审批' },
      signed: { color: 'green', text: '签约完成' }
    };
    const s = stageMap[stage] || { color: 'default', text: stage };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const getLevelTag = (level?: OpportunityLevel) => {
    if (!level) return null;
    const levelMap: Record<string, { color: string }> = {
      '一级': { color: 'red' },
      '准一级': { color: 'orange' },
      '二级': { color: 'gold' },
      '准二级': { color: 'lime' },
      '三级': { color: 'green' },
      '准三级': { color: 'cyan' },
      '四级': { color: 'default' }
    };
    const l = levelMap[level] || { color: 'default' };
    return <Tag color={l.color}>{level}</Tag>;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)}万`;
    }
    return `${amount.toFixed(2)}`;
  };

  const columns = [
    {
      title: '商机编号',
      dataIndex: 'opportunityCode',
      key: 'opportunityCode',
      width: 130
    },
    {
      title: '商机名称',
      dataIndex: 'opportunityName',
      key: 'opportunityName',
      width: 180
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: Customer) => customer?.name || '-'
    },
    {
      title: '商机金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>{formatAmount(amount)}</Text>
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: OpportunityLevel) => getLevelTag(level)
    },
    {
      title: '销售阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: OpportunityStage) => getStageTag(stage)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: OpportunityStatus) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          active: { color: 'processing', text: '进行中' },
          won: { color: 'success', text: '已成交' },
          lost: { color: 'error', text: '已失败' },
          cancelled: { color: 'default', text: '已取消' }
        };
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag>{s.text}</Tag>;
      }
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner: User) => owner?.realName || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Opportunity) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该商机吗?"
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
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          商机管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增商机
        </Button>
      </div>

      {/* 销售漏斗 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Progress percent={80} size="small" strokeColor="#1890ff" format={() => '需求了解'} />
              <Progress percent={60} size="small" strokeColor="#52c41a" format={() => '方案制定'} />
              <Progress percent={40} size="small" strokeColor="#faad14" format={() => '商务洽谈'} />
              <Progress percent={20} size="small" strokeColor="#fa8c16" format={() => '合同评审'} />
              <Progress percent={10} size="small" strokeColor="#722ed1" format={() => '签约完成'} />
            </div>
          </Col>
          <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button type="link" icon={<RiseOutlined />}>查看漏斗</Button>
          </Col>
        </Row>
      </Card>

      {/* 搜索表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline" onFinish={handleSearch}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item name="keyword" label="关键词" style={{ marginBottom: 0 }}>
                <Input placeholder="商机名称" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="level" label="商机级别" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="一级">一级</Option>
                  <Option value="准一级">准一级</Option>
                  <Option value="二级">二级</Option>
                  <Option value="准二级">准二级</Option>
                  <Option value="三级">三级</Option>
                  <Option value="准三级">准三级</Option>
                  <Option value="四级">四级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item name="stage" label="销售阶段" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="requirement">需求了解</Option>
                  <Option value="proposal">方案制定</Option>
                  <Option value="negotiation">商务洽谈</Option>
                  <Option value="contract_review">合同评审</Option>
                  <Option value="contract_approval">合同审批</Option>
                  <Option value="signed">签约完成</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="active">进行中</Option>
                  <Option value="won">已成交</Option>
                  <Option value="lost">已失败</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          }
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingId ? '编辑商机' : '新增商机'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="opportunityName"
            label="商机名称"
            rules={[{ required: true, message: '请输入商机名称' }]}
          >
            <Input placeholder="请输入商机名称" />
          </Form.Item>
          <Form.Item
            name="customerId"
            label="关联客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户" showSearch optionFilterProp="label">
              {customerOptions.map((c) => (
                <Option key={c.id} value={c.id} label={c.customerName}>
                  {c.customerName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="商机金额"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input type="number" placeholder="请输入金额" suffix="元" />
          </Form.Item>
          <Form.Item name="source" label="商机来源" rules={[{ required: true }]}>
            <Select placeholder="请选择来源">
              <Option value="cold_call">电话营销</Option>
              <Option value="visit">主动拜访</Option>
              <Option value="referral">客户推荐</Option>
              <Option value="bidding">招投标</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stage" label="销售阶段" initialValue="requirement">
            <Select placeholder="请选择阶段">
              <Option value="requirement">需求了解</Option>
              <Option value="proposal">方案制定</Option>
              <Option value="negotiation">商务洽谈</Option>
              <Option value="contract_review">合同评审</Option>
              <Option value="contract_approval">合同审批</Option>
              <Option value="signed">签约完成</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ownerId" label="负责人" rules={[{ required: true }]}>
            <Select placeholder="请选择负责人">
              {salesOptions.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.realName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="expectedSignDate" label="预计签约日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="winRate" label="胜率评估">
            <Input type="number" placeholder="0-100" suffix="%" />
          </Form.Item>
          <Form.Item name="products" label="产品/服务类型">
            <Input.TextArea rows={2} placeholder="请输入产品或服务类型" />
          </Form.Item>
          <Form.Item name="competitors" label="竞争对手">
            <Input placeholder="请输入竞争对手信息" />
          </Form.Item>
          <Form.Item name="description" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OpportunityListPage;