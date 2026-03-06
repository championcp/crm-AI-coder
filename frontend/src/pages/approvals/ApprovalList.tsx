/**
 * 审批中心页面
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
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Empty
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { approvalService, userService } from '../../services/api';
import { Approval, ApprovalType, ApprovalStatus } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ApprovalListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Approval[]>([]);
  const [pendingData, setPendingData] = useState<Approval[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewingApproval, setViewingApproval] = useState<Approval | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [commentForm] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchPendingData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await approvalService.getList({ pageSize: 100 });
      if (response.success) {
        setData(response.data.list);
      }
    } catch (error) {
      // 使用模拟数据
      const mockData = getMockApprovals();
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingData = async () => {
    try {
      const response = await approvalService.getPending();
      if (response.success) {
        setPendingData(response.data);
      }
    } catch (error) {
      const mockPending = getMockApprovals().filter(a => a.status === 'PENDING');
      setPendingData(mockPending);
    }
  };

  const getMockApprovals = (): Approval[] => {
    return [
      {
        id: '1',
        approvalCode: 'AP001',
        type: ApprovalType.PROJECT_SETUP,
        title: 'ERP系统开发项目立项申请',
        content: '申请立项ERP系统开发项目，项目预算50万元，周期6个月',
        applicantId: 'u1',
        applicant: { id: 'u1', username: 'zhangsan', realName: '张三', role: 'PROJECT_MANAGER' as any, department: '项目部', status: 'active' },
        status: ApprovalStatus.PENDING,
        relatedId: 'p1',
        relatedType: 'project',
        createTime: dayjs().subtract(1, 'day').toISOString(),
        updateTime: dayjs().subtract(1, 'day').toISOString()
      },
      {
        id: '2',
        approvalCode: 'AP002',
        type: ApprovalType.CONTRACT_APPROVAL,
        title: '某企业ERP开发合同审批',
        content: '合同金额80万元，需要审批',
        applicantId: 'u2',
        applicant: { id: 'u2', username: 'lisi', realName: '李四', role: 'SALES_MANAGER' as any, department: '销售部', status: 'active' },
        status: ApprovalStatus.PENDING,
        relatedId: 'c1',
        relatedType: 'contract',
        createTime: dayjs().subtract(2, 'day').toISOString(),
        updateTime: dayjs().subtract(2, 'day').toISOString()
      },
      {
        id: '3',
        approvalCode: 'AP003',
        type: ApprovalType.OPPORTUNITY_CHANGE,
        title: '银行数据仓库项目商机变更',
        content: '商机阶段从需求分析变更为方案设计',
        applicantId: 'u3',
        applicant: { id: 'u3', username: 'wangwu', realName: '王五', role: 'SALES_CONTROLLER' as any, department: '销售部', status: 'active' },
        status: ApprovalStatus.APPROVED,
        approverId: 'u4',
        approver: { id: 'u4', username: 'zhaoliu', realName: '赵六', role: 'SENIOR_MANAGEMENT' as any, department: '总经办', status: 'active' },
        comment: '同意变更',
        approvalTime: dayjs().subtract(3, 'day').toISOString(),
        relatedId: 'o1',
        relatedType: 'opportunity',
        createTime: dayjs().subtract(5, 'day').toISOString(),
        updateTime: dayjs().subtract(3, 'day').toISOString()
      },
      {
        id: '4',
        approvalCode: 'AP004',
        type: ApprovalType.PROJECT_CHANGE,
        title: 'ERP项目延期申请',
        content: '由于技术难点，申请项目延期1个月',
        applicantId: 'u1',
        applicant: { id: 'u1', username: 'zhangsan', realName: '张三', role: 'PROJECT_MANAGER' as any, department: '项目部', status: 'active' },
        status: ApprovalStatus.REJECTED,
        approverId: 'u4',
        approver: { id: 'u4', username: 'zhaoliu', realName: '赵六', role: 'SENIOR_MANAGEMENT' as any, department: '总经办', status: 'active' },
        comment: '延期时间过长，需要重新评估',
        approvalTime: dayjs().subtract(1, 'day').toISOString(),
        relatedId: 'p1',
        relatedType: 'project',
        createTime: dayjs().subtract(5, 'day').toISOString(),
        updateTime: dayjs().subtract(1, 'day').toISOString()
      }
    ];
  };

  const handleView = (record: Approval) => {
    setViewingApproval(record);
    setModalVisible(true);
  };

  const handleApprove = async () => {
    try {
      const values = await commentForm.validateFields();
      if (viewingApproval) {
        await approvalService.process(viewingApproval.id, 'approve', values.comment);
        message.success('审批通过');
        setModalVisible(false);
        fetchData();
        fetchPendingData();
      }
    } catch (error) {
      // API错误
    }
  };

  const handleReject = async () => {
    try {
      const values = await commentForm.validateFields();
      if (viewingApproval) {
        await approvalService.process(viewingApproval.id, 'reject', values.comment);
        message.success('审批驳回');
        setModalVisible(false);
        fetchData();
        fetchPendingData();
      }
    } catch (error) {
      // API错误
    }
  };

  const getTypeConfig = (type: ApprovalType) => {
    const config: Record<string, { color: string; text: string }> = {
      OPPORTUNITY_CHANGE: { color: 'blue', text: '商机变更' },
      CONTRACT_APPROVAL: { color: 'purple', text: '合同审批' },
      PROJECT_SETUP: { color: 'green', text: '项目立项' },
      PROJECT_CHANGE: { color: 'orange', text: '项目变更' },
      PAYMENT_APPROVAL: { color: 'cyan', text: '付款审批' },
      OTHER: { color: 'default', text: '其他' }
    };
    return config[type] || { color: 'default', text: type };
  };

  const getStatusConfig = (status: ApprovalStatus) => {
    const config: Record<string, { color: string; text: string; icon: any }> = {
      PENDING: { color: 'processing', text: '待审批', icon: <ClockCircleOutlined /> },
      APPROVED: { color: 'success', text: '已通过', icon: <CheckCircleOutlined /> },
      REJECTED: { color: 'error', text: '已驳回', icon: <CloseCircleOutlined /> },
      CANCELLED: { color: 'default', text: '已取消', icon: <FileSearchOutlined /> }
    };
    return config[status] || { color: 'default', text: status, icon: null };
  };

  const columns = [
    {
      title: '审批编号',
      dataIndex: 'approvalCode',
      key: 'approvalCode',
      width: 120
    },
    {
      title: '审批类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: ApprovalType) => {
        const config = getTypeConfig(type);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '审批标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      render: (applicant: any) => applicant?.realName || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ApprovalStatus) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      }
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Approval) => (
        <Button type="link" size="small" onClick={() => handleView(record)}>
          查看详情
        </Button>
      )
    }
  ];

  const displayData = activeTab === 'pending' ? pendingData : data;

  const pendingCount = pendingData.length;
  const approvedCount = data.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = data.filter(d => d.status === 'REJECTED').length;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        审批中心
      </Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审批"
              value={pendingCount}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已通过"
              value={approvedCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已驳回"
              value={rejectedCount}
              valueStyle={{ color: '#f5222d' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总审批数"
              value={data.length}
              prefix={<FileSearchOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'pending',
            label: `待审批 (${pendingCount})`
          },
          {
            key: 'all',
            label: '全部审批'
          }
        ]}
      />

      <Table
        columns={columns}
        dataSource={displayData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <Empty description="暂无审批记录" /> }}
      />

      <Modal
        title="审批详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={viewingApproval?.status === 'PENDING' ? [
          <Button key="reject" type="primary" danger onClick={handleReject}>
            驳回
          </Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>
            通过
          </Button>
        ] : [
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {viewingApproval && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Tag color={getTypeConfig(viewingApproval.type).color}>
                  {getTypeConfig(viewingApproval.type).text}
                </Tag>
                <Tag color={getStatusConfig(viewingApproval.status).color}>
                  {getStatusConfig(viewingApproval.status).text}
                </Tag>
              </Space>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><strong>审批编号：</strong>{viewingApproval.approvalCode}</div>
              <div><strong>申请人：</strong>{viewingApproval.applicant?.realName}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>审批标题：</strong>{viewingApproval.title}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>审批内容：</strong>{viewingApproval.content}</div>
              <div><strong>申请时间：</strong>{dayjs(viewingApproval.createTime).format('YYYY-MM-DD HH:mm')}</div>
              {viewingApproval.approvalTime && (
                <div><strong>审批时间：</strong>{dayjs(viewingApproval.approvalTime).format('YYYY-MM-DD HH:mm')}</div>
              )}
              {viewingApproval.approver && (
                <div><strong>审批人：</strong>{viewingApproval.approver.realName}</div>
              )}
            </div>

            {viewingApproval.status === 'PENDING' && (
              <Form form={commentForm} layout="vertical">
                <Form.Item name="comment" label="审批意见">
                  <TextArea rows={3} placeholder="请输入审批意见" />
                </Form.Item>
              </Form>
            )}

            {viewingApproval.comment && viewingApproval.status !== 'PENDING' && (
              <div style={{ marginTop: 16 }}>
                <Text strong>审批意见：</Text>
                <p>{viewingApproval.comment}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalListPage;