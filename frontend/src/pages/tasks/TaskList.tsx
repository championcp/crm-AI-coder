/**
 * 任务管理页面
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
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface TaskRecord {
  id: string;
  taskCode: string;
  taskName: string;
  projectName: string;
 负责人: string;
  executorName: string;
  priority: string;
  status: string;
  planStartDate: string;
  planEndDate: string;
  progress: number;
  createTime: string;
}

const TaskListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TaskRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TaskRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<TaskRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // 模拟数据
    const mockData: TaskRecord[] = [
      {
        id: '1',
        taskCode: 'T001',
        taskName: '完成数据库设计',
        projectName: 'ERP系统开发项目',
        负责人: '张三',
        executorName: '李四',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        planStartDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
        planEndDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
        progress: 60,
        createTime: dayjs().subtract(10, 'day').toISOString()
      },
      {
        id: '2',
        taskCode: 'T002',
        taskName: '前端页面开发',
        projectName: 'ERP系统开发项目',
        负责人: '王五',
        executorName: '赵六',
        priority: 'MEDIUM',
        status: 'PENDING',
        planStartDate: dayjs().format('YYYY-MM-DD'),
        planEndDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        progress: 0,
        createTime: dayjs().subtract(5, 'day').toISOString()
      },
      {
        id: '3',
        taskCode: 'T003',
        taskName: '接口对接',
        projectName: '银行数据仓库项目',
        负责人: '孙七',
        executorName: '周八',
        priority: 'HIGH',
        status: 'COMPLETED',
        planStartDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
        planEndDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
        progress: 100,
        createTime: dayjs().subtract(15, 'day').toISOString()
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

  const handleEdit = (record: TaskRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: TaskRecord) => {
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

  const getPriorityConfig = (priority: string) => {
    const config: Record<string, { color: string; text: string }> = {
      HIGH: { color: 'red', text: '高优先级' },
      MEDIUM: { color: 'orange', text: '中优先级' },
      LOW: { color: 'green', text: '低优先级' }
    };
    return config[priority] || { color: 'default', text: priority };
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'default', text: '待开始' },
      IN_PROGRESS: { color: 'processing', text: '进行中' },
      COMPLETED: { color: 'success', text: '已完成' },
      CANCELLED: { color: 'red', text: '已取消' }
    };
    return config[status] || { color: 'default', text: status };
  };

  const columns = [
    {
      title: '任务编号',
      dataIndex: 'taskCode',
      key: 'taskCode',
      width: 100
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName'
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '负责人',
      dataIndex: '负责人',
      key: '负责人'
    },
    {
      title: '执行人',
      dataIndex: 'executorName',
      key: 'executorName'
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityConfig(priority).color}>{getPriorityConfig(priority).text}</Tag>
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
      title: '计划工期',
      key: 'duration',
      render: (_: any, record: TaskRecord) => `${record.planStartDate} ~ ${record.planEndDate}`
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: TaskRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该任务吗?"
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
          任务管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增任务
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总任务数" value={data.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="进行中" value={data.filter(d => d.status === 'IN_PROGRESS').length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已完成" value={data.filter(d => d.status === 'COMPLETED').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="超期任务" value={data.filter(d => dayjs(d.planEndDate).isBefore(dayjs()) && d.status !== 'COMPLETED').length} valueStyle={{ color: '#f5222d' }} />
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
        title={editingRecord ? '编辑任务' : '新增任务'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="taskName" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item name="projectName" label="所属项目" rules={[{ required: true, message: '请输入所属项目' }]}>
            <Input placeholder="请输入所属项目" />
          </Form.Item>
          <Form.Item name="负责人" label="负责人" rules={[{ required: true, message: '请输入负责人' }]}>
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="executorName" label="执行人">
            <Input placeholder="请输入执行人" />
          </Form.Item>
          <Form.Item name="priority" label="优先级" initialValue="MEDIUM">
            <Select>
              <Option value="HIGH">高优先级</Option>
              <Option value="MEDIUM">中优先级</Option>
              <Option value="LOW">低优先级</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="PENDING">
            <Select>
              <Option value="PENDING">待开始</Option>
              <Option value="IN_PROGRESS">进行中</Option>
              <Option value="COMPLETED">已完成</Option>
              <Option value="CANCELLED">已取消</Option>
            </Select>
          </Form.Item>
          <Form.Item name="progress" label="进度(%)" initialValue={0}>
            <Input type="number" min={0} max={100} />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <Input.TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="任务详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
        width={600}
      >
        {viewingRecord && (
          <div>
            <p><strong>任务编号：</strong>{viewingRecord.taskCode}</p>
            <p><strong>任务名称：</strong>{viewingRecord.taskName}</p>
            <p><strong>所属项目：</strong>{viewingRecord.projectName}</p>
            <p><strong>负责人：</strong>{viewingRecord.负责人}</p>
            <p><strong>执行人：</strong>{viewingRecord.executorName}</p>
            <p><strong>优先级：</strong><Tag color={getPriorityConfig(viewingRecord.priority).color}>{getPriorityConfig(viewingRecord.priority).text}</Tag></p>
            <p><strong>状态：</strong><Tag color={getStatusConfig(viewingRecord.status).color}>{getStatusConfig(viewingRecord.status).text}</Tag></p>
            <p><strong>计划工期：</strong>{viewingRecord.planStartDate} ~ {viewingRecord.planEndDate}</p>
            <p><strong>进度：</strong><Progress percent={viewingRecord.progress} /></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaskListPage;