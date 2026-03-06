/**
 * 合同列表页面
 * 企业项目全流程管理数据系统 - 合同管理模块
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
  DatePicker,
  InputNumber
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { contractService, customerService, userService } from '../../services/api';
import { Contract, ContractType, ContractStatus, Customer, User } from '../../types';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ContractListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [form] = Form.useForm();
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [ownerOptions, setOwnerOptions] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, [page, pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await contractService.getList({
        page,
        pageSize,
        ...searchParams
      });
      if (response.success) {
        setData(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('获取合同列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [customerRes, ownerRes] = await Promise.all([
        customerService.getOptions(),
        userService.getOptions()
      ]);
      if (customerRes.success) {
        setCustomerOptions(customerRes.data);
      }
      if (ownerRes.success) {
        setOwnerOptions(ownerRes.data);
      }
    } catch (error) {
      console.error('获取选项失败', error);
    }
  };

  const handleSearch = (values: any) => {
    const params: any = {};
    if (values.keyword) params.keyword = values.keyword;
    if (values.contractType) params.contractType = values.contractType;
    if (values.status) params.status = values.status;
    if (values.customerId) params.customerId = values.customerId;
    if (values.dateRange) {
      params.startDate = values.dateRange[0].format('YYYY-MM-DD');
      params.endDate = values.dateRange[1].format('YYYY-MM-DD');
    }
    setSearchParams(params);
    setPage(1);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (record: Contract) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      signDate: record.signDate ? dayjs(record.signDate) : null,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null
    });
    setModalVisible(true);
  };

  const handleView = async (record: Contract) => {
    try {
      const response = await contractService.getById(record.id);
      if (response.success) {
        setViewingContract(response.data);
        setDetailVisible(true);
      }
    } catch (error) {
      message.error('获取合同详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contractService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        signDate: values.signDate?.format('YYYY-MM-DD'),
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
        amount: values.amount?.toString()
      };

      if (editingId) {
        await contractService.update(editingId, submitData);
        message.success('更新成功');
      } else {
        await contractService.create(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      // 表单验证失败或API错误
    }
  };

  const handleSubmitApproval = async (id: string) => {
    try {
      await contractService.submitApproval(id);
      message.success('提交审批成功');
      fetchData();
    } catch (error) {
      message.error('提交审批失败');
    }
  };

  const getContractTypeName = (type: ContractType): string => {
    const typeMap: Record<string, string> = {
      SALES: '销售合同',
      PURCHASE: '采购合同',
      SERVICE: '服务合同',
      CONSULTING: '咨询合同',
      OTHER: '其他'
    };
    return typeMap[type] || type;
  };

  const getStatusConfig = (status: ContractStatus) => {
    const config: Record<string, { color: string; text: string }> = {
      DRAFT: { color: 'default', text: '草稿' },
      PENDING_APPROVAL: { color: 'processing', text: '待审批' },
      APPROVED: { color: 'success', text: '已审批' },
      REJECTED: { color: 'error', text: '已驳回' },
      SIGNED: { color: 'blue', text: '已签订' },
      COMPLETED: { color: 'green', text: '已履行' },
      TERMINATED: { color: 'red', text: '已终止' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractCode',
      key: 'contractCode',
      width: 140
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      render: (type: ContractType) => (
        <Tag color="blue">{getContractTypeName(type)}</Tag>
      )
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => amount ? `¥${Number(amount).toLocaleString()}` : '-'
    },
    {
      title: '签订日期',
      dataIndex: 'signDate',
      key: 'signDate',
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-'
    },
    {
      title: '合同期限',
      key: 'duration',
      render: (_: any, record: Contract) => {
        if (record.startDate && record.endDate) {
          return `${record.startDate} ~ ${record.endDate}`;
        }
        return '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ContractStatus) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Contract) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 'DRAFT' && (
            <Button type="link" size="small" onClick={() => handleSubmitApproval(record.id)}>
              提交审批
            </Button>
          )}
          <Popconfirm
            title="确定删除该合同吗?"
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
          合同管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增合同
        </Button>
      </div>

      {/* 搜索表单 */}
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="合同编号/名称" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="contractType" label="合同类型">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="SALES">销售合同</Option>
            <Option value="PURCHASE">采购合同</Option>
            <Option value="SERVICE">服务合同</Option>
            <Option value="CONSULTING">咨询合同</Option>
            <Option value="OTHER">其他</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="DRAFT">草稿</Option>
            <Option value="PENDING_APPROVAL">待审批</Option>
            <Option value="APPROVED">已审批</Option>
            <Option value="REJECTED">已驳回</Option>
            <Option value="SIGNED">已签订</Option>
            <Option value="COMPLETED">已履行</Option>
            <Option value="TERMINATED">已终止</Option>
          </Select>
        </Form.Item>
        <Form.Item name="customerId" label="客户">
          <Select placeholder="请选择客户" style={{ width: 160 }} allowClear showSearch>
            {customerOptions.map((c) => (
              <Option key={c.id} value={c.id}>{c.customerName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="签订日期">
          <RangePicker />
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
        title={editingId ? '编辑合同' : '新增合同'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="contractName"
            label="合同名称"
            rules={[{ required: true, message: '请输入合同名称' }]}
          >
            <Input placeholder="请输入合同名称" />
          </Form.Item>
          <Form.Item
            name="customerId"
            label="客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户" showSearch>
              {customerOptions.map((c) => (
                <Option key={c.id} value={c.id}>{c.customerName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contractType"
            label="合同类型"
            rules={[{ required: true, message: '请选择合同类型' }]}
          >
            <Select placeholder="请选择合同类型">
              <Option value="SALES">销售合同</Option>
              <Option value="PURCHASE">采购合同</Option>
              <Option value="SERVICE">服务合同</Option>
              <Option value="CONSULTING">咨询合同</Option>
              <Option value="OTHER">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="合同金额"
            rules={[{ required: true, message: '请输入合同金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入合同金额"
              min={0}
              precision={2}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
          <Form.Item name="signDate" label="签订日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="startDate" label="开始日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="endDate" label="结束日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ownerId" label="负责人">
            <Select placeholder="请选择负责人" allowClear>
              {ownerOptions.map((u) => (
                <Option key={u.id} value={u.id}>{u.realName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="paymentTerms" label="付款条款">
            <Input.TextArea rows={2} placeholder="请输入付款条款" />
          </Form.Item>
          <Form.Item name="deliveryTerms" label="交付条款">
            <Input.TextArea rows={2} placeholder="请输入交付条款" />
          </Form.Item>
          <Form.Item name="description" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="合同详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {viewingContract && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <strong>合同编号：</strong>{viewingContract.contractCode}
              </div>
              <div>
                <strong>状态：</strong>
                <Tag color={getStatusConfig(viewingContract.status).color}>
                  {getStatusConfig(viewingContract.status).text}
                </Tag>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>合同名称：</strong>{viewingContract.contractName}
              </div>
              <div>
                <strong>客户名称：</strong>{viewingContract.customerName}
              </div>
              <div>
                <strong>合同类型：</strong>{getContractTypeName(viewingContract.contractType)}
              </div>
              <div>
                <strong>合同金额：</strong>¥{Number(viewingContract.amount || 0).toLocaleString()}
              </div>
              <div>
                <strong>签订日期：</strong>{viewingContract.signDate || '-'}
              </div>
              <div>
                <strong>合同期限：</strong>
                {viewingContract.startDate && viewingContract.endDate
                  ? `${viewingContract.startDate} ~ ${viewingContract.endDate}`
                  : '-'}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>付款条款：</strong>{viewingContract.paymentTerms || '-'}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>交付条款：</strong>{viewingContract.deliveryTerms || '-'}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>备注：</strong>{viewingContract.description || '-'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContractListPage;