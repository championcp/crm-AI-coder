/**
 * 主布局组件
 * 企业项目全流程管理数据系统
 * 包含侧边栏菜单、顶部栏和内容区域
 */

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, type MenuProps, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  AuditOutlined,
  WalletOutlined
} from '@ant-design/icons';
import type { User } from '../types';

const { Header, Sider, Content } = Layout;

/**
 * 主布局组件
 * 提供侧边栏导航、顶部栏和主内容区域
 */
const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  /**
   * 组件挂载时从localStorage获取用户信息
   */
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('解析用户信息失败:', e);
      }
    }
  }, []);

  /**
   * 侧边栏菜单配置
   */
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
        { key: '/customers', icon: <TeamOutlined />, label: '客户管理' },
        { key: '/opportunities', icon: <RiseOutlined />, label: '商机管理' },
        { key: '/contracts', icon: <FileTextOutlined />, label: '合同管理' },
        { key: '/projects', icon: <ProjectOutlined />, label: '项目管理' }
      ]
    },
    {
      key: 'approvals',
      icon: <AuditOutlined />,
      label: '审批流程',
      children: [
        { key: '/approvals', icon: <CheckCircleOutlined />, label: '我的审批' },
        { key: '/approval-flows', icon: <FileTextOutlined />, label: '流程配置' }
      ]
    },
    {
      key: '/finance',
      icon: <DollarOutlined />,
      label: '财务管理'
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理'
    }
  ];

  /**
   * 用户下拉菜单配置
   */
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true
    }
  ];

  /**
   * 处理菜单点击事件
   * @param key 菜单项的key
   */
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/system');
    } else {
      navigate(key);
    }
  };

  /**
   * 处理退出登录
   * 清除本地存储的token和用户信息，跳转到登录页
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * 获取当前选中的菜单项
   */
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    // 如果是子路由，选中父菜单
    if (pathname.startsWith('/system/')) {
      return ['/system'];
    }
    return [pathname];
  };

  /**
   * 获取需要展开的子菜单
   */
  const getOpenKeys = () => {
    const pathname = location.pathname;
    if (['/customers', '/opportunities', '/contracts', '/projects'].includes(pathname)) {
      return ['business'];
    }
    if (['/approvals', '/approval-flows'].includes(pathname)) {
      return ['approvals'];
    }
    return [];
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#1E293B',
          flexShrink: 0,
          height: 'auto',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
        width={240}
        collapsedWidth={80}
      >
        {/* Logo区域 */}
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
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          {collapsed ? 'CRM' : '企业项目管理系统'}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: '#1E293B',
            borderRight: 0
          }}
        />
      </Sider>

      {/* 主内容区域 */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0, 
          width: '100%',
          marginLeft: collapsed ? 80 : 240,
          transition: 'margin-left 0.2s'
        }}
      >
        {/* 顶部栏 */}
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        >
          {/* 左侧：折叠按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                cursor: 'pointer', 
                color: '#666', 
                fontSize: 18,
                padding: '8px',
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </div>

          {/* 右侧：通知和用户菜单 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* 通知图标 */}
            <Badge count={3} size="small">
              <BellOutlined 
                style={{ 
                  fontSize: 18, 
                  color: '#666', 
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              />
            </Badge>

            {/* 用户下拉菜单 */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick
              }}
              placement="bottomRight"
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar 
                  style={{ backgroundColor: token.colorPrimary }} 
                  icon={<UserOutlined />} 
                />
                <span style={{ color: '#333' }}>
                  {user?.realName || user?.username || '用户'}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 - 使用Outlet渲染子路由 */}
        <Content
          style={{
            margin: 0,
            padding: '24px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
            flex: 1
          }}
        >
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default MainLayout;
