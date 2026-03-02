/**
 * 企业项目全流程管理数据系统
 * 后端服务入口文件
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import customerRoutes from './routes/customers';
import opportunityRoutes from './routes/opportunities';
import contractRoutes from './routes/contracts';
import projectRoutes from './routes/projects';
import approvalRoutes from './routes/approvals';
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
app.use('/api/customers', customerRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/approvals', approvalRoutes);
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

// 数据库连接和应用启动
async function startServer() {
  try {
    // 连接数据库
    await AppDataSource.initialize();
    console.log('数据库连接成功！');

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