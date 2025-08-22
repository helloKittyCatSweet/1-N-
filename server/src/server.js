import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import generateMemeImage from './controllers/integrated.js'; // 新增导入

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


// 新增图片生成API路由
app.post('/api/generate-meme', async (req, res) => {
  try {
    await generateMemeImage();
    res.status(200).json({
      success: true,
      message: '图片生成成功'
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