/**
 * 仪表盘页面
 * 企业项目全流程管理数据系统
 */

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress, Typography, Spin } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { dashboardService } from '../services/api';
import { DashboardStats } from '../types';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    <div style={{ textAlign: 'center', padding: 100 }}>
      <Spin size="large" />
    </div>;
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(2)}万`;
    }
    return `¥${amount.toFixed(2)}`;
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        仪表盘概览
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="客户总数"
              value={stats?.customers.total || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">正式客户: {stats?.customers.formal || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="商机总数"
              value={stats?.opportunities.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">进行中: {stats?.opportunities.active || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="商机金额"
              value={stats?.opportunities.amount || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Text type="secondary">已成交: {stats?.opportunities.won || 0}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="项目总数"
              value={stats?.projects.total || 0}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary">执行中: {stats?.projects.executing || 0}</Text>
          </Card>
        </Col>
      </Row>

      {/* 第二行统计 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="执行中项目"
              value={stats?.projects.executing || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="已完成项目"
              value={stats?.projects.completed || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="合同总数"
              value={stats?.contracts.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="待审批"
              value={stats?.approvals.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 销售漏斗 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="销售漏斗" extra={<a href="/opportunities">查看详情</a>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text style={{ width: 80 }}>需求了解</Text>
                <Progress percent={80} status="active" strokeColor="#1890ff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text style={{ width: 80 }}>方案制定</Text>
                <Progress percent={60} status="active" strokeColor="#52c41a" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text style={{ width: 80 }}>商务洽谈</Text>
                <Progress percent={40} status="active" strokeColor="#faad14" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text style={{ width: 80 }}>合同评审</Text>
                <Progress percent={20} status="active" strokeColor="#fa8c16" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Text style={{ width: 80 }}>签约完成</Text>
                <Progress percent={10} status="active" strokeColor="#722ed1" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="项目状态分布" extra={<a href="/projects">查看详情</a>}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 200 }}>
              <div style={{ textAlign: 'center' }}>
                <Progress type="circle" percent={75} format={() => '75%'} />
                <div style={{ marginTop: 8 }}>执行中</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Progress type="circle" percent={15} status="exception" format={() => '15%'} />
                <div style={{ marginTop: 8 }}>验收中</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Progress type="circle" percent={10} status="success" format={() => '10%'} />
                <div style={{ marginTop: 8 }}>已完成</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="最近商机" extra={<a href="/opportunities">更多</a>}>
            <Table
              dataSource={[]}
              columns={[
                { title: '商机名称', dataIndex: 'name', key: 'name' },
                { title: '客户', dataIndex: 'customer', key: 'customer' },
                { title: '金额', dataIndex: 'amount', key: 'amount' },
                {
                  title: '阶段',
                  dataIndex: 'stage',
                  key: 'stage',
                  render: (stage: string) => <Tag>{stage}</Tag>
                }
              ]}
              pagination={false}
              size="small"
              locale={{ emptyText: '暂无数据' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最近项目" extra={<a href="/projects">更多</a>}>
            <Table
              dataSource={[]}
              columns={[
                { title: '项目名称', dataIndex: 'name', key: 'name' },
                { title: '客户', dataIndex: 'customer', key: 'customer' },
                { title: '项目经理', dataIndex: 'manager', key: 'manager' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => <Tag color={status === '执行中' ? 'blue' : 'green'}>{status}</Tag>
                }
              ]}
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

export default DashboardPage;