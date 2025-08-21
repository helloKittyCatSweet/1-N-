import User from '../models/User.js';

import { genSalt, hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

// 注册用户
export async function register(req, res) {
  try {
    const { username, password } = req.body;

    // 检查用户是否已存在
    let user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ msg: '用户已存在' });
    }

    // 创建新用户
    user = new User({
      username,
      password
    });

    // 加密密码
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    // 保存用户
    await user.save();

    // 创建JWT令牌
    const payload = {
      user: {
        id: user.id
      }
    };

    sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}

// 用户登录
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // 检查用户是否存在
    let user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ msg: '用户不存在' });
    }

    // 验证密码
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '密码错误' });
    }

    // 创建JWT令牌
    const payload = {
      user: {
        id: user.id
      }
    };

    sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}

// 获取当前用户信息
export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}