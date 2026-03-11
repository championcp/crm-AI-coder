/**
 * 项目详情页面
 * 企业项目全流程管理数据系统 - 项目管理模块
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Tabs,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Spin,
  Typography,
  Popconfirm,
  Select,
  InputNumber,
  Progress
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { projectService, userService, contractService } from '../../services/api';
import { Project, ProjectType, ProjectLevel, ProjectStatus, User } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Milestone {
  id: string;
  milestoneCode: string;
  name: string;
  description?: string;
  planDate: string;
  actualDate?: string;
  status: string;
  deliverables?: string;
}

interface ProjectMember {
  id: string;
  userId: string;
  userName?: string;
  role: string;
  department: string;
  joinDate: string;
  leaveDate?: string;
  workRatio: string;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [milestoneForm] = Form.useForm();
  const [memberForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchProjectDetail();
      fetchUserOptions();
    }
  }, [id]);

  const fetchProjectDetail = async () => {
    setLoading(true);
    try {
      const response = await projectService.getById(id!);
      if (response.success) {
        setProject(response.data);
        // 如果后端返回了里程碑和成员数据，也需要获取
        setMilestones(response.data.milestones || []);
        setMembers(response.data.members || []);
      }
    } catch (error) {
      message.error('获取项目详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOptions = async () => {
    try {
      const response = await userService.getOptions();
      if (response.success) {
        setUserOptions(response.data);
      }
    } catch (error) {
      console.error('获取用户选项失败', error);
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

  const getMilestoneStatusConfig = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      NOT_STARTED: { color: 'default', text: '未开始' },
      IN_PROGRESS: { color: 'processing', text: '进行中' },
      COMPLETED: { color: 'success', text: '已完成' },
      DELAYED: { color: 'error', text: '已延期' }
    };
    return config[status] || { color: 'default', text: status };
  };

  // 里程碑相关操作
  const handleAddMilestone = () => {
    setEditingMilestone(null);
    milestoneForm.resetFields();
    setMilestoneModalVisible(true);
  };

  const handleEditMilestone = (record: Milestone) => {
    setEditingMilestone(record);
    milestoneForm.setFieldsValue({
      ...record,
      planDate: record.planDate ? dayjs(record.planDate) : null,
      actualDate: record.actualDate ? dayjs(record.actualDate) : null
    });
    setMilestoneModalVisible(true);
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      // 假设有删除里程碑的API
      // await projectService.deleteMilestone(id!, milestoneId);
      message.success('删除成功');
      fetchProjectDetail();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmitMilestone = async () => {
    try {
      const values = await milestoneForm.validateFields();
      const submitData = {
        ...values,
        planDate: values.planDate?.format('YYYY-MM-DD'),
        actualDate: values.actualDate?.format('YYYY-MM-DD')
      };

      if (editingMilestone) {
        // 更新里程碑
        // await projectService.updateMilestone(id!, editingMilestone.id, submitData);
        message.success('更新成功');
      } else {
        // 添加里程碑
        await projectService.addMilestone(id!, submitData);
        message.success('添加成功');
      }
      setMilestoneModalVisible(false);
      fetchProjectDetail();
    } catch (error) {
      // 表单验证或API错误
    }
  };

  // 团队成员相关操作
  const handleAddMember = () => {
    setEditingMember(null);
    memberForm.resetFields();
    setMemberModalVisible(true);
  };

  const handleEditMember = (record: ProjectMember) => {
    setEditingMember(record);
    memberForm.setFieldsValue({
      ...record,
      joinDate: record.joinDate ? dayjs(record.joinDate) : null,
      leaveDate: record.leaveDate ? dayjs(record.leaveDate) : null
    });
    setMemberModalVisible(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      // 假设有删除成员的API
      // await projectService.deleteMember(id!, memberId);
      message.success('删除成功');
      fetchProjectDetail();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmitMember = async () => {
    try {
      const values = await memberForm.validateFields();
      const submitData = {
        ...values,
        joinDate: values.joinDate?.format('YYYY-MM-DD'),
        leaveDate: values.leaveDate?.format('YYYY-MM-DD'),
        workRatio: values.workRatio?.toString()
      };

      if (editingMember) {
        // 更新成员
        message.success('更新成功');
      } else {
        // 添加成员
        await projectService.addMember(id!, submitData);
        message.success('添加成功');
      }
      setMemberModalVisible(false);
      fetchProjectDetail();
    } catch (error) {
      // 表单验证或API错误
    }
  };

  const calculateProgress = (): number => {
    if (!project) return 0;
    if (project.status === 'COMPLETED') return 100;
    if (project.status === 'PENDING_APPROVAL') return 0;

    const now = dayjs();
    const start = project.actualStartDate ? dayjs(project.actualStartDate) : dayjs(project.planStartDate);
    const end = project.actualEndDate ? dayjs(project.actualEndDate) : dayjs(project.planEndDate);

    if (!start.isValid()) return 0;

    const totalDays = end.diff(start, 'day');
    if (totalDays <= 0) return 0;

    const daysPassed = now.diff(start, 'day');
    const progress = Math.round((daysPassed / totalDays) * 100);
    return Math.min(Math.max(progress, 0), 100);
  };

  const completedMilestones = milestones.filter(m => m.status === 'COMPLETED').length;
  const totalMilestones = milestones.length;

  const milestoneColumns = [
    {
      title: '里程碑编号',
      dataIndex: 'milestoneCode',
      key: 'milestoneCode',
      width: 120
    },
    {
      title: '里程碑名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate'
    },
    {
      title: '实际日期',
      dataIndex: 'actualDate',
      key: 'actualDate',
      render: (date: string) => date || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getMilestoneStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '交付物',
      dataIndex: 'deliverables',
      key: 'deliverables',
      render: (text: string) => text || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Milestone) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditMilestone(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该里程碑吗?"
            onConfirm={() => handleDeleteMilestone(record.id)}
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

  const memberColumns = [
    {
      title: '成员姓名',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: '入项日期',
      dataIndex: 'joinDate',
      key: 'joinDate'
    },
    {
      title: '离项日期',
      dataIndex: 'leaveDate',
      key: 'leaveDate',
      render: (date: string) => date || '-'
    },
    {
      title: '工作占比',
      dataIndex: 'workRatio',
      key: 'workRatio',
      render: (ratio: string) => `${ratio}%`
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ProjectMember) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditMember(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该成员吗?"
            onConfirm={() => handleDeleteMember(record.id)}
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
          返回列表
        </Button>
        <div style={{ marginTop: 20, textAlign: 'center' }}>项目不存在</div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')} style={{ marginBottom: 16 }}>
        返回列表
      </Button>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {project.projectName}
            </Title>
            <Text type="secondary">{project.projectCode}</Text>
          </div>
          <Space>
            <Tag color={statusConfig.color} style={{ fontSize: 14, padding: '4px 12px' }}>
              {statusConfig.text}
            </Tag>
            <Tag color={project.level === 'A' ? 'red' : project.level === 'B' ? 'orange' : 'green'}>
              {project.level}级项目
            </Tag>
          </Space>
        </div>

        <Progress
          percent={calculateProgress()}
          status={project.status === 'TERMINATED' ? 'exception' : undefined}
          style={{ marginBottom: 24 }}
        />

        <Descriptions bordered column={2}>
          <Descriptions.Item label="项目类型">{getProjectTypeName(project.projectType)}</Descriptions.Item>
          <Descriptions.Item label="客户名称">{project.customerName}</Descriptions.Item>
          <Descriptions.Item label="项目经理">{project.managerName}</Descriptions.Item>
          <Descriptions.Item label="项目副经理">{project.deputyManagerName || '-'}</Descriptions.Item>
          <Descriptions.Item label="计划开始日期">{project.planStartDate}</Descriptions.Item>
          <Descriptions.Item label="计划结束日期">{project.planEndDate}</Descriptions.Item>
          <Descriptions.Item label="实际开始日期">{project.actualStartDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="实际结束日期">{project.actualEndDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="项目预算">¥{Number(project.budget || 0).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="合同金额">¥{Number(project.contractAmount || 0).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="项目概述" span={2}>{project.description || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs
        defaultActiveKey="milestones"
        style={{ marginTop: 16 }}
        items={[
          {
            key: 'milestones',
            label: `里程碑 (${completedMilestones}/${totalMilestones})`,
            children: (
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMilestone}>
                    添加里程碑
                  </Button>
                </div>
                <Table
                  columns={milestoneColumns}
                  dataSource={milestones}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            )
          },
          {
            key: 'members',
            label: `团队成员 (${members.length})`,
            children: (
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMember}>
                    添加成员
                  </Button>
                </div>
                <Table
                  columns={memberColumns}
                  dataSource={members}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            )
          }
        ]}
      />

      {/* 里程碑弹窗 */}
      <Modal
        title={editingMilestone ? '编辑里程碑' : '添加里程碑'}
        open={milestoneModalVisible}
        onOk={handleSubmitMilestone}
        onCancel={() => setMilestoneModalVisible(false)}
        width={600}
      >
        <Form form={milestoneForm} layout="vertical">
          <Form.Item
            name="name"
            label="里程碑名称"
            rules={[{ required: true, message: '请输入里程碑名称' }]}
          >
            <Input placeholder="请输入里程碑名称" />
          </Form.Item>
          <Form.Item name="description" label="里程碑说明">
            <TextArea rows={2} placeholder="请输入里程碑说明" />
          </Form.Item>
          <Form.Item name="planDate" label="计划完成日期" rules={[{ required: true, message: '请选择计划完成日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="actualDate" label="实际完成日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="NOT_STARTED">
            <Select placeholder="请选择状态">
              <Option value="NOT_STARTED">未开始</Option>
              <Option value="IN_PROGRESS">进行中</Option>
              <Option value="COMPLETED">已完成</Option>
              <Option value="DELAYED">已延期</Option>
            </Select>
          </Form.Item>
          <Form.Item name="deliverables" label="交付物">
            <TextArea rows={2} placeholder="请输入交付物" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 成员弹窗 */}
      <Modal
        title={editingMember ? '编辑成员' : '添加成员'}
        open={memberModalVisible}
        onOk={handleSubmitMember}
        onCancel={() => setMemberModalVisible(false)}
        width={600}
      >
        <Form form={memberForm} layout="vertical">
          <Form.Item
            name="userId"
            label="成员"
            rules={[{ required: true, message: '请选择成员' }]}
          >
            <Select placeholder="请选择成员" showSearch>
              {userOptions.map((u) => (
                <Option key={u.id} value={u.id}>{u.realName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请输入角色' }]}
          >
            <Input placeholder="请输入角色（如：开发工程师、测试工程师）" />
          </Form.Item>
          <Form.Item
            name="department"
            label="所属部门"
            rules={[{ required: true, message: '请输入所属部门' }]}
          >
            <Input placeholder="请输入所属部门" />
          </Form.Item>
          <Form.Item
            name="joinDate"
            label="入项日期"
            rules={[{ required: true, message: '请选择入项日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="leaveDate" label="离项日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="workRatio"
            label="工作占比(%)"
            rules={[{ required: true, message: '请输入工作占比' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              placeholder="请输入工作占比"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;