/**
 * 主布局组件
 * 企业项目全流程管理数据系统
 */

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, type MenuProps, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  RiseOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘'
    },
    {
      key: 'business',
      icon: <ShopOutlined />,
      label: '业务管理',
      children: [
        { key: '/customers', label: '客户管理' },
        { key: '/opportunities', label: '商机管理' },
        { key: '/contracts', label: '合同管理' },
        { key: '/projects', label: '项目管理' }
      ]
    },
    {
      key: 'execution',
      icon: <ProjectOutlined />,
      label: '执行管理',
      children: [
        { key: '/progress', label: '进度管理' },
        { key: '/tasks', label: '任务管理' },
        { key: '/risks', label: '风险管理' }
      ]
    },
    {
      key: '/acceptance',
      icon: <CheckCircleOutlined />,
      label: '验收管理'
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: '财务管理',
      children: [
        { key: '/budget', label: '预算管理' },
        { key: '/cost', label: '成本管理' },
        { key: '/payment', label: '回款管理' }
      ]
    },
    {
      key: '/approvals',
      icon: <AuditOutlined />,
      label: '审批中心'
    },
    {
      key: 'report',
      icon: <RiseOutlined />,
      label: '报表分析',
      children: [
        { key: '/report/sales', label: '销售报表' },
        { key: '/report/project', label: '项目报表' },
        { key: '/report/finance', label: '财务报表' }
      ]
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        { key: '/system/users', label: '用户管理' },
        { key: '/system/roles', label: '角色管理' },
        { key: '/system/config', label: '系统配置' }
      ]
    }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置'
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true
    }
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      onLogout();
    } else {
      navigate(key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#1E293B',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
        width={240}
        collapsedWidth={80}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            color: '#fff',
            fontSize: collapsed ? 16 : 18,
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {collapsed ? '项目' : '企业项目管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['business', 'execution', 'finance', 'report', 'system']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: '#1E293B',
            borderRight: 0
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{ cursor: 'pointer', color: '#fff', fontSize: 18 }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }} />
            </Badge>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick
              }}
              placement="bottomRight"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
                <span style={{ color: '#fff' }}>{user?.realName || user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;