import express from 'express';
import { createConnection } from 'mysql2/promise';
import cors from 'cors';
import { config } from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

// 加载环境变量
config();

const app = express();
const PORT = process.env.PORT;

// 中间件
app.use(cors());
app.use(express.json());

// 使用配置文件中的 Sequelize 实例

// 测试数据库连接
sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL连接成功');
    // 同步模型到数据库
    sequelize.sync({ alter: true }).then(() => {
      console.log('数据库模型同步完成');
    });
  })
  .catch((err) => {
    console.error('MySQL连接失败:', err);
  });

// 路由
app.use('/api/auth', authRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.send('API运行中...');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});