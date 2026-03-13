/**
 * 仪表盘页面
 * 展示系统概览和关键指标
 */

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Typography,
  Progress,
  Badge
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { dashboardService, opportunityService, projectService } from '../services/api';
import type { DashboardStats, Opportunity, Project } from '../types';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOpportunities, setRecentOpportunities] = useState<Opportunity[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 获取统计数据
      const statsRes = await dashboardService.getStats();
      setStats(statsRes.data || null);
      
      // 获取最近商机（取前5条）
      const oppRes = await opportunityService.getList({ page: 1, pageSize: 5 });
      setRecentOpportunities(oppRes.data?.list || []);
      
      // 获取最近项目（取前5条）
      const projRes = await projectService.getList({ page: 1, pageSize: 5 });
      setRecentProjects(projRes.data?.list || []);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      '需求了解': 'blue',
      '方案制定': 'cyan',
      '商务洽谈': 'orange',
      '合同评审': 'purple',
      '签约完成': 'green'
    };
    return colors[stage] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '执行中': 'processing',
      '已暂停': 'warning',
      '已完成': 'success',
      '已取消': 'error'
    };
    return colors[status] || 'default';
  };

  // 销售漏斗数据
  const funnelData = [
    { stage: '需求了解', count: 80, color: '#1890ff' },
    { stage: '方案制定', count: 60, color: '#52c41a' },
    { stage: '商务洽谈', count: 40, color: '#faad14' },
    { stage: '合同评审', count: 20, color: '#fa541c' },
    { stage: '签约完成', count: 10, color: '#722ed1' }
  ];

  // 项目状态分布数据
  const projectStatusData = [
    { name: '执行中', value: 15, color: '#1890ff' },
    { name: '验收中', value: 3, color: '#faad14' },
    { name: '已完成', value: 2, color: '#52c41a' }
  ];

  const opportunityColumns = [
    {
      title: '商机名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      ellipsis: true,
      render: (customer: any) => customer?.name || '-'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount)
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => <Tag color={getStageColor(stage)}>{stage}</Tag>
    }
  ];

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      ellipsis: true,
      render: (customer: any) => customer?.name || '-'
    },
    {
      title: '项目经理',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: any) => manager?.realName || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Badge status={getStatusColor(status)} text={status} />
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      <Title level={4} style={{ marginBottom: 24 }}>仪表盘概览</Title>

      {/* 第一行统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="客户总数"
              value={stats?.customers?.total || 0}
              prefix={<UserOutlined />}
              style={{ color: '#1890ff' }}
            />
            <Text type="secondary">正式客户: {stats?.customers?.formal || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="商机总数"
              value={stats?.opportunities?.total || 0}
              prefix={<FileTextOutlined />}
              style={{ color: '#52c41a' }}
            />
            <Text type="secondary">进行中: {stats?.opportunities?.active || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="商机金额"
              value={stats?.opportunities?.amount || 0}
              prefix={<DollarOutlined />}
              style={{ color: '#faad14' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Text type="secondary">已成交: {stats?.opportunities?.won || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="项目总数"
              value={stats?.projects?.total || 0}
              prefix={<ProjectOutlined />}
              style={{ color: '#722ed1' }}
            />
            <Text type="secondary">执行中: {stats?.projects?.executing || 0}</Text>
          </Card>
        </Col>
      </Row>

      {/* 第二行统计 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="执行中项目"
              value={stats?.projects?.executing || 0}
              prefix={<ClockCircleOutlined />}
              style={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="已完成项目"
              value={stats?.projects?.completed || 0}
              prefix={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="合同总数"
              value={stats?.contracts?.total || 0}
              prefix={<FileTextOutlined />}
              style={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="待审批"
              value={stats?.approvals?.pending || 0}
              prefix={<ClockCircleOutlined />}
              style={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="销售漏斗"
            extra={<a href="#/opportunities">查看详情</a>}
            loading={loading}
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            <div style={{ padding: '20px 0' }}>
              {funnelData.map((item) => (
                <div key={item.stage} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{item.stage}</Text>
                    <Text strong>{item.count}%</Text>
                  </div>
                  <Progress
                    percent={item.count}
                    strokeColor={item.color}
                    railColor="#f0f0f0"
                    size={12}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="项目状态分布"
            extra={<a href="#/projects">查看详情</a>}
            loading={loading}
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
              {projectStatusData.map((item) => (
                <div key={item.name} style={{ textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={item.value}
                    strokeColor={item.color}
                    railColor="#f0f0f0"
                    size={80}
                    format={() => <Text strong style={{ fontSize: 20, color: item.color }}>{item.value}%</Text>}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text>{item.name}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近数据表格 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            title="最近商机"
            extra={<a href="#/opportunities">更多</a>}
            loading={loading}
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            <Table
              dataSource={recentOpportunities}
              columns={opportunityColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: '暂无数据' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="最近项目"
            extra={<a href="#/projects">更多</a>}
            loading={loading}
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          >
            <Table
              dataSource={recentProjects}
              columns={projectColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: '暂无数据' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
