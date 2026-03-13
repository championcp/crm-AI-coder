/**
 * 客户列表页面
 * 展示客户数据，支持搜索、筛选、分页等功能
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Space,
  Tag,
  Pagination,
  Typography,
  Row,
  Col,
  Tooltip,
  App,
  Form,
  Drawer,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { customerService, userService } from '../../services/api';
import type { Customer, CustomerQueryParams } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

/**
 * 客户选项数据类型
 */
interface CustomerOptions {
  levels: { value: string; label: string }[];
  statuses: { value: string; label: string }[];
  industries: { value: string; label: string }[];
  types: { value: string; label: string }[];
  scales: { value: string; label: string }[];
  sources: { value: string; label: string }[];
}

/**
 * 用户选项数据类型
 */
interface UserOption {
  id: string;
  username: string;
  realName: string;
}

const { Title } = Typography;

/**
 * 客户列表页面组件
 */
const CustomerList: React.FC = () => {
  // 使用App组件的message context
  const { message } = App.useApp();

  // 加载状态
  const [loading, setLoading] = useState(false);
  // 客户数据列表
  const [dataSource, setDataSource] = useState<Customer[]>([]);
  // 总记录数
  const [total, setTotal] = useState(0);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);

  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  // 客户等级筛选
  const [level, setLevel] = useState<string>('');
  // 客户状态筛选
  const [status, setStatus] = useState<string>('');
  // 行业筛选
  const [industry, setIndustry] = useState<string>('');

  // 新建客户Drawer状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('新建客户');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  // 选项数据
  const [customerOptions, setCustomerOptions] = useState<CustomerOptions>({
    levels: [],
    statuses: [],
    industries: [],
    types: [],
    scales: [],
    sources: []
  });
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);

  /**
   * 页面加载时获取客户数据
   */
  useEffect(() => {
    fetchCustomerList();
  }, [currentPage, pageSize]);

  /**
   * 加载选项数据
   */
  const loadOptions = async () => {
    try {
      // 获取客户选项
      const customerRes = await customerService.getOptions();
      if (customerRes.code === 200 && customerRes.data) {
        setCustomerOptions(customerRes.data);
      }

      // 获取用户选项（负责人列表）
      const userRes = await userService.getOptions();
      if (userRes.code === 200 && userRes.data) {
        setUserOptions(userRes.data);
      }
    } catch (error) {
      console.error('加载选项数据失败:', error);
    }
  };

  /**
   * 获取客户列表数据
   */
  const fetchCustomerList = async () => {
    try {
      setLoading(true);
      const params: CustomerQueryParams = {
        page: currentPage,
        pageSize: pageSize,
        keyword: keyword || undefined,
        level: level as any || undefined,
        status: status as any || undefined,
        industry: industry || undefined
      };

      const response = await customerService.getList(params);
      if (response.success && response.data) {
        setDataSource(response.data.list || []);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message || '获取客户列表失败');
      }
    } catch (error) {
      console.error('获取客户列表失败:', error);
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理搜索
   */
  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomerList();
  };

  /**
   * 处理重置
   */
  const handleReset = () => {
    setKeyword('');
    setLevel('');
    setStatus('');
    setIndustry('');
    setCurrentPage(1);
    // 延迟执行查询以等待状态更新
    setTimeout(() => {
      fetchCustomerList();
    }, 0);
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  /**
   * 查看客户详情
   */
  const handleView = (record: Customer) => {
    message.info(`查看客户: ${record.name}`);
    // TODO: 跳转到客户详情页
  };

  /**
   * 编辑客户
   */
  const handleEdit = (record: Customer) => {
    message.info(`编辑客户: ${record.name}`);
    // TODO: 打开编辑弹窗或跳转编辑页
  };

  /**
   * 删除客户
   */
  const handleDelete = (record: Customer) => {
    // TODO: 实现删除确认弹窗
    console.log('删除客户:', record.id);
  };

  /**
   * 新建客户 - 打开Drawer
   */
  const handleCreate = async () => {
    setDrawerTitle('新建客户');
    form.resetFields();
    await loadOptions();
    setDrawerVisible(true);
  };

  /**
   * 关闭Drawer
   */
  const handleDrawerClose = () => {
    setDrawerVisible(false);
    form.resetFields();
  };

  /**
   * 提交客户表单
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      const submitData = {
        name: values.name,
        type: values.type || 'enterprise',
        level: values.level,
        status: values.status || 'potential',
        industry: values.industry,
        scale: values.scale,
        contactName: values.contactName || undefined,
        contactPhone: values.contactPhone || undefined,
        contactEmail: values.contactEmail || undefined,
        address: values.address || undefined,
        source: values.source || 'other',
        remark: values.remark || undefined,
        ownerId: values.ownerId
      };

      const response = await customerService.create(submitData);

      if (response.code === 201 || response.code === 200) {
        message.success('客户创建成功');
        handleDrawerClose();
        fetchCustomerList();
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      console.error('创建客户失败:', error);
      if (error.errorFields) {
        // 表单验证失败
        return;
      }
      message.error(error.message || '创建客户失败');
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * 获取客户等级对应的颜色
   */
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A': 'red',
      'B': 'orange',
      'C': 'blue',
      'D': 'default'
    };
    return colors[level] || 'default';
  };

  /**
   * 获取客户状态对应的颜色
   */
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'potential': 'blue',
      'formal': 'green',
      'key': 'red',
      'lost': 'default'
    };
    return colors[status] || 'default';
  };

  /**
   * 获取客户状态标签
   */
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'potential': '潜在客户',
      'formal': '正式客户',
      'key': '重点客户',
      'lost': '流失客户'
    };
    return labels[status] || status;
  };

  /**
   * 表格列定义
   */
  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      fixed: 'left' as const
    },
    {
      title: '客户编码',
      dataIndex: 'code',
      key: 'code',
      width: 150
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>{level}级</Tag>
      )
    },
    {
      title: '客户状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      )
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100,
      ellipsis: true
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 130
    },
    {
      title: '负责人',
      dataIndex: ['owner', 'realName'],
      key: 'owner',
      width: 100,
      render: (_: any, record: Customer) => record.owner?.realName || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Customer) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* 页面标题 */}
      <Title level={4} style={{ marginBottom: 24 }}>客户管理</Title>

      <Card style={{ marginBottom: 16 }}>
        {/* 搜索栏 */}
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6} lg={5}>
            <Input
              placeholder="请输入客户名称/编码"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4} lg={4}>
            <Select
              placeholder="客户等级"
              value={level || undefined}
              onChange={(value) => setLevel(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
              <Option value="D">D级</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4} lg={4}>
            <Select
              placeholder="客户状态"
              value={status || undefined}
              onChange={(value) => setStatus(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="potential">潜在客户</Option>
              <Option value="formal">正式客户</Option>
              <Option value="key">重点客户</Option>
              <Option value="lost">流失客户</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4} lg={4}>
            <Select
              placeholder="所属行业"
              value={industry || undefined}
              onChange={(value) => setIndustry(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="it">互联网</Option>
              <Option value="finance">金融</Option>
              <Option value="manufacturing">制造</Option>
              <Option value="education">教育</Option>
              <Option value="healthcare">医疗</Option>
              <Option value="other">其他</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={7}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        {/* 操作栏 */}
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建客户
          </Button>
        </div>

        {/* 数据表格 */}
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: '暂无数据'
          }}
        />

        {/* 分页组件 */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            onChange={handlePageChange}
            pageSizeOptions={['10', '20', '50', '100']}
          />
        </div>
      </Card>

      {/* 新建客户Drawer */}
      <Drawer
        title={drawerTitle}
        styles={{ wrapper: { width: 600 } }}
        open={drawerVisible}
        onClose={handleDrawerClose}
        extra={
          <Space>
            <Button onClick={handleDrawerClose}>取消</Button>
            <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="客户类型"
              >
                <Select placeholder="请选择客户类型" allowClear>
                  {customerOptions.types.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="客户等级"
              >
                <Select placeholder="请选择客户等级" allowClear>
                  {customerOptions.levels.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="客户状态"
              >
                <Select placeholder="请选择客户状态" allowClear>
                  {customerOptions.statuses.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="industry"
                label="所属行业"
                rules={[{ required: true, message: '请选择所属行业' }]}
              >
                <Select placeholder="请选择所属行业" allowClear>
                  {customerOptions.industries.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scale"
                label="客户规模"
              >
                <Select placeholder="请选择客户规模" allowClear>
                  {customerOptions.scales.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="source"
                label="客户来源"
              >
                <Select placeholder="请选择客户来源" allowClear>
                  {customerOptions.sources.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactName"
                label="联系人姓名"
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系人邮箱"
              >
                <Input placeholder="请输入联系人邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ownerId"
                label="负责人"
              >
                <Select placeholder="请选择负责人" allowClear>
                  {userOptions.map(user => (
                    <Option key={user.id} value={user.id}>{user.realName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="地址"
          >
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default CustomerList;