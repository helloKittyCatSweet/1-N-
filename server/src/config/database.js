import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// 加载环境变量
config();

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  process.env.DB_NAME ,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // 设置为 true 可以在控制台看到 SQL 查询
  }
);

export default sequelize;