import { Router } from 'express';
const router = Router();

// 导入控制器和中间件
import { register, login, getCurrentUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

// 注册用户
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 获取当前用户信息
router.get('/me', auth, getCurrentUser);

export default router;