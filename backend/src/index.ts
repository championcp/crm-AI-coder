/**
 * 企业项目全流程管理数据系统
 * 后端服务入口文件
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './config/database';
import { User, UserRole, UserStatus } from './entities/User';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import roleRoutes from './routes/roles';
import customerRoutes from './routes/customers';
import opportunityRoutes from './routes/opportunities';
import contractRoutes from './routes/contracts';
import projectRoutes from './routes/projects';
import approvalRoutes from './routes/approvals';
import approvalFlowRoutes from './routes/approval-flows';
import dashboardRoutes from './routes/dashboard';
import { authenticate } from './middlewares/auth';

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet()); // 安全头
app.use(cors()); // 跨域资源共享
app.use(morgan('dev')); // HTTP日志
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 静态文件服务（如果需要）
app.use('/uploads', express.static('uploads'));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/approval-flows', approvalFlowRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 初始化默认管理员用户
async function initializeDefaultUsers() {
  const userRepository = AppDataSource.getRepository(User);

  // 检查是否已存在管理员用户
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      realName: '系统管理员',
      phone: '13800138000',
      email: 'admin@example.com',
      role: UserRole.SYSTEM_ADMIN,
      department: '技术部',
      status: UserStatus.ACTIVE
    });
    await userRepository.save(adminUser);
    console.log('✓ 默认管理员用户已创建: admin / admin123');
  } else {
    console.log('✓ 管理员用户已存在');
  }
}

// 数据库连接和应用启动
async function startServer() {
  try {
    // 连接数据库
    await AppDataSource.initialize();
    console.log('数据库连接成功！');

    // 初始化默认用户
    await initializeDefaultUsers();

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      console.log(`健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}

startServer();

export { app };