import express from 'express';
import { createConnection } from 'mysql2/promise';
import cors from 'cors';
import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

// 加载环境变量
config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库配置
const sequelize = new Sequelize(
  process.env.DB_NAME || 'uniapp_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // 设置为 true 可以在控制台看到 SQL 查询
  }
);

// 测试数据库连接
sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL连接成功');
  })
  .catch((err) => {
    console.error('MySQL连接失败:', err);
  });

// 路由
app.use('/api/auth', require('./routes/auth').default);

// 测试路由
app.get('/', (req, res) => {
  res.send('API运行中...');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});