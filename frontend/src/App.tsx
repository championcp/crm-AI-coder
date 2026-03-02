/**
 * 企业项目全流程管理数据系统
 * 主应用入口
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import CustomerListPage from './pages/customers/CustomerList';
import OpportunityListPage from './pages/opportunities/OpportunityList';
import { User } from './types';

// 简单认证组件
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的用户信息
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (newUser: User, token: string) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return null;
  }

  return (
    <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
};

// 创建上下文
interface AppContextType {
  user: User | null;
  handleLogin: (user: User, token: string) => void;
  handleLogout: () => void;
}

export const AppContext = React.createContext<AppContextType>({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {}
});

// 路由守卫组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = React.useContext(AppContext);
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 主布局路由
const MainLayoutRoute: React.FC = () => {
  const { user, handleLogout } = React.useContext(AppContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/opportunities" element={<OpportunityListPage />} />
        <Route path="/contracts" element={<div>合同管理</div>} />
        <Route path="/projects" element={<div>项目管理</div>} />
        <Route path="/approvals" element={<div>审批中心</div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageWrapper />} />
              <Route path="/*" element={<MainLayoutRoute />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

// 登录页面包装器
const LoginPageWrapper: React.FC = () => {
  const { handleLogin } = React.useContext(AppContext);
  const navigate = useNavigate();

  const onLogin = (user: User, token: string) => {
    handleLogin(user, token);
    navigate('/dashboard');
  };

  return <LoginPage onLogin={onLogin} />;
};

export default App;