import { Router } from 'express';
import { getAllPictures, getPicturesByUser } from '../services/pictureService.js';
import { getAllCategories } from '../services/categoryService.js';
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

router.get('/categories', getAllCategories);
router.get('/pictures', getAllPictures);
router.get('/pictures/user/:userId', getPicturesByUser);

export default router;