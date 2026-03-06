/**
 * 进度管理页面
 * 企业项目全流程管理数据系统 - 执行管理模块
 */

import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
  Progress,
  Typography,
  Input,
  Select,
  DatePicker,
  Form,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { projectService } from '../../services/api';
import { Project } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ProgressRecord {
  id: string;
  projectId: string;
  projectName: string;
  reportDate: string;
  overallProgress: number;
  milestoneProgress: number;
  taskProgress: number;
  issues: string;
  nextPlan: string;
  reporterId: string;
  reporterName: string;
  createTime: string;
}

const ProgressListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProgressRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<ProgressRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchProjects();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // 模拟数据 - 实际应该调用API
    const mockData: ProgressRecord[] = [
      {
        id: '1',
        projectId: 'p1',
        projectName: '某企业ERP系统开发项目',
        reportDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        overallProgress: 65,
        milestoneProgress: 70,
        taskProgress: 60,
        issues: '人员协调需要进一步优化',
        nextPlan: '完成第三阶段开发工作',
        reporterId: 'u1',
        reporterName: '张三',
        createTime: dayjs().subtract(1, 'day').toISOString()
      },
      {
        id: '2',
        projectId: 'p2',
        projectName: '某银行数据仓库项目',
        reportDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
        overallProgress: 45,
        milestoneProgress: 50,
        taskProgress: 40,
        issues: '遇到技术难点',
        nextPlan: '攻克技术难题',
        reporterId: 'u2',
        reporterName: '李四',
        createTime: dayjs().subtract(2, 'day').toISOString()
      }
    ];
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  const fetchProjects = async () => {
    try {
      const response = await projectService.getList({ pageSize: 100 });
      if (response.success) {
        setProjects(response.data.list);
      }
    } catch (error) {
      console.error('获取项目列表失败', error);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({
      reportDate: dayjs(),
      overallProgress: 0
    });
    setModalVisible(true);
  };

  const handleView = (record: ProgressRecord) => {
    setViewingRecord(record);
    setDetailVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success('提交成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      // 表单验证失败
    }
  };

  const getStatusConfig = (progress: number) => {
    if (progress >= 80) return { status: 'success', text: '正常', color: 'green' };
    if (progress >= 50) return { status: 'normal', text: '进行中', color: 'blue' };
    if (progress >= 30) return { status: 'active', text: '需要注意', color: 'orange' };
    return { status: 'exception', text: '滞后', color: 'red' };
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: '报告日期',
      dataIndex: 'reportDate',
      key: 'reportDate'
    },
    {
      title: '总体进度',
      dataIndex: 'overallProgress',
      key: 'overallProgress',
      render: (progress: number) => {
        const config = getStatusConfig(progress);
        return (
          <Progress
            percent={progress}
            size="small"
            status={config.status as any}
            strokeColor={config.color}
          />
        );
      }
    },
    {
      title: '里程碑进度',
      dataIndex: 'milestoneProgress',
      key: 'milestoneProgress',
      render: (progress: number) => `${progress}%`
    },
    {
      title: '任务进度',
      dataIndex: 'taskProgress',
      key: 'taskProgress',
      render: (progress: number) => `${progress}%`
    },
    {
      title: '汇报人',
      dataIndex: 'reporterName',
      key: 'reporterName'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ProgressRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          进度管理
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增进度报告
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="执行中项目"
              value={projects.filter(p => p.status === 'EXECUTING').length}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常进度"
              value={data.filter(d => d.overallProgress >= 50).length}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="需要注意"
              value={data.filter(d => d.overallProgress >= 30 && d.overallProgress < 50).length}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进度滞后"
              value={data.filter(d => d.overallProgress < 30).length}
              valueStyle={{ color: '#cf1322' }}
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
        title="新增进度报告"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="projectId"
            label="项目"
            rules={[{ required: true, message: '请选择项目' }]}
          >
            <Select placeholder="请选择项目" showSearch>
              {projects.map((p) => (
                <Option key={p.id} value={p.id}>{p.projectName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="reportDate" label="报告日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="overallProgress"
            label="总体进度(%)"
            rules={[{ required: true, message: '请输入进度' }]}
          >
            <Input type="number" min={0} max={100} placeholder="0-100" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="milestoneProgress" label="里程碑进度(%)">
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="taskProgress" label="任务进度(%)">
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="issues" label="当前问题">
            <TextArea rows={2} placeholder="请描述当前遇到的问题" />
          </Form.Item>
          <Form.Item name="nextPlan" label="下一步计划">
            <TextArea rows={2} placeholder="请描述下一步计划" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="进度详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {viewingRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="项目名称">{viewingRecord.projectName}</Descriptions.Item>
            <Descriptions.Item label="报告日期">{viewingRecord.reportDate}</Descriptions.Item>
            <Descriptions.Item label="总体进度">
              <Progress percent={viewingRecord.overallProgress} />
            </Descriptions.Item>
            <Descriptions.Item label="里程碑进度">{viewingRecord.milestoneProgress}%</Descriptions.Item>
            <Descriptions.Item label="任务进度">{viewingRecord.taskProgress}%</Descriptions.Item>
            <Descriptions.Item label="当前问题">{viewingRecord.issues}</Descriptions.Item>
            <Descriptions.Item label="下一步计划">{viewingRecord.nextPlan}</Descriptions.Item>
            <Descriptions.Item label="汇报人">{viewingRecord.reporterName}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ProgressListPage;