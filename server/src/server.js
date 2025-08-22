import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import generateMemeImage from './controllers/integrated.js'; // 新增导入
import { console } from 'node:inspector';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// 配置静态文件服务
const memePath = path.join(__dirname, 'memes');
app.use('/memes', express.static(memePath));

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL connection successful');
    // Sync models to database
    sequelize.sync({ alter: true }).then(() => {
      console.log('Database models synchronized');
    });
  })
  .catch((err) => {
    console.error('MySQL connection failed:', err);
    console.log('Continuing without database connection...');
  });

// Routes
app.use('/api/auth', authRoutes);

// 新增图片生成API路由（返回base64）
app.post('/api/generate-meme', async (req, res) => {
  try {
    const { keyword } = req.body || {};
    const relativePath = await generateMemeImage(keyword || 'programmer');
    
    res.status(200).json({
      success: true,
      message: '图片生成成功',
      // 返回可访问的URL路径
      url: `http://localhost:5000/memes/${path.basename(relativePath)}`
    });
  } catch (error) {
    console.error('图片生成失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});