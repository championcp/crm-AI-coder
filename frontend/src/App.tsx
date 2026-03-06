/**
 * 应用主入口
 * 配置路由和全局布局
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 布局
import MainLayout from './layouts/MainLayout';

// 页面
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// 客户管理
import CustomerList from './pages/customers/CustomerList';

// 商机管理
import OpportunityList from './pages/opportunities/OpportunityList';

// 合同管理
import ContractList from './pages/contracts/ContractList';

// 项目管理
import ProjectList from './pages/projects/ProjectList';

// 审批管理
import ApprovalList from './pages/approvals/ApprovalList';

// 财务管理
import FinanceDashboard from './pages/finance/FinanceDashboard';

// 系统管理
import UserManagement from './pages/system/UserList';
import RoleManagement from './pages/system/RoleList';

/**
 * 路由守卫组件
 * 检查用户是否已登录
 */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 主应用组件
 */
const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <HashRouter>
        <Routes>
          {/* 登录页面 */}
          <Route path="/login" element={<Login />} />

          {/* 主布局路由 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {/* 默认重定向到仪表盘 */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* 仪表盘 */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* 客户管理 */}
            <Route path="customers" element={<CustomerList />} />

            {/* 商机管理 */}
            <Route path="opportunities" element={<OpportunityList />} />

            {/* 合同管理 */}
            <Route path="contracts" element={<ContractList />} />

            {/* 项目管理 */}
            <Route path="projects" element={<ProjectList />} />

            {/* 审批流程 */}
            <Route path="approvals" element={<ApprovalList />} />

            {/* 财务管理 */}
            <Route path="finance" element={<FinanceDashboard />} />

            {/* 系统管理 */}
            <Route path="system/users" element={<UserManagement />} />
            <Route path="system/roles" element={<RoleManagement />} />

            {/* 404 页面 */}
            <Route path="*" element={<div>页面未找到</div>} />
          </Route>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
};

export default App;
