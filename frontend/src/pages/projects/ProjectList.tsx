/**
 * 项目列表页面
 * 企业项目全流程管理数据系统 - 项目管理模块
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
  InputNumber,
  Progress
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectService, contractService, userService } from '../../services/api';
import { Project, ProjectType, ProjectLevel, ProjectStatus, Contract, User } from '../../types';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [contractOptions, setContractOptions] = useState<Contract[]>([]);
  const [managerOptions, setManagerOptions] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, [page, pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await projectService.getList({
        page,
        pageSize,
        ...searchParams
      });
      if (response.success) {
        setData(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [contractRes, managerRes] = await Promise.all([
        contractService.getList({ pageSize: 1000 }),
        userService.getOptions()
      ]);
      if (contractRes.success) {
        setContractOptions(contractRes.data.list);
      }
      if (managerRes.success) {
        setManagerOptions(managerRes.data);
      }
    } catch (error) {
      console.error('获取选项失败', error);
    }
  };

  const handleSearch = (values: any) => {
    const params: any = {};
    if (values.keyword) params.keyword = values.keyword;
    if (values.projectType) params.projectType = values.projectType;
    if (values.status) params.status = values.status;
    if (values.level) params.level = values.level;
    if (values.managerId) params.managerId = values.managerId;
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

  const handleEdit = async (record: Project) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      planStartDate: record.planStartDate ? dayjs(record.planStartDate) : null,
      planEndDate: record.planEndDate ? dayjs(record.planEndDate) : null,
      actualStartDate: record.actualStartDate ? dayjs(record.actualStartDate) : null,
      actualEndDate: record.actualEndDate ? dayjs(record.actualEndDate) : null,
      budget: record.budget ? Number(record.budget) : null,
      contractAmount: record.contractAmount ? Number(record.contractAmount) : null
    });
    setModalVisible(true);
  };

  const handleView = (record: Project) => {
    navigate(`/projects/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await projectService.delete(id);
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
        planStartDate: values.planStartDate?.format('YYYY-MM-DD'),
        planEndDate: values.planEndDate?.format('YYYY-MM-DD'),
        actualStartDate: values.actualStartDate?.format('YYYY-MM-DD'),
        actualEndDate: values.actualEndDate?.format('YYYY-MM-DD'),
        budget: values.budget?.toString(),
        contractAmount: values.contractAmount?.toString()
      };

      if (editingId) {
        await projectService.update(editingId, submitData);
        message.success('更新成功');
      } else {
        await projectService.create(submitData);
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
      await projectService.submitApproval(id);
      message.success('提交审批成功');
      fetchData();
    } catch (error) {
      message.error('提交审批失败');
    }
  };

  const getProjectTypeName = (type: ProjectType): string => {
    const typeMap: Record<string, string> = {
      PRODUCT_DEVELOPMENT: '产品开发',
      SERVICE_DELIVERY: '服务交付',
      CONSULTING: '咨询实施',
      MIXED: '混合类型'
    };
    return typeMap[type] || type;
  };

  const getStatusConfig = (status: ProjectStatus) => {
    const config: Record<string, { color: string; text: string }> = {
      PENDING_APPROVAL: { color: 'processing', text: '立项审批中' },
      EXECUTING: { color: 'blue', text: '执行中' },
      ACCEPTANCE: { color: 'orange', text: '验收中' },
      COMPLETED: { color: 'success', text: '已验收' },
      TERMINATED: { color: 'red', text: '已终止' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const getLevelTag = (level: ProjectLevel) => {
    const levelConfig: Record<string, { color: string; text: string }> = {
      A: { color: 'red', text: 'A级-重要' },
      B: { color: 'orange', text: 'B级-一般' },
      C: { color: 'green', text: 'C级-普通' }
    };
    const config = levelConfig[level] || { color: 'default', text: level };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const calculateProgress = (project: Project): number => {
    const now = dayjs();
    const start = project.actualStartDate ? dayjs(project.actualStartDate) : dayjs(project.planStartDate);
    const end = project.actualEndDate ? dayjs(project.actualEndDate) : dayjs(project.planEndDate);

    if (!start.isValid()) return 0;
    if (project.status === 'COMPLETED') return 100;
    if (project.status === 'PENDING_APPROVAL') return 0;

    const totalDays = end.diff(start, 'day');
    if (totalDays <= 0) return 0;

    const daysPassed = now.diff(start, 'day');
    const progress = Math.round((daysPassed / totalDays) * 100);
    return Math.min(Math.max(progress, 0), 100);
  };

  const columns = [
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 120
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      key: 'projectType',
      render: (type: ProjectType) => (
        <Tag>{getProjectTypeName(type)}</Tag>
      )
    },
    {
      title: '项目级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: ProjectLevel) => getLevelTag(level)
    },
    {
      title: '项目经理',
      dataIndex: 'managerName',
      key: 'managerName'
    },
    {
      title: '计划工期',
      key: 'duration',
      render: (_: any, record: Project) => (
        `${record.planStartDate} ~ ${record.planEndDate}`
      )
    },
    {
      title: '进度',
      key: 'progress',
      width: 150,
      render: (_: any, record: Project) => <Progress percent={calculateProgress(record)} size="small" />
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: Project) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 'PENDING_APPROVAL' && (
            <Button type="link" size="small" onClick={() => handleSubmitApproval(record.id)}>
              提交审批
            </Button>
          )}
          <Popconfirm
            title="确定删除该项目吗?"
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
          项目管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增项目
        </Button>
      </div>

      {/* 搜索表单 */}
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="项目编号/名称" style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="projectType" label="项目类型">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="PRODUCT_DEVELOPMENT">产品开发</Option>
            <Option value="SERVICE_DELIVERY">服务交付</Option>
            <Option value="CONSULTING">咨询实施</Option>
            <Option value="MIXED">混合类型</Option>
          </Select>
        </Form.Item>
        <Form.Item name="level" label="项目级别">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="A">A级</Option>
            <Option value="B">B级</Option>
            <Option value="C">C级</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear>
            <Option value="PENDING_APPROVAL">立项审批中</Option>
            <Option value="EXECUTING">执行中</Option>
            <Option value="ACCEPTANCE">验收中</Option>
            <Option value="COMPLETED">已验收</Option>
            <Option value="TERMINATED">已终止</Option>
          </Select>
        </Form.Item>
        <Form.Item name="managerId" label="项目经理">
          <Select placeholder="请选择" style={{ width: 120 }} allowClear showSearch>
            {managerOptions.map((m) => (
              <Option key={m.id} value={m.id}>{m.realName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="计划日期">
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
        title={editingId ? '编辑项目' : '新增项目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="projectName"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            name="contractId"
            label="关联合同"
            rules={[{ required: true, message: '请选择关联合同' }]}
          >
            <Select placeholder="请选择合同" showSearch>
              {contractOptions.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.contractName} - {c.contractCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="projectType"
            label="项目类型"
            rules={[{ required: true, message: '请选择项目类型' }]}
          >
            <Select placeholder="请选择项目类型">
              <Option value="PRODUCT_DEVELOPMENT">产品开发</Option>
              <Option value="SERVICE_DELIVERY">服务交付</Option>
              <Option value="CONSULTING">咨询实施</Option>
              <Option value="MIXED">混合类型</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="managerId"
            label="项目经理"
            rules={[{ required: true, message: '请选择项目经理' }]}
          >
            <Select placeholder="请选择项目经理" showSearch>
              {managerOptions.map((m) => (
                <Option key={m.id} value={m.id}>{m.realName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="deputyManagerId" label="项目副经理">
            <Select placeholder="请选择项目副经理" allowClear showSearch>
              {managerOptions.map((m) => (
                <Option key={m.id} value={m.id}>{m.realName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="level" label="项目级别" initialValue="B">
            <Select placeholder="请选择项目级别">
              <Option value="A">A级-重要</Option>
              <Option value="B">B级-一般</Option>
              <Option value="C">C级-普通</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="planStartDate"
            label="计划开始日期"
            rules={[{ required: true, message: '请选择计划开始日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="planEndDate"
            label="计划结束日期"
            rules={[{ required: true, message: '请选择计划结束日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="budget"
            label="项目预算"
            rules={[{ required: true, message: '请输入项目预算' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入项目预算"
              min={0}
              precision={2}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
          <Form.Item
            name="contractAmount"
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
          <Form.Item name="description" label="项目概述">
            <Input.TextArea rows={3} placeholder="请输入项目概述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectListPage;