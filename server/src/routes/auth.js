import { Router } from 'express';
const router = Router();
import { register, login, getCurrentUser } from '../controllers/authController';
import auth from '../middleware/auth';

// 注册用户
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 获取当前用户信息
router.get('/me', auth, getCurrentUser);

export default router;