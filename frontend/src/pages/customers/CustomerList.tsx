/**
 * 客户列表页面
 * 企业项目全流程管理数据系统 - 客户管理模块
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
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { customerService, userService } from '../../services/api';
import { Customer, CustomerLevel, CustomerScale, CustomerIndustry, CustomerStatus, User } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const CustomerListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [salesOptions, setSalesOptions] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
    fetchSalesOptions();
  }, [page, pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customerService.getList({
        page,
        pageSize,
        ...searchParams
      });
      if (response.success) {
        setData(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesOptions = async () => {
    try {
      const response = await userService.getOptions({ role: 'sales_manager' });
      if (response.success) {
        setSalesOptions(response.data);
      }
    } catch (error) {
      console.error('获取销售选项失败', error);
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

  const handleEdit = async (record: Customer) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await customerService.delete(id);
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
        await customerService.update(editingId, values);
        message.success('更新成功');
      } else {
        await customerService.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      // 表单验证失败或API错误
    }
  };

  const columns = [
    {
      title: '客户编号',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 120
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      key: 'shortName'
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      render: (industry: CustomerIndustry) => {
        const industryMap: Record<string, string> = {
          IT: '信息技术',
          FINANCE: '金融',
          MANUFACTURING: '制造业',
          RETAIL: '零售',
          EDUCATION: '教育',
          HEALTHCARE: '医疗健康',
          REAL_ESTATE: '房地产',
          ENERGY: '能源',
          TRANSPORTATION: '交通物流',
          OTHER: '其他'
        };
        return <Tag>{industryMap[industry] || industry}</Tag>;
      }
    },
    {
      title: '规模',
      dataIndex: 'scale',
      key: 'scale',
      render: (scale: CustomerScale) => {
        const scaleMap: Record<string, string> = {
          LARGE: '大型',
          MEDIUM: '中型',
          SMALL: '小型',
          MICRO: '微型'
        };
        return <Tag color="blue">{scaleMap[scale] || scale}</Tag>;
      }
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: CustomerLevel) => {
        const colorMap: Record<string, string> = {
          A: 'red',
          B: 'orange',
          C: 'green',
          D: 'default'
        };
        return <Tag color={colorMap[level]}>{level}级</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: CustomerStatus) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          POTENTIAL: { color: 'default', text: '潜在客户' },
          FORMAL: { color: 'green', text: '正式客户' },
          LOST: { color: 'red', text: '已流失' }
        };
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
      }
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Customer) => (
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
            title="确定删除该客户吗?"
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
          客户管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增客户
        </Button>
      </div>

      {/* 搜索表单 */}
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="客户名称/简称/电话" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="level" label="客户等级">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="A">A级</Option>
            <Option value="B">B级</Option>
            <Option value="C">C级</Option>
            <Option value="D">D级</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="potential">潜在客户</Option>
            <Option value="formal">正式客户</Option>
            <Option value="lost">已流失</Option>
          </Select>
        </Form.Item>
        <Form.Item name="industry" label="行业">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            {Object.keys(CustomerIndustry).map((key) => (
              <Option key={key} value={key}>
                {key === 'IT' && '信息技术'}
                {key === 'FINANCE' && '金融'}
                {key === 'MANUFACTURING' && '制造业'}
                {key === 'RETAIL' && '零售'}
                {key === 'EDUCATION' && '教育'}
                {key === 'HEALTHCARE' && '医疗健康'}
                {key === 'REAL_ESTATE' && '房地产'}
                {key === 'ENERGY' && '能源'}
                {key === 'TRANSPORTATION' && '交通物流'}
                {key === 'OTHER' && '其他'}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Form.Item>
      </Form>

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
        title={editingId ? '编辑客户' : '新增客户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customerName"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="shortName" label="客户简称">
            <Input placeholder="请输入客户简称" />
          </Form.Item>
          <Form.Item
            name="industry"
            label="所属行业"
            rules={[{ required: true, message: '请选择行业' }]}
          >
            <Select placeholder="请选择行业">
              {Object.keys(CustomerIndustry).map((key) => (
                <Option key={key} value={key}>
                  {key === 'IT' && '信息技术'}
                  {key === 'FINANCE' && '金融'}
                  {key === 'MANUFACTURING' && '制造业'}
                  {key === 'RETAIL' && '零售'}
                  {key === 'EDUCATION' && '教育'}
                  {key === 'HEALTHCARE' && '医疗健康'}
                  {key === 'REAL_ESTATE' && '房地产'}
                  {key === 'ENERGY' && '能源'}
                  {key === 'TRANSPORTATION' && '交通物流'}
                  {key === 'OTHER' && '其他'}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="scale"
            label="客户规模"
            rules={[{ required: true, message: '请选择规模' }]}
          >
            <Select placeholder="请选择规模">
              <Option value="large">大型企业</Option>
              <Option value="medium">中型企业</Option>
              <Option value="small">小型企业</Option>
              <Option value="micro">微型企业</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="address" label="联系地址">
            <Input placeholder="请输入联系地址" />
          </Form.Item>
          <Form.Item
            name="level"
            label="客户等级"
            rules={[{ required: true, message: '请选择等级' }]}
          >
            <Select placeholder="请选择等级">
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
              <Option value="D">D级</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ownerId" label="负责人">
            <Select placeholder="请选择负责人" allowClear>
              {salesOptions.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.realName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="客户状态">
            <Select placeholder="请选择状态">
              <Option value="potential">潜在客户</Option>
              <Option value="formal">正式客户</Option>
              <Option value="lost">已流失</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerListPage;