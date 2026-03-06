/**
 * 财务管理仪表盘
 * 企业项目全流程管理数据系统 - 财务管理模块
 */

import React from 'react';
import { Card, Row, Col, Statistic, DatePicker } from 'antd';
import {
  DollarOutlined,
  PieChartOutlined,
  WalletOutlined,
  FundOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

/**
 * 财务管理仪表盘组件
 */
const FinanceDashboard: React.FC = () => {
  return (
    <div className="finance-dashboard">
      <h1>财务管理</h1>

      {/* 日期筛选 */}
      <Card style={{ marginBottom: 24 }}>
        <RangePicker style={{ width: 300 }} />
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总支出"
              value={0}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="预算使用率"
              value={0}
              suffix="%"
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="项目成本"
              value={0}
              prefix={<FundOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能说明 */}
      <Card title="功能模块">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card type="inner" title="预算管理">
              项目预算编制与执行跟踪
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="成本管理">
              项目成本核算与分析
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="收款付款">
              合同收款计划与付款记录
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
